/**
 * View Audits - Pulse Hub
 * 
 * Features:
 * - Display all recent audits with pagination
 * - CRUD operations (View, Edit, Delete)
 * - Click audit to view full results
 * - Beautiful UI matching app design
 * - Filtering and search capabilities
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/stackwise-demo/components/ui/card";
import { Input } from "@/stackwise-demo/components/ui/input";
import { Badge } from "@/stackwise-demo/components/ui/badge";
import { ThreeColumnLayout } from "@/stackwise-demo/components/layouts/ThreeColumnLayout";
import { QuickActions } from "@/stackwise-demo/components/QuickActions";
import { useToast } from "@/stackwise-demo/hooks/use-toast";
import { queryClient } from "@/stackwise-demo/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/stackwise-demo/components/ui/dialog";
import {
  Globe,
  Search,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw,
  ExternalLink,
  FileText,
  Sparkles,
} from "lucide-react";

type AuditStatus = 'pending' | 'processing' | 'completed' | 'failed';

type Audit = {
  audit_id: number;
  audit_name: string;
  website_url: string;
  status: AuditStatus;
  overall_score?: number;
  performance_level?: string;
  grade?: string;
  topics_audited: string[];
  created_at: string;
  completed_at?: string;
};

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    label: "Completed"
  },
  processing: {
    icon: RefreshCw,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    label: "Processing"
  },
  pending: {
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    label: "Pending"
  },
  failed: {
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    label: "Failed"
  }
};

const gradeColors = {
  'A+': 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
  'A': 'bg-gradient-to-br from-emerald-500 to-green-600 text-white',
  'B+': 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white',
  'B': 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
  'C+': 'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
  'C': 'bg-gradient-to-br from-amber-500 to-amber-600 text-white',
  'D': 'bg-gradient-to-br from-red-500 to-rose-600 text-white',
  'F': 'bg-gradient-to-br from-red-600 to-rose-700 text-white',
};

export default function ViewAudits() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AuditStatus | "all">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [currentStep, setCurrentStep] = useState('view-audits');

  const moduleColor = '#6218df';
  const limit = 10;

  // Steps for navigation
  const steps = [
    { id: "start", label: "Audit", description: "Select topics" },
    { id: "view-audits", label: "View Audits", description: "Audit history" },
  ];

  // Handle step changes with navigation
  const handleStepChange = (stepId: string) => {
    if (stepId === "start") {
      // Navigate back to Audit page
      setLocation("/pulse-hub/audit");
    } else {
      setCurrentStep(stepId);
    }
  };

  // Fetch audits - get all for client-side filtering with auto-refresh
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['audits'],
    queryFn: async () => {
      console.log('[ViewAudits] Fetching all audits for filtering');
      const response = await fetch(`/api/audits?page=1&limit=1000`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ViewAudits] Failed to fetch audits:', response.status, errorText);
        throw new Error('Failed to fetch audits');
      }
      
      const result = await response.json();
      console.log('[ViewAudits] Audits fetched successfully:', result);
      return result as {
        success: boolean;
        audits: Audit[];
        pagination: PaginationInfo;
      };
    },
    refetchInterval: (query) => {
      // Auto-refresh every 3 seconds if there are processing/pending audits
      const hasActiveAudits = query.state.data?.audits?.some(
        (audit: Audit) => audit.status === 'processing' || audit.status === 'pending'
      );
      return hasActiveAudits ? 3000 : false;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (auditId: number) => {
      const response = await fetch(`/api/audits/${auditId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete audit');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Audit Deleted",
        description: "The audit has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      setDeleteDialogOpen(false);
      setSelectedAudit(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete audit. Please try again.",
        variant: "destructive",
      });
    },
  });

  const audits = data?.audits || [];

  // Filter audits based on search and status
  const filteredAudits = audits.filter(audit => {
    const matchesSearch = searchQuery.trim() === "" || 
      audit.audit_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.website_url.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || audit.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Client-side pagination
  const totalFiltered = filteredAudits.length;
  const totalPages = Math.ceil(totalFiltered / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedAudits = filteredAudits.slice(startIndex, endIndex);

  // Reset to page 1 when search or filter changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (status: AuditStatus | "all") => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleViewAudit = (audit: Audit) => {
    // Navigate to dedicated audit results page
    // Use native navigation to ensure query params are preserved
    window.location.href = `/stackwise-dashboard/pulse-hub/audit-results?id=${audit.audit_id}`;
  };

  const handleDeleteClick = (audit: Audit) => {
    setSelectedAudit(audit);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedAudit) {
      deleteMutation.mutate(selectedAudit.audit_id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const leftColumn = (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <FileText className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">Audit History</h2>
        </div>
        <p className="text-purple-100 text-sm">
          View and manage all your marketing audits
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Total Audits</span>
            </div>
            <Badge variant="secondary" className="bg-purple-600 text-white">
              {totalFiltered}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <Badge variant="secondary" className="bg-green-600 text-white">
              {audits.filter(a => a.status === 'completed').length}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Processing</span>
            </div>
            <Badge variant="secondary" className="bg-blue-600 text-white">
              {audits.filter(a => a.status === 'processing').length}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() => setLocation('/pulse-hub/audit')}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Create New Audit
          </Button>
          
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh List
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Check for active audits
  const processingAudits = audits.filter(a => a.status === 'processing');
  const pendingAudits = audits.filter(a => a.status === 'pending');
  const hasActiveAudits = processingAudits.length > 0 || pendingAudits.length > 0;

  const mainContent = (
    <div className="space-y-6">
      {/* Active Audits Banner */}
      {hasActiveAudits && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">
                  {processingAudits.length > 0 && `${processingAudits.length} audit${processingAudits.length > 1 ? 's' : ''} processing`}
                  {processingAudits.length > 0 && pendingAudits.length > 0 && ' • '}
                  {pendingAudits.length > 0 && `${pendingAudits.length} in queue`}
                </h3>
                <p className="text-sm text-blue-700">
                  This page will auto-refresh every 3 seconds while audits are active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            View Audits
          </h1>
          <p className="text-gray-600 mt-1">
            Browse and manage your marketing audit history
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by audit name or website..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => handleFilterChange("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "completed" ? "default" : "outline"}
                onClick={() => handleFilterChange("completed")}
                size="sm"
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === "processing" ? "default" : "outline"}
                onClick={() => handleFilterChange("processing")}
                size="sm"
              >
                Processing
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                onClick={() => handleFilterChange("pending")}
                size="sm"
              >
                Pending
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audits List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : filteredAudits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Audits Found</h3>
            <p className="text-gray-500 text-center mb-4">
              {searchQuery || statusFilter !== "all" 
                ? "Try adjusting your filters" 
                : "Get started by creating your first audit"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button
                onClick={() => setLocation('/pulse-hub/audit')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Create Your First Audit
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {paginatedAudits.map((audit) => {
            const StatusIcon = statusConfig[audit.status].icon;
            const gradeColor = audit.grade ? gradeColors[audit.grade as keyof typeof gradeColors] || 'bg-gray-500' : 'bg-gray-500';
            
            return (
              <Card
                key={audit.audit_id}
                className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500 cursor-pointer"
                onClick={() => handleViewAudit(audit)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Header */}
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {audit.audit_name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <a
                              href={audit.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-purple-600 hover:underline truncate"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {audit.website_url}
                            </a>
                            <ExternalLink className="h-3 w-3 text-gray-400" />
                          </div>
                        </div>

                        {/* Grade Badge */}
                        {audit.grade && (
                          <div className={`px-4 py-2 rounded-lg ${gradeColor} font-bold text-xl min-w-[60px] text-center`}>
                            {audit.grade}
                          </div>
                        )}
                      </div>

                      {/* Status and Score */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig[audit.status].bgColor}`}>
                          <StatusIcon className={`h-4 w-4 ${statusConfig[audit.status].color} ${audit.status === 'processing' ? 'animate-spin' : ''}`} />
                          <span className={`text-sm font-medium ${statusConfig[audit.status].color}`}>
                            {statusConfig[audit.status].label}
                          </span>
                        </div>

                        {audit.overall_score !== undefined && audit.overall_score !== null && (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-semibold text-purple-700">
                              Score: {audit.overall_score}/100
                            </span>
                          </div>
                        )}

                        {audit.performance_level && (
                          <Badge variant="outline" className="border-purple-300 text-purple-700">
                            {audit.performance_level}
                          </Badge>
                        )}
                      </div>

                      {/* Topics */}
                      {audit.topics_audited && audit.topics_audited.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-500 font-medium">Topics:</span>
                          {audit.topics_audited.slice(0, 3).map((topic, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {audit.topics_audited.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{audit.topics_audited.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Date */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created: {formatDate(audit.created_at)}</span>
                        </div>
                        {audit.completed_at && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            <span>Completed: {formatDate(audit.completed_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewAudit(audit);
                        }}
                        className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(audit);
                        }}
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing page {currentPage} of {totalPages} ({totalFiltered} total audits)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="min-w-[40px]"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Audit</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete <span className="font-semibold">{selectedAudit?.audit_name}</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone. All audit data will be permanently removed.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Delete Audit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <ThreeColumnLayout
      leftNav={null}
      steps={steps}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      content={
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-background pb-4 border-b px-8 pt-4">
            <QuickActions module="PulseHub" />
          </div>
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Stats */}
              <div className="lg:col-span-1">
                {leftColumn}
              </div>
              
              {/* Main Content - Audits List */}
              <div className="lg:col-span-3">
                {mainContent}
              </div>
            </div>
          </div>
        </div>
      }
      moduleColor={moduleColor}
      completedSteps={[]}
      featureName="View Audits"
    />
  );
}
