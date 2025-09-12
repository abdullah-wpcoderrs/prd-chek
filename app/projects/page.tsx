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
import { DocumentViewer } from "@/components/DocumentViewer";
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
  Copy
} from "lucide-react";
import Link from "next/link";
import type { ProjectWithDocuments, DocumentRecord } from "@/lib/actions/project.actions";
import { deleteProject } from "@/lib/actions/project.actions";

const documentIcons = {
  "PRD": FileText,
  "User Stories": Users,
  "Sitemap": Map,
  "Tech Stack": Code,
  "Screens": Layout
};

const statusColors = {
  ready: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  processing: "bg-yellow-100 text-yellow-700",
  pending: "bg-gray-100 text-gray-700",
  failed: "bg-red-100 text-red-700"
};

export default function ProjectsPage() {
  const { projects, loading: projectsLoading, error } = useRealtimeProjects();
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
  } | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sign-in');
    }
  }, [user, authLoading, router]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDocument = (document: DocumentRecord) => {
    setViewerDocument({
      id: `${selectedProject}-${document.type}`,
      name: document.name,
      type: document.type,
      size: document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(1)} MB` : "Processing...",
      downloadUrl: document.download_url || `#download-${document.type}`
    });
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setViewerDocument(null);
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingProjectId(projectId);
    
    try {
      await deleteProject(projectId);
      toast({
        title: "Project deleted",
        description: `"${projectName}" has been successfully deleted.`,
        variant: "default",
      });
      
      // Clear selection if deleted project was selected
      if (selectedProject === projectId) {
        setSelectedProject(null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error deleting project",
        description: error instanceof Error ? error.message : "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingProjectId(null);
    }
  };

  const handleCopyProject = (project: ProjectWithDocuments) => {
    // For now, just copy the project details to clipboard
    const projectDetails = `Project: ${project.name}\nDescription: ${project.description}\nTech Stack: ${project.tech_stack}\nTarget Platform: ${project.target_platform}\nComplexity: ${project.complexity}`;
    navigator.clipboard.writeText(projectDetails);
    toast({
      title: "Project details copied",
      description: "Project information has been copied to your clipboard.",
      variant: "default",
    });
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
            {/* Projects List */}
            <div className="lg:col-span-2 space-y-6">
            {filteredProjects.map((project) => {
              const isProcessing = project.status === 'processing';
              
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
                          <Badge className={statusColors[project.status as keyof typeof statusColors] || statusColors.pending}>
                            {isProcessing && (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            )}
                            {project.status === 'completed' ? 'Completed' : 
                             project.status === 'processing' ? 'Processing' : 
                             project.status === 'failed' ? 'Failed' : 'Pending'}
                          </Badge>
                        </div>
                        
                        <CardDescription className="font-sans text-gray-600 mb-3">
                          {project.description}
                        </CardDescription>
                        
                        {/* Show progress for processing projects */}
                        {isProcessing && (
                          <div className="mb-3">
                            <div className="flex justify-between items-center text-sm mb-1">
                              <span className="font-medium text-gray-700 font-sans">Progress</span>
                              <span className="text-gray-600 font-sans">{project.progress}%</span>
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
                              e.stopPropagation();
                              handleCopyProject(project);
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement edit functionality
                              toast({
                                title: "Edit feature",
                                description: "Project editing will be available soon.",
                                variant: "default",
                              });
                            }}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id, project.name);
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
                    <div className="grid grid-cols-5 gap-2">
                      {project.documents.map((doc, index) => {
                        const IconComponent = documentIcons[doc.type as keyof typeof documentIcons];
                        return (
                          <div 
                            key={index}
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
                              {doc.type}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            </div>

            {/* Project Details Panel */}
            <div className="lg:col-span-1">
              {selectedProject ? (
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="font-sans">Project Documents</CardTitle>
                    <CardDescription className="font-sans">
                      {projects.find(p => p.id === selectedProject)?.name}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {projects.find(p => p.id === selectedProject)?.documents.map((doc, index) => {
                      const IconComponent = documentIcons[doc.type as keyof typeof documentIcons];
                      return (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-sm">
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-5 h-5 text-gray-600" />
                            <div>
                              <div className="font-medium text-sm font-sans">{doc.name}</div>
                              <div className="text-xs text-gray-500 font-sans">
                                {doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(1)} MB` : 'Processing...'}
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
                    })}
                    
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
    </>
  );
}