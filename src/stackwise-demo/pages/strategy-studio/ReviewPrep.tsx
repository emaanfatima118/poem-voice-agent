import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/stackwise-demo/components/ui/card'
import { Button } from '@/stackwise-demo/components/ui/button'
import { Badge } from '@/stackwise-demo/components/ui/badge'
import { Progress } from '@/stackwise-demo/components/ui/progress'
import { Textarea } from '@/stackwise-demo/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/stackwise-demo/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/stackwise-demo/components/ui/dialog'
import { QuickActions } from '@/stackwise-demo/components/QuickActions'
import { 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  StickyNote, 
  ChevronDown, 
  ChevronUp,
  Tag,
  FileText,
  Send,
  Download
} from 'lucide-react'
import { useToast } from '@/stackwise-demo/hooks/use-toast'

interface ReviewItem {
  id: number
  title: string
  source: string
  priority: 'critical' | 'high' | 'normal' | 'low'
  status: 'pending' | 'in-progress' | 'complete'
  note?: string
  carryover: boolean
}

interface Note {
  id: number
  content: string
  category: 'Win' | 'Risk' | 'Lesson' | 'Idea'
  source: string
  timestamp: string
}

export default function ReviewPrep() {
  const { toast } = useToast()
  const [isNotesOpen, setIsNotesOpen] = useState(true)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [isItemNoteModalOpen, setIsItemNoteModalOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [newNoteCategory, setNewNoteCategory] = useState<'Win' | 'Risk' | 'Lesson' | 'Idea'>('Win')
  const [itemNoteContent, setItemNoteContent] = useState('')
  const [isLocked, setIsLocked] = useState(false)

  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([
    { id: 1, title: 'Complete Q4 Brand Voice Audit', source: 'BrandCraft', priority: 'critical', status: 'pending', carryover: false },
    { id: 2, title: 'LinkedIn POV Series — Draft 3 posts', source: 'Strategy Studio', priority: 'high', status: 'in-progress', carryover: false },
    { id: 3, title: 'Retention Play Milestone — Day 60', source: '30/60/90', priority: 'critical', status: 'pending', carryover: false },
    { id: 4, title: 'Tag top 3 wins for review', source: 'Eval Matrix', priority: 'normal', status: 'complete', carryover: false },
    { id: 5, title: 'Update Paid Social budget allocation', source: 'Flight Deck', priority: 'high', status: 'in-progress', carryover: false },
    { id: 6, title: 'Email nurture sequence optimization', source: 'Eval Matrix', priority: 'high', status: 'pending', carryover: false },
  ])

  const [notes, setNotes] = useState<Note[]>([
    { id: 1, content: 'Social engagement rose 12% while retention programs slowed.', category: 'Lesson', source: 'PulseHub', timestamp: '2 days ago' },
    { id: 2, content: 'Exec POV adoption is increasing but needs consistency.', category: 'Risk', source: 'Strategy Studio', timestamp: '1 day ago' },
    { id: 3, content: 'LinkedIn content performance exceeded targets by 18%.', category: 'Win', source: 'BrandCraft', timestamp: '3 days ago' },
  ])

  const [swot, setSwot] = useState({
    strengths: 'High exec POV engagement\nStrong content cadence',
    weaknesses: 'Retention lag\nLimited refresh cycles',
    opportunities: 'LinkedIn growth\nExpansion into owned media',
    threats: 'Rising paid cost\nCompetitor POV series'
  })

  const calculateReadiness = () => {
    const total = reviewItems.length
    const completed = reviewItems.filter(item => item.status === 'complete').length
    return Math.round((completed / total) * 100)
  }

  const cycleHealth = 76

  const toggleItemStatus = (id: number) => {
    if (isLocked) return
    setReviewItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          let newStatus: ReviewItem['status']
          if (item.status === 'pending') newStatus = 'in-progress'
          else if (item.status === 'in-progress') newStatus = 'complete'
          else newStatus = 'pending'
          return { ...item, status: newStatus }
        }
        return item
      })
    )
  }

  const toggleCarryover = (id: number) => {
    if (isLocked) return
    setReviewItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, carryover: !item.carryover } : item
      )
    )
  }

  const addNote = () => {
    const newNote: Note = {
      id: notes.length + 1,
      content: newNoteContent,
      category: newNoteCategory,
      source: 'Manual Entry',
      timestamp: 'Just now'
    }
    setNotes([newNote, ...notes])
    setNewNoteContent('')
    setNewNoteCategory('Win')
    setIsNoteModalOpen(false)
    toast({
      title: 'Note added',
      description: 'Your note has been added to the review.',
    })
  }

  const addItemNote = () => {
    if (selectedItemId === null) return
    setReviewItems(prev =>
      prev.map(item =>
        item.id === selectedItemId ? { ...item, note: itemNoteContent } : item
      )
    )
    setItemNoteContent('')
    setSelectedItemId(null)
    setIsItemNoteModalOpen(false)
    toast({
      title: 'Note added',
      description: 'Note has been added to the item.',
    })
  }

  const sendToReview = () => {
    setIsLocked(true)
    toast({
      title: 'Sent to Review',
      description: 'Your review preparation has been locked and sent to the review workspace.',
    })
  }

  const exportSummary = () => {
    toast({
      title: 'Export Started',
      description: 'Your summary PDF is being generated...',
    })
  }

  const getStatusIcon = (status: ReviewItem['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <Circle className="h-4 w-4 text-orange-600 fill-orange-600" />
      case 'pending':
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPriorityBadge = (priority: ReviewItem['priority']) => {
    const colors = {
      critical: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      normal: 'bg-blue-100 text-blue-700',
      low: 'bg-gray-100 text-gray-700'
    }
    return (
      <Badge variant="secondary" className={colors[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  const getCategoryColor = (category: Note['category']) => {
    const colors = {
      Win: 'text-green-600',
      Risk: 'text-red-600',
      Lesson: 'text-blue-600',
      Idea: 'text-purple-600'
    }
    return colors[category]
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-background">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground" data-testid="heading-review-prep">
                Review Prep — Q4 Strategy Cycle
              </h1>
              <p className="text-sm text-muted-foreground">
                Confirm readiness and capture context ahead of your Q1 Review
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportSummary}
                data-testid="button-export"
              >
                <Download className="h-4 w-4 mr-1" />
                Export Summary (PDF)
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] text-white hover:opacity-90"
                onClick={sendToReview}
                disabled={isLocked}
                data-testid="button-send-to-review"
              >
                <Send className="h-4 w-4 mr-1" />
                {isLocked ? 'Sent to Review' : 'Send to Review'}
              </Button>
            </div>
          </div>

          {/* Metrics Strip */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Cycle Health</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] bg-clip-text text-transparent">
                  {cycleHealth}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Readiness</div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold">{calculateReadiness()}%</div>
                  <Progress value={calculateReadiness()} className="flex-1 h-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">Notes Submitted</div>
                <div className="text-2xl font-bold">{notes.length}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions module="StrategyStudio" />

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column: SWOT + Readiness Checklist */}
          <div className="col-span-2 space-y-6">
            {/* SWOT Block */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Context & SWOT</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Simple lens for review discussion prep
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-green-700 block mb-2">Strengths</label>
                    <Textarea
                      value={swot.strengths}
                      onChange={(e) => setSwot({ ...swot, strengths: e.target.value })}
                      rows={4}
                      disabled={isLocked}
                      className="text-xs"
                      data-testid="textarea-strengths"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-red-700 block mb-2">Weaknesses</label>
                    <Textarea
                      value={swot.weaknesses}
                      onChange={(e) => setSwot({ ...swot, weaknesses: e.target.value })}
                      rows={4}
                      disabled={isLocked}
                      className="text-xs"
                      data-testid="textarea-weaknesses"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-blue-700 block mb-2">Opportunities</label>
                    <Textarea
                      value={swot.opportunities}
                      onChange={(e) => setSwot({ ...swot, opportunities: e.target.value })}
                      rows={4}
                      disabled={isLocked}
                      className="text-xs"
                      data-testid="textarea-opportunities"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-orange-700 block mb-2">Threats</label>
                    <Textarea
                      value={swot.threats}
                      onChange={(e) => setSwot({ ...swot, threats: e.target.value })}
                      rows={4}
                      disabled={isLocked}
                      className="text-xs"
                      data-testid="textarea-threats"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Readiness Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>Review Readiness Checklist</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {isLocked ? 'Checklist locked and sent to review' : 'Track pending items for your quarterly review'}
                </p>
              </CardHeader>
              <CardContent>
                {/* Legend */}
                <div className="mb-4 p-3 bg-muted/30 rounded-md border">
                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <span className="font-semibold">Actions Legend:</span>
                    <div className="flex items-center gap-1.5">
                      <StickyNote className="h-3 w-3" />
                      <span>Add Note</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3 w-3" />
                      <span>Tag for Carryover</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-2 pb-2 border-b text-xs font-semibold text-muted-foreground">
                    <div className="col-span-1"></div>
                    <div className="col-span-5">Item</div>
                    <div className="col-span-2">Source</div>
                    <div className="col-span-2">Priority</div>
                    <div className="col-span-2">Actions</div>
                  </div>

                  {/* Table Rows */}
                  {reviewItems.map((item) => (
                    <div 
                      key={item.id}
                      className={`grid grid-cols-12 gap-2 p-3 rounded-md border ${
                        isLocked ? 'bg-muted/50' : 'bg-card hover-elevate'
                      }`}
                      data-testid={`review-item-${item.id}`}
                    >
                      <div className="col-span-1 flex items-center">
                        <button 
                          onClick={() => toggleItemStatus(item.id)}
                          disabled={isLocked}
                          className={isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                          data-testid={`button-toggle-${item.id}`}
                        >
                          {getStatusIcon(item.status)}
                        </button>
                      </div>
                      <div className="col-span-5 flex flex-col">
                        <span className={`text-sm font-medium ${item.status === 'complete' ? 'line-through text-muted-foreground' : ''}`}>
                          {item.title}
                        </span>
                        {item.note && (
                          <span className="text-xs text-muted-foreground italic mt-1">
                            Note: {item.note}
                          </span>
                        )}
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="text-xs text-muted-foreground">{item.source}</span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        {getPriorityBadge(item.priority)}
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => {
                            setSelectedItemId(item.id)
                            setItemNoteContent(item.note || '')
                            setIsItemNoteModalOpen(true)
                          }}
                          disabled={isLocked}
                          data-testid={`button-add-note-${item.id}`}
                        >
                          <StickyNote className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-7 px-2 ${item.carryover ? 'text-purple-600' : ''}`}
                          onClick={() => toggleCarryover(item.id)}
                          disabled={isLocked}
                          data-testid={`button-carryover-${item.id}`}
                        >
                          <Tag className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {!isLocked && (
                  <div className="mt-4 text-xs text-muted-foreground">
                    Click status icons to update progress • Add notes for context • Tag items for next cycle carryover
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Notes & Reflections */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notes & Reflections</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsNotesOpen(!isNotesOpen)}
                    data-testid="button-toggle-notes"
                  >
                    {isNotesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Compiled notes from across modules
                </p>
              </CardHeader>
              {isNotesOpen && (
                <CardContent className="space-y-3">
                  <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        variant="outline" 
                        size="sm"
                        disabled={isLocked}
                        data-testid="button-add-new-note"
                      >
                        <StickyNote className="h-4 w-4 mr-1" />
                        Add New Note
                      </Button>
                    </DialogTrigger>
                    <DialogContent data-testid="dialog-add-note">
                      <DialogHeader>
                        <DialogTitle>Add Note</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Category</label>
                          <Select value={newNoteCategory} onValueChange={(value: any) => setNewNoteCategory(value)}>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Win">Win</SelectItem>
                              <SelectItem value="Risk">Risk</SelectItem>
                              <SelectItem value="Lesson">Lesson</SelectItem>
                              <SelectItem value="Idea">Idea</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Note</label>
                          <Textarea
                            placeholder="Enter your reflection..."
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            rows={4}
                            data-testid="textarea-new-note"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={addNote}
                            className="flex-1"
                            disabled={!newNoteContent.trim()}
                            data-testid="button-save-new-note"
                          >
                            Save Note
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => setIsNoteModalOpen(false)}
                            data-testid="button-cancel-new-note"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Notes List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {notes.map((note) => (
                      <div 
                        key={note.id}
                        className="p-3 rounded-md border bg-card"
                        data-testid={`note-${note.id}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="secondary" className={getCategoryColor(note.category)}>
                            {note.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{note.timestamp}</span>
                        </div>
                        <p className="text-xs leading-relaxed">{note.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">Source: {note.source}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>

        {/* Item Note Modal */}
        <Dialog open={isItemNoteModalOpen} onOpenChange={setIsItemNoteModalOpen}>
          <DialogContent data-testid="dialog-item-note">
            <DialogHeader>
              <DialogTitle>Add Note to Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Add context or notes for this item..."
                value={itemNoteContent}
                onChange={(e) => setItemNoteContent(e.target.value)}
                rows={4}
                data-testid="textarea-item-note"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={addItemNote}
                  className="flex-1"
                  data-testid="button-save-item-note"
                >
                  Save Note
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsItemNoteModalOpen(false)
                    setItemNoteContent('')
                    setSelectedItemId(null)
                  }}
                  data-testid="button-cancel-item-note"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
