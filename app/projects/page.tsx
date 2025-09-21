"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentViewer } from "@/components/DocumentViewer";
import GenerationProgressV2 from "@/components/GenerationProgressV2";
import { useRealtimeProjects } from "@/lib/hooks/useRealtimeProjects";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";
import { 
  FileText, 
  Users, 
  Map, 
  Code, 
  Layout, 
  Download, 
  Eye, 
  MoreVertical,
  Calendar,
  Plus,
  Folder,
  Search,
  Filter,
  Loader2,
  Trash2,
  Edit3,
  Copy,
  Save,
  BarChart3,
  Target,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import type { ProjectWithDocuments, DocumentRecord } from "@/lib/actions/project.actions";
import { deleteProject, updateProject } from "@/lib/actions/project.actions";
import { formatFileSize } from "@/lib/utils/file-size";

// Updated document icons for new pipeline
const documentIcons = {
  // Legacy documents (for backward compatibility)
  "PRD": FileText,
  "User Stories": Users,
  "Sitemap": Map,
  "Tech Stack": Code,
  "Screens": Layout,
  
  // New document pipeline
  "Research_Insights": Search,
  "Vision_Strategy": Eye,
  "BRD": Users,
  "TRD": Code,
  "Planning_Toolkit": Layout
};

// Document stages for new pipeline
const documentStages = {
  discovery: {
    title: "Discovery & Research",
    color: "blue",
    documents: ["Research_Insights"]
  },
  strategy: {
    title: "Vision & Strategy", 
    color: "purple",
    documents: ["Vision_Strategy"]
  },
  planning: {
    title: "Requirements & Planning",
    color: "green", 
    documents: ["PRD", "BRD", "TRD", "Planning_Toolkit"]
  }
};

const statusColors = {
  ready: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  processing: "bg-yellow-100 text-yellow-700",
  pending: "bg-gray-100 text-gray-700",
  failed: "bg-red-100 text-red-700"
};

// Helper function to get document types for a project (V2 only)
const getProjectDocumentTypes = (project: ProjectWithDocuments) => {
  // All projects now use the enhanced 6-document pipeline
  return ['Research_Insights', 'Vision_Strategy', 'PRD', 'BRD', 'TRD', 'Planning_Toolkit'];
};

// Helper function to get document display info
const getDocumentDisplayInfo = (docType: string) => {
  const displayNames: Record<string, string> = {
    'Research_Insights': 'Research & Insights',
    'Vision_Strategy': 'Vision & Strategy',
    'BRD': 'Business Requirements',
    'TRD': 'Technical Requirements',
    'Planning_Toolkit': 'Planning Toolkit',
    'PRD': 'PRD',
    'User Stories': 'User Stories',
    'Sitemap': 'Sitemap',
    'Tech Stack': 'Tech Stack',
    'Screens': 'Screens'
  };
  
  return {
    name: displayNames[docType] || docType,
    icon: documentIcons[docType as keyof typeof documentIcons] || FileText
  };
};

export default function ProjectsPage() {
  const { projects, loading: projectsLoading, error, optimisticUpdate, optimisticDelete, refetch } = useRealtimeProjects();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [viewerDocument, setViewerDocument] = useState<{
    id: string;
    name: string;
    type: string;
    size: string;
    downloadUrl: string;
    createdAt?: string;
    documentId?: string;
  } | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ProjectWithDocuments | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    tech_stack: '',
    target_platform: ''
  });
  const [updatingProjectId, setUpdatingProjectId] = useState<string | null>(null);
  const [showProgressModal, setShowProgressModal] = useState<string | null>(null);
  // State to track which projects have expanded documents on mobile
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sign-in');
    }
  }, [user, authLoading, router]);

  // Auto-show progress modal for processing projects (when redirected from dashboard)
  useEffect(() => {
    if (projects.length > 0 && !showProgressModal) {
      const processingProject = projects.find(p => p.status === 'processing');
      if (processingProject) {
        // Auto-show progress for the most recent processing project
        const mostRecentProcessing = projects
          .filter(p => p.status === 'processing')
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        
        if (mostRecentProcessing) {
          setShowProgressModal(mostRecentProcessing.id);
        }
      }
    }
  }, [projects, showProgressModal]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDocument = (document: DocumentRecord) => {
    setViewerDocument({
      id: `${selectedProject}-${document.type}`,
      name: document.name,
      type: document.type,
      size: formatFileSize(document.file_size),
      downloadUrl: document.download_url || `#download-${document.type}`,
      createdAt: document.created_at,
      documentId: document.id // Pass the actual document ID for content fetching
    });
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setViewerDocument(null);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete || deletingProjectId) return;

    const projectIdToDelete = projectToDelete.id;
    const projectNameToDelete = projectToDelete.name;
    
    setDeletingProjectId(projectIdToDelete);
    
    try {
      console.log('Starting project deletion:', projectIdToDelete);
      
      // Perform the actual deletion
      await deleteProject(projectIdToDelete);
      
      console.log('Project deletion completed, refreshing page...');
      
      // Simple approach: just refresh the page after successful deletion
      // This ensures no state conflicts or UI freezing
      window.location.reload();
      
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error deleting project",
        description: error instanceof Error ? error.message : "Failed to delete project. Please try again.",
        variant: "destructive",
      });
      
      setDeletingProjectId(null);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const openDeleteDialog = (projectId: string, projectName: string) => {
    setProjectToDelete({ id: projectId, name: projectName });
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (project: ProjectWithDocuments) => {
    setProjectToEdit(project);
    setEditForm({
      name: project.name,
      description: project.description || '',
      tech_stack: project.tech_stack,
      target_platform: project.target_platform,
      // complexity: project.complexity // Removed as complexity field no longer exists
    });
    setEditDialogOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!projectToEdit) return;

    setUpdatingProjectId(projectToEdit.id);
    
    try {
      await updateProject(projectToEdit.id, editForm);
      toast({
        title: "Project updated",
        description: `"${editForm.name}" has been successfully updated.`,
        variant: "default",
      });
      
      setEditDialogOpen(false);
      setProjectToEdit(null);
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error updating project",
        description: error instanceof Error ? error.message : "Failed to update project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingProjectId(null);
    }
  };

  const handleCopyProject = (project: ProjectWithDocuments) => {
    // For now, just copy the project details to clipboard
    const projectDetails = `Project: ${project.name}
Description: ${project.description}
Tech Stack: ${project.tech_stack}
Target Platform: ${project.target_platform}`;
    navigator.clipboard.writeText(projectDetails);
    toast({
      title: "Project details copied",
      description: "Project information has been copied to your clipboard.",
      variant: "default",
    });
  };

  // Toggle document expansion for a project on mobile
  const toggleProjectDocuments = (projectId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // Show loading state while checking authentication or loading projects
  if (authLoading || projectsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600 font-sans">
            {authLoading ? 'Checking authentication...' : 'Loading your projects...'}
          </p>
        </div>
      </div>
    );
  }

  // Don't render the page if user is not authenticated
  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sans">Error Loading Projects</h3>
          <p className="text-gray-600 mb-4 font-sans">{error}</p>
          <Button onClick={() => window.location.reload()} className="font-sans">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 font-sans">My Projects</h1>
              <p className="text-lg text-gray-600 mt-2 font-sans">
                Manage your generated documentation projects
              </p>
            </div>
            
            <Link href="/dashboard">
              <Button className="text-white font-sans" style={{backgroundColor: 'var(--steel-blue-600)'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-700)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-600)'}>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm font-sans focus:outline-none"
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--steel-blue-500)';
                  e.target.style.boxShadow = '0 0 0 2px var(--steel-blue-200)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <Button variant="outline" className="font-sans">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Projects Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Projects List - Full width on mobile, 2/3 on desktop */}
            <div className="lg:col-span-3 xl:col-span-2 space-y-6">
            {filteredProjects.map((project) => {
              const isProcessing = project.status === 'processing';
              const isExpanded = expandedProjects[project.id];
              
              return (
                <Card 
                  key={project.id} 
                  className={`cursor-pointer transition-all hover:shadow-sm ${
                    selectedProject === project.id ? 'border-opacity-100 shadow-sm' : ''
                  } border-2`}
                  style={selectedProject === project.id ? {borderColor: 'var(--steel-blue-500)'} : {}}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="font-sans text-xl">{project.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={statusColors[project.status as keyof typeof statusColors] || statusColors.pending}>
                              {isProcessing && (
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              )}
                              {project.status === 'completed' ? 'Completed' : 
                               project.status === 'processing' ? 'Processing' : 
                               project.status === 'failed' ? 'Failed' : 'Pending'}
                            </Badge>
                            {/* All projects are now enhanced V2 */}
                          </div>
                        </div>
                        
                        <CardDescription className="font-sans text-gray-600 mb-3">
                          {project.description}
                        </CardDescription>
                        
                        {/* Show progress for processing projects */}
                        {isProcessing && (
                          <div className="mb-3">
                            <div className="flex justify-between items-center text-sm mb-1">
                              <span className="font-medium text-gray-700 font-sans">Progress</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 font-sans">{project.progress}%</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowProgressModal(project.id);
                                  }}
                                  className="text-xs px-2 py-1 h-6 font-sans"
                                >
                                  <BarChart3 className="w-3 h-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-300" 
                                style={{
                                  backgroundColor: 'var(--steel-blue-600)',
                                  width: `${project.progress}%`
                                }}
                              />
                            </div>
                            {project.current_step && (
                              <p className="text-xs text-gray-500 mt-1 font-sans">
                                {project.current_step}
                              </p>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 font-sans">
                          <div className="flex items-center gap-1">
                            <Code className="w-4 h-4" />
                            {project.tech_stack}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(project.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={deletingProjectId === project.id}
                            onClick={(e) => e.stopPropagation()} // Prevent card selection
                          >
                            {deletingProjectId === project.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <MoreVertical className="w-4 h-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleCopyProject(project);
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openEditDialog(project);
                            }}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openDeleteDialog(project.id, project.name);
                            }}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            disabled={deletingProjectId === project.id}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {getProjectDocumentTypes(project).map((docType) => {
                        const doc = project.documents.find(d => d.type === docType);
                        const displayInfo = getDocumentDisplayInfo(docType);
                        const IconComponent = displayInfo.icon;
                        
                        // If document doesn't exist, show placeholder
                        if (!doc) {
                          return (
                            <div 
                              key={docType}
                              className="p-3 rounded-sm border-2 text-center border-gray-200 bg-gray-50"
                            >
                              <IconComponent className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                              <div className="text-xs font-medium text-gray-700 font-sans">
                                {displayInfo.name}
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <div 
                            key={docType}
                            className={`p-3 rounded-sm border-2 text-center relative ${
                              doc.status === 'ready' || doc.status === 'completed' ? 'border-green-200 bg-green-50' :
                              doc.status === 'processing' ? 'border-yellow-200 bg-yellow-50' :
                              'border-gray-200 bg-gray-50'
                            }`}
                          >
                            {doc.status === 'processing' && (
                              <div className="absolute top-1 right-1">
                                <Loader2 className="w-3 h-3 animate-spin text-yellow-600" />
                              </div>
                            )}
                            <IconComponent className={`w-6 h-6 mx-auto mb-1 ${
                              doc.status === 'ready' || doc.status === 'completed' ? 'text-green-600' :
                              doc.status === 'processing' ? 'text-yellow-600' :
                              'text-gray-400'
                            }`} />
                            <div className="text-xs font-medium text-gray-700 font-sans">
                              {displayInfo.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Mobile document details section - hidden on desktop, shown on mobile when expanded */}
                    <div className="lg:hidden mt-4 border-t pt-4">
                      <Button 
                        variant="ghost" 
                        className="w-full flex items-center justify-between p-0 h-auto font-sans hover:bg-orange-100 text-orange-600 hover:text-orange-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProjectDocuments(project.id);
                        }}
                      >
                        <span className="font-medium">
                          {isExpanded ? "Hide Documents" : "Show Documents"}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 ml-2 text-orange-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-2 text-orange-600" />
                        )}
                      </Button>
                      
                      {isExpanded && (
                        <div className="mt-4 space-y-3">
                          {(() => {
                            const selectedProjectData = projects.find(p => p.id === project.id);
                            if (!selectedProjectData) return null;
                            
                            return getProjectDocumentTypes(selectedProjectData).map((docType) => {
                              const doc = selectedProjectData.documents.find(d => d.type === docType);
                              const displayInfo = getDocumentDisplayInfo(docType);
                              const IconComponent = displayInfo.icon;
                            
                            // If document doesn't exist, show placeholder
                            if (!doc) {
                              return (
                                <div key={docType} className="flex items-center justify-between p-3 border rounded-sm bg-gray-50">
                                  <div className="flex items-center gap-3">
                                    <IconComponent className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <div className="font-medium text-sm font-sans text-gray-500">{displayInfo.name}</div>
                                      <div className="text-xs text-gray-400 font-sans">Not available</div>
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-400 font-sans">Pending</span>
                                </div>
                              );
                            }
                            
                            return (
                              <div key={docType} className="flex items-center justify-between p-3 border rounded-sm">
                                <div className="flex items-center gap-3">
                                  <IconComponent className="w-5 h-5 text-gray-600" />
                                  <div>
                                    <div className="font-medium text-sm font-sans">{doc.name}</div>
                                    <div className="text-xs text-gray-500 font-sans">
                                      {formatFileSize(doc.file_size)}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex gap-1">
                                  {(doc.status === 'ready' || doc.status === 'completed') && (
                                    <>
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className="p-1 h-auto"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleViewDocument(doc);
                                        }}
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className="p-1 h-auto"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle download
                                        }}
                                      >
                                        <Download className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                  {doc.status === 'processing' && (
                                    <div className="flex items-center gap-2">
                                      <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
                                      <span className="text-xs text-yellow-600 font-sans">Processing</span>
                                    </div>
                                  )}
                                  {doc.status === 'pending' && (
                                    <span className="text-xs text-gray-500 font-sans">Waiting</span>
                                  )}
                                </div>
                              </div>
                            );
                          });
                          })()}
                          
                          <div className="pt-2">
                            <Button 
                              className="w-full text-white font-sans" 
                              disabled={project.status !== 'completed'}
                              style={{backgroundColor: 'var(--steel-blue-600)'}} 
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-700)'} 
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-600)'}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle download all
                              }}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download All Documents
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            </div>

            {/* Project Details Panel - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block lg:col-span-1">
              {selectedProject ? (
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="font-sans">Project Documents</CardTitle>
                    <CardDescription className="font-sans">
                      {projects.find(p => p.id === selectedProject)?.name}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-600 font-sans">
                      <div className="font-medium mb-1">Project Details:</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div><span className="font-medium">Tech Stack:</span> {projects.find(p => p.id === selectedProject)?.tech_stack}</div>
                        <div><span className="font-medium">Target Platform:</span> {projects.find(p => p.id === selectedProject)?.target_platform}</div>
                      </div>
                    </div>
                    
                    {(() => {
                      const selectedProjectData = projects.find(p => p.id === selectedProject);
                      if (!selectedProjectData) return null;
                      
                      return getProjectDocumentTypes(selectedProjectData).map((docType) => {
                        const doc = selectedProjectData.documents.find(d => d.type === docType);
                        const displayInfo = getDocumentDisplayInfo(docType);
                        const IconComponent = displayInfo.icon;
                      
                      // If document doesn't exist, show placeholder
                      if (!doc) {
                        return (
                          <div key={docType} className="flex items-center justify-between p-3 border rounded-sm bg-gray-50">
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="font-medium text-sm font-sans text-gray-500">{displayInfo.name}</div>
                                <div className="text-xs text-gray-400 font-sans">Not available</div>
                              </div>
                            </div>
                            <span className="text-xs text-gray-400 font-sans">Pending</span>
                          </div>
                        );
                      }
                      
                      return (
                        <div key={docType} className="flex items-center justify-between p-3 border rounded-sm">
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-5 h-5 text-gray-600" />
                            <div>
                              <div className="font-medium text-sm font-sans">{doc.name}</div>
                              <div className="text-xs text-gray-500 font-sans">
                                {formatFileSize(doc.file_size)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            {(doc.status === 'ready' || doc.status === 'completed') && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="p-1 h-auto"
                                  onClick={() => handleViewDocument(doc)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="p-1 h-auto">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {doc.status === 'processing' && (
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
                                <span className="text-xs text-yellow-600 font-sans">Processing</span>
                              </div>
                            )}
                            {doc.status === 'pending' && (
                              <span className="text-xs text-gray-500 font-sans">Waiting</span>
                            )}
                          </div>
                        </div>
                      );
                    });
                    })()}
                    
                    <div className="pt-4">
                      <Button 
                        className="w-full text-white font-sans" 
                        disabled={projects.find(p => p.id === selectedProject)?.status !== 'completed'}
                        style={{backgroundColor: 'var(--steel-blue-600)'}} 
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-700)'} 
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-600)'}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download All Documents
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="sticky top-24">
                  <CardContent className="p-8 text-center">
                    <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
                      Select a Project
                    </h3>
                    <p className="text-gray-600 font-sans">
                      Click on a project to view its documents and details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sans">
                {searchTerm ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-gray-600 mb-6 font-sans">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Create your first project to get started with documentation generation'
                }
              </p>
              {!searchTerm && (
                <Link href="/dashboard">
                  <Button className="text-white font-sans" style={{backgroundColor: 'var(--steel-blue-600)'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-700)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-600)'}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Project
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Document Viewer */}
      {viewerDocument && (
        <DocumentViewer
          document={viewerDocument}
          isOpen={isViewerOpen}
          onClose={handleCloseViewer}
        />
      )}

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-sans">Edit Project</DialogTitle>
            <DialogDescription className="font-sans">
              Update your project details. Note: This will not regenerate documents.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="font-sans font-medium">
                Project Name *
              </Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter project name"
                className="font-sans"
                disabled={!!updatingProjectId}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="font-sans font-medium">
                Description *
              </Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project..."
                className="min-h-[100px] font-sans"
                disabled={!!updatingProjectId}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tech-stack" className="font-sans font-medium">
                  Tech Stack
                </Label>
                <Input
                  id="edit-tech-stack"
                  value={editForm.tech_stack}
                  onChange={(e) => setEditForm(prev => ({ ...prev, tech_stack: e.target.value }))}
                  className="font-sans"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-target-platform" className="font-sans font-medium">
                  Target Platform
                </Label>
                <Input
                  id="edit-target-platform"
                  value={editForm.target_platform}
                  onChange={(e) => setEditForm(prev => ({ ...prev, target_platform: e.target.value }))}
                  className="font-sans"
                />
              </div>
              

            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setProjectToEdit(null);
              }}
              disabled={!!updatingProjectId}
              className="font-sans"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateProject}
              disabled={!!updatingProjectId || !editForm.name.trim() || !editForm.description.trim()}
              className="font-sans"
              style={{backgroundColor: 'var(--steel-blue-600)'}} 
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-700)'} 
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-600)'}
            >
              {updatingProjectId ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-sans">Delete Project</DialogTitle>
            <DialogDescription className="font-sans">
              Are you sure you want to delete <span className="font-semibold">"{projectToDelete?.name}"</span>? 
              This action cannot be undone and will permanently remove all associated documents.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setProjectToDelete(null);
              }}
              disabled={!!deletingProjectId}
              className="font-sans"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteProject}
              disabled={!!deletingProjectId}
              className="font-sans"
            >
              {deletingProjectId ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Progress Modal */}
      {showProgressModal && (
        <GenerationProgressV2
          projectId={showProgressModal}
          onComplete={(projectId) => {
            setShowProgressModal(null);
            toast({
              title: "Generation Complete!",
              description: "Your documentation suite has been generated successfully.",
              variant: "default",
            });
          }}
          onCancel={() => {
            setShowProgressModal(null);
          }}
          onClickOutside={() => {
            setShowProgressModal(null);
          }}
        />
      )}
    </>
  );
}