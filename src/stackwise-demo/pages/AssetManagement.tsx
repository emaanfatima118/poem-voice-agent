import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/stackwise-demo/components/ui/card";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Checkbox } from "@/stackwise-demo/components/ui/checkbox";
import { Label } from "@/stackwise-demo/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/stackwise-demo/components/ui/tabs";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/stackwise-demo/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/stackwise-demo/components/ui/select";
import { 
  Search, 
  UploadCloud, 
  Image as ImageIcon, 
  FileText, 
  Download, 
  Edit2, 
  Archive, 
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  Save,
  X
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/stackwise-demo/lib/queryClient";
import { useToast } from "@/stackwise-demo/hooks/use-toast";
import type { Asset, InsertAsset } from "@shared/schema";

// Filter configuration matching screenshot
const FILTER_CONFIG = {
  Reports: {
    options: ["Budget", "Reviews", "Packages"],
    subOptions: {
      Reviews: ["Quarterly", "Annual", "Strategy"],
      Packages: ["Insights & Analysis", "Manifesto"]
    }
  },
  Campaigns: {
    options: ["Name", "Persona", "Stage", "Goal", "Pillar"],
    subOptions: {
      Persona: ["CFO", "CMO"],
      Stage: ["Awareness", "Conversion"],
      Goal: ["Lead Gen", "Brand Awareness"],
      Pillar: {
        P1: ["Sub 1", "Sub 2", "Sub 3"],
        P2: ["Sub 1", "Sub 2", "Sub 3"],
        P3: ["Sub 1", "Sub 2", "Sub 3"]
      }
    }
  },
  Exec: {
    options: ["Name", "Pillar"],
    subOptions: {
      Name: ["Jen", "Sarah", "Mason"],
      Pillar: {
        P1: ["Sub 1", "Sub 2", "Sub 3"],
        P2: ["Sub 1", "Sub 2", "Sub 3"],
        P3: ["Sub 1", "Sub 2", "Sub 3"]
      }
    }
  },
  Content: {
    options: ["Type", "Channel"],
    subOptions: {
      Type: ["Display Ad", "Blog", "Email", "PDF"],
      Channel: ["LinkedIn", "Instagram", "Programmatic"]
    }
  },
  Stack: {
    options: ["Category A", "Category B", "Category C"],
    subOptions: {}
  },
  Module: {
    options: ["Strategy Studio", "Pulse Hub", "Brand Craft", "Flight Deck"],
    subOptions: {
      "Strategy Studio": ["F1", "F2", "F3", "F4", "F5", "F6", "F7"],
      "Pulse Hub": ["F1", "F2", "F3", "F4", "F5", "F6", "F7"],
      "Brand Craft": ["F1", "F2", "F3", "F4", "F5", "F6", "F7"],
      "Flight Deck": ["F1", "F2", "F3", "F4", "F5", "F6", "F7"]
    }
  },
  "Asset Status": {
    options: ["Active", "Archived", "Draft"],
    subOptions: {}
  }
};

export default function AssetManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("stacked");
  const [searchQuery, setSearchQuery] = useState("");
  const [topBarTab, setTopBarTab] = useState<"search" | "my-plays" | "recently-used" | "saved-views">("search");
  
  // Filter state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  
  // Asset management state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [dragOver, setDragOver] = useState(false);
  
  // New asset form
  const [newAsset, setNewAsset] = useState<Partial<InsertAsset>>({
    name: "",
    description: "",
    assetStatus: "active"
  });

  // Fetch assets
  const { data: assets = [], isLoading } = useQuery<Asset[]>({
    queryKey: ['/api/assets', selectedFilters, searchQuery],
  });

  // Fetch recently viewed
  const { data: recentlyViewed = [] } = useQuery<Asset[]>({
    queryKey: ['/api/assets/recent'],
    enabled: topBarTab === 'recently-used'
  });

  // Create/update asset mutation
  const saveAssetMutation = useMutation({
    mutationFn: async (data: Partial<InsertAsset>) => {
      if (editingAsset) {
        return await apiRequest('PATCH', `/api/assets/${editingAsset.id}`, data);
      }
      return await apiRequest('POST', '/api/assets', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      toast({
        title: editingAsset ? 'Asset Updated' : 'Asset Created',
        description: `Asset ${editingAsset ? 'updated' : 'created'} successfully.`
      });
      setShowAddDialog(false);
      setEditingAsset(null);
      setNewAsset({ name: "", description: "", assetStatus: "active" });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save asset',
        variant: 'destructive'
      });
    }
  });

  // Archive asset mutation
  const archiveAssetMutation = useMutation({
    mutationFn: async (assetId: string) => {
      return await apiRequest('PATCH', `/api/assets/${assetId}`, { assetStatus: 'archived' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      toast({
        title: 'Asset Archived',
        description: 'Asset moved to archive.'
      });
    }
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterChange = (category: string, option: string, value: any) => {
    setSelectedFilters(prev => {
      const categoryKey = category.toLowerCase().replace(/\s+/g, '');
      const newFilters = { ...prev };
      
      if (!newFilters[categoryKey]) {
        newFilters[categoryKey] = {};
      }
      
      newFilters[categoryKey][option] = value;
      
      // Track pillar selection for sub-topics
      if (option === 'Pillar') {
        setSelectedPillar(value);
      }
      
      return newFilters;
    });
  };

  const clearFilters = () => {
    setSelectedFilters({});
    setSelectedPillar(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In real app, upload to storage and get URL
      const fakeUrl = URL.createObjectURL(file);
      setNewAsset(prev => ({
        ...prev,
        fileUrl: fakeUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        thumbnailUrl: file.type.startsWith('image/') ? fakeUrl : undefined
      }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setNewAsset(prev => ({
        ...prev,
        fileUrl: fakeUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        thumbnailUrl: file.type.startsWith('image/') ? fakeUrl : undefined
      }));
    }
  };

  const handleSaveAsset = () => {
    if (!newAsset.name) {
      toast({
        title: 'Validation Error',
        description: 'Asset name is required',
        variant: 'destructive'
      });
      return;
    }
    saveAssetMutation.mutate(newAsset);
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="w-full h-full text-muted-foreground" />;
    if (fileType.startsWith('image/')) return <ImageIcon className="w-full h-full text-muted-foreground" />;
    return <FileText className="w-full h-full text-muted-foreground" />;
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">Asset Management</h1>
        <p className="text-sm text-muted-foreground">
          Centralized digital asset management and Stack Navigator
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b px-4">
            <TabsList className="grid grid-cols-2 w-80">
              <TabsTrigger value="stacked" data-testid="tab-stacked">Stacked</TabsTrigger>
              <TabsTrigger value="fully-stacked" data-testid="tab-fully-stacked">Fully Stacked</TabsTrigger>
            </TabsList>
          </div>

          {/* Stacked Tab */}
          <TabsContent value="stacked" className="flex-1 overflow-hidden m-0">
            <div className="h-full flex">
              {/* Left Filter Panel */}
              <div className="w-80 border-r p-4 overflow-y-auto space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={clearFilters}
                  data-testid="button-clear-filters"
                >
                  Clear All
                </Button>

                {Object.entries(FILTER_CONFIG).map(([section, config]) => (
                  <Card key={section}>
                    <CardHeader className="p-3">
                      <button
                        onClick={() => toggleSection(section)}
                        className="flex items-center justify-between w-full text-left"
                        data-testid={`button-filter-${section.toLowerCase()}`}
                      >
                        <CardTitle className="text-sm font-semibold">{section}</CardTitle>
                        {expandedSections[section] ? 
                          <ChevronDown className="w-4 h-4" /> : 
                          <ChevronRight className="w-4 h-4" />
                        }
                      </button>
                    </CardHeader>
                    {expandedSections[section] && (
                      <CardContent className="p-3 pt-0 space-y-2">
                        {config.options.map((option) => (
                          <div key={option} className="space-y-1">
                            <label className="flex items-center gap-2 text-sm cursor-pointer hover-elevate p-1 rounded">
                              <Checkbox 
                                data-testid={`checkbox-${section}-${option}`.toLowerCase().replace(/\s+/g, '-')}
                              />
                              {option}
                            </label>
                            
                            {/* Sub-options - only show if relevant */}
                            {(config.subOptions as any)[option] && (
                              <div className="ml-6 space-y-1">
                                {Array.isArray((config.subOptions as any)[option]) ? (
                                  ((config.subOptions as any)[option] as string[]).map((sub: string) => (
                                    <label key={sub} className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover-elevate p-1 rounded">
                                      <Checkbox />
                                      {sub}
                                    </label>
                                  ))
                                ) : (
                                  // Pillar with sub-topics
                                  Object.entries((config.subOptions as any)[option] as Record<string, string[]>).map(([pillar, subs]) => (
                                    <div key={pillar} className="space-y-1">
                                      <label className="flex items-center gap-2 text-xs font-medium cursor-pointer hover-elevate p-1 rounded">
                                        <Checkbox 
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              handleFilterChange(section, option, pillar);
                                            } else {
                                              setSelectedPillar(null);
                                            }
                                          }}
                                        />
                                        {pillar}
                                      </label>
                                      {/* Only show sub-topics if this pillar is selected */}
                                      {selectedPillar === pillar && (
                                        <div className="ml-4 space-y-1">
                                          {subs.map((sub) => (
                                            <label key={sub} className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover-elevate p-1 rounded">
                                              <Checkbox />
                                              {sub}
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>

              {/* Right Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar with Tabs */}
                <div className="border-b p-4 space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      variant={topBarTab === 'search' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setTopBarTab('search')}
                      data-testid="button-tab-search"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                    <Button 
                      variant={topBarTab === 'my-plays' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setTopBarTab('my-plays')}
                      data-testid="button-tab-my-plays"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      My Plays
                    </Button>
                    <Button 
                      variant={topBarTab === 'recently-used' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setTopBarTab('recently-used')}
                      data-testid="button-tab-recently-used"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Recently Used
                    </Button>
                    <Button 
                      variant={topBarTab === 'saved-views' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setTopBarTab('saved-views')}
                      data-testid="button-tab-saved-views"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Saved Views
                    </Button>
                  </div>

                  {topBarTab === 'search' && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search assets, campaigns, executives..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        data-testid="input-search"
                      />
                    </div>
                  )}
                </div>

                {/* Asset Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {isLoading ? (
                      <div className="col-span-3 text-center text-muted-foreground py-12">
                        Loading assets...
                      </div>
                    ) : assets.length === 0 ? (
                      <div className="col-span-3 text-center text-muted-foreground py-12">
                        <p className="text-lg mb-2">No assets found</p>
                        <p className="text-sm">Adjust your filters or upgrade to Fully Stacked to add assets</p>
                      </div>
                    ) : (
                      assets.map((asset) => (
                        <Card key={asset.id} className="hover-elevate" data-testid={`asset-card-${asset.id}`}>
                          <CardContent className="p-4">
                            <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
                              {asset.thumbnailUrl ? (
                                <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-16 h-16">
                                  {getFileIcon(asset.fileType || undefined)}
                                </div>
                              )}
                            </div>
                            <h3 className="font-medium text-sm mb-1 truncate">{asset.name}</h3>
                            {asset.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{asset.description}</p>
                            )}
                            {asset.contentType && asset.contentType.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {asset.contentType.slice(0, 2).map((type, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">{type}</Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>

                  {assets.length > 0 && (
                    <div className="mt-8 text-center">
                      <Button 
                        variant="default" 
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-cyan-600"
                        data-testid="button-upgrade"
                      >
                        Upgrade to Fully Stacked for Edit, Download & More
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Fully Stacked Tab */}
          <TabsContent value="fully-stacked" className="flex-1 overflow-hidden m-0">
            <div className="h-full flex">
              {/* Left Filter Panel (same as Stacked) */}
              <div className="w-80 border-r p-4 overflow-y-auto space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={clearFilters}
                  data-testid="button-clear-filters-fully"
                >
                  Clear All
                </Button>

                {Object.entries(FILTER_CONFIG).map(([section, config]) => (
                  <Card key={section}>
                    <CardHeader className="p-3">
                      <button
                        onClick={() => toggleSection(section)}
                        className="flex items-center justify-between w-full text-left"
                        data-testid={`button-filter-fully-${section.toLowerCase()}`}
                      >
                        <CardTitle className="text-sm font-semibold">{section}</CardTitle>
                        {expandedSections[section] ? 
                          <ChevronDown className="w-4 h-4" /> : 
                          <ChevronRight className="w-4 h-4" />
                        }
                      </button>
                    </CardHeader>
                    {expandedSections[section] && (
                      <CardContent className="p-3 pt-0 space-y-2">
                        {config.options.map((option) => (
                          <div key={option} className="space-y-1">
                            <label className="flex items-center gap-2 text-sm cursor-pointer hover-elevate p-1 rounded">
                              <Checkbox />
                              {option}
                            </label>
                            
                            {(config.subOptions as any)[option] && (
                              <div className="ml-6 space-y-1">
                                {Array.isArray((config.subOptions as any)[option]) ? (
                                  ((config.subOptions as any)[option] as string[]).map((sub: string) => (
                                    <label key={sub} className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover-elevate p-1 rounded">
                                      <Checkbox />
                                      {sub}
                                    </label>
                                  ))
                                ) : (
                                  Object.entries((config.subOptions as any)[option] as Record<string, string[]>).map(([pillar, subs]) => (
                                    <div key={pillar} className="space-y-1">
                                      <label className="flex items-center gap-2 text-xs font-medium cursor-pointer hover-elevate p-1 rounded">
                                        <Checkbox 
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              handleFilterChange(section, option, pillar);
                                            } else {
                                              setSelectedPillar(null);
                                            }
                                          }}
                                        />
                                        {pillar}
                                      </label>
                                      {selectedPillar === pillar && (
                                        <div className="ml-4 space-y-1">
                                          {subs.map((sub) => (
                                            <label key={sub} className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover-elevate p-1 rounded">
                                              <Checkbox />
                                              {sub}
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>

              {/* Right Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <div className="border-b p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button 
                        variant={topBarTab === 'search' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setTopBarTab('search')}
                        data-testid="button-tab-search-fully"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </Button>
                      <Button 
                        variant={topBarTab === 'my-plays' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setTopBarTab('my-plays')}
                        data-testid="button-tab-my-plays-fully"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        My Plays
                      </Button>
                      <Button 
                        variant={topBarTab === 'recently-used' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setTopBarTab('recently-used')}
                        data-testid="button-tab-recently-used-fully"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Recently Used
                      </Button>
                      <Button 
                        variant={topBarTab === 'saved-views' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setTopBarTab('saved-views')}
                        data-testid="button-tab-saved-views-fully"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Saved Views
                      </Button>
                    </div>

                    <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-new">
                      Add New
                    </Button>
                  </div>

                  {topBarTab === 'search' && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search assets, campaigns, executives..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        data-testid="input-search-fully"
                      />
                    </div>
                  )}
                </div>

                {/* Asset Grid with Full Controls */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {isLoading ? (
                      <div className="col-span-3 text-center text-muted-foreground py-12">
                        Loading assets...
                      </div>
                    ) : assets.length === 0 ? (
                      <div className="col-span-3 text-center text-muted-foreground py-12">
                        <p className="text-lg mb-2">No assets yet</p>
                        <p className="text-sm mb-4">Get started by adding your first asset</p>
                        <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-first">
                          Add New Asset
                        </Button>
                      </div>
                    ) : (
                      assets.map((asset) => (
                        <Card key={asset.id} className="hover-elevate" data-testid={`asset-card-fully-${asset.id}`}>
                          <CardContent className="p-4">
                            <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
                              {asset.thumbnailUrl ? (
                                <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-16 h-16">
                                  {getFileIcon(asset.fileType || undefined)}
                                </div>
                              )}
                            </div>
                            <h3 className="font-medium text-sm mb-1 truncate">{asset.name}</h3>
                            {asset.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{asset.description}</p>
                            )}
                            {asset.contentType && asset.contentType.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {asset.contentType.slice(0, 2).map((type, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">{type}</Badge>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-1">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setEditingAsset(asset);
                                  setNewAsset(asset);
                                  setShowAddDialog(true);
                                }}
                                data-testid={`button-edit-${asset.id}`}
                              >
                                <Edit2 className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                data-testid={`button-download-${asset.id}`}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => archiveAssetMutation.mutate(asset.id)}
                                data-testid={`button-archive-${asset.id}`}
                              >
                                <Archive className="w-3 h-3 mr-1" />
                                Archive
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                data-testid={`button-versions-${asset.id}`}
                              >
                                View Versions
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Asset Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) {
          setEditingAsset(null);
          setNewAsset({ name: "", description: "", assetStatus: "active" });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
            <DialogDescription>
              Upload and categorize your asset for easy discovery
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* File Upload */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <UploadCloud className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-2">Drag and drop or click to upload</p>
              <Input
                type="file"
                onChange={handleFileUpload}
                className="max-w-xs mx-auto"
                data-testid="input-file-upload"
              />
              {newAsset.thumbnailUrl && (
                <div className="mt-4">
                  <img 
                    src={newAsset.thumbnailUrl} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover mx-auto rounded-md border" 
                  />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-3">
              <div>
                <Label>Asset Name *</Label>
                <Input
                  placeholder="Enter asset name"
                  value={newAsset.name || ''}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
                  data-testid="input-asset-name"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  placeholder="Brief description"
                  value={newAsset.description || ''}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, description: e.target.value }))}
                  data-testid="input-asset-description"
                />
              </div>
            </div>

            {/* Content Type & Channel (Multi-select) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Content Type</Label>
                <Select
                  value={newAsset.contentType?.[0] || ''}
                  onValueChange={(value) => setNewAsset(prev => ({ 
                    ...prev, 
                    contentType: [value] 
                  }))}
                >
                  <SelectTrigger data-testid="select-content-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Display Ad">Display Ad</SelectItem>
                    <SelectItem value="Blog">Blog</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Channel</Label>
                <Select
                  value={newAsset.contentChannel?.[0] || ''}
                  onValueChange={(value) => setNewAsset(prev => ({ 
                    ...prev, 
                    contentChannel: [value] 
                  }))}
                >
                  <SelectTrigger data-testid="select-channel">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Programmatic">Programmatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Module</Label>
                <Select
                  value={newAsset.module || ''}
                  onValueChange={(value) => setNewAsset(prev => ({ ...prev, module: value }))}
                >
                  <SelectTrigger data-testid="select-module">
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Strategy Studio">Strategy Studio</SelectItem>
                    <SelectItem value="Pulse Hub">Pulse Hub</SelectItem>
                    <SelectItem value="Brand Craft">Brand Craft</SelectItem>
                    <SelectItem value="Flight Deck">Flight Deck</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Campaign Pillar</Label>
                <Select
                  value={newAsset.campaignPillar || ''}
                  onValueChange={(value) => setNewAsset(prev => ({ ...prev, campaignPillar: value }))}
                >
                  <SelectTrigger data-testid="select-campaign-pillar">
                    <SelectValue placeholder="Select pillar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P1">P1</SelectItem>
                    <SelectItem value="P2">P2</SelectItem>
                    <SelectItem value="P3">P3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddDialog(false);
                setEditingAsset(null);
                setNewAsset({ name: "", description: "", assetStatus: "active" });
              }}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveAsset}
              disabled={saveAssetMutation.isPending}
              data-testid="button-save-asset"
            >
              {saveAssetMutation.isPending ? 'Saving...' : editingAsset ? 'Update Asset' : 'Save Asset'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
