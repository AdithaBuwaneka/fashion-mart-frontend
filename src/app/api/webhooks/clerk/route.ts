// src/app/api/webhooks/clerk/route.ts
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { apiClient } from '@/lib/api/config'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

if (!webhookSecret) {
  throw new Error('Please add CLERK_WEBHOOK_SECRET to your environment variables')
}

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.text()

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret!)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400,
    })
  }

  const eventType = evt.type

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data)
        break
      case 'user.updated':
        await handleUserUpdated(evt.data)
        break
      case 'user.deleted':
        await handleUserDeleted(evt.data)
        break
      default:
        console.log(`Unhandled webhook event type: ${eventType}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error handling webhook ${eventType}:`, error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

interface ClerkUserData {
  id: string
  email_addresses: Array<{ email_address: string }>
  first_name: string | null
  last_name: string | null
  image_url: string | null
}

async function handleUserCreated(userData: ClerkUserData) {
  try {
    await apiClient.post('/auth/webhook/user-created', {
      clerkId: userData.id,
      email: userData.email_addresses[0]?.email_address,
      firstName: userData.first_name,
      lastName: userData.last_name,
      avatar: userData.image_url,
      role: 'customer' // Default role
    })
    console.log(`User created: ${userData.id}`)
  } catch (error) {
    console.error('Failed to create user in backend:', error)
    throw error
  }
}

async function handleUserUpdated(userData: ClerkUserData) {
  try {
    await apiClient.patch(`/auth/webhook/user-updated/${userData.id}`, {
      email: userData.email_addresses[0]?.email_address,
      firstName: userData.first_name,
      lastName: userData.last_name,
      avatar: userData.image_url,
    })
    console.log(`User updated: ${userData.id}`)
  } catch (error) {
    console.error('Failed to update user in backend:', error)
    throw error
  }
}

interface ClerkDeletedUser {
  id?: string
}

async function handleUserDeleted(userData: ClerkDeletedUser) {
  try {
    if (!userData.id) {
      throw new Error('User ID is required for deletion')
    }
    await apiClient.delete(`/auth/webhook/user-deleted/${userData.id}`)
    console.log(`User deleted: ${userData.id}`)
  } catch (error) {
    console.error('Failed to delete user in backend:', error)
    throw error
  }
}