// src/components/staff/customer-support.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare,
  User,
  Plus,
  Bell,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

interface Ticket {
  id: string
  subject: string
  description: string
  customer: {
    name: string
    email: string
    id: string
  }
  status: string
  priority: string
  category: string
  assignedTo?: {
    name: string
    id: string
  } | null
  createdAt: string
  updatedAt: string
  lastResponse?: string | null
  messageCount: number
}

interface CustomerSupportProps {
  tickets: Ticket[]
  title: string
  description: string
}

export function CustomerSupport({ tickets, title, description }: CustomerSupportProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive'
      case 'in_progress': return 'default'
      case 'pending_customer': return 'secondary'
      case 'resolved': return 'secondary'
      case 'closed': return 'outline'
      default: return 'outline'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'default'
      case 'medium': return 'secondary'
      default: return 'outline'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'order_issue': return Bell
      case 'payment_problem': return AlertTriangle
      case 'product_inquiry': return MessageSquare
      case 'account_issue': return User
      default: return MessageSquare
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="outline">{tickets.length} tickets</Badge>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No tickets found</h3>
            <p className="text-sm text-muted-foreground">
              There are no support tickets in this category at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => {
              const CategoryIcon = getCategoryIcon(ticket.category)
              return (
                <div key={ticket.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="mt-1">
                      <CategoryIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{ticket.id}</h4>
                        <Badge variant={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="font-medium mb-1">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {ticket.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>
                          <User className="w-3 h-3 inline mr-1" />
                          {ticket.customer.name}
                        </span>
                        <span>
                          <MessageSquare className="w-3 h-3 inline mr-1" />
                          {ticket.messageCount} messages
                        </span>
                        <span>Created {formatTimeAgo(ticket.createdAt)}</span>
                        {ticket.lastResponse && (
                          <span>Last reply {formatTimeAgo(ticket.lastResponse)}</span>
                        )}
                      </div>
                      {ticket.assignedTo && (
                        <p className="text-sm text-blue-600 mt-1">
                          Assigned to {ticket.assignedTo.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/staff/support/${ticket.id}`}>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    </Link>
                    {!ticket.assignedTo && (
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Take
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
