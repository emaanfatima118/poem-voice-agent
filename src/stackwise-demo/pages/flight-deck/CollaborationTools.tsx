import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/stackwise-demo/components/ui/card'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Input } from '@/stackwise-demo/components/ui/input'
import { Label } from '@/stackwise-demo/components/ui/label'
import { Badge } from '@/stackwise-demo/components/ui/badge'
import { Switch } from '@/stackwise-demo/components/ui/switch'
import { Checkbox } from '@/stackwise-demo/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/stackwise-demo/components/ui/select'
import {
  Users,
  Workflow as WorkflowIcon,
  MessageSquare,
  Send,
  Lightbulb,
  CheckCircle2,
  Plus,
  Zap,
  ChevronRight
} from 'lucide-react'
import { QuickActions } from '@/stackwise-demo/components/QuickActions'

const FLIGHT_DECK_COLOR = '#1e40f2'

function TeamUsers() {
  const teamMembers = [
    { id: 1, name: 'Sarah Chen', role: 'Marketing Director', email: 'sarah@company.com', avatar: 'SC', active: true },
    { id: 2, name: 'Marcus Johnson', role: 'Content Manager', email: 'marcus@company.com', avatar: 'MJ', active: true },
    { id: 3, name: 'Lisa Park', role: 'Campaign Specialist', email: 'lisa@company.com', avatar: 'LP', active: true },
    { id: 4, name: 'David Kim', role: 'Social Media Lead', email: 'david@company.com', avatar: 'DK', active: false },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2" style={{ color: FLIGHT_DECK_COLOR }}>
          <Users className="w-4 h-4" />
          Team Members
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {teamMembers.map(member => (
          <div key={member.id} className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-semibold text-blue-600 shrink-0"
              data-testid={`avatar-${member.id}`}
            >
              {member.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{member.name}</div>
              <div className="text-xs text-muted-foreground truncate">{member.role}</div>
            </div>
            <div className={`w-2 h-2 rounded-full ${member.active ? 'bg-green-500' : 'bg-gray-300'}`} />
          </div>
        ))}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          data-testid="button-invite-user"
        >
          <Plus className="w-3 h-3 mr-2" />
          Invite User
        </Button>
      </CardContent>
    </Card>
  )
}

type Trigger = {
  id: string
  category: string
  name: string
  description: string
}

type Action = {
  id: string
  name: string
  type: 'notify_internal' | 'notify_sales' | 'reminder' | 'suggestion'
  description: string
}

const allTriggers: Trigger[] = [
  // Campaign
  { id: 'campaign-launch', category: 'Campaign', name: 'Campaign launches', description: 'When a campaign goes live' },
  { id: 'campaign-complete', category: 'Campaign', name: 'Campaign completes', description: 'When a campaign finishes' },
  // Audience/ABM
  { id: 'account-spike', category: 'Audience/ABM', name: 'Account activity spike', description: 'Target account shows high activity' },
  { id: 'segment-change', category: 'Audience/ABM', name: 'Segment membership change', description: 'Contact enters/exits segment' },
  { id: 'segment-heating', category: 'Audience/ABM', name: 'Segment heating up', description: 'Segment shows increased engagement' },
  { id: 'segment-cold', category: 'Audience/ABM', name: 'Segment going cold', description: 'Segment engagement dropping' },
  { id: 'segment-trending', category: 'Audience/ABM', name: 'Segment trending', description: 'Segment showing positive trends' },
  { id: 'segment-underserved', category: 'Audience/ABM', name: 'Under-served segment detected', description: 'High potential, low coverage segment' },
  { id: 'segment-wasted', category: 'Audience/ABM', name: 'Wasted effort detected', description: 'Low ROI segment identified' },
  // Content
  { id: 'content-approved', category: 'Content', name: 'Content approved', description: 'Draft approved in BrandCraft' },
  { id: 'asset-ready', category: 'Content', name: 'Asset ready', description: 'Asset available for distribution' },
  // Pulse Hub
  { id: 'performance-drop', category: 'Pulse Hub', name: 'Performance drop detected', description: 'Metrics fall below threshold' },
  { id: 'competitor-change', category: 'Pulse Hub', name: 'Competitor movement', description: 'Competitor activity detected' },
  // Budget
  { id: 'budget-overspend', category: 'Budget', name: 'Budget overspend detected', description: 'Category or channel exceeds budget tolerance' },
  { id: 'budget-underspend', category: 'Budget', name: 'Budget underspend detected', description: 'Category significantly under budget' },
  { id: 'budget-threshold', category: 'Budget', name: 'Budget threshold reached', description: 'Spending reaches set threshold (90%, 95%, etc.)' },
  { id: 'reallocation-needed', category: 'Budget', name: 'Reallocation opportunity', description: 'AI detects optimal reallocation opportunity' },
  { id: 'channel-inactive', category: 'Budget', name: 'Channel minimum activity alert', description: 'Channel below minimum activity threshold' },
  { id: 'monthly-budget-check', category: 'Budget', name: 'Monthly budget review', description: 'Monthly budget check-in reminder' },
  // Strategy Studio
  { id: 'quarterly-review-due', category: 'Strategy Studio', name: 'Quarterly review due', description: 'Quarterly review coming up' },
  { id: 'annual-reset-due', category: 'Strategy Studio', name: 'Annual reset due', description: 'Annual planning due' },
  // Flight Deck
  { id: 'distribution-ready', category: 'Flight Deck', name: 'Distribution ready', description: 'Campaign ready for takeoff' },
  { id: 'task-overdue', category: 'Flight Deck', name: 'Task overdue', description: 'Task past due date' },
]

const allActions: Action[] = [
  // Sales Alerts
  { id: 'notify-sales-email', name: 'Email sales team', type: 'notify_sales', description: 'Send email to sales' },
  { id: 'notify-sales-slack', name: 'Slack sales channel', type: 'notify_sales', description: 'Post to sales Slack channel' },
  { id: 'attach-campaign-asset', name: 'Attach campaign asset', type: 'notify_sales', description: 'Include campaign materials' },
  { id: 'segment-heating-alert', name: 'Segment heating up alert', type: 'notify_sales', description: 'Alert when segment shows increased engagement' },
  { id: 'segment-cold-alert', name: 'Segment cold alert', type: 'notify_sales', description: 'Alert when segment engagement drops' },
  { id: 'segment-trending-alert', name: 'Segment trending alert', type: 'notify_sales', description: 'Alert when segment shows positive trends' },
  { id: 'segment-underserved-alert', name: 'Under-served segment alert', type: 'notify_sales', description: 'Alert for high-potential, low-coverage segments' },
  { id: 'segment-wasted-alert', name: 'Wasted effort alert', type: 'notify_sales', description: 'Alert for low-ROI segments' },
  // Internal Notifications
  { id: 'send-inapp', name: 'In-app notification', type: 'notify_internal', description: 'Show in Stackwise' },
  { id: 'send-email-internal', name: 'Email team', type: 'notify_internal', description: 'Send email notification' },
  { id: 'send-slack-internal', name: 'Slack notification', type: 'notify_internal', description: 'Post to team channel' },
  { id: 'segment-insight-notification', name: 'Segment insight notification', type: 'notify_internal', description: 'Notify team of segment changes' },
  // Reminders
  { id: 'reminder-quarterly', name: 'Quarterly reminder', type: 'reminder', description: 'Quarterly review reminder' },
  { id: 'reminder-monthly', name: 'Monthly reminder', type: 'reminder', description: 'Monthly check-in' },
  { id: 'reminder-annual', name: 'Annual reminder', type: 'reminder', description: 'Annual planning reminder' },
  // Suggestions
  { id: 'suggest-optimization', name: 'Suggest optimization', type: 'suggestion', description: 'Recommend improvements' },
  { id: 'suggest-content', name: 'Suggest content', type: 'suggestion', description: 'Content recommendations' },
  { id: 'suggest-segment-action', name: 'Suggest segment action', type: 'suggestion', description: 'Recommend actions for segment' },
  { id: 'push-to-eval-matrix', name: 'Push to Eval Matrix', type: 'suggestion', description: 'Send segment insights to Stack Navigator' },
]

export default function CollaborationTools() {
  const [activeSection, setActiveSection] = useState<'collaboration' | 'workflows'>('collaboration')
  
  // Team collaboration state
  const [teamNotes, setTeamNotes] = useState<any[]>([
    {
      id: '1',
      author: 'Sarah Chen',
      content: '@marcus Can you review the Q4 campaign assets before Friday?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      mentions: ['marcus'],
      comments: [
        {
          id: 'c1',
          author: 'Marcus Johnson',
          content: 'On it! Will have feedback by Thursday EOD.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      ],
      reactions: { approved: 2, discussion: 0, time: 1 }
    },
    {
      id: '2',
      author: 'Lisa Park',
      content: 'The new BrandCraft templates are ready for review. @all please check them out!',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      mentions: ['all'],
      comments: [],
      reactions: { approved: 5, discussion: 1, time: 0 }
    }
  ])
  const [newNoteContent, setNewNoteContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  // Workflows state with prebuilt defaults
  const [workflows, setWorkflows] = useState<any[]>([
    {
      id: '1',
      name: 'ABM Spike Alerts',
      trigger: 'account-spike',
      actions: ['notify-sales-email'],
      type: 'Sales Alerts',
      module: 'Audience Engine',
      enabled: true,
      isDefault: true,
      assignedTo: '',
      salesEmail: '',
      slackChannel: ''
    },
    {
      id: '2',
      name: 'Budget Alerts',
      trigger: 'budget-overspend',
      actions: ['send-inapp'],
      type: 'Budget',
      module: 'Flight Deck',
      enabled: true,
      isDefault: true,
      assignedTo: '',
      salesEmail: '',
      slackChannel: ''
    },
    {
      id: '3',
      name: 'Quarterly Review Reminders',
      trigger: 'quarterly-review-due',
      actions: ['reminder-quarterly'],
      type: 'Reminders',
      module: 'Strategy Studio',
      enabled: true,
      isDefault: true,
      assignedTo: '',
      salesEmail: '',
      slackChannel: ''
    },
    {
      id: '4',
      name: 'Annual Reset Reminders',
      trigger: 'annual-reset-due',
      actions: ['reminder-annual'],
      type: 'Reminders',
      module: 'Strategy Studio',
      enabled: true,
      isDefault: true,
      assignedTo: '',
      salesEmail: '',
      slackChannel: ''
    },
    {
      id: '5',
      name: 'Monthly Budget Updates',
      trigger: 'monthly-budget-check',
      actions: ['send-email-internal'],
      type: 'Reports',
      module: 'Flight Deck',
      enabled: true,
      isDefault: true,
      assignedTo: '',
      salesEmail: '',
      slackChannel: ''
    },
    {
      id: '6',
      name: 'Campaign Manifesto Delivery',
      trigger: 'distribution-ready',
      actions: ['notify-sales-email', 'attach-campaign-asset'],
      type: 'Sales Alerts',
      module: 'Flight Deck',
      enabled: true,
      isDefault: true,
      assignedTo: '',
      salesEmail: '',
      slackChannel: ''
    }
  ])

  const [newAutomationDialogOpen, setNewAutomationDialogOpen] = useState(false)
  const [selectedTrigger, setSelectedTrigger] = useState('')
  const [selectedActions, setSelectedActions] = useState<string[]>([])
  const [workflowName, setWorkflowName] = useState('')
  const [selectedWorkflowType, setSelectedWorkflowType] = useState('')
  const [selectedModule, setSelectedModule] = useState('')

  const getTriggerById = (id: string) => allTriggers.find(t => t.id === id)
  const getActionById = (id: string) => allActions.find(a => a.id === id)

  const createWorkflow = () => {
    if (!workflowName || !selectedTrigger || selectedActions.length === 0) return
    
    const newWorkflow = {
      id: Date.now().toString(),
      name: workflowName,
      trigger: selectedTrigger,
      actions: selectedActions,
      type: selectedWorkflowType || 'Notifications',
      module: selectedModule || 'Flight Deck',
      enabled: true,
      isDefault: false,
      assignedTo: '',
      salesEmail: '',
      slackChannel: ''
    }
    
    setWorkflows([...workflows, newWorkflow])
    setNewAutomationDialogOpen(false)
    setWorkflowName('')
    setSelectedTrigger('')
    setSelectedActions([])
    setSelectedWorkflowType('')
    setSelectedModule('')
  }

  const leftContent = (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-1" style={{ color: FLIGHT_DECK_COLOR }}>
          Collaboration & Workflows
        </h3>
        <p className="text-xs text-muted-foreground">Team communication and automation</p>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setActiveSection('collaboration')}
          className={`w-full flex items-center gap-3 p-3 rounded-md transition-all ${
            activeSection === 'collaboration'
              ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800'
              : 'border border-transparent hover-elevate'
          }`}
          data-testid="button-section-collaboration"
        >
          <div className={`p-2 rounded-md ${
            activeSection === 'collaboration'
              ? 'bg-blue-100 dark:bg-blue-900'
              : 'bg-muted'
          }`}>
            <MessageSquare className={`w-4 h-4 ${
              activeSection === 'collaboration'
                ? 'text-blue-600'
                : 'text-muted-foreground'
            }`} />
          </div>
          <div className="flex-1 text-left">
            <div className={`text-sm font-medium ${
              activeSection === 'collaboration' ? 'text-blue-900 dark:text-blue-100' : ''
            }`}>
              Collaboration
            </div>
            <div className="text-xs text-muted-foreground">
              Team notes & @mentions
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveSection('workflows')}
          className={`w-full flex items-center gap-3 p-3 rounded-md transition-all ${
            activeSection === 'workflows'
              ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800'
              : 'border border-transparent hover-elevate'
          }`}
          data-testid="button-section-workflows"
        >
          <div className={`p-2 rounded-md ${
            activeSection === 'workflows'
              ? 'bg-blue-100 dark:bg-blue-900'
              : 'bg-muted'
          }`}>
            <WorkflowIcon className={`w-4 h-4 ${
              activeSection === 'workflows'
                ? 'text-blue-600'
                : 'text-muted-foreground'
            }`} />
          </div>
          <div className="flex-1 text-left">
            <div className={`text-sm font-medium ${
              activeSection === 'workflows' ? 'text-blue-900 dark:text-blue-100' : ''
            }`}>
              Workflows
            </div>
            <div className="text-xs text-muted-foreground">
              Automated triggers & actions
            </div>
          </div>
        </button>
      </div>

      <TeamUsers />
    </div>
  )

  const centerContent = (
    <div className="space-y-6">
      {activeSection === 'collaboration' ? (
        <>
          <div>
            <h1 className="text-2xl font-bold mb-2">Team Collaboration</h1>
            <p className="text-muted-foreground">
              @mentions, threaded comments, and quick reactions for team communication
            </p>
          </div>

          {/* New Note Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Notes</CardTitle>
                  <CardDescription>Collaborate with @mentions and threaded discussions</CardDescription>
                </div>
                <Badge variant="secondary">{teamNotes.length} notes</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* New Note Input */}
              <div className="space-y-3">
                <Label className="text-sm">Add Team Note</Label>
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Type your note here... Use @name to mention teammates (e.g., @marcus, @sarah, @lisa, @all)"
                  className="w-full min-h-[80px] p-3 text-sm rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-testid="input-new-note"
                />
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Quick reactions: ✅ approved • 💬 needs discussion • 🕐 needs time
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => {
                      if (!newNoteContent.trim()) return
                      const mentions = newNoteContent.match(/@(\w+)/g)?.map(m => m.slice(1)) || []
                      setTeamNotes([{
                        id: Date.now().toString(),
                        author: 'You',
                        content: newNoteContent,
                        timestamp: new Date(),
                        mentions,
                        comments: [],
                        reactions: { approved: 0, discussion: 0, time: 0 }
                      }, ...teamNotes])
                      setNewNoteContent('')
                    }}
                    disabled={!newNoteContent.trim()}
                    data-testid="button-post-note"
                  >
                    <Send className="w-3 h-3 mr-2" />
                    Post Note
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Notes Feed */}
          <div className="space-y-4">
            {teamNotes.map(note => (
              <Card key={note.id} className="border-2">
                <CardContent className="pt-4">
                  {/* Note Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-semibold text-blue-600">
                        {note.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{note.author}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(note.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {note.mentions.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {note.mentions.length} {note.mentions.length === 1 ? 'mention' : 'mentions'}
                      </Badge>
                    )}
                  </div>

                  {/* Note Content */}
                  <div className="mb-3 text-sm">
                    {note.content}
                  </div>

                  {/* Reactions */}
                  <div className="flex items-center gap-2 pb-3 border-b">
                    <button
                      onClick={() => {
                        setTeamNotes(teamNotes.map(n => 
                          n.id === note.id 
                            ? {...n, reactions: {...n.reactions, approved: n.reactions.approved + 1}}
                            : n
                        ))
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs hover-elevate"
                      data-testid={`reaction-approved-${note.id}`}
                    >
                      ✅ {note.reactions.approved}
                    </button>
                    <button
                      onClick={() => {
                        setTeamNotes(teamNotes.map(n => 
                          n.id === note.id 
                            ? {...n, reactions: {...n.reactions, discussion: n.reactions.discussion + 1}}
                            : n
                        ))
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs hover-elevate"
                      data-testid={`reaction-discussion-${note.id}`}
                    >
                      💬 {note.reactions.discussion}
                    </button>
                    <button
                      onClick={() => {
                        setTeamNotes(teamNotes.map(n => 
                          n.id === note.id 
                            ? {...n, reactions: {...n.reactions, time: n.reactions.time + 1}}
                            : n
                        ))
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs hover-elevate"
                      data-testid={`reaction-time-${note.id}`}
                    >
                      🕐 {note.reactions.time}
                    </button>
                    <div className="flex-1" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(replyingTo === note.id ? null : note.id)}
                      data-testid={`button-reply-${note.id}`}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Reply ({note.comments.length})
                    </Button>
                  </div>

                  {/* Threaded Comments */}
                  {note.comments.length > 0 && (
                    <div className="mt-3 space-y-2 pl-4 border-l-2 border-muted">
                      {note.comments.map((comment: any) => (
                        <div key={comment.id} className="bg-muted/50 p-3 rounded-md">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-semibold text-blue-600">
                              {comment.author.charAt(0)}
                            </div>
                            <div className="font-semibold text-xs">{comment.author}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(comment.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-xs ml-8">{comment.content}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyingTo === note.id && (
                    <div className="mt-3 space-y-2 pl-4 border-l-2 border-blue-500">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full min-h-[60px] p-2 text-xs rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        data-testid={`input-reply-${note.id}`}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyContent('')
                          }}
                          data-testid={`button-cancel-reply-${note.id}`}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            if (!replyContent.trim()) return
                            setTeamNotes(teamNotes.map(n => 
                              n.id === note.id
                                ? {
                                    ...n,
                                    comments: [...n.comments, {
                                      id: `c${Date.now()}`,
                                      author: 'You',
                                      content: replyContent,
                                      timestamp: new Date()
                                    }]
                                  }
                                : n
                            ))
                            setReplyContent('')
                            setReplyingTo(null)
                          }}
                          disabled={!replyContent.trim()}
                          data-testid={`button-submit-reply-${note.id}`}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Info Card */}
          <Card className="bg-muted/50 border-2">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4" style={{ color: FLIGHT_DECK_COLOR }} />
                Collaboration Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5" />
                <span><strong>@mentions</strong> — Tag teammates to delegate tasks or get feedback</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5" />
                <span><strong>Threaded comments</strong> — Keep discussions organized with replies</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5" />
                <span><strong>Quick reactions</strong> — ✅ approved, 💬 needs discussion, 🕐 needs time</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5" />
                <span><strong>In-app alerts</strong> — Get notified when you're mentioned or assigned</span>
              </p>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold mb-2">Workflows</h1>
            <p className="text-muted-foreground">
              Automated triggers and actions for marketing operations
            </p>
          </div>

          {/* Workflow Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Filter Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs mb-2 block">Workflow Status</Label>
                  <Select defaultValue="all">
                    <SelectTrigger data-testid="filter-workflow-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Workflows</SelectItem>
                      <SelectItem value="enabled">Enabled Only</SelectItem>
                      <SelectItem value="disabled">Disabled Only</SelectItem>
                      <SelectItem value="default">Default Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs mb-2 block">Type</Label>
                  <Select defaultValue="all">
                    <SelectTrigger data-testid="filter-workflow-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Sales Alerts">Sales Alerts</SelectItem>
                      <SelectItem value="Notifications">Notifications</SelectItem>
                      <SelectItem value="Reports">Reports</SelectItem>
                      <SelectItem value="Reminders">Reminders</SelectItem>
                      <SelectItem value="Suggestions">Suggestions</SelectItem>
                      <SelectItem value="Budget">Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs mb-2 block">Module</Label>
                  <Select defaultValue="all">
                    <SelectTrigger data-testid="filter-workflow-module">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      <SelectItem value="Strategy Studio">Strategy Studio</SelectItem>
                      <SelectItem value="Pulse Hub">Pulse Hub</SelectItem>
                      <SelectItem value="BrandCraft">BrandCraft</SelectItem>
                      <SelectItem value="Flight Deck">Flight Deck</SelectItem>
                      <SelectItem value="Audience Engine">Audience Engine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Workflows */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Workflows</CardTitle>
                  <CardDescription>Manage your automated workflows</CardDescription>
                </div>
                <Button 
                  onClick={() => setNewAutomationDialogOpen(true)}
                  data-testid="button-create-workflow"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workflow
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {workflows.length === 0 ? (
                <div className="text-center py-12">
                  <WorkflowIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No workflows yet. Create your first one!</p>
                </div>
              ) : (
                workflows.map(workflow => {
                  const trigger = getTriggerById(workflow.trigger)
                  const actions = workflow.actions.map((id: string) => getActionById(id)).filter(Boolean)
                  
                  return (
                    <Card key={workflow.id} className="border-2">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{workflow.name}</h4>
                              <Badge variant={workflow.enabled ? 'default' : 'secondary'}>
                                {workflow.enabled ? 'Enabled' : 'Disabled'}
                              </Badge>
                              {workflow.isDefault && (
                                <Badge variant="outline" className="text-xs">Default</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="secondary" className="text-xs">{workflow.type}</Badge>
                              <span>•</span>
                              <span>{workflow.module}</span>
                            </div>
                          </div>
                          <Switch
                            checked={workflow.enabled}
                            onCheckedChange={(checked) => {
                              setWorkflows(wfs =>
                                wfs.map(w => w.id === workflow.id ? {...w, enabled: checked} : w)
                              )
                            }}
                            data-testid={`switch-workflow-${workflow.id}`}
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-md bg-yellow-100 dark:bg-yellow-900">
                              <Zap className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-muted-foreground mb-1">TRIGGER</div>
                              <div className="text-sm font-medium">{trigger?.name}</div>
                              <div className="text-xs text-muted-foreground">{trigger?.description}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-6">
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-md bg-green-100 dark:bg-green-900">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-muted-foreground mb-2">ACTIONS</div>
                              <div className="space-y-1">
                                {actions.map((action: Action | undefined, i: number) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-green-600" />
                                    <span className="text-sm">{action?.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Editable Fields */}
                          <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                            <div>
                              <Label className="text-xs mb-1 block">Assigned To</Label>
                              <Input 
                                placeholder="User email"
                                value={workflow.assignedTo}
                                onChange={(e) => {
                                  setWorkflows(wfs =>
                                    wfs.map(w => w.id === workflow.id ? {...w, assignedTo: e.target.value} : w)
                                  )
                                }}
                                className="text-xs h-8"
                                data-testid={`input-assigned-${workflow.id}`}
                              />
                            </div>
                            <div>
                              <Label className="text-xs mb-1 block">Sales Email/Slack</Label>
                              <Input 
                                placeholder="email or #channel"
                                value={workflow.salesEmail || workflow.slackChannel}
                                onChange={(e) => {
                                  setWorkflows(wfs =>
                                    wfs.map(w => w.id === workflow.id ? {...w, salesEmail: e.target.value} : w)
                                  )
                                }}
                                className="text-xs h-8"
                                data-testid={`input-sales-contact-${workflow.id}`}
                              />
                            </div>
                          </div>

                          {!workflow.isDefault && (
                            <div className="flex items-center gap-2 pt-2">
                              <Switch
                                checked={workflow.isDefault}
                                onCheckedChange={(checked) => {
                                  setWorkflows(wfs =>
                                    wfs.map(w => w.id === workflow.id ? {...w, isDefault: checked} : w)
                                  )
                                }}
                                data-testid={`switch-default-${workflow.id}`}
                              />
                              <Label className="text-xs text-muted-foreground">Set as default workflow</Label>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 border-r overflow-y-auto p-6 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20">
        {leftContent}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <QuickActions module="FlightDeck" />
        {centerContent}
      </div>

      {/* Create Workflow Dialog */}
      {newAutomationDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Workflow</CardTitle>
              <CardDescription>Configure triggers, actions, and workflow type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">Workflow Name</Label>
                <Input 
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="e.g., Campaign Launch Notification"
                  data-testid="input-workflow-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Workflow Type</Label>
                  <Select value={selectedWorkflowType} onValueChange={setSelectedWorkflowType}>
                    <SelectTrigger data-testid="select-workflow-type">
                      <SelectValue placeholder="Choose type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales Alerts">Sales Alerts</SelectItem>
                      <SelectItem value="Notifications">Notifications</SelectItem>
                      <SelectItem value="Reports">Reports</SelectItem>
                      <SelectItem value="Reminders">Reminders</SelectItem>
                      <SelectItem value="Suggestions">Suggestions</SelectItem>
                      <SelectItem value="Budget">Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">Module</Label>
                  <Select value={selectedModule} onValueChange={setSelectedModule}>
                    <SelectTrigger data-testid="select-workflow-module">
                      <SelectValue placeholder="Choose module..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Strategy Studio">Strategy Studio</SelectItem>
                      <SelectItem value="Pulse Hub">Pulse Hub</SelectItem>
                      <SelectItem value="BrandCraft">BrandCraft</SelectItem>
                      <SelectItem value="Flight Deck">Flight Deck</SelectItem>
                      <SelectItem value="Audience Engine">Audience Engine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Select Trigger (Category-Based)</Label>
                <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
                  <SelectTrigger data-testid="select-trigger">
                    <SelectValue placeholder="Choose trigger..." />
                  </SelectTrigger>
                  <SelectContent>
                    {['Campaign', 'Audience/ABM', 'Content', 'Pulse Hub', 'Budget', 'Strategy Studio', 'Flight Deck'].map(category => {
                      const categoryTriggers = allTriggers.filter(t => t.category === category)
                      return categoryTriggers.map(trigger => (
                        <SelectItem key={trigger.id} value={trigger.id}>
                          [{category}] {trigger.name}
                        </SelectItem>
                      ))
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Select Actions (Category-Based)</Label>
                <div className="space-y-3 max-h-64 overflow-y-auto p-3 rounded-md border">
                  {['Sales Alerts', 'Notifications', 'Reminders', 'Suggestions'].map(category => {
                    const categoryActions = allActions.filter(a => {
                      if (category === 'Sales Alerts') return a.type === 'notify_sales'
                      if (category === 'Notifications') return a.type === 'notify_internal'
                      if (category === 'Reminders') return a.type === 'reminder'
                      if (category === 'Suggestions') return a.type === 'suggestion'
                      return false
                    })
                    
                    if (categoryActions.length === 0) return null
                    
                    return (
                      <div key={category}>
                        <h4 className="font-semibold text-xs mb-2 text-muted-foreground">{category}</h4>
                        <div className="space-y-2">
                          {categoryActions.map(action => (
                            <div key={action.id} className="flex items-start gap-2">
                              <Checkbox
                                id={action.id}
                                checked={selectedActions.includes(action.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedActions([...selectedActions, action.id])
                                  } else {
                                    setSelectedActions(selectedActions.filter(id => id !== action.id))
                                  }
                                }}
                                data-testid={`checkbox-action-${action.id}`}
                              />
                              <label htmlFor={action.id} className="flex-1 cursor-pointer">
                                <div className="text-sm font-medium">{action.name}</div>
                                <div className="text-xs text-muted-foreground">{action.description}</div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
            <div className="p-6 border-t flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setNewAutomationDialogOpen(false)}
                data-testid="button-cancel-workflow"
              >
                Cancel
              </Button>
              <Button 
                onClick={createWorkflow}
                disabled={!workflowName || !selectedTrigger || selectedActions.length === 0}
                data-testid="button-save-workflow"
              >
                Create Workflow
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
