"use client"

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ListChecks, 
  MessageSquare, 
  Workflow as WorkflowIcon, 
  Plus,
  CheckCircle2,
  Circle,
  AlertCircle,
  Calendar,
  Users,
  Lightbulb,
  Target,
  Activity,
  Play,
  Search,
  Sparkles,
  Bell,
  CheckCheck,
  MessageCircle,
  Clock,
  ChevronRight
} from 'lucide-react'
import { queryClient, apiRequest } from '@/lib/queryClient'
import type { Workflow, WorkflowTask, ProjectInstance, ProjectTask, TaskComment, TaskReaction } from '@shared/schema'

export default function CollaborationTools() {
  const [currentStep, setCurrentStep] = useState(1)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [playDialogOpen, setPlayDialogOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskAssignee, setNewTaskAssignee] = useState('')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState<'campaign' | 'internal'>('campaign')
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null)
  const [commentText, setCommentText] = useState('')
  
  // Task filtering state
  const [filterAssignee, setFilterAssignee] = useState<string>('all')
  const [filterDueDate, setFilterDueDate] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Workflow/Play template state
  const [selectedPlaybookType, setSelectedPlaybookType] = useState<string | null>(null)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)

  const steps = [
    { 
      number: 1, 
      title: 'Tasks', 
      description: 'Manage priorities and deadlines',
      icon: ListChecks 
    },
    { 
      number: 2, 
      title: 'Automation & Workflows', 
      description: 'Build marketing plays and sequences',
      icon: WorkflowIcon 
    },
    { 
      number: 3, 
      title: 'Collaboration', 
      description: 'Team communication and feedback',
      icon: MessageSquare 
    }
  ]

  // Fetch workflows
  const { data: workflows = [] } = useQuery<Workflow[]>({
    queryKey: ['/api/workflows'],
  })

  // Fetch project instances (user's active workflows)
  const { data: projectInstances = [] } = useQuery<ProjectInstance[]>({
    queryKey: ['/api/project-instances'],
  })

  // Fetch tasks for all project instances
  const { data: allTasks = [] } = useQuery<ProjectTask[]>({
    queryKey: ['/api/project-tasks'],
    enabled: projectInstances.length > 0,
  })

  // Fetch comments for selected task
  const { data: taskComments = [] } = useQuery<TaskComment[]>({
    queryKey: ['/api/task-comments', selectedTask?.id],
    enabled: !!selectedTask,
  })

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ProjectTask> }) => {
      return apiRequest('PATCH', `/api/project-tasks/${id}`, updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/project-tasks'] })
    },
  })

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (comment: { projectTaskId: string; commentText: string; userName: string }) => {
      return apiRequest('POST', '/api/task-comments', comment)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/task-comments', selectedTask?.id] })
      setCommentText('')
    },
  })

  // Add reaction mutation
  const addReactionMutation = useMutation({
    mutationFn: async (reaction: { targetId: string; targetType: 'task' | 'comment'; reactionType: string; userId: string }) => {
      return apiRequest('POST', '/api/task-reactions', reaction)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/task-reactions', selectedTask?.id] })
    },
  })

  // Get overdue tasks count
  const overdueTasks = allTasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false
    return new Date(task.dueDate) < new Date()
  })

  // Get upcoming tasks count (due in next 7 days)
  const upcomingTasks = allTasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    const weekFromNow = new Date()
    weekFromNow.setDate(today.getDate() + 7)
    return dueDate >= today && dueDate <= weekFromNow
  })

  // Get priority tasks (high priority, not completed)
  const priorityTasks = allTasks.filter(task => 
    task.priority === 'high' && task.status !== 'completed'
  ).slice(0, 5)

  // Filter tasks based on filter criteria
  const filteredTasks = allTasks.filter(task => {
    // Search query filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    // Assignee filter
    if (filterAssignee !== 'all' && task.assignedTo !== filterAssignee) {
      return false
    }
    
    // Status filter
    if (filterStatus !== 'all' && task.status !== filterStatus) {
      return false
    }
    
    // Priority filter
    if (filterPriority !== 'all' && task.priority !== filterPriority) {
      return false
    }
    
    // Due date filter
    if (filterDueDate !== 'all') {
      if (!task.dueDate) return false
      const dueDate = new Date(task.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (filterDueDate === 'overdue') {
        if (dueDate >= today) return false
      } else if (filterDueDate === 'today') {
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        if (dueDate < today || dueDate >= tomorrow) return false
      } else if (filterDueDate === 'week') {
        const weekFromNow = new Date(today)
        weekFromNow.setDate(today.getDate() + 7)
        if (dueDate < today || dueDate > weekFromNow) return false
      } else if (filterDueDate === 'month') {
        const monthFromNow = new Date(today)
        monthFromNow.setMonth(today.getMonth() + 1)
        if (dueDate < today || dueDate > monthFromNow) return false
      }
    }
    
    return true
  })

  // Get unique assignees for filter
  const uniqueAssignees = Array.from(new Set(allTasks.map(t => t.assignedTo).filter(Boolean)))

  // Handle task status change
  const handleTaskStatusChange = (taskId: string, completed: boolean) => {
    updateTaskMutation.mutate({
      id: taskId,
      updates: { status: completed ? 'completed' : 'todo' }
    })
  }

  // Handle add comment
  const handleAddComment = () => {
    if (!selectedTask || !commentText.trim()) return
    
    addCommentMutation.mutate({
      projectTaskId: selectedTask.id,
      commentText: commentText,
      userName: 'Current User'
    })
  }

  // Handle add reaction
  const handleAddReaction = (reactionType: string) => {
    if (!selectedTask) return
    
    addReactionMutation.mutate({
      targetId: selectedTask.id,
      targetType: 'task',
      reactionType,
      userId: 'user-1'
    })
  }

  // Sample plays data
  const playbookTypes = [
    {
      id: 'abm',
      name: 'ABM Playbooks',
      description: 'Account-based marketing sequences for enterprise targets',
      icon: Target,
      gradient: 'from-purple-500 to-pink-500',
      count: 3
    },
    {
      id: 'my-plays',
      name: 'My Plays / Recipes',
      description: 'Custom campaign recipes from Strategy Studio',
      icon: Sparkles,
      gradient: 'from-blue-500 to-cyan-500',
      count: 5
    },
    {
      id: 'personalization',
      name: 'Personalization Plays',
      description: 'Behavior-based nurture sequences',
      icon: Activity,
      gradient: 'from-orange-500 to-red-500',
      count: 2
    }
  ]

  // Template data for each playbook type
  const playbookTemplates = {
    'abm': [
      {
        id: 'abm-1',
        name: 'Enterprise Account Warming',
        description: '6-week nurture sequence for enterprise targets with personalized content',
        steps: 5,
        duration: '6 weeks',
        triggers: 'Account added to target list',
        actions: ['Send personalized email', 'LinkedIn connection', 'Share case study', 'Schedule demo', 'Executive outreach']
      },
      {
        id: 'abm-2',
        name: 'Multi-Threaded Engagement',
        description: 'Reach multiple decision makers within target account',
        steps: 7,
        duration: '8 weeks',
        triggers: 'Contact identified in buying committee',
        actions: ['Research contacts', 'Personalized outreach', 'Share resources', 'Coordinate meetings', 'Align messaging', 'Schedule call', 'Follow-up']
      },
      {
        id: 'abm-3',
        name: 'Re-Engagement Play',
        description: 'Revive cold accounts with new value propositions',
        steps: 4,
        duration: '4 weeks',
        triggers: 'No engagement in 90 days',
        actions: ['Share industry insights', 'Product update email', 'Executive check-in', 'Offer consultation']
      }
    ],
    'my-plays': [
      {
        id: 'myplay-1',
        name: 'Product Launch Campaign',
        description: 'Full campaign recipe from Strategy Studio',
        steps: 8,
        duration: '12 weeks',
        triggers: 'Product launch date set',
        actions: ['Teaser campaign', 'Email series', 'Social media', 'Webinar', 'Press release', 'Partner outreach', 'Customer stories', 'Sales enablement']
      },
      {
        id: 'myplay-2',
        name: 'Event Promotion Sequence',
        description: 'Drive registrations and attendance for events',
        steps: 6,
        duration: '6 weeks',
        triggers: 'Event scheduled',
        actions: ['Save the date', 'Early bird offer', 'Speaker highlights', 'Agenda reveal', 'Last chance reminder', 'Post-event follow-up']
      },
      {
        id: 'myplay-3',
        name: 'Content Distribution Recipe',
        description: 'Maximize reach of premium content assets',
        steps: 5,
        duration: '4 weeks',
        triggers: 'New content published',
        actions: ['Email to subscribers', 'Social promotion', 'Partner sharing', 'Paid amplification', 'Retargeting']
      },
      {
        id: 'myplay-4',
        name: 'Customer Expansion Play',
        description: 'Cross-sell and upsell to existing customers',
        steps: 6,
        duration: '8 weeks',
        triggers: 'Usage threshold reached',
        actions: ['Value assessment', 'Feature showcase', 'Success story share', 'Personalized demo', 'Pricing discussion', 'Close negotiation']
      },
      {
        id: 'myplay-5',
        name: 'Partner Co-Marketing',
        description: 'Joint campaign with strategic partners',
        steps: 7,
        duration: '10 weeks',
        triggers: 'Partner agreement signed',
        actions: ['Align messaging', 'Create co-branded content', 'Joint webinar', 'Email to combined lists', 'Social cross-promotion', 'Lead sharing', 'ROI review']
      }
    ],
    'personalization': [
      {
        id: 'pers-1',
        name: 'Website Visitor Nurture',
        description: 'Triggered sequence based on page visits and content downloads',
        steps: 4,
        duration: '2 weeks',
        triggers: 'Visited pricing page 3+ times',
        actions: ['Send relevant case study', 'Product comparison guide', 'Offer demo', 'Check-in call']
      },
      {
        id: 'pers-2',
        name: 'Trial User Conversion',
        description: 'Behavior-based emails during product trial',
        steps: 6,
        duration: '14 days',
        triggers: 'Trial started',
        actions: ['Welcome & setup', 'Feature highlight #1', 'Feature highlight #2', 'Success tips', 'Upgrade offer', 'Last day reminder']
      }
    ]
  }

  // Get templates for selected playbook type
  const getTemplatesForType = (typeId: string) => {
    return playbookTemplates[typeId as keyof typeof playbookTemplates] || []
  }

  return (
    <div className="h-full flex bg-background overflow-x-hidden">
      {/* Left Navigation - Column 1 */}
      <div className="w-64 border-r p-6 space-y-6 overflow-y-auto overflow-x-hidden">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-flightdeck-start to-flightdeck-end bg-clip-text text-transparent mb-2">
            Collab & Workflows
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage tasks, build workflows, and collaborate
          </p>
        </div>

        {/* Step Navigation */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Steps</label>
          <nav className="space-y-1">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <button
                  key={step.number}
                  onClick={() => setCurrentStep(step.number)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    currentStep === step.number
                      ? 'bg-flightdeck-start/10 text-flightdeck-start font-medium'
                      : 'hover-elevate'
                  }`}
                  data-testid={`nav-step-${step.number}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4" />
                    Step {step.number}: {step.title}
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">{step.description}</p>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Middle and Right Content Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content - Column 2 */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Step 1: Tasks */}
          {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <ListChecks className="w-6 h-6" />
                Step 1: Tasks
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage priorities, deadlines, and team assignments
              </p>
            </div>

            {/* Priority Tasks Section */}
            {priorityTasks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-600" />
                    Priority Tasks
                  </h4>
                  <Badge variant="outline" className="text-red-600">
                    {priorityTasks.length} high priority
                  </Badge>
                </div>
                <div className="space-y-2">
                  {priorityTasks.map((task) => (
                    <Card 
                      key={task.id} 
                      className="p-4 hover-elevate cursor-pointer border-l-4 border-l-red-500"
                      onClick={() => setSelectedTask(task)}
                      data-testid={`card-priority-task-${task.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.status === 'completed'}
                          onCheckedChange={(checked) => handleTaskStatusChange(task.id, checked as boolean)}
                          onClick={(e) => e.stopPropagation()}
                          data-testid={`checkbox-priority-${task.id}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{task.title}</span>
                            <Badge variant="destructive" className="text-xs">HIGH</Badge>
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {task.dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            )}
                            {task.assignee && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {task.assignee}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Task Actions */}
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setTaskDialogOpen(true)}
                data-testid="button-create-task"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
              <Button 
                variant="outline"
                data-testid="button-pull-from-stackwise"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Pull from Stackwise
              </Button>
            </div>

            {/* Task Categories */}
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold mb-3">Campaign Tasks</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Tasks related to marketing campaigns and initiatives
                </p>
                {allTasks.filter(t => !t.description?.includes('internal')).length === 0 ? (
                  <Card className="p-8 text-center">
                    <ListChecks className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No campaign tasks yet. Create one to get started.
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {allTasks.filter(t => !t.description?.includes('internal')).slice(0, 5).map((task) => (
                      <Card 
                        key={task.id}
                        className="p-3 hover-elevate cursor-pointer"
                        onClick={() => setSelectedTask(task)}
                        data-testid={`card-task-${task.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={task.status === 'completed'}
                            onCheckedChange={(checked) => handleTaskStatusChange(task.id, checked as boolean)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1">
                            <span className={`text-sm ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </span>
                          </div>
                          {task.assignee && (
                            <Badge variant="secondary" className="text-xs">
                              {task.assignee}
                            </Badge>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3">Internal Maintenance</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  System maintenance tasks: monthly/quarterly reports, review preps, budget updates
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: 'Monthly Leadership Report', assignee: 'Sarah Chen', due: '1st of month' },
                    { title: 'Quarterly Review Prep', assignee: 'Marcus Johnson', due: 'Last week of quarter' },
                    { title: 'Annual Reset Planning', assignee: 'Lisa Park', due: 'December' },
                    { title: 'Budget Update', assignee: 'Finance Team', due: 'Monthly' }
                  ].map((item, idx) => {
                    const isCompleted = false; // Will be tracked in actual task data
                    return (
                      <Card key={idx} className="p-3 hover-elevate cursor-pointer" data-testid={`card-internal-${idx}`}>
                        <div className="flex items-start gap-2 mb-2">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          )}
                          <span className={`text-sm font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {item.title}
                          </span>
                        </div>
                      <div className="pl-6 space-y-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" />
                          {item.assignee}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {item.due}
                        </div>
                      </div>
                    </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-end pt-4">
              <Button onClick={() => setCurrentStep(2)} data-testid="button-next-to-workflows">
                Next: Automation & Workflows
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Automation & Workflows */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <WorkflowIcon className="w-6 h-6" />
                Step 2: Automation & Workflows
              </h3>
              <p className="text-sm text-muted-foreground">
                Build sequences, assign segments, and automate marketing workflows
              </p>
            </div>

            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Build Your Plays</h4>
              <Button 
                onClick={() => setPlayDialogOpen(true)}
                data-testid="button-create-play"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Play
              </Button>
            </div>

            {/* Playbook Type Cards */}
            <div className="grid grid-cols-3 gap-4">
              {playbookTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Card 
                    key={type.id}
                    className="p-6 hover-elevate cursor-pointer"
                    data-testid={`card-playbook-type-${type.id}`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${type.gradient} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold mb-1">{type.name}</h5>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-sm text-muted-foreground">{type.count} templates</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          setSelectedPlaybookType(type.id)
                          setTemplateDialogOpen(true)
                        }}
                        data-testid={`button-view-templates-${type.id}`}
                      >
                        View Templates
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Active Plays Section */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Active Plays</h4>
              <Card className="p-8 text-center">
                <Play className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <h5 className="font-semibold mb-2">No Active Plays Yet</h5>
                <p className="text-sm text-muted-foreground mb-4">
                  Open a template, customize it, and save to create your first play
                </p>
                <Button variant="outline">
                  Browse Templates
                </Button>
              </Card>
            </div>

            {/* Integration Alerts */}
            <Card className="p-6 bg-muted/50">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-flightdeck-start flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-semibold mb-2">Sales Alerts & Integrations</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Connect your tools to trigger alerts based on play activities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Email', 'Slack', 'HubSpot', 'Salesforce'].map((integration) => (
                      <Badge key={integration} variant="outline" className="cursor-pointer hover-elevate">
                        {integration}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Previous: Tasks
              </Button>
              <Button onClick={() => setCurrentStep(3)} data-testid="button-next-to-collab">
                Next: Collaboration
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Collaboration */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <MessageSquare className="w-6 h-6" />
                Step 3: Collaboration
              </h3>
              <p className="text-sm text-muted-foreground">
                Use @mentions to delegate effectively and stay connected with your team
              </p>
            </div>

            {/* Add Comment / Mention Someone */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Add Comment or Mention</h4>
              <div className="space-y-3">
                <Textarea
                  placeholder="Type @ to mention someone, or just add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-24"
                  data-testid="input-comment"
                />
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {['@sarahchen', '@marcusjohnson', '@lisapark'].map((mention) => (
                      <Badge 
                        key={mention}
                        variant="outline"
                        className="cursor-pointer hover-elevate"
                        onClick={() => setCommentText(commentText + ' ' + mention)}
                        data-testid={`mention-${mention.replace('@', '')}`}
                      >
                        {mention}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    data-testid="button-add-comment"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </Card>

            {/* Recent Activity Feed */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Recent Activity</h4>
              <div className="space-y-3">
                {/* Sample Activity Items */}
                <Card className="p-4" data-testid="activity-1">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Sarah Chen</span>
                        <span className="text-xs text-muted-foreground">mentioned you</span>
                        <span className="text-xs text-muted-foreground">• 2h ago</span>
                      </div>
                      <p className="text-sm mb-2">
                        <span className="text-blue-600 font-medium">@marcusjohnson</span> can you review the Q1 campaign brief? Need your input on targeting.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" data-testid="button-react-activity-1">
                          <CheckCheck className="w-3 h-3 mr-1" />
                          React
                        </Button>
                        <Button variant="outline" size="sm" data-testid="button-reply-activity-1">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4" data-testid="activity-2">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Marcus Johnson</span>
                        <span className="text-xs text-muted-foreground">completed a task</span>
                        <span className="text-xs text-muted-foreground">• 4h ago</span>
                      </div>
                      <p className="text-sm mb-2">
                        Finalized the ABM account list for Q1 campaigns
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          ✅ Approved (3)
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4" data-testid="activity-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Lisa Park</span>
                        <span className="text-xs text-muted-foreground">commented</span>
                        <span className="text-xs text-muted-foreground">• 5h ago</span>
                      </div>
                      <p className="text-sm mb-2">
                        Updated the targeting criteria to focus on enterprise accounts with 500+ employees
                      </p>
                      <div className="pl-4 border-l-2 border-muted mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-xs">Sarah Chen</span>
                          <span className="text-xs text-muted-foreground">replied • 3h ago</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Great update! This aligns perfectly with our ICP.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4" data-testid="activity-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">System</span>
                        <span className="text-xs text-muted-foreground">assigned you a task</span>
                        <span className="text-xs text-muted-foreground">• 1d ago</span>
                      </div>
                      <p className="text-sm">
                        Monthly Leadership Report due in 3 days
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-start pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Previous: Automation & Workflows
              </Button>
            </div>
          </div>
        )}
        </div>

        {/* Right Column - Stats & Filters (only for Step 1) */}
        {currentStep === 1 && (
          <div className="w-80 border-l p-6 space-y-6 overflow-y-auto">
            {/* Quick Stats */}
            <div>
              <h4 className="font-semibold mb-3">Manage Tasks</h4>
              <div className="space-y-2">
                <Card className={`p-3 ${overdueTasks.length > 0 ? 'border-red-200 dark:border-red-900' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`w-4 h-4 ${overdueTasks.length > 0 ? 'text-red-600' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-medium">Overdue</span>
                    </div>
                    <Badge variant={overdueTasks.length > 0 ? "destructive" : "secondary"} data-testid="badge-overdue">
                      {overdueTasks.length}
                    </Badge>
                  </div>
                </Card>
                
                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Due This Week</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" data-testid="badge-due-week">
                      {upcomingTasks.length}
                    </Badge>
                  </div>
                </Card>

                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                    <Badge variant="secondary" data-testid="badge-completed">
                      {allTasks.filter(t => t.status === 'completed').length}
                    </Badge>
                  </div>
                </Card>
              </div>
            </div>

            {/* Filters */}
            <div>
              <h4 className="font-semibold mb-3">Filters</h4>
              <div className="space-y-3">
                {/* Search */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                      data-testid="input-search-tasks"
                    />
                  </div>
                </div>

                {/* Assignee Filter */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Assignee</label>
                  <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                    <SelectTrigger data-testid="filter-assignee">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {uniqueAssignees.map(assignee => (
                        <SelectItem key={assignee} value={assignee}>
                          {assignee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger data-testid="filter-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Priority</label>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger data-testid="filter-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Due Date Filter */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Due Date</label>
                  <Select value={filterDueDate} onValueChange={setFilterDueDate}>
                    <SelectTrigger data-testid="filter-due-date">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Template Viewing Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" data-testid="dialog-view-templates">
          <DialogHeader>
            <DialogTitle>
              {selectedPlaybookType && playbookTypes.find(t => t.id === selectedPlaybookType)?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedPlaybookType && playbookTypes.find(t => t.id === selectedPlaybookType)?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedPlaybookType && getTemplatesForType(selectedPlaybookType).map((template) => (
              <Card key={template.id} className="p-6" data-testid={`template-${template.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{template.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <WorkflowIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{template.steps} steps</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{template.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Trigger:</span> {template.triggers}
                      </div>
                    </div>

                    {/* Workflow Actions */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Workflow Actions:</label>
                      <div className="grid gap-2">
                        {template.actions.map((action, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <div className="w-6 h-6 rounded-full bg-flightdeck-start/10 text-flightdeck-start flex items-center justify-center flex-shrink-0 text-xs font-semibold mt-0.5">
                              {idx + 1}
                            </div>
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="default"
                    data-testid={`button-use-template-${template.id}`}
                    onClick={() => {
                      setTemplateDialogOpen(false)
                      // In real app, would create instance from template
                    }}
                  >
                    Use This Template
                  </Button>
                  <Button 
                    variant="outline"
                    data-testid={`button-preview-${template.id}`}
                  >
                    Preview
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent data-testid="dialog-create-task">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your workflow or pull specific items from Stackwise
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Task Type</label>
              <Select value={newTaskCategory} onValueChange={(v) => setNewTaskCategory(v as any)}>
                <SelectTrigger data-testid="select-task-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="campaign">Campaign Task</SelectItem>
                  <SelectItem value="internal">Internal Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="Enter task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                data-testid="input-task-title"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Enter task description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                rows={3}
                data-testid="textarea-task-description"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Assign To</label>
              <Input
                placeholder="Enter team member name"
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                data-testid="input-task-assignee"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Due Date</label>
              <Input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                data-testid="input-task-due-date"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {}} data-testid="button-save-task">
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Play Dialog */}
      <Dialog open={playDialogOpen} onOpenChange={setPlayDialogOpen}>
        <DialogContent data-testid="dialog-create-play">
          <DialogHeader>
            <DialogTitle>Create New Play</DialogTitle>
            <DialogDescription>
              Build a custom workflow from scratch or start from a template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {playbookTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Card 
                    key={type.id}
                    className="p-4 hover-elevate cursor-pointer text-center"
                    data-testid={`option-playbook-${type.id}`}
                  >
                    <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-2`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h5 className="font-semibold text-sm mb-1">{type.name}</h5>
                    <p className="text-xs text-muted-foreground">{type.count} templates</p>
                  </Card>
                )
              })}
            </div>
            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full" data-testid="button-create-from-scratch">
                <Plus className="w-4 h-4 mr-2" />
                Create from Scratch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
