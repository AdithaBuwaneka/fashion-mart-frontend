// src/app/(dashboard)/designer/collaborations/page.tsx
'use client'

import { useState } from 'react';
import { CollaborationBoard } from '@/components/designer/collaboration-board';
import { toast } from 'sonner';

// Type for our local collaboration state
type LocalCollaboration = {
  id: string;
  title: string;
  description: string;
  client: {
    id: string;
    name: string;
    avatar?: string;
    company?: string;
  };
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  deadline: string;
  budget: number;
  progress: number;
  messages: Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: string;
    isDesigner: boolean;
  }>;
  deliverables: Array<{
    id: string;
    name: string;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate: string;
  }>;
};

// Mock collaboration data - TODO: Replace with API calls
const mockCollaborations: LocalCollaboration[] = [
  {
    id: '1',
    title: 'Spring Fashion Collection',
    description: 'Design a cohesive spring collection featuring floral patterns and pastel colors for our upcoming launch.',
    client: {
      id: 'client-1',
      name: 'Sarah Johnson',
      avatar: '/images/avatars/client-1.jpg',
      company: 'Bloom Fashion'
    },
    status: 'active',
    priority: 'high',
    startDate: '2024-06-01',
    deadline: '2024-07-15',
    budget: 2500,
    progress: 65,
    messages: [
      {
        id: 'msg-1',
        sender: 'Sarah Johnson',
        message: 'Hi! Excited to work with you on this collection. I love your previous floral work.',
        timestamp: '2024-06-20T10:00:00Z',
        isDesigner: false
      },
      {
        id: 'msg-2',
        sender: 'Designer',
        message: 'Thank you! I have some initial concepts ready. Would you like to see them?',
        timestamp: '2024-06-20T10:30:00Z',
        isDesigner: true
      },
      {
        id: 'msg-3',
        sender: 'Sarah Johnson',
        message: 'Yes, please! I am particularly interested in incorporating cherry blossoms.',
        timestamp: '2024-06-20T11:00:00Z',
        isDesigner: false
      }
    ],
    deliverables: [
      {
        id: 'del-1',
        name: 'Initial Concept Sketches',
        status: 'completed',
        dueDate: '2024-06-10'
      },
      {
        id: 'del-2',
        name: 'Color Palette Development',
        status: 'completed',
        dueDate: '2024-06-15'
      },
      {
        id: 'del-3',
        name: 'Pattern Designs (5 variants)',
        status: 'in-progress',
        dueDate: '2024-07-01'
      },
      {
        id: 'del-4',
        name: 'Final Collection Presentation',
        status: 'pending',
        dueDate: '2024-07-15'
      }
    ]
  },
  {
    id: '2',
    title: 'Urban Streetwear Graphics',
    description: 'Create bold graphic designs for a new streetwear line targeting young adults.',
    client: {
      id: 'client-2',
      name: 'Mike Chen',
      avatar: '/images/avatars/client-2.jpg',
      company: 'Urban Threads'
    },
    status: 'pending',
    priority: 'medium',
    startDate: '2024-07-01',
    deadline: '2024-08-15',
    budget: 1800,
    progress: 0,
    messages: [
      {
        id: 'msg-4',
        sender: 'Mike Chen',
        message: 'We are looking for someone to create edgy graphics for our streetwear line. Your urban art style caught our attention.',
        timestamp: '2024-06-25T14:00:00Z',
        isDesigner: false
      }
    ],
    deliverables: [
      {
        id: 'del-5',
        name: 'Brand Research & Mood Board',
        status: 'pending',
        dueDate: '2024-07-05'
      },
      {
        id: 'del-6',
        name: 'Initial Graphic Concepts (3)',
        status: 'pending',
        dueDate: '2024-07-20'
      },
      {
        id: 'del-7',
        name: 'Final Graphics Package',
        status: 'pending',
        dueDate: '2024-08-15'
      }
    ]
  },
  {
    id: '3',
    title: 'Vintage Wedding Collection',
    description: 'Design elegant vintage-inspired patterns for a luxury wedding dress collection.',
    client: {
      id: 'client-3',
      name: 'Emma Williams',
      avatar: '/images/avatars/client-3.jpg',
      company: 'Elegance Bridal'
    },
    status: 'completed',
    priority: 'high',
    startDate: '2024-04-01',
    deadline: '2024-05-30',
    budget: 3200,
    progress: 100,
    messages: [
      {
        id: 'msg-5',
        sender: 'Emma Williams',
        message: 'Thank you for the beautiful work! The vintage lace patterns are perfect.',
        timestamp: '2024-05-30T16:00:00Z',
        isDesigner: false
      },
      {
        id: 'msg-6',
        sender: 'Designer',
        message: 'It was a pleasure working with you! I hope the collection launch goes well.',
        timestamp: '2024-05-30T16:30:00Z',
        isDesigner: true
      }
    ],
    deliverables: [
      {
        id: 'del-8',
        name: 'Vintage Lace Patterns (8)',
        status: 'completed',
        dueDate: '2024-05-15'
      },
      {
        id: 'del-9',
        name: 'Embroidery Designs (5)',
        status: 'completed',
        dueDate: '2024-05-25'
      },
      {
        id: 'del-10',
        name: 'Final Design Package',
        status: 'completed',
        dueDate: '2024-05-30'
      }
    ]
  }
];

export default function DesignerCollaborationsPage() {
  const [collaborations, setCollaborations] = useState(mockCollaborations);

  const handleAcceptRequest = (id: string) => {
    setCollaborations(prev =>
      prev.map(collab =>
        collab.id === id
          ? { ...collab, status: 'active' }
          : collab
      )
    );
    toast.success('Collaboration request accepted!');
  };

  const handleRejectRequest = (id: string) => {
    setCollaborations(prev =>
      prev.map(collab =>
        collab.id === id
          ? { ...collab, status: 'cancelled' }
          : collab
      )
    );
    toast.success('Collaboration request declined.');
  };

  const handleSendMessage = (collaborationId: string, message: string) => {
    const timestamp = new Date().toISOString();
    setCollaborations(prev =>
      prev.map(collab =>
        collab.id === collaborationId
          ? {
              ...collab,
              messages: [
                ...collab.messages,
                {
                  id: `msg-${Date.now()}`,
                  sender: 'Designer',
                  message,
                  timestamp,
                  isDesigner: true
                }
              ]
            }
          : collab
      )
    );
    toast.success('Message sent!');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <CollaborationBoard
        collaborations={collaborations}
        onAcceptRequest={handleAcceptRequest}
        onRejectRequest={handleRejectRequest}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
