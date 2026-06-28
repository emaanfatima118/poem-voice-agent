"use client"

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient, apiRequest } from '@/lib/queryClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useForm } from 'react-hook-form'
import { 
  Upload, 
  Search, 
  Star, 
  Lightbulb, 
  BookmarkPlus,
  FileText,
  Edit,
  Archive,
  Download,
  Replace,
  Eye,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Save,
  X
} from 'lucide-react'

type AssetFormValues = {
  userId: string
  name: string
  description?: string | null
  reportType?: string | null
  reportSubType?: string | null
  campaignName?: string | null
  campaignPersona?: string[] | null
  campaignStage?: string[] | null
  campaignGoal?: string[] | null
  campaignPillar?: string | null
  campaignSubTopic?: string | null
  execName?: string[] | null
  execPillar?: string | null
  contentType?: string[] | null
  contentChannel?: string[] | null
  module?: string | null
  feature?: string | null
  assetStatus?: string | null
  fileUrl?: string | null
  fileName?: string | null
  fileSize?: number | null
  fileType?: string | null
  thumbnailUrl?: string | null
}

const FILTER_CATEGORIES = [
  {
    id: 'reports',
    label: 'Reports',
    options: [
      { id: 'budget', label: 'Budget', subTopics: [] },
      { id: 'reviews', label: 'Reviews', subTopics: ['Quarterly', 'Annual', 'Strategy'] },
      { id: 'packages', label: 'Packages', subTopics: ['Insights & Analysis', 'Manifesto'] },
    ]
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    options: [
      { id: 'name', label: 'Name', subTopics: [] },
      { id: 'persona', label: 'Persona', subTopics: ['CFO', 'CMO'] },
      { id: 'stage', label: 'Stage', subTopics: ['Awareness', 'Conversion'] },
      { id: 'goal', label: 'Goal', subTopics: ['Lead Gen', 'Brand Awareness'] },
      { id: 'pillar', label: 'Pillar', subTopics: ['P1 - Sub 1', 'P1 - Sub 2', 'P1 - Sub 3', 'P2 - Sub 1', 'P2 - Sub 2', 'P2 - Sub 3', 'P3 - Sub 1', 'P3 - Sub 2', 'P3 - Sub 3'] },
    ]
  },
  {
    id: 'exec',
    label: 'ExecPrograms',
    options: [
      { id: 'exec', label: 'Exec', subTopics: ['Jen', 'Sarah', 'Mason'] },
      { id: 'pillar', label: 'Pillar', subTopics: ['P1 - Sub 1', 'P1 - Sub 2', 'P1 - Sub 3', 'P2 - Sub 1', 'P2 - Sub 2', 'P2 - Sub 3', 'P3 - Sub 1', 'P3 - Sub 2', 'P3 - Sub 3'] },
    ]
  },
  {
    id: 'content',
    label: 'Content&Creative',
    options: [
      { id: 'type', label: 'Type or Export', subTopics: ['Display Ad', 'Blog', 'Email', 'PDF'] },
      { id: 'channel', label: 'Channel', subTopics: ['LinkedIn', 'Instagram', 'Programmatic'] },
    ]
  },
  {
    id: 'modules',
    label: 'Module',
    options: [
      { id: 'strategy', label: 'Strategy Studio', subTopics: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'] },
      { id: 'pulse', label: 'Pulse HubSpot', subTopics: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'] },
      { id: 'brand', label: 'Brand Craft', subTopics: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'] },
      { id: 'flight', label: 'Flight Deck', subTopics: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'] },
    ]
  },
  {
    id: 'status',
    label: 'Asset Status',
    options: [
      { id: 'draft', label: 'Draft', subTopics: [] },
      { id: 'active', label: 'Active', subTopics: [] },
      { id: 'archived', label: 'Archived', subTopics: [] },
    ]
  },
]

// Real BrandCraft Content Types (from CampaignBuilder.tsx)
const CONTENT_TYPE_OPTIONS = [
  'Article / Thought Leadership',
  'Whitepaper',
  'Case Study',
  'E-Book',
  'Infographic',
  'One-Pager / Sell Sheet',
  'Presentation / Slide Deck',
  'Video',
  'Webinar',
  'Podcast',
  'Social Post',
  'Email',
  'Newsletter',
  'Press Release',
  'Landing Page',
  'Website Page',
  'Product Page',
  'Guide / Checklist',
  'Template / Toolkit',
  'Report / Benchmark Study',
  'Ad / Creative Asset',
  'Event Material (Booth, Flyer, Handout)',
  'Customer Story / Testimonial',
  'Internal Enablement Asset (Battlecard, Script, Training Deck)',
  'Interactive Content (Quiz, Calculator, Poll)',
  'Microsite / Campaign Hub'
]

// Real BrandCraft Channels (from CampaignBuilder.tsx)
const CHANNEL_OPTIONS = [
  'Email',
  'LinkedIn',
  'Facebook',
  'Instagram',
  'X (Twitter)',
  'YouTube',
  'TikTok',
  'Pinterest',
  'Google Ads',
  'Display Network',
  'Programmatic Display',
  'Direct Mail',
  'SMS/Text',
  'Webinars',
  'Podcasts',
  'Events (In-person / Virtual)',
  'Trade Shows',
  'Press Releases',
  'Blogs',
  'Website',
  'SEO / Organic Search',
  'Paid Search (PPC)'
]

// Pillar subtopics for cascading selection
const PILLAR_SUBTOPICS: Record<string, string[]> = {
  'P1': ['P1 - Sub 1', 'P1 - Sub 2', 'P1 - Sub 3'],
  'P2': ['P2 - Sub 1', 'P2 - Sub 2', 'P2 - Sub 3'],
  'P3': ['P3 - Sub 1', 'P3 - Sub 2', 'P3 - Sub 3'],
}

export default function AssetManagement() {
  const [userTier, setUserTier] = useState<'stacked' | 'fully-stacked'>('stacked')
  const [searchQuery, setSearchQuery] = useState('')
  const [topTab, setTopTab] = useState<'recent' | 'plays' | 'saved'>('recent')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [addAssetOpen, setAddAssetOpen] = useState(false)
  const [editAsset, setEditAsset] = useState<any>(null)
  const [previewAsset, setPreviewAsset] = useState<any>(null)
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([])
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([])
  const [selectedStages, setSelectedStages] = useState<string[]>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [selectedExecs, setSelectedExecs] = useState<string[]>([])
  
  // Parent/child filter dependencies
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  
  // Bulk operations state
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set())
  const [bulkActionMenuOpen, setBulkActionMenuOpen] = useState(false)
  
  // Sort state
  const [sortField, setSortField] = useState<'date' | 'name' | 'type' | 'size' | 'module'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  // Saved views state
  const [saveViewDialogOpen, setSaveViewDialogOpen] = useState(false)
  const [viewNameInput, setViewNameInput] = useState('')

  const { data: assets = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/assets'],
  })

  const { data: campaigns = [] } = useQuery<any[]>({
    queryKey: ['/api/campaigns'],
  })

  const { data: features = [] } = useQuery<any[]>({
    queryKey: ['/api/features', selectedModule],
    enabled: !!selectedModule,
  })

  const { data: recentAssets = [] } = useQuery({
    queryKey: ['/api/assets/recent'],
  })

  const { data: savedViews = [] } = useQuery({
    queryKey: ['/api/saved-views'],
  })
  
  const { data: favorites = [] } = useQuery<any[]>({
    queryKey: ['/api/favorites'],
  })

  const form = useForm<AssetFormValues>({
    defaultValues: {
      userId: 'user-1',
      name: '',
      description: '',
      reportType: '',
      campaignName: '',
      contentType: [],
      contentChannel: [],
      assetStatus: 'draft',
      fileUrl: '',
      fileName: '',
      fileSize: 0,
      fileType: '',
      thumbnailUrl: '',
    },
  })

  // Get available filter options from selected campaign
  const selectedCampaignData = campaigns.find((c: any) => c.id === selectedCampaign)
  
  const campaignChildOptions = selectedCampaignData ? {
    goals: selectedCampaignData.goal ? [selectedCampaignData.goal] : [],
    personas: [
      selectedCampaignData.primaryPersona,
      ...(selectedCampaignData.secondaryPersonas || [])
    ].filter(Boolean),
    stages: selectedCampaignData.goal ? [selectedCampaignData.goal] : [], // Using goal as stage proxy
    contentTypes: CONTENT_TYPE_OPTIONS, // All content types available
  } : { goals: [], personas: [], stages: [], contentTypes: [] }

  // Handle campaign selection change - reset child filters
  const handleCampaignChange = (campaignId: string | null) => {
    setSelectedCampaign(campaignId)
    // Reset dependent filters
    setSelectedGoals([])
    setSelectedPersonas([])
    setSelectedStages([])
    setSelectedContentTypes([])
  }

  const resetFormState = () => {
    form.reset()
    setSelectedPillar(null)
    setSelectedModule(null)
    setSelectedContentTypes([])
    setSelectedChannels([])
    setSelectedPersonas([])
    setSelectedStages([])
    setSelectedGoals([])
    setSelectedExecs([])
    setSelectedCampaign(null)
    setEditAsset(null)
  }

  const createAssetMutation = useMutation({
    mutationFn: async (data: AssetFormValues) => {
      return await apiRequest('/api/assets', 'POST', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] })
      queryClient.invalidateQueries({ queryKey: ['/api/assets/recent'] })
      setAddAssetOpen(false)
      resetFormState()
    },
  })

  const updateAssetMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: AssetFormValues }) => {
      return await apiRequest(`/api/assets/${id}`, 'PATCH', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] })
      queryClient.invalidateQueries({ queryKey: ['/api/assets/recent'] })
      setEditAsset(null)
      resetFormState()
    },
  })

  // Bulk archive mutation
  const bulkArchiveMutation = useMutation({
    mutationFn: async (assetIds: string[]) => {
      return await Promise.all(
        assetIds.map(id => apiRequest(`/api/assets/${id}`, 'PATCH', { assetStatus: 'Archived' }))
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] })
      setSelectedAssets(new Set())
    },
  })
  
  // Saved Views mutations
  const createSavedViewMutation = useMutation({
    mutationFn: async (viewName: string) => {
      const filters = {
        searchQuery,
        selectedFilters,
        selectedModule,
        selectedPillar,
        selectedContentTypes,
        selectedChannels,
        selectedPersonas,
        selectedStages,
        selectedGoals,
        selectedExecs,
        selectedCampaign,
      }
      return await apiRequest('/api/saved-views', 'POST', { name: viewName, filters })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-views'] })
      setSaveViewDialogOpen(false)
      setViewNameInput('')
    },
  })
  
  const deleteSavedViewMutation = useMutation({
    mutationFn: async (viewId: string) => {
      return await apiRequest(`/api/saved-views/${viewId}`, 'DELETE')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-views'] })
    },
  })
  
  // Favorites mutations
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (assetId: string) => {
      const isFavorited = favorites.some((f: any) => f.assetId === assetId)
      if (isFavorited) {
        return await apiRequest(`/api/favorites/${assetId}`, 'DELETE')
      } else {
        return await apiRequest('/api/favorites', 'POST', { assetId })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] })
    },
  })

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  const toggleFilter = (categoryId: string, optionId: string) => {
    setSelectedFilters(prev => {
      const current = prev[categoryId] || []
      const isSelected = current.includes(optionId)
      return {
        ...prev,
        [categoryId]: isSelected 
          ? current.filter(id => id !== optionId)
          : [...current, optionId]
      }
    })
  }

  // Bulk selection helpers
  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets(prev => {
      const newSet = new Set(prev)
      if (newSet.has(assetId)) {
        newSet.delete(assetId)
      } else {
        newSet.add(assetId)
      }
      return newSet
    })
  }

  const selectAllAssets = () => {
    setSelectedAssets(new Set(displayAssets.map((a: any) => a.id)))
  }

  const deselectAllAssets = () => {
    setSelectedAssets(new Set())
  }

  const handleBulkArchive = () => {
    if (confirm(`Archive ${selectedAssets.size} asset(s)?`)) {
      bulkArchiveMutation.mutate(Array.from(selectedAssets))
    }
  }

  const handleBulkDownload = () => {
    // In a real app, this would trigger actual downloads
    alert(`Downloading ${selectedAssets.size} asset(s)...`)
    // TODO: Implement actual download logic
  }
  
  // Saved Views handlers
  const loadSavedView = (view: any) => {
    const filters = view.filters || {}
    setSearchQuery(filters.searchQuery || '')
    setSelectedFilters(filters.selectedFilters || {})
    setSelectedModule(filters.selectedModule || null)
    setSelectedPillar(filters.selectedPillar || null)
    setSelectedContentTypes(filters.selectedContentTypes || [])
    setSelectedChannels(filters.selectedChannels || [])
    setSelectedPersonas(filters.selectedPersonas || [])
    setSelectedStages(filters.selectedStages || [])
    setSelectedGoals(filters.selectedGoals || [])
    setSelectedExecs(filters.selectedExecs || [])
  }
  
  const handleSaveCurrentView = () => {
    if (!viewNameInput.trim()) {
      alert('Please enter a view name')
      return
    }
    createSavedViewMutation.mutate(viewNameInput)
  }
  
  // Check if asset is favorited
  const isAssetFavorited = (assetId: string) => {
    return favorites.some((f: any) => f.assetId === assetId)
  }

  const onSubmit = (data: AssetFormValues) => {
    if (editAsset) {
      updateAssetMutation.mutate({ id: editAsset.id, data })
    } else {
      createAssetMutation.mutate(data)
    }
  }

  const filteredAssets = assets.filter((asset: any) => {
    // Search query filter
    if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Apply selected filters
    for (const [categoryId, selectedOptions] of Object.entries(selectedFilters)) {
      if (selectedOptions.length === 0) continue

      let matches = false
      
      if (categoryId === 'reports') {
        matches = selectedOptions.some(opt => {
          if (opt === 'budget') return asset.reportType === 'Budget'
          if (opt === 'reviews') return asset.reportType === 'Reviews'
          if (opt === 'packages') return asset.reportType === 'Packages'
          return false
        })
      } else if (categoryId === 'campaigns') {
        matches = selectedOptions.some(opt => {
          if (opt === 'name') return !!asset.campaignName
          if (opt === 'persona') return asset.campaignPersona?.length > 0
          if (opt === 'stage') return asset.campaignStage?.length > 0
          if (opt === 'goal') return asset.campaignGoal?.length > 0
          if (opt === 'pillar') return !!asset.campaignPillar
          return false
        })
      } else if (categoryId === 'exec') {
        matches = selectedOptions.some(opt => {
          if (opt === 'exec') return asset.execName?.length > 0
          if (opt === 'pillar') return !!asset.execPillar
          return false
        })
      } else if (categoryId === 'content') {
        matches = selectedOptions.some(opt => {
          if (opt === 'type') return asset.contentType?.length > 0
          if (opt === 'channel') return asset.contentChannel?.length > 0
          return false
        })
      } else if (categoryId === 'modules') {
        matches = selectedOptions.some(opt => {
          if (opt === 'strategy') return asset.module === 'Strategy Studio'
          if (opt === 'pulse') return asset.module === 'Pulse HubSpot'
          if (opt === 'brand') return asset.module === 'Brand Craft'
          if (opt === 'flight') return asset.module === 'Flight Deck'
          return false
        })
      } else if (categoryId === 'status') {
        matches = selectedOptions.some(opt => asset.assetStatus === opt)
      }

      if (!matches) return false
    }

    return true
  })

  // Apply sorting
  const displayAssets = [...filteredAssets].sort((a, b) => {
    let compare = 0
    switch (sortField) {
      case 'name':
        compare = a.name.localeCompare(b.name)
        break
      case 'date':
        compare = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        break
      case 'type':
        compare = (a.fileType || '').localeCompare(b.fileType || '')
        break
      case 'size':
        compare = (a.fileSize || 0) - (b.fileSize || 0)
        break
      case 'module':
        compare = (a.module || '').localeCompare(b.module || '')
        break
    }
    return sortOrder === 'asc' ? compare : -compare
  })

  return (
    <div className="h-full flex flex-col bg-background overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 p-4 border-b overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-flightdeck-start to-flightdeck-end bg-clip-text text-transparent">
            Asset Management
          </h1>
          <p className="text-sm text-muted-foreground">Digital Asset Management for your marketing content</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Tabs value={userTier} onValueChange={(v) => setUserTier(v as any)}>
            <TabsList data-testid="tabs-user-tier">
              <TabsTrigger value="stacked" data-testid="tab-stacked">Stacked</TabsTrigger>
              <TabsTrigger value="fully-stacked" data-testid="tab-fully-stacked">Fully Stacked</TabsTrigger>
            </TabsList>
          </Tabs>

          {userTier === 'fully-stacked' && (
            <Dialog open={addAssetOpen} onOpenChange={setAddAssetOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-asset">
                  <Upload className="w-4 h-4 mr-2" />
                  Add New Asset
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Asset</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asset Name *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter asset name" data-testid="input-name" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} value={field.value || ''} placeholder="Brief description of the asset" data-testid="input-description" rows={2} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fileUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>File Upload</FormLabel>
                          <FormControl>
                            <div className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate cursor-pointer" data-testid="upload-zone">
                              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground mb-2">Drag and drop your file here, or click to browse</p>
                              <p className="text-xs text-muted-foreground">Supports: PDF, Images, Videos, Documents, Zip files</p>
                              <Input {...field} value={field.value || ''} type="text" placeholder="Or paste file URL" className="mt-2" data-testid="input-file-url" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium mb-3">Asset Tags & Classification</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="reportType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Report Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value || undefined}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-report-type">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Budget">Budget</SelectItem>
                                  <SelectItem value="Reviews">Reviews</SelectItem>
                                  <SelectItem value="Packages">Packages</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="module"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Module</FormLabel>
                              <Select 
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  setSelectedModule(value)
                                  form.setValue('feature', null)
                                }} 
                                value={field.value || undefined}
                              >
                                <FormControl>
                                  <SelectTrigger data-testid="select-module">
                                    <SelectValue placeholder="Select module" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Strategy Studio">Strategy Studio</SelectItem>
                                  <SelectItem value="Pulse Hub">Pulse Hub</SelectItem>
                                  <SelectItem value="BrandCraft">BrandCraft</SelectItem>
                                  <SelectItem value="Flight Deck">Flight Deck</SelectItem>
                                  <SelectItem value="Reports">Reports</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        {/* Feature dropdown - appears when module is selected */}
                        {selectedModule && features.length > 0 && (
                          <FormField
                            control={form.control}
                            name="feature"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Feature</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || undefined}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-feature">
                                      <SelectValue placeholder="Select feature" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {features.map((feature: any) => (
                                      <SelectItem key={feature.id} value={feature.featureName}>
                                        {feature.featureName}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="campaignName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Campaign Name</FormLabel>
                              <FormControl>
                                <Input {...field} value={field.value || ''} placeholder="Campaign name" data-testid="input-campaign-name" />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="campaignPillar"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Campaign Pillar</FormLabel>
                              <Select 
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  setSelectedPillar(value)
                                }} 
                                value={field.value || undefined}
                              >
                                <FormControl>
                                  <SelectTrigger data-testid="select-campaign-pillar">
                                    <SelectValue placeholder="Select pillar" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="P1">P1</SelectItem>
                                  <SelectItem value="P2">P2</SelectItem>
                                  <SelectItem value="P3">P3</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Subtopic field that appears when pillar is selected */}
                      {selectedPillar && PILLAR_SUBTOPICS[selectedPillar] && (
                        <div className="mt-4">
                          <FormField
                            control={form.control}
                            name="campaignSubTopic"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Campaign Subtopic</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || undefined}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-campaign-subtopic">
                                      <SelectValue placeholder="Select subtopic" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {PILLAR_SUBTOPICS[selectedPillar].map(subtopic => (
                                      <SelectItem key={subtopic} value={subtopic}>{subtopic}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="assetStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Asset Status *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value || 'draft'}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-status">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2 mt-4">
                        <label className="text-sm font-medium">Campaign Personas</label>
                        <div className="flex flex-wrap gap-2">
                          {['CFO', 'CMO', 'VP Marketing', 'Marketing Director', 'Demand Gen Manager'].map(persona => (
                            <label key={persona} className="flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer hover-elevate">
                              <input 
                                type="checkbox" 
                                className="rounded"
                                checked={selectedPersonas.includes(persona)}
                                onChange={(e) => {
                                  const newPersonas = e.target.checked 
                                    ? [...selectedPersonas, persona]
                                    : selectedPersonas.filter(p => p !== persona)
                                  setSelectedPersonas(newPersonas)
                                  form.setValue('campaignPersona', newPersonas)
                                }}
                              />
                              <span className="text-sm">{persona}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <label className="text-sm font-medium">Campaign Stages</label>
                        <div className="flex flex-wrap gap-2">
                          {['Awareness', 'Consideration', 'Decision', 'Conversion', 'Retention'].map(stage => (
                            <label key={stage} className="flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer hover-elevate">
                              <input 
                                type="checkbox" 
                                className="rounded"
                                checked={selectedStages.includes(stage)}
                                onChange={(e) => {
                                  const newStages = e.target.checked 
                                    ? [...selectedStages, stage]
                                    : selectedStages.filter(s => s !== stage)
                                  setSelectedStages(newStages)
                                  form.setValue('campaignStage', newStages)
                                }}
                              />
                              <span className="text-sm">{stage}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <label className="text-sm font-medium">Campaign Goals</label>
                        <div className="flex flex-wrap gap-2">
                          {['Lead Generation', 'Brand Awareness', 'Demand Generation', 'Customer Retention', 'Product Launch', 'Event Promotion'].map(goal => (
                            <label key={goal} className="flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer hover-elevate">
                              <input 
                                type="checkbox" 
                                className="rounded"
                                checked={selectedGoals.includes(goal)}
                                onChange={(e) => {
                                  const newGoals = e.target.checked 
                                    ? [...selectedGoals, goal]
                                    : selectedGoals.filter(g => g !== goal)
                                  setSelectedGoals(newGoals)
                                  form.setValue('campaignGoal', newGoals)
                                }}
                              />
                              <span className="text-sm">{goal}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <label className="text-sm font-medium">Content Types (select multiple)</label>
                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                          {CONTENT_TYPE_OPTIONS.map(type => (
                            <label key={type} className="flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer hover-elevate">
                              <input 
                                type="checkbox" 
                                className="rounded"
                                checked={selectedContentTypes.includes(type)}
                                onChange={(e) => {
                                  const newTypes = e.target.checked 
                                    ? [...selectedContentTypes, type]
                                    : selectedContentTypes.filter(t => t !== type)
                                  setSelectedContentTypes(newTypes)
                                  form.setValue('contentType', newTypes)
                                }}
                              />
                              <span className="text-sm">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <label className="text-sm font-medium">Channels (select multiple)</label>
                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                          {CHANNEL_OPTIONS.map(channel => (
                            <label key={channel} className="flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer hover-elevate">
                              <input 
                                type="checkbox" 
                                className="rounded"
                                checked={selectedChannels.includes(channel)}
                                onChange={(e) => {
                                  const newChannels = e.target.checked 
                                    ? [...selectedChannels, channel]
                                    : selectedChannels.filter(c => c !== channel)
                                  setSelectedChannels(newChannels)
                                  form.setValue('contentChannel', newChannels)
                                }}
                              />
                              <span className="text-sm">{channel}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <label className="text-sm font-medium">Executive Programs</label>
                        <div className="flex flex-wrap gap-2">
                          {['Sarah Chen (CEO)', 'Marcus Johnson (VP Marketing)', 'Lisa Park (CMO)'].map(exec => (
                            <label key={exec} className="flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer hover-elevate">
                              <input 
                                type="checkbox" 
                                className="rounded"
                                checked={selectedExecs.includes(exec)}
                                onChange={(e) => {
                                  const newExecs = e.target.checked 
                                    ? [...selectedExecs, exec]
                                    : selectedExecs.filter(ex => ex !== exec)
                                  setSelectedExecs(newExecs)
                                  form.setValue('execName', newExecs)
                                }}
                              />
                              <span className="text-sm">{exec}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      {/* Left side: Replace and Archive buttons (Edit mode only) */}
                      {editAsset && (
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              // Trigger file replacement
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = '*/*'
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file) {
                                  // In a real app, upload the file and get URL
                                  form.setValue('fileName', file.name)
                                  form.setValue('fileSize', file.size)
                                  form.setValue('fileType', file.type)
                                }
                              }
                              input.click()
                            }}
                            data-testid="button-replace-asset"
                          >
                            <Replace className="w-4 h-4 mr-2" />
                            Replace Asset
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              if (confirm('Are you sure you want to archive this asset?')) {
                                updateAssetMutation.mutate({ 
                                  id: editAsset.id, 
                                  data: { ...form.getValues(), assetStatus: 'Archived' }
                                })
                              }
                            }}
                            data-testid="button-archive-asset"
                          >
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </Button>
                        </div>
                      )}
                      
                      {/* Right side: Cancel and Submit */}
                      <div className="flex gap-2 ml-auto">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setAddAssetOpen(false)
                            resetFormState()
                          }} 
                          data-testid="button-cancel"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createAssetMutation.isPending || updateAssetMutation.isPending} 
                          data-testid="button-submit"
                        >
                          {editAsset 
                            ? (updateAssetMutation.isPending ? 'Updating...' : 'Update Asset')
                            : (createAssetMutation.isPending ? 'Adding...' : 'Add Asset')
                          }
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Filters */}
        <div className="w-64 border-r p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Filters</h3>
          <div className="space-y-2">
            {FILTER_CATEGORIES.map(category => {
              // Special handling for Campaigns category with parent/child dependencies
              if (category.id === 'campaigns') {
                return (
                  <div key={category.id}>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between p-2 hover-elevate rounded-md text-sm font-medium"
                      data-testid={`filter-category-${category.id}`}
                    >
                      <span>{category.label}</span>
                      {expandedCategories[category.id] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    
                    {expandedCategories[category.id] && (
                      <div className="ml-4 mt-2 space-y-3">
                        {/* Parent Filter: Campaign Name */}
                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-1">
                            Campaign Name
                          </label>
                          <Select 
                            value={selectedCampaign || ''} 
                            onValueChange={(val) => handleCampaignChange(val || null)}
                          >
                            <SelectTrigger className="w-full" data-testid="filter-campaign-name">
                              <SelectValue placeholder="Select campaign" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">None</SelectItem>
                              {campaigns.map((campaign: any) => (
                                <SelectItem key={campaign.id} value={campaign.id}>
                                  {campaign.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Child Filters - Only enabled when campaign selected */}
                        {selectedCampaign && (
                          <>
                            {/* Goal Filter */}
                            {campaignChildOptions.goals.length > 0 && (
                              <div>
                                <label className="text-xs font-medium text-muted-foreground block mb-1">
                                  Goal
                                </label>
                                <div className="space-y-1">
                                  {campaignChildOptions.goals.map(goal => (
                                    <label
                                      key={goal}
                                      className="flex items-center gap-2 p-1.5 hover-elevate rounded cursor-pointer text-sm"
                                      data-testid={`filter-goal-${goal}`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedGoals.includes(goal)}
                                        onChange={() => {
                                          setSelectedGoals(prev => 
                                            prev.includes(goal) 
                                              ? prev.filter(g => g !== goal)
                                              : [...prev, goal]
                                          )
                                        }}
                                        className="rounded"
                                      />
                                      <span>{goal}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Persona Filter */}
                            {campaignChildOptions.personas.length > 0 && (
                              <div>
                                <label className="text-xs font-medium text-muted-foreground block mb-1">
                                  Persona
                                </label>
                                <div className="space-y-1">
                                  {campaignChildOptions.personas.map(persona => (
                                    <label
                                      key={persona}
                                      className="flex items-center gap-2 p-1.5 hover-elevate rounded cursor-pointer text-sm"
                                      data-testid={`filter-persona-${persona}`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedPersonas.includes(persona)}
                                        onChange={() => {
                                          setSelectedPersonas(prev => 
                                            prev.includes(persona) 
                                              ? prev.filter(p => p !== persona)
                                              : [...prev, persona]
                                          )
                                        }}
                                        className="rounded"
                                      />
                                      <span>{persona}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Stage Filter */}
                            {campaignChildOptions.stages.length > 0 && (
                              <div>
                                <label className="text-xs font-medium text-muted-foreground block mb-1">
                                  Stage
                                </label>
                                <div className="space-y-1">
                                  {campaignChildOptions.stages.map(stage => (
                                    <label
                                      key={stage}
                                      className="flex items-center gap-2 p-1.5 hover-elevate rounded cursor-pointer text-sm"
                                      data-testid={`filter-stage-${stage}`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedStages.includes(stage)}
                                        onChange={() => {
                                          setSelectedStages(prev => 
                                            prev.includes(stage) 
                                              ? prev.filter(s => s !== stage)
                                              : [...prev, stage]
                                          )
                                        }}
                                        className="rounded"
                                      />
                                      <span>{stage}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Content Type Filter */}
                            <div>
                              <label className="text-xs font-medium text-muted-foreground block mb-1">
                                Content Type
                              </label>
                              <div className="space-y-1 max-h-48 overflow-y-auto">
                                {CONTENT_TYPE_OPTIONS.map(contentType => (
                                  <label
                                    key={contentType}
                                    className="flex items-center gap-2 p-1.5 hover-elevate rounded cursor-pointer text-sm"
                                    data-testid={`filter-content-type-${contentType}`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedContentTypes.includes(contentType)}
                                      onChange={() => {
                                        setSelectedContentTypes(prev => 
                                          prev.includes(contentType) 
                                            ? prev.filter(ct => ct !== contentType)
                                            : [...prev, contentType]
                                        )
                                      }}
                                      className="rounded"
                                    />
                                    <span className="text-xs">{contentType}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {!selectedCampaign && (
                          <p className="text-xs text-muted-foreground italic p-2">
                            Select a campaign to enable Goal, Persona, Stage, and Content Type filters
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              }
              
              // Default rendering for other categories
              return (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between p-2 hover-elevate rounded-md text-sm font-medium"
                    data-testid={`filter-category-${category.id}`}
                  >
                    <span>{category.label}</span>
                    {expandedCategories[category.id] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {expandedCategories[category.id] && (
                    <div className="ml-4 mt-1 space-y-1">
                      {category.options.map(option => (
                        <label
                          key={option.id}
                          className="flex items-center gap-2 p-1.5 hover-elevate rounded cursor-pointer text-sm"
                          data-testid={`filter-option-${option.id}`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedFilters[category.id]?.includes(option.id) || false}
                            onChange={() => toggleFilter(category.id, option.id)}
                            className="rounded"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="border-b p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              
              {/* Sort Controls */}
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="w-[180px]" data-testid="select-sort-field">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Added</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="type">File Type</SelectItem>
                  <SelectItem value="size">File Size</SelectItem>
                  <SelectItem value="module">Module</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                data-testid="button-toggle-sort-order"
              >
                {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              </Button>
              
              {/* Load Saved View */}
              {savedViews.length > 0 && (
                <Select onValueChange={(viewId) => {
                  const view = savedViews.find((v: any) => v.id === viewId)
                  if (view) loadSavedView(view)
                }}>
                  <SelectTrigger className="w-[180px]" data-testid="select-load-view">
                    <SelectValue placeholder="Load View..." />
                  </SelectTrigger>
                  <SelectContent>
                    {savedViews.map((view: any) => (
                      <div key={view.id} className="flex items-center justify-between px-2 py-1.5 hover-elevate">
                        <SelectItem value={view.id} className="flex-1 border-0">{view.name}</SelectItem>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm(`Delete view "${view.name}"?`)) {
                              deleteSavedViewMutation.mutate(view.id)
                            }
                          }}
                          data-testid={`button-delete-view-${view.id}`}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {/* Save Current View */}
              <Dialog open={saveViewDialogOpen} onOpenChange={setSaveViewDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" data-testid="button-save-view">
                    <Save className="w-4 h-4 mr-2" />
                    Save View
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="dialog-save-view">
                  <DialogHeader>
                    <DialogTitle>Save Current View</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="View name..."
                      value={viewNameInput}
                      onChange={(e) => setViewNameInput(e.target.value)}
                      data-testid="input-view-name"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setSaveViewDialogOpen(false)} data-testid="button-cancel-save-view">
                        Cancel
                      </Button>
                      <Button onClick={handleSaveCurrentView} data-testid="button-confirm-save-view">
                        Save
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs value={topTab} onValueChange={(v) => setTopTab(v as any)}>
              <TabsList data-testid="tabs-top">
                <TabsTrigger value="recent" data-testid="tab-recent">
                  <Eye className="w-4 h-4 mr-2" />
                  Recently Viewed
                </TabsTrigger>
                <TabsTrigger value="plays" data-testid="tab-plays">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  My Plays
                </TabsTrigger>
                <TabsTrigger value="saved" data-testid="tab-saved">
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Saved Views
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Bulk Actions Bar */}
          {userTier === 'fully-stacked' && selectedAssets.size > 0 && (
            <div className="border-b bg-accent/10 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {selectedAssets.size} asset{selectedAssets.size !== 1 ? 's' : ''} selected
                  </span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={deselectAllAssets}
                    data-testid="button-deselect-all"
                  >
                    Clear
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleBulkDownload}
                    disabled={bulkArchiveMutation.isPending}
                    data-testid="button-bulk-download"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleBulkArchive}
                    disabled={bulkArchiveMutation.isPending}
                    data-testid="button-bulk-archive"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Asset Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Select All Checkbox (Fully Stacked only) */}
            {userTier === 'fully-stacked' && displayAssets.length > 0 && (
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedAssets.size === displayAssets.length && displayAssets.length > 0}
                  onChange={(e) => e.target.checked ? selectAllAssets() : deselectAllAssets()}
                  className="rounded"
                  data-testid="checkbox-select-all"
                />
                <label className="text-sm font-medium cursor-pointer" onClick={() => selectedAssets.size === displayAssets.length ? deselectAllAssets() : selectAllAssets()}>
                  Select All ({displayAssets.length})
                </label>
              </div>
            )}
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading assets...</div>
            ) : displayAssets.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No assets found</h3>
                <p className="text-muted-foreground mb-4">
                  {userTier === 'fully-stacked' 
                    ? 'Get started by adding your first asset' 
                    : 'No assets available to view'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayAssets.map((asset: any) => (
                  <Card key={asset.id} className="overflow-hidden hover-elevate relative" data-testid={`card-asset-${asset.id}`}>
                    {/* Favorite Star (Both tiers) */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 left-2 z-10 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavoriteMutation.mutate(asset.id)
                      }}
                      data-testid={`button-favorite-${asset.id}`}
                    >
                      {isAssetFavorited(asset.id) ? (
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="w-4 h-4" />
                      )}
                    </Button>
                    
                    {/* Checkbox for bulk selection (Fully Stacked only) */}
                    {userTier === 'fully-stacked' && (
                      <div className="absolute top-2 right-2 z-10">
                        <input
                          type="checkbox"
                          checked={selectedAssets.has(asset.id)}
                          onChange={() => toggleAssetSelection(asset.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-5 h-5 rounded border-2 border-white shadow-lg cursor-pointer"
                          data-testid={`checkbox-asset-${asset.id}`}
                        />
                      </div>
                    )}
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      {asset.thumbnailUrl ? (
                        <img src={asset.thumbnailUrl} alt={asset.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-1 line-clamp-1" data-testid={`text-name-${asset.id}`}>{asset.name}</h4>
                      {asset.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{asset.description}</p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        {asset.assetStatus && (
                          <Badge variant="secondary" className="text-xs">{asset.assetStatus}</Badge>
                        )}
                        {asset.contentType && Array.isArray(asset.contentType) && asset.contentType.map((t: string) => (
                          <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-1 pt-2 border-t">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setPreviewAsset(asset)}
                          data-testid={`button-preview-${asset.id}`}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          <span className="text-xs">Preview</span>
                        </Button>
                        {userTier === 'fully-stacked' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setEditAsset(asset)
                                setAddAssetOpen(true)
                                // Populate form with asset data
                                form.reset({
                                  ...asset,
                                  userId: asset.userId || 'user-1'
                                })
                                // Set all state for cascading dropdowns and checkboxes
                                setSelectedModule(asset.module || null)
                                setSelectedPillar(asset.campaignPillar || null)
                                setSelectedContentTypes(asset.contentType || [])
                                setSelectedChannels(asset.contentChannel || [])
                                setSelectedPersonas(asset.campaignPersona || [])
                                setSelectedStages(asset.campaignStage || [])
                                setSelectedGoals(asset.campaignGoal || [])
                                setSelectedExecs(asset.execName || [])
                              }}
                              data-testid={`button-edit-${asset.id}`}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" data-testid={`button-download-${asset.id}`}>
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" data-testid={`button-archive-${asset.id}`}>
                              <Archive className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewAsset} onOpenChange={() => setPreviewAsset(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewAsset?.name || 'Asset Preview'}</DialogTitle>
          </DialogHeader>
          {previewAsset && (
            <div className="space-y-4">
              {/* Asset Preview Image/Thumbnail */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {previewAsset.thumbnailUrl ? (
                  <img src={previewAsset.thumbnailUrl} alt={previewAsset.name} className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-24 h-24 text-muted-foreground" />
                )}
              </div>

              {/* Asset Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-sm mt-1">{previewAsset.assetStatus || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Module</label>
                  <p className="text-sm mt-1">{previewAsset.module || 'N/A'}</p>
                </div>
              </div>

              {previewAsset.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm mt-1">{previewAsset.description}</p>
                </div>
              )}

              {previewAsset.campaignName && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Campaign</label>
                  <p className="text-sm mt-1">{previewAsset.campaignName}</p>
                </div>
              )}

              {previewAsset.campaignPillar && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Campaign Pillar</label>
                    <p className="text-sm mt-1">{previewAsset.campaignPillar}</p>
                  </div>
                  {previewAsset.campaignSubTopic && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Subtopic</label>
                      <p className="text-sm mt-1">{previewAsset.campaignSubTopic}</p>
                    </div>
                  )}
                </div>
              )}

              {previewAsset.contentType && previewAsset.contentType.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Content Types</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {previewAsset.contentType.map((type: string) => (
                      <Badge key={type} variant="outline">{type}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {previewAsset.contentChannel && previewAsset.contentChannel.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Channels</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {previewAsset.contentChannel.map((channel: string) => (
                      <Badge key={channel} variant="outline">{channel}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {previewAsset.campaignPersona && previewAsset.campaignPersona.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Target Personas</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {previewAsset.campaignPersona.map((persona: string) => (
                      <Badge key={persona} variant="secondary">{persona}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {previewAsset.campaignStage && previewAsset.campaignStage.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Campaign Stages</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {previewAsset.campaignStage.map((stage: string) => (
                      <Badge key={stage} variant="secondary">{stage}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {previewAsset.campaignGoal && previewAsset.campaignGoal.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Campaign Goals</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {previewAsset.campaignGoal.map((goal: string) => (
                      <Badge key={goal} variant="secondary">{goal}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {previewAsset.fileUrl && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">File URL</label>
                  <p className="text-sm mt-1 text-blue-600 break-all">{previewAsset.fileUrl}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setPreviewAsset(null)} data-testid="button-close-preview">
                  Close
                </Button>
                {userTier === 'fully-stacked' && previewAsset.fileUrl && (
                  <Button variant="default" data-testid="button-download-preview">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
