'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Collaboration {
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
}

interface CollaborationBoardProps {
  collaborations: Collaboration[];
  onAcceptRequest?: (id: string) => void;
  onRejectRequest?: (id: string) => void;
  onSendMessage?: (collaborationId: string, message: string) => void;
  onUpdateProgress?: (id: string, progress: number) => void;
}

export function CollaborationBoard({
  collaborations,
  onAcceptRequest,
  onRejectRequest,
  onSendMessage
}: CollaborationBoardProps) {
  const [selectedCollaboration, setSelectedCollaboration] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'active': return <Users className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSendMessage = (collaborationId: string) => {
    if (newMessage.trim()) {
      onSendMessage?.(collaborationId, newMessage.trim());
      setNewMessage('');
    }
  };

  const selectedCollab = selectedCollaboration 
    ? collaborations.find(c => c.id === selectedCollaboration)
    : null;

  const pendingRequests = collaborations.filter(c => c.status === 'pending');
  const activeProjects = collaborations.filter(c => c.status === 'active');
  const completedProjects = collaborations.filter(c => c.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Collaboration Hub</h2>
          <p className="text-muted-foreground">Manage your design projects and client communications</p>
        </div>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{activeProjects.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedProjects.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${collaborations.reduce((sum, c) => sum + (c.status === 'completed' ? c.budget : 0), 0).toLocaleString()}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collaboration List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Collaborations</CardTitle>
              <CardDescription>Ongoing projects and new requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {collaborations.map((collaboration) => (
                  <div
                    key={collaboration.id}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                      selectedCollaboration === collaboration.id && "border-primary bg-primary/5"
                    )}
                    onClick={() => setSelectedCollaboration(collaboration.id)}
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", getPriorityColor(collaboration.priority))} />
                          <h4 className="font-medium text-sm">{collaboration.title}</h4>
                        </div>
                        <Badge className={getStatusColor(collaboration.status)}>
                          {getStatusIcon(collaboration.status)}
                          <span className="ml-1 capitalize">{collaboration.status}</span>
                        </Badge>
                      </div>

                      {/* Client */}
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={collaboration.client.avatar} />
                          <AvatarFallback className="text-xs">
                            {collaboration.client.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-xs">
                          <span className="font-medium">{collaboration.client.name}</span>
                          {collaboration.client.company && (
                            <span className="text-muted-foreground"> • {collaboration.client.company}</span>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due {formatDate(collaboration.deadline)}</span>
                          </div>
                          <span>${collaboration.budget.toLocaleString()}</span>
                        </div>
                        {collaboration.status === 'active' && (
                          <div className="flex items-center gap-1">
                            <div className="w-16 bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-primary h-1 rounded-full"
                                style={{ width: `${collaboration.progress}%` }}
                              />
                            </div>
                            <span>{collaboration.progress}%</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons for Pending */}
                      {collaboration.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAcceptRequest?.(collaboration.id);
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRejectRequest?.(collaboration.id);
                            }}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {collaborations.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No collaborations yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collaboration Details */}
        <div className="space-y-4">
          {selectedCollab ? (
            <>
              {/* Project Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{selectedCollab.title}</CardTitle>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Full Details
                    </Button>
                  </div>
                  <CardDescription>{selectedCollab.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Client Info */}
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedCollab.client.avatar} />
                      <AvatarFallback>
                        {selectedCollab.client.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedCollab.client.name}</p>
                      {selectedCollab.client.company && (
                        <p className="text-sm text-muted-foreground">{selectedCollab.client.company}</p>
                      )}
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-medium">{formatDate(selectedCollab.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deadline</p>
                      <p className="font-medium">{formatDate(selectedCollab.deadline)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-medium">${selectedCollab.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Progress</p>
                      <p className="font-medium">{selectedCollab.progress}%</p>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <h4 className="font-medium mb-2">Deliverables</h4>
                    <div className="space-y-2">
                      {selectedCollab.deliverables.map((deliverable) => (
                        <div key={deliverable.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              deliverable.status === 'completed' ? 'bg-green-500' :
                              deliverable.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                            )} />
                            <span className="text-sm">{deliverable.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Due {formatDate(deliverable.dueDate)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedCollab.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-2",
                          message.isDesigner ? "justify-end" : "justify-start"
                        )}
                      >
                        <div className={cn(
                          "max-w-[70%] p-3 rounded-lg text-sm",
                          message.isDesigner 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        )}>
                          <p>{message.message}</p>
                          <p className={cn(
                            "text-xs mt-1",
                            message.isDesigner ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2 mt-4">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(selectedCollab.id)}
                      className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
                    />
                    <Button 
                      size="sm"
                      onClick={() => handleSendMessage(selectedCollab.id)}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Select a collaboration to view details
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}