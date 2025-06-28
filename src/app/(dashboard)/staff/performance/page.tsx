// src/app/(dashboard)/staff/performance/page.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp,
  TrendingDown,
  Target,
  Star,
  Award,
  BarChart3,
  RefreshCw
} from 'lucide-react'
import { RoleGuard } from '@/components/shared/role-guard'

export default function StaffPerformancePage() {
  // Mock data - would come from API
  const performanceData = {
    current: {
      ordersProcessed: 156,
      avgProcessingTime: 24, // minutes
      customerSatisfaction: 4.6,
      qualityScore: 94.2,
      ticketsResolved: 43,
      completionRate: 87.5
    },
    targets: {
      ordersProcessed: 200,
      avgProcessingTime: 30,
      customerSatisfaction: 4.5,
      qualityScore: 90,
      ticketsResolved: 50,
      completionRate: 85
    },
    trends: {
      ordersProcessed: +12.5,
      avgProcessingTime: -8.3,
      customerSatisfaction: +0.2,
      qualityScore: +2.1,
      ticketsResolved: +5.8,
      completionRate: +3.2
    }
  }

  const weeklyData = [
    { day: 'Mon', orders: 22, tickets: 8, quality: 95 },
    { day: 'Tue', orders: 28, tickets: 12, quality: 92 },
    { day: 'Wed', orders: 25, tickets: 9, quality: 96 },
    { day: 'Thu', orders: 32, tickets: 14, quality: 93 },
    { day: 'Fri', orders: 29, tickets: 11, quality: 97 },
    { day: 'Sat', orders: 18, tickets: 6, quality: 94 },
    { day: 'Sun', orders: 15, tickets: 4, quality: 95 }
  ]

  const achievements = [
    {
      id: 1,
      title: 'Speed Demon',
      description: 'Process 50+ orders in a single day',
      icon: TrendingUp,
      earned: true,
      earnedDate: '2024-06-25'
    },
    {
      id: 2,
      title: 'Quality Champion',
      description: 'Maintain 95%+ quality score for a week',
      icon: Star,
      earned: true,
      earnedDate: '2024-06-20'
    },
    {
      id: 3,
      title: 'Customer Hero',
      description: 'Achieve 4.8+ customer satisfaction rating',
      icon: Award,
      earned: false,
      progress: 85
    },
    {
      id: 4,
      title: 'Efficiency Expert',
      description: 'Complete 100% of daily targets for a month',
      icon: Target,
      earned: false,
      progress: 67
    }
  ]

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? TrendingUp : TrendingDown
  }

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <RoleGuard allowedRoles={['staff']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Performance Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track your performance metrics and achievements
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Orders Processed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                Orders Processed
                <Badge variant="outline">{performanceData.current.ordersProcessed}/{performanceData.targets.ordersProcessed}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{performanceData.current.ordersProcessed}</span>
                  <div className={`flex items-center space-x-1 ${getTrendColor(performanceData.trends.ordersProcessed)}`}>
                    {React.createElement(getTrendIcon(performanceData.trends.ordersProcessed), { className: 'w-4 h-4' })}
                    <span className="text-sm font-medium">{Math.abs(performanceData.trends.ordersProcessed)}%</span>
                  </div>
                </div>
                <Progress value={(performanceData.current.ordersProcessed / performanceData.targets.ordersProcessed) * 100} />
                <p className="text-sm text-muted-foreground">
                  Target: {performanceData.targets.ordersProcessed} orders this month
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Processing Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                Avg Processing Time
                <Badge variant="outline">{performanceData.current.avgProcessingTime}min</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{performanceData.current.avgProcessingTime}<span className="text-lg text-muted-foreground">min</span></span>
                  <div className={`flex items-center space-x-1 ${getTrendColor(performanceData.trends.avgProcessingTime)}`}>
                    {React.createElement(getTrendIcon(performanceData.trends.avgProcessingTime), { className: 'w-4 h-4' })}
                    <span className="text-sm font-medium">{Math.abs(performanceData.trends.avgProcessingTime)}%</span>
                  </div>
                </div>
                <Progress value={Math.max(0, 100 - ((performanceData.current.avgProcessingTime / performanceData.targets.avgProcessingTime) * 100))} />
                <p className="text-sm text-muted-foreground">
                  Target: under {performanceData.targets.avgProcessingTime} minutes
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Satisfaction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                Customer Satisfaction
                <Badge variant="outline">{performanceData.current.customerSatisfaction}/5.0</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-2xl font-bold">{performanceData.current.customerSatisfaction}</span>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                  <div className={`flex items-center space-x-1 ${getTrendColor(performanceData.trends.customerSatisfaction)}`}>
                    {React.createElement(getTrendIcon(performanceData.trends.customerSatisfaction), { className: 'w-4 h-4' })}
                    <span className="text-sm font-medium">{Math.abs(performanceData.trends.customerSatisfaction)}</span>
                  </div>
                </div>
                <Progress value={(performanceData.current.customerSatisfaction / 5) * 100} />
                <p className="text-sm text-muted-foreground">
                  Target: {performanceData.targets.customerSatisfaction}+ rating
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quality Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                Quality Score
                <Badge variant="outline">{performanceData.current.qualityScore}%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{performanceData.current.qualityScore}<span className="text-lg text-muted-foreground">%</span></span>
                  <div className={`flex items-center space-x-1 ${getTrendColor(performanceData.trends.qualityScore)}`}>
                    {React.createElement(getTrendIcon(performanceData.trends.qualityScore), { className: 'w-4 h-4' })}
                    <span className="text-sm font-medium">{Math.abs(performanceData.trends.qualityScore)}%</span>
                  </div>
                </div>
                <Progress value={performanceData.current.qualityScore} />
                <p className="text-sm text-muted-foreground">
                  Target: {performanceData.targets.qualityScore}%+ quality score
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tickets Resolved */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                Tickets Resolved
                <Badge variant="outline">{performanceData.current.ticketsResolved}/{performanceData.targets.ticketsResolved}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{performanceData.current.ticketsResolved}</span>
                  <div className={`flex items-center space-x-1 ${getTrendColor(performanceData.trends.ticketsResolved)}`}>
                    {React.createElement(getTrendIcon(performanceData.trends.ticketsResolved), { className: 'w-4 h-4' })}
                    <span className="text-sm font-medium">{Math.abs(performanceData.trends.ticketsResolved)}%</span>
                  </div>
                </div>
                <Progress value={(performanceData.current.ticketsResolved / performanceData.targets.ticketsResolved) * 100} />
                <p className="text-sm text-muted-foreground">
                  Target: {performanceData.targets.ticketsResolved} tickets this month
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Completion Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                Completion Rate
                <Badge variant="outline">{performanceData.current.completionRate}%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{performanceData.current.completionRate}<span className="text-lg text-muted-foreground">%</span></span>
                  <div className={`flex items-center space-x-1 ${getTrendColor(performanceData.trends.completionRate)}`}>
                    {React.createElement(getTrendIcon(performanceData.trends.completionRate), { className: 'w-4 h-4' })}
                    <span className="text-sm font-medium">{Math.abs(performanceData.trends.completionRate)}%</span>
                  </div>
                </div>
                <Progress value={performanceData.current.completionRate} />
                <p className="text-sm text-muted-foreground">
                  Target: {performanceData.targets.completionRate}%+ completion rate
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="weekly">Weekly Performance</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="goals">Goals & Targets</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance Breakdown</CardTitle>
                <CardDescription>
                  Your daily performance metrics for this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyData.map((day) => (
                    <div key={day.day} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 text-center">
                          <span className="font-medium">{day.day}</span>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Orders</p>
                            <p className="font-semibold">{day.orders}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Tickets</p>
                            <p className="font-semibold">{day.tickets}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Quality</p>
                            <p className="font-semibold">{day.quality}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={day.quality} className="w-20" />
                        <span className="text-sm font-medium">{day.quality}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Badges</CardTitle>
                <CardDescription>
                  Your earned achievements and progress toward new ones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className={`p-4 border rounded-lg ${achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${achievement.earned ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <achievement.icon className={`w-5 h-5 ${achievement.earned ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{achievement.title}</h4>
                            {achievement.earned && (
                              <Badge variant="secondary" className="text-xs">Earned</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          {achievement.earned ? (
                            <p className="text-xs text-green-600">
                              Earned on {achievement.earnedDate}
                            </p>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{achievement.progress}%</span>
                              </div>
                              <Progress value={achievement.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle>Goals & Targets</CardTitle>
                <CardDescription>
                  Set and track your performance goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">Goal Setting</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Personalized goal setting and tracking features will be available here.
                  </p>
                  <Button variant="outline">Set New Goals</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
