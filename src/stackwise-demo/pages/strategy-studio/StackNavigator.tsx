import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardContent } from '@/stackwise-demo/components/ui/card'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Badge } from '@/stackwise-demo/components/ui/badge'
import { Input } from '@/stackwise-demo/components/ui/input'
import { Textarea } from '@/stackwise-demo/components/ui/textarea'
import { Label } from '@/stackwise-demo/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/stackwise-demo/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/stackwise-demo/components/ui/tabs'
import { ThreeColumnLayout } from '@/stackwise-demo/components/layouts/ThreeColumnLayout'
import { PushToEvalButton } from '@/stackwise-demo/components/PushToEvalButton'
import { QuickActions } from '@/stackwise-demo/components/QuickActions'
import { Target, CheckCircle, Circle, Clock, Edit2, Trash2, GripVertical, Plus, MoveRight, AlertTriangle, Lightbulb, Star, TrendingUp, Filter, Upload, Download } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/stackwise-demo/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/stackwise-demo/components/ui/dialog"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { apiRequest, queryClient } from '@/stackwise-demo/lib/queryClient'
import { useToast } from '@/stackwise-demo/hooks/use-toast'
import { format } from 'date-fns'
import type { EvalMatrixItem, Milestone } from '@shared/schema'

/**
 * INTERNAL NOTE: Stack Navigator - Strategic Calculations Hub
 * 
 * If any calculations, assessments, prioritization logic, or strategic computations 
 * need to be performed in the future, this is the designated area where they should live.
 * This includes:
 * - Priority scoring algorithms
 * - Risk assessment calculations
 * - Strategic alignment computations
 * - Impact vs. effort matrix calculations
 * - Milestone dependency analysis
 * - Any quantitative strategic decision-making logic
 */

const DEMO_USER_ID = "user-demo"

// Sortable Milestone Card Component
function SortableMilestoneCard({ milestone, onEdit, onDelete, onMove, onComplete }: { 
  milestone: Milestone
  onEdit: () => void
  onDelete: () => void
  onMove: (timeframe: string) => void
  onComplete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: milestone.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getPriorityColor = (priority: string | null) => {
    switch(priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card border rounded-lg p-3 hover-elevate group"
      data-testid={`milestone-${milestone.id}`}
    >
      <div className="flex items-start gap-2">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium flex-1">{milestone.title}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Circle className={`w-3 h-3 mt-0.5 ${getPriorityColor(milestone.priority)}`} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Priority: {milestone.priority || 'Medium'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {milestone.description && (
            <p className="text-xs text-muted-foreground">{milestone.description}</p>
          )}
          
          {milestone.assignee && (
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {milestone.assignee}
              </Badge>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={onComplete} data-testid={`button-complete-${milestone.id}`} className="h-6 w-6">
                  <CheckCircle className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mark Complete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Select onValueChange={onMove}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectTrigger className="h-6 w-6 p-0 border-0" data-testid={`button-move-${milestone.id}`}>
                    <MoveRight className="w-3 h-3" />
                  </SelectTrigger>
                </TooltipTrigger>
                <TooltipContent>Move to Column</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <SelectContent>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="60">60 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={onEdit} data-testid={`button-edit-${milestone.id}`} className="h-6 w-6">
                  <Edit2 className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={onDelete} data-testid={`button-delete-${milestone.id}`} className="h-6 w-6">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}

export default function StackNavigator() {
  const [currentStep, setCurrentStep] = useState('eval-matrix')
  const moduleColor = '#6218df'
  const { toast } = useToast()
  
  // Edit dialog state
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [editForm, setEditForm] = useState({ 
    title: '', 
    description: '', 
    assignee: '', 
    timeframe: '30' 
  })
  
  // Add new milestone dialog state
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null)
  const [newMilestoneForm, setNewMilestoneForm] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium'
  })

  // My Plays state
  const [playFilters, setPlayFilters] = useState({ status: 'active', pillar: 'all', source: 'all' })
  const [newPlay, setNewPlay] = useState({ title: '', description: '', pillar: '', effortRank: 'medium', performance: 50 })

  const steps = [
    { id: 'eval-matrix', label: 'Eval Matrix', description: 'Priority and risk routing' },
    { id: '30-60-90', label: '30/60/90', description: 'Quarterly milestones' },
    { id: 'stacks', label: 'Stacks', description: 'View-only asset library' },
    { id: 'my-plays', label: 'My Plays', description: 'Strategic idea collection' },
    { id: 'ad-tracking', label: 'Ad Tracking URLs', description: 'UTM & QR code generation' },
  ]

  // Fetch eval matrix items from database
  const { data: evalMatrixItems = [], isLoading: loadingEvalItems } = useQuery<EvalMatrixItem[]>({
    queryKey: ['/api/eval-matrix-items'],
  })

  // Fetch milestones from database
  const { data: milestonesData = [], isLoading: loadingMilestones } = useQuery<Milestone[]>({
    queryKey: ['/api/milestones'],
  })

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Group milestones by timeframe and status
  const activeMilestones = milestonesData.filter(m => m.status !== 'completed').sort((a, b) => a.order - b.order)
  const completedMilestones = milestonesData.filter(m => m.status === 'completed').sort((a, b) => {
    if (!a.completedAt || !b.completedAt) return 0
    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  })

  // Calculate missed milestones (past due date and not completed)
  const missedMilestones = milestonesData.filter(m => {
    if (m.status === 'completed') return false
    if (!m.createdAt) return false
    
    const dueDate = new Date(m.createdAt)
    dueDate.setDate(dueDate.getDate() + parseInt(m.timeframe))
    return dueDate < new Date()
  }).sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0
    const aDue = new Date(a.createdAt)
    aDue.setDate(aDue.getDate() + parseInt(a.timeframe))
    const bDue = new Date(b.createdAt)
    bDue.setDate(bDue.getDate() + parseInt(b.timeframe))
    return bDue.getTime() - aDue.getTime()
  })

  const milestones = {
    '30-day': activeMilestones.filter(m => m.timeframe === '30'),
    '60-day': activeMilestones.filter(m => m.timeframe === '60'),
    '90-day': activeMilestones.filter(m => m.timeframe === '90'),
  }

  // Create milestone mutation
  const createMilestoneMutation = useMutation({
    mutationFn: async (data: Partial<Milestone>) => {
      return await apiRequest('/api/milestones', 'POST', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/milestones'] })
      toast({ title: 'Milestone created successfully' })
      setAddingToColumn(null)
      setNewMilestoneForm({ title: '', description: '', assignee: '', priority: 'medium' })
    }
  })

  // Update milestone mutation
  const updateMilestoneMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Milestone> }) => {
      return await apiRequest(`/api/milestones/${id}`, 'PATCH', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/milestones'] })
      toast({ title: 'Milestone updated successfully' })
    }
  })

  // Delete milestone mutation
  const deleteMilestoneMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/milestones/${id}`, 'DELETE')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/milestones'] })
      toast({ title: 'Milestone deleted' })
    }
  })

  // CSV Template Download
  const downloadMilestonesTemplate = () => {
    const headers = ['Title', 'Description', 'Assignee', 'Timeframe', 'Priority', 'Status']
    const exampleRows = [
      ['Launch Product Campaign', 'Complete social media assets and landing page', 'Sarah Johnson', '30', 'high', 'active'],
      ['Q2 Sales Enablement', 'Create sales deck and training materials', 'Mike Chen', '60', 'medium', 'active'],
      ['Annual Report Publication', 'Design and publish yearly financial report', 'Alex Rivera', '90', 'medium', 'active']
    ]
    
    const csvContent = [
      headers.join(','),
      ...exampleRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'milestones_template.csv'
    link.click()
    
    toast({ 
      title: 'Template downloaded',
      description: 'Fill in the CSV and upload to bulk import milestones'
    })
  }

  // CSV Upload and Parse
  const handleUploadMilestones = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        
        // Skip header row
        const dataLines = lines.slice(1)
        
        let successCount = 0
        let errorCount = 0
        
        for (const line of dataLines) {
          // Simple CSV parsing (handles quoted fields)
          const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)
          if (!matches || matches.length < 4) {
            errorCount++
            continue
          }
          
          const [title, description, assignee, timeframe, priority = 'medium', status = 'active'] = 
            matches.map(field => field.replace(/^"|"$/g, '').trim())
          
          // Validate timeframe
          if (!['30', '60', '90'].includes(timeframe)) {
            errorCount++
            continue
          }
          
          // Validate priority
          const validPriority = ['low', 'medium', 'high'].includes(priority.toLowerCase()) 
            ? priority.toLowerCase() 
            : 'medium'
          
          try {
            await createMilestoneMutation.mutateAsync({
              title,
              description: description || '',
              assignee: assignee || '',
              timeframe,
              priority: validPriority as 'low' | 'medium' | 'high',
              status: status as 'active' | 'completed',
              userId: DEMO_USER_ID,
              order: 999, // Will be adjusted by backend
            })
            successCount++
          } catch (error) {
            errorCount++
          }
        }
        
        toast({
          title: 'Upload complete',
          description: `${successCount} milestone${successCount !== 1 ? 's' : ''} imported successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`
        })
        
        // Reset file input
        event.target.value = ''
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: 'Could not parse CSV file. Please check the format.',
          variant: 'destructive'
        })
      }
    }
    
    reader.readAsText(file)
  }

  const handleDragEnd = async (event: DragEndEvent, timeframe: string) => {
    const { active, over } = event
    
    if (!over || active.id === over.id) return

    const oldIndex = milestones[timeframe as '30-day' | '60-day' | '90-day'].findIndex((m: Milestone) => m.id === active.id)
    const newIndex = milestones[timeframe as '30-day' | '60-day' | '90-day'].findIndex((m: Milestone) => m.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(milestones[timeframe as '30-day' | '60-day' | '90-day'], oldIndex, newIndex)
      
      // Update order in database for all affected items
      newOrder.forEach((milestone, index) => {
        updateMilestoneMutation.mutate({ id: milestone.id, data: { order: index } })
      })
    }
  }

  const handleEdit = (milestone: Milestone) => {
    setEditingMilestone(milestone)
    setEditForm({
      title: milestone.title,
      description: milestone.description || '',
      assignee: milestone.assignee || '',
      timeframe: milestone.timeframe
    })
  }

  const handleSaveEdit = () => {
    if (!editingMilestone) return
    
    updateMilestoneMutation.mutate({
      id: editingMilestone.id,
      data: editForm
    })
    setEditingMilestone(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this milestone?')) {
      deleteMilestoneMutation.mutate(id)
    }
  }

  const handleMoveColumn = async (milestoneId: string, newTimeframe: string) => {
    await updateMilestoneMutation.mutateAsync({ id: milestoneId, data: { timeframe: newTimeframe } })
  }

  const handleComplete = async (milestoneId: string) => {
    await updateMilestoneMutation.mutateAsync({ 
      id: milestoneId, 
      data: { 
        status: 'completed',
        completedAt: new Date()
      } 
    })
  }

  const handleAddNewMilestone = (timeframe: string) => {
    const maxOrder = milestones[`${timeframe}-day` as '30-day' | '60-day' | '90-day'].reduce((max, m) => Math.max(max, m.order), 0)
    
    createMilestoneMutation.mutate({
      userId: DEMO_USER_ID,
      title: newMilestoneForm.title,
      description: newMilestoneForm.description || null,
      assignee: newMilestoneForm.assignee || null,
      timeframe,
      priority: newMilestoneForm.priority,
      status: 'pending',
      order: maxOrder + 1,
      risk: 'low',
      impact: 'medium',
      effort: 'medium'
    })
  }

  const leftNav = (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold" style={{ color: moduleColor }}>Strategy Studio</h2>
        <h3 className="text-sm font-semibold text-gray-200 mt-2">Stack Navigator</h3>
      </div>
    </div>
  )

  const renderStepContent = () => {
    if (currentStep === 'eval-matrix') {
      // Calculate distribution for visualization
      const distribution = {
        'high-low': evalMatrixItems.filter(i => i.priority === 'high' && i.risk === 'low').length,
        'high-medium': evalMatrixItems.filter(i => i.priority === 'high' && i.risk === 'medium').length,
        'high-high': evalMatrixItems.filter(i => i.priority === 'high' && i.risk === 'high').length,
        'medium-low': evalMatrixItems.filter(i => i.priority === 'medium' && i.risk === 'low').length,
        'medium-medium': evalMatrixItems.filter(i => i.priority === 'medium' && i.risk === 'medium').length,
        'medium-high': evalMatrixItems.filter(i => i.priority === 'medium' && i.risk === 'high').length,
        'low-low': evalMatrixItems.filter(i => i.priority === 'low' && i.risk === 'low').length,
        'low-medium': evalMatrixItems.filter(i => i.priority === 'low' && i.risk === 'medium').length,
        'low-high': evalMatrixItems.filter(i => i.priority === 'low' && i.risk === 'high').length,
      }

      return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Evaluation Matrix</h1>
            <p className="text-muted-foreground">Smart routing based on priority and risk - helping you decide what to tackle next</p>
          </div>

          {/* Quick Actions */}
          <QuickActions module="StrategyStudio" />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How the Matrix Works</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>High Priority + Low Risk:</strong> Quick wins - execute immediately</p>
              <p><strong>High Priority + Medium/High Risk:</strong> Strategic bets - plan carefully before execution</p>
              <p><strong>Medium Priority + Low Risk:</strong> Fill-in work - execute when capacity allows</p>
              <p><strong>Low Priority + High Risk:</strong> Consider deferring or rejecting</p>
            </CardContent>
          </Card>

          {/* 2x2 Matrix Visualization */}
          {evalMatrixItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" style={{ color: moduleColor }} />
                  Priority vs Risk Matrix
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Visual mapping of all items by priority and risk level
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-0 border rounded-lg overflow-hidden">
                  {/* Header Row */}
                  <div className="bg-muted p-3 border-r border-b">
                    <span className="text-xs font-medium text-muted-foreground">Priority ↓ Risk →</span>
                  </div>
                  <div className="bg-muted p-3 border-r border-b text-center">
                    <span className="text-sm font-semibold">Low Risk</span>
                  </div>
                  <div className="bg-muted p-3 border-r border-b text-center">
                    <span className="text-sm font-semibold">Medium Risk</span>
                  </div>
                  <div className="bg-muted p-3 border-b text-center">
                    <span className="text-sm font-semibold">High Risk</span>
                  </div>

                  {/* High Priority Row */}
                  <div className="bg-muted p-3 border-r border-b">
                    <span className="text-sm font-semibold">High Priority</span>
                  </div>
                  <div className="p-4 border-r border-b bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-700">{distribution['high-low']}</div>
                      <div className="text-xs text-green-600 mt-1 font-medium">Quick Wins</div>
                      <div className="text-xs text-muted-foreground mt-1">Execute Now</div>
                    </div>
                  </div>
                  <div className="p-4 border-r border-b bg-yellow-50 dark:bg-yellow-950/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-700">{distribution['high-medium']}</div>
                      <div className="text-xs text-yellow-600 mt-1 font-medium">Calculated Moves</div>
                      <div className="text-xs text-muted-foreground mt-1">Plan & Execute</div>
                    </div>
                  </div>
                  <div className="p-4 border-b bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-700">{distribution['high-high']}</div>
                      <div className="text-xs text-orange-600 mt-1 font-medium">Strategic Bets</div>
                      <div className="text-xs text-muted-foreground mt-1">Plan Carefully</div>
                    </div>
                  </div>

                  {/* Medium Priority Row */}
                  <div className="bg-muted p-3 border-r border-b">
                    <span className="text-sm font-semibold">Medium Priority</span>
                  </div>
                  <div className="p-4 border-r border-b bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">{distribution['medium-low']}</div>
                      <div className="text-xs text-blue-600 mt-1 font-medium">Fill-in Work</div>
                      <div className="text-xs text-muted-foreground mt-1">Capacity Dependent</div>
                    </div>
                  </div>
                  <div className="p-4 border-r border-b bg-gray-100 dark:bg-gray-800/20 hover:bg-gray-200 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">{distribution['medium-medium']}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">Monitor</div>
                      <div className="text-xs text-muted-foreground mt-1">Reassess Regularly</div>
                    </div>
                  </div>
                  <div className="p-4 border-b bg-gray-100 dark:bg-gray-800/20 hover:bg-gray-200 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">{distribution['medium-high']}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">Review</div>
                      <div className="text-xs text-muted-foreground mt-1">Consider Deferring</div>
                    </div>
                  </div>

                  {/* Low Priority Row */}
                  <div className="bg-muted p-3 border-r">
                    <span className="text-sm font-semibold">Low Priority</span>
                  </div>
                  <div className="p-4 border-r bg-gray-50 dark:bg-gray-900/20 hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-600">{distribution['low-low']}</div>
                      <div className="text-xs text-gray-500 mt-1 font-medium">Backlog</div>
                      <div className="text-xs text-muted-foreground mt-1">Low Priority</div>
                    </div>
                  </div>
                  <div className="p-4 border-r bg-gray-50 dark:bg-gray-900/20 hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-600">{distribution['low-medium']}</div>
                      <div className="text-xs text-gray-500 mt-1 font-medium">Defer</div>
                      <div className="text-xs text-muted-foreground mt-1">Not Now</div>
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-700">{distribution['low-high']}</div>
                      <div className="text-xs text-red-600 mt-1 font-medium">Avoid</div>
                      <div className="text-xs text-muted-foreground mt-1">Reject or Postpone</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" style={{ color: moduleColor }} />
                All Items ({evalMatrixItems.length})
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Items awaiting your review and decision
              </p>
            </CardHeader>
            <CardContent>
              {loadingEvalItems ? (
                <p className="text-center text-muted-foreground py-8">Loading evaluation matrix...</p>
              ) : evalMatrixItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No evaluation items yet. Use the "Push to Eval" button throughout Stackwise to add items here.</p>
              ) : (
                <div className="space-y-3">
                  {evalMatrixItems.map((item) => {
                    const priorityDisplay = item.priority?.charAt(0).toUpperCase() + item.priority?.slice(1) || 'Medium'
                    const riskDisplay = item.risk?.charAt(0).toUpperCase() + item.risk?.slice(1) || 'Low'
                    
                    return (
                      <Card key={item.id} className="p-4 hover-elevate" data-testid={`eval-item-${item.id}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{item.title}</h3>
                            <div className="flex gap-2 mb-2">
                              <Badge 
                                variant={item.priority === 'high' ? 'default' : 'secondary'}
                                data-testid={`priority-${item.id}`}
                              >
                                Priority: {priorityDisplay}
                              </Badge>
                              <Badge 
                                variant={item.risk === 'high' ? 'destructive' : item.risk === 'medium' ? 'default' : 'secondary'}
                                data-testid={`risk-${item.id}`}
                              >
                                Risk: {riskDisplay}
                              </Badge>
                              <Badge variant="outline" data-testid={`status-${item.id}`}>
                                {item.status === 'in-review' ? 'In Review' : item.status === 'approved' ? 'Approved' : item.status === 'rejected' ? 'Rejected' : 'Pending'}
                              </Badge>
                            </div>
                            {item.impact && (
                              <p className="text-sm text-muted-foreground mb-1">
                                <strong>Impact:</strong> {item.impact}
                              </p>
                            )}
                            {item.recommendedBy && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p className="text-xs text-muted-foreground cursor-help">
                                      Recommended by: {item.recommendedBy}
                                    </p>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>This item was suggested by {item.recommendedBy}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" data-testid={`button-approve-${item.id}`}>Approve</Button>
                            <Button size="sm" variant="outline" data-testid={`button-defer-${item.id}`}>Defer</Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    if (currentStep === 'stacks') {
      // Mock asset data for view-only access
      const mockAssets = [
        { id: '1', name: 'Q4 Campaign Hero Image', type: 'Image', module: 'BrandCraft', feature: 'Campaign Builder', size: '2.4 MB', createdAt: '2025-01-15' },
        { id: '2', name: 'Product Demo Video', type: 'Video', module: 'BrandCraft', feature: 'Content Creation', size: '45.2 MB', createdAt: '2025-01-20' },
        { id: '3', name: 'Email Newsletter Template', type: 'Document', module: 'Flight Deck', feature: 'Multi-Channel Distribution', size: '156 KB', createdAt: '2025-02-01' },
        { id: '4', name: 'LinkedIn Ad Creative', type: 'Image', module: 'BrandCraft', feature: 'Campaign Builder', size: '1.8 MB', createdAt: '2025-02-05' },
        { id: '5', name: 'Case Study PDF', type: 'Document', module: 'BrandCraft', feature: 'Content Creation', size: '3.2 MB', createdAt: '2025-02-10' },
      ]

      return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Stacks</h1>
            <p className="text-muted-foreground">View-only asset library - browse and preview marketing assets</p>
          </div>

          <QuickActions module="StrategyStudio" />

          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                View-Only Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-gray-700">
                <strong>Stacks</strong> provides view-only access to your team's marketing asset library. With this access level, you can:
              </p>
              <ul className="space-y-1 text-gray-600 ml-4">
                <li>• Browse all marketing assets across modules</li>
                <li>• Search and filter by module, feature, and type</li>
                <li>• Preview asset details and metadata</li>
                <li>• View asset usage and context</li>
              </ul>
              <div className="pt-2 border-t border-blue-200">
                <p className="text-xs text-blue-900">
                  <strong>Note:</strong> Upgrade to Fully Stacked for full DAM features including download, edit, upload, versioning, and collaboration.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Asset List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Asset Library</span>
                <Badge variant="secondary">{mockAssets.length} assets</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockAssets.map((asset) => (
                  <Card key={asset.id} className="hover-elevate" data-testid={`asset-${asset.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium mb-1">{asset.name}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span>{asset.type}</span>
                            <span>•</span>
                            <span>{asset.module}</span>
                            <span>•</span>
                            <span>{asset.feature}</span>
                            <span>•</span>
                            <span>{asset.size}</span>
                            <span>•</span>
                            <span>Added {asset.createdAt}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" data-testid={`button-preview-${asset.id}`}>
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (currentStep === 'my-plays') {
      // Mock plays data with performance tracking (will be replaced with API call)
      const mockPlays = [
        {
          id: '1',
          title: 'Launch ABM campaign for enterprise SaaS companies',
          description: 'Target 25 Tier 1 accounts with personalized content and executive outreach',
          pillar: 'Demand Generation',
          source: 'GTM Test Pit',
          effortRank: 'high',
          performance: 85, // Success score 0-100
          status: 'active',
          createdAt: '2025-01-15'
        },
        {
          id: '2',
          title: 'Increase LinkedIn thought leadership frequency',
          description: 'Publish 3x per week with executive insights and industry commentary',
          pillar: 'Brand Awareness',
          source: 'Competitor Analysis',
          effortRank: 'medium',
          performance: 92,
          status: 'active',
          createdAt: '2025-01-20'
        },
        {
          id: '3',
          title: 'Optimize landing page conversion funnel',
          description: 'A/B test messaging, CTAs, and form fields to improve conversion rate',
          pillar: 'Conversion Optimization',
          source: 'Manual',
          effortRank: 'low',
          performance: 78,
          status: 'active',
          createdAt: '2025-02-01'
        },
        {
          id: '4',
          title: 'Build partner co-marketing program',
          description: 'Identify 5 strategic partners for joint webinars and content collaboration',
          pillar: 'Partnerships',
          source: 'Manual',
          effortRank: 'high',
          performance: 65,
          status: 'archived',
          createdAt: '2024-12-10'
        },
      ]

      const filteredPlays = mockPlays.filter(play => {
        if (playFilters.status !== 'all' && play.status !== playFilters.status) return false
        if (playFilters.pillar !== 'all' && play.pillar !== playFilters.pillar) return false
        if (playFilters.source !== 'all' && play.source !== playFilters.source) return false
        return true
      })

      const sortedPlays = [...filteredPlays].sort((a, b) => b.performance - a.performance)

      const getEffortBadgeColor = (effort: string) => {
        switch(effort) {
          case 'low': return 'bg-green-100 text-green-800 border-green-300'
          case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
          case 'high': return 'bg-red-100 text-red-800 border-red-300'
          default: return 'bg-gray-100 text-gray-800 border-gray-300'
        }
      }

      const getPerformanceStars = (score: number) => {
        if (score >= 90) return 5
        if (score >= 75) return 4
        if (score >= 60) return 3
        if (score >= 40) return 2
        return 1
      }

      return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header with Explanation */}
          <div>
            <h1 className="text-3xl font-bold mb-2">My Plays</h1>
            <p className="text-muted-foreground">Your strategic idea inbox - capture recommendations from across the platform before evaluating them</p>
          </div>

          {/* Quick Actions */}
          <QuickActions module="StrategyStudio" />

          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                What are "Plays"?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-gray-700">
                <strong>Plays</strong> are strategic ideas that haven't been prioritized yet. They come from:
              </p>
              <ul className="space-y-1 text-gray-600 ml-4">
                <li>• <strong>GTM Test Pit:</strong> AI recommendations from your GTM model analysis</li>
                <li>• <strong>Competitor Analysis:</strong> Insights from competitive intelligence</li>
                <li>• <strong>Leadership Reports:</strong> Strategic priorities flagged in executive reporting</li>
                <li>• <strong>Manual Entry:</strong> Your own ideas captured on-the-fly</li>
              </ul>
              <div className="pt-2 border-t border-purple-200">
                <p className="text-xs text-purple-900">
                  <strong>Workflow:</strong> My Plays → +Eval (push to Eval Matrix) → Prioritize → Convert to 30/60/90 Milestones
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tabs: All Plays vs Create a Play */}
          <Tabs defaultValue="all-plays" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all-plays" data-testid="tab-all-plays">All Plays</TabsTrigger>
              <TabsTrigger value="create-play" data-testid="tab-create-play">Create a Play</TabsTrigger>
            </TabsList>

            {/* All Plays Tab */}
            <TabsContent value="all-plays" className="space-y-4">
              {/* Filters */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs mb-1 block">Status</Label>
                      <Select value={playFilters.status} onValueChange={(val) => setPlayFilters({...playFilters, status: val})}>
                        <SelectTrigger data-testid="filter-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs mb-1 block">Pillar</Label>
                      <Select value={playFilters.pillar} onValueChange={(val) => setPlayFilters({...playFilters, pillar: val})}>
                        <SelectTrigger data-testid="filter-pillar">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="Demand Generation">Demand Generation</SelectItem>
                          <SelectItem value="Brand Awareness">Brand Awareness</SelectItem>
                          <SelectItem value="Conversion Optimization">Conversion Optimization</SelectItem>
                          <SelectItem value="Partnerships">Partnerships</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs mb-1 block">Source</Label>
                      <Select value={playFilters.source} onValueChange={(val) => setPlayFilters({...playFilters, source: val})}>
                        <SelectTrigger data-testid="filter-source">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="GTM Test Pit">GTM Test Pit</SelectItem>
                          <SelectItem value="Competitor Analysis">Competitor Analysis</SelectItem>
                          <SelectItem value="Manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Success Performance Summary */}
              {sortedPlays.length > 0 && (
                <Card className="border-2 border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Star className="w-4 h-4 text-green-700 fill-green-700" />
                      Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      {sortedPlays.slice(0, 3).map((play, idx) => (
                        <div key={play.id} className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-white border-green-300 text-green-900">
                            #{idx + 1}
                          </Badge>
                          <span className="text-xs font-medium text-green-900">{play.title.slice(0, 30)}...</span>
                          <div className="flex gap-0.5">
                            {[...Array(getPerformanceStars(play.performance))].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            ))}
                          </div>
                          <span className="text-xs text-green-700 font-semibold">{play.performance}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Play Cards */}
              <div className="space-y-3">
                {sortedPlays.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                      <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No plays match your filters</p>
                    </CardContent>
                  </Card>
                )}

                {sortedPlays.map((play) => (
                  <Card key={play.id} className="border hover-elevate transition-all" data-testid={`play-card-${play.id}`}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-base mb-1">{play.title}</h4>
                            <p className="text-sm text-muted-foreground">{play.description}</p>
                          </div>

                          {/* Performance Stars */}
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex gap-0.5">
                              {[...Array(getPerformanceStars(play.performance))].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-gray-700">{play.performance}% Success</span>
                          </div>
                        </div>

                        {/* Metadata Row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-800">
                            {play.pillar}
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-800">
                            {play.source}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getEffortBadgeColor(play.effortRank)}`}>
                            {play.effortRank} effort
                          </Badge>
                          <span className="text-xs text-muted-foreground">Added {play.createdAt}</span>
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-[#6218df] to-[#c009ba] text-white hover:opacity-90"
                            onClick={() => {
                              // TODO: Implement actual push to eval matrix with play data
                              toast({ 
                                title: "Pushed to Eval Matrix",
                                description: `"${play.title}" added to Eval Matrix for prioritization`
                              })
                            }}
                            data-testid={`button-eval-${play.id}`}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Eval
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-edit-${play.id}`}>
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" data-testid={`button-archive-${play.id}`}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Create a Play Tab */}
            <TabsContent value="create-play" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Create New Play</CardTitle>
                  <p className="text-sm text-muted-foreground">Capture a strategic idea for later evaluation</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="play-title">Play Title</Label>
                    <Input 
                      id="play-title"
                      placeholder="e.g., Launch product-led growth motion"
                      value={newPlay.title}
                      onChange={(e) => setNewPlay({...newPlay, title: e.target.value})}
                      data-testid="input-play-title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="play-description">Description</Label>
                    <Textarea
                      id="play-description"
                      placeholder="Describe the strategic play, expected outcomes, and initial thoughts..."
                      value={newPlay.description}
                      onChange={(e) => setNewPlay({...newPlay, description: e.target.value})}
                      rows={4}
                      data-testid="input-play-description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="play-pillar">Strategic Pillar</Label>
                      <Select value={newPlay.pillar} onValueChange={(val) => setNewPlay({...newPlay, pillar: val})}>
                        <SelectTrigger id="play-pillar" data-testid="select-play-pillar">
                          <SelectValue placeholder="Select pillar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Demand Generation">Demand Generation</SelectItem>
                          <SelectItem value="Brand Awareness">Brand Awareness</SelectItem>
                          <SelectItem value="Conversion Optimization">Conversion Optimization</SelectItem>
                          <SelectItem value="Customer Retention">Customer Retention</SelectItem>
                          <SelectItem value="Partnerships">Partnerships</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="play-effort">Effort Rank</Label>
                      <Select value={newPlay.effortRank} onValueChange={(val) => setNewPlay({...newPlay, effortRank: val})}>
                        <SelectTrigger id="play-effort" data-testid="select-play-effort">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Effort</SelectItem>
                          <SelectItem value="medium">Medium Effort</SelectItem>
                          <SelectItem value="high">High Effort</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="play-performance">Expected Performance (0-100%)</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="play-performance"
                        type="number"
                        min="0"
                        max="100"
                        value={newPlay.performance}
                        onChange={(e) => setNewPlay({...newPlay, performance: parseInt(e.target.value) || 0})}
                        className="w-24"
                        data-testid="input-play-performance"
                      />
                      <div className="flex gap-0.5">
                        {[...Array(getPerformanceStars(newPlay.performance))].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({getPerformanceStars(newPlay.performance)} stars)
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => {
                        // TODO: API call to create play
                        toast({ title: "Play created!", description: `"${newPlay.title}" added to My Plays` })
                        setNewPlay({ title: '', description: '', pillar: '', effortRank: 'medium', performance: 50 })
                      }}
                      disabled={!newPlay.title || !newPlay.description || !newPlay.pillar}
                      data-testid="button-create-play"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Play
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setNewPlay({ title: '', description: '', pillar: '', effortRank: 'medium', performance: 50 })}
                      data-testid="button-reset-play"
                    >
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )
    }

    if (currentStep === '30-60-90') {
      if (loadingMilestones) {
        return (
          <div className="p-8">
            <p className="text-center text-muted-foreground py-8">Loading milestones...</p>
          </div>
        )
      }

      const renderColumn = (timeframe: '30-day' | '60-day' | '90-day', title: string, days: string) => {
        const items = milestones[timeframe]
        const timeframeNum = timeframe.split('-')[0]
        
        return (
          <div className="flex-1 min-w-[320px]">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Next {days} days</p>
                  </div>
                  <Badge variant="secondary">{items.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog open={addingToColumn === timeframeNum} onOpenChange={(open) => !open && setAddingToColumn(null)}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full" 
                      onClick={() => setAddingToColumn(timeframeNum)}
                      data-testid={`button-add-${timeframeNum}`}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Milestone
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Milestone - {title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-title">Title *</Label>
                        <Input
                          id="new-title"
                          value={newMilestoneForm.title}
                          onChange={(e) => setNewMilestoneForm({ ...newMilestoneForm, title: e.target.value })}
                          placeholder="e.g., Launch new campaign"
                          data-testid="input-new-title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-description">Description</Label>
                        <Textarea
                          id="new-description"
                          value={newMilestoneForm.description}
                          onChange={(e) => setNewMilestoneForm({ ...newMilestoneForm, description: e.target.value })}
                          rows={3}
                          placeholder="Add details about this milestone..."
                          data-testid="textarea-new-description"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-assignee">Assignee</Label>
                        <Input
                          id="new-assignee"
                          value={newMilestoneForm.assignee}
                          onChange={(e) => setNewMilestoneForm({ ...newMilestoneForm, assignee: e.target.value })}
                          placeholder="e.g., Sarah Chen"
                          data-testid="input-new-assignee"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-priority">Priority</Label>
                        <Select 
                          value={newMilestoneForm.priority} 
                          onValueChange={(value) => setNewMilestoneForm({ ...newMilestoneForm, priority: value })}
                        >
                          <SelectTrigger id="new-priority" data-testid="select-new-priority">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          onClick={() => setAddingToColumn(null)} 
                          data-testid="button-cancel-new"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => handleAddNewMilestone(timeframeNum)} 
                          disabled={!newMilestoneForm.title}
                          data-testid="button-save-new"
                        >
                          Add Milestone
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => handleDragEnd(event, timeframe)}
                >
                  <SortableContext
                    items={items.map(m => m.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2 min-h-[200px]">
                      {items.map((milestone) => (
                        <SortableMilestoneCard
                          key={milestone.id}
                          milestone={milestone}
                          onEdit={() => handleEdit(milestone)}
                          onDelete={() => handleDelete(milestone.id)}
                          onMove={(newTimeframe) => handleMoveColumn(milestone.id, newTimeframe)}
                          onComplete={() => handleComplete(milestone.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </CardContent>
            </Card>
          </div>
        )
      }

      return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">30/60/90 Milestones</h1>
              <p className="text-muted-foreground">Drag to reorder, use arrows to move between columns, check mark to complete</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadMilestonesTemplate}
                data-testid="button-download-template"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
              <label htmlFor="csv-upload">
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  data-testid="button-upload-milestones"
                >
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Milestones
                  </span>
                </Button>
              </label>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleUploadMilestones}
                data-testid="input-csv-upload"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions module="StrategyStudio" />

          <div className="flex gap-4 overflow-x-auto pb-4">
            {renderColumn('30-day', '30 Days', '30')}
            {renderColumn('60-day', '60 Days', '60')}
            {renderColumn('90-day', '90 Days', '90')}
          </div>

          {/* Missed Milestones Section */}
          {missedMilestones.length > 0 && (
            <Card className="border-2 border-red-300 dark:border-red-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Missed Milestones
                  <Badge variant="destructive">{missedMilestones.length}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Milestones past due date - requires immediate attention</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {missedMilestones.map((milestone) => {
                    const dueDate = milestone.createdAt ? new Date(milestone.createdAt) : new Date()
                    dueDate.setDate(dueDate.getDate() + parseInt(milestone.timeframe))
                    const daysOverdue = Math.floor((new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
                    
                    return (
                      <div
                        key={milestone.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900"
                        data-testid={`missed-milestone-${milestone.id}`}
                      >
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-900 dark:text-red-100">{milestone.title}</p>
                          {milestone.description && (
                            <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            {milestone.assignee && (
                              <span className="text-muted-foreground">Assignee: {milestone.assignee}</span>
                            )}
                            <span className="font-semibold text-red-700 dark:text-red-400">
                              ⚠ Overdue by {daysOverdue} day{daysOverdue !== 1 ? 's' : ''}
                            </span>
                            <span className="text-muted-foreground">
                              Due: {format(dueDate, 'MMM d, yyyy')}
                            </span>
                            <Badge variant="destructive" className="text-xs">
                              {milestone.timeframe}-day milestone
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completed Section */}
          {completedMilestones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Completed Milestones
                  <Badge variant="default">{completedMilestones.length}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Completed milestones with timestamps for traceability</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {completedMilestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
                      data-testid={`completed-milestone-${milestone.id}`}
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium line-through text-muted-foreground">{milestone.title}</p>
                        {milestone.description && (
                          <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          {milestone.assignee && <span>By: {milestone.assignee}</span>}
                          {milestone.completedAt && (
                            <span className="font-medium">
                              ✓ Completed: {format(new Date(milestone.completedAt), 'MMM d, yyyy • h:mm a')}
                            </span>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {milestone.timeframe}-day milestone
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Dialog */}
          <Dialog open={!!editingMilestone} onOpenChange={(open) => !open && setEditingMilestone(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Milestone</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    data-testid="input-edit-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    data-testid="textarea-edit-description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-assignee">Assignee</Label>
                  <Input
                    id="edit-assignee"
                    value={editForm.assignee}
                    onChange={(e) => setEditForm({ ...editForm, assignee: e.target.value })}
                    data-testid="input-edit-assignee"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-timeframe">Timeframe</Label>
                  <Select value={editForm.timeframe} onValueChange={(value) => setEditForm({ ...editForm, timeframe: value })}>
                    <SelectTrigger id="edit-timeframe" data-testid="select-edit-timeframe">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="60">60 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setEditingMilestone(null)} data-testid="button-cancel-edit">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit} data-testid="button-save-edit">
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )
    }

    if (currentStep === 'ad-tracking') {
      return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ad Tracking URLs</h1>
            <p className="text-muted-foreground">Generate UTM tracking codes and QR codes for campaign performance tracking</p>
          </div>

          {/* Quick Actions */}
          <QuickActions module="StrategyStudio" />

          {/* Coaching Prompt */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                Coaching: URL Tracking Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>UTM Parameters:</strong> Use consistent naming conventions across campaigns for accurate reporting</p>
              <p><strong>Source:</strong> Where traffic originates (linkedin, google, newsletter)</p>
              <p><strong>Medium:</strong> Marketing medium (social, cpc, email, organic)</p>
              <p><strong>Campaign:</strong> Specific campaign name (q4-product-launch, webinar-series)</p>
              <p><strong>Content:</strong> Differentiate similar content or links (cta-button, hero-banner)</p>
              <p><strong>QR Codes:</strong> Perfect for print materials, events, and offline-to-online tracking</p>
            </CardContent>
          </Card>

          {/* Coming Soon - Full Implementation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" style={{ color: moduleColor }} />
                URL Tracking Generator
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Create tracking codes and QR codes for your campaigns
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-8 text-center border-2 border-dashed rounded-lg bg-muted/30">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto">
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold">URL Tracking Generator Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate UTM-tagged URLs and QR codes with real Stackwise campaign data, channel integrations, and automated tracking code management
                  </p>
                  <div className="pt-4 space-y-2 text-left">
                    <p className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>UTM parameter builder with campaign/channel presets</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>QR code generation for print and offline materials</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Integration with Flight Deck distribution workflow</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Click tracking and performance analytics</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  return (
    <ThreeColumnLayout
      leftNav={leftNav}
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      content={renderStepContent()}
      moduleColor={moduleColor}
      featureName="Stack Navigator"
    />
  )
}
