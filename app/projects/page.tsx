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

import { DocumentViewer } from "@/components/DocumentViewer";
import GenerationProgressV2 from "@/components/GenerationProgressV2";
import { useRealtimeProjects } from "@/lib/hooks/useRealtimeProjects";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";
import htmlDocx from "html-docx-js/dist/html-docx";
import {
  FileText,
  Users,
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
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import type { ProjectWithDocuments, DocumentRecord } from "@/lib/actions/project.actions";
import { deleteProject, updateProject } from "@/lib/actions/project.actions";

// V2 Document Pipeline Icons (DOMINANT WITH PRD RESTORED)
const documentIcons = {
  // V2 Document Pipeline (ACTIVE)
  "Research_Insights": Search,
  "Vision_Strategy": Eye,
  "PRD": FileText,
  "BRD": Users,
  "TRD": Code,
  "Planning_Toolkit": Layout,

  // Legacy documents (V1) - COMMENTED OUT FOR V2 DOMINANCE
  // "User Stories": Users,
  // "Sitemap": Map,
  // "Tech Stack": Code,
  // "Screens": Layout
};



const statusColors = {
  ready: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  processing: "bg-yellow-100 text-yellow-700",
  pending: "bg-gray-100 text-gray-700",
  failed: "bg-red-100 text-red-700"
};

// Helper function to get document types for a project (V2 WITH PRD RESTORED)
const getProjectDocumentTypes = () => {
  // V2 projects use the enhanced 6-document pipeline (PRD restored)
  return ['Research_Insights', 'Vision_Strategy', 'PRD', 'BRD', 'TRD', 'Planning_Toolkit'];
};

// Helper function to get document display info (V2 DOMINANT WITH PRD RESTORED)
const getDocumentDisplayInfo = (docType: string) => {
  const displayNames: Record<string, string> = {
    // V2 Document Types (ACTIVE)
    'Research_Insights': 'Research & Insights',
    'Vision_Strategy': 'Vision & Strategy',
    'PRD': 'PRD',
    'BRD': 'Business Requirements',
    'TRD': 'Technical Requirements',
    'Planning_Toolkit': 'Planning Toolkit',

    // V1 Legacy Types (COMMENTED OUT)
    // 'User Stories': 'User Stories',
    // 'Sitemap': 'Sitemap',
    // 'Tech Stack': 'Tech Stack',
    // 'Screens': 'Screens'
  };

  return {
    name: displayNames[docType] || docType,
    icon: documentIcons[docType as keyof typeof documentIcons] || FileText
  };
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

  const filteredProjects = projects.filter(proj =>
    proj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proj.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDocument = (document: DocumentRecord) => {
    setViewerDocument({
      id: `${selectedProject}-${document.type}`,
      name: document.name,
      type: document.type,
      downloadUrl: document.download_url || `#download-${document.type}`,
      createdAt: document.created_at,
      documentId: document.id // Pass the actual document ID for content fetching
    });
    setIsViewerOpen(true);
  };

  const handleDownloadDocument = async (document: DocumentRecord) => {
    try {
      if (!document.download_url) {
        toast({
          title: "Download failed",
          description: "No download URL available for this document.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Generating Word document",
        description: "Please wait while we prepare your document...",
        variant: "default",
      });

      // Fetch the HTML content
      const response = await fetch(document.download_url, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
      }

      const htmlContent = await response.text();

      // Parse the HTML content to extract body
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const bodyContent = doc.body.innerHTML;

      // Create a complete HTML document with proper styling for Word
      const styledHtml = `
        <!DOCTYPE html>
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head>
            <meta charset="UTF-8">
            <xml>
              <w:WordDocument>
                <w:View>Print</w:View>
                <w:Zoom>100</w:Zoom>
                <w:DoNotOptimizeForBrowser/>
              </w:WordDocument>
            </xml>
            <style>
              @page {
                size: 8.5in 11in;
                margin: 1in 1in 1in 1in;
                mso-header-margin: 0.5in;
                mso-footer-margin: 0.5in;
                mso-paper-source: 0;
              }
              @page Section1 {
                size: 8.5in 11in;
                margin: 1in 1in 1in 1in;
                mso-header-margin: 0.5in;
                mso-footer-margin: 0.5in;
                mso-paper-source: 0;
              }
              div.Section1 {
                page: Section1;
              }
              body {
                font-family: Calibri, Arial, sans-serif;
                font-size: 11pt;
                line-height: 1.15;
                color: #000000;
                margin: 0;
                padding: 0;
              }
              h1 {
                font-size: 20pt;
                font-weight: bold;
                margin: 12pt 0 6pt 0;
                color: #000000;
                line-height: 1.15;
                page-break-after: avoid;
              }
              h2 {
                font-size: 16pt;
                font-weight: bold;
                margin: 10pt 0 6pt 0;
                color: #000000;
                line-height: 1.15;
                page-break-after: avoid;
              }
              h3 {
                font-size: 14pt;
                font-weight: bold;
                margin: 10pt 0 6pt 0;
                color: #000000;
                line-height: 1.15;
                page-break-after: avoid;
              }
              h4 {
                font-size: 12pt;
                font-weight: bold;
                margin: 10pt 0 6pt 0;
                color: #000000;
                page-break-after: avoid;
              }
              h5, h6 {
                font-size: 11pt;
                font-weight: bold;
                margin: 10pt 0 6pt 0;
                color: #000000;
                page-break-after: avoid;
              }
              p {
                margin: 0 0 10pt 0;
                line-height: 1.15;
              }
              ul, ol {
                margin: 0 0 10pt 0;
                padding-left: 0.5in;
              }
              li {
                margin: 0 0 5pt 0;
                line-height: 1.15;
              }
              table {
                border-collapse: collapse;
                margin: 10pt 0;
                width: 100%;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                mso-table-anchor-vertical: paragraph;
                mso-table-anchor-horizontal: column;
                mso-table-left: left;
                mso-padding-alt: 0in 5.4pt 0in 5.4pt;
              }
              th, td {
                padding: 5pt;
                border: 1pt solid #000000;
                vertical-align: top;
                mso-border-alt: solid #000000 0.5pt;
              }
              th {
                background-color: #f0f0f0;
                font-weight: bold;
              }
              blockquote {
                margin: 10pt 0 10pt 0.5in;
                padding: 5pt 10pt;
                border-left: 3pt solid #cccccc;
                font-style: italic;
              }
              code {
                font-family: 'Courier New', monospace;
                font-size: 10pt;
              }
              pre {
                font-family: 'Courier New', monospace;
                font-size: 10pt;
                margin: 10pt 0;
                padding: 10pt;
                background-color: #f5f5f5;
                border: 1pt solid #cccccc;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              a {
                color: #0563c1;
                text-decoration: underline;
              }
              strong, b {
                font-weight: bold;
              }
              em, i {
                font-style: italic;
              }
              hr {
                margin: 10pt 0;
                border: none;
                border-top: 1pt solid #cccccc;
              }
            </style>
          </head>
          <body>
            <div class="Section1">
              ${bodyContent}
            </div>
          </body>
        </html>
      `;

      // Convert HTML to Word document with options
      const converted = htmlDocx.asBlob(styledHtml, {
        orientation: 'portrait',
        margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      });

      // Create download link
      const url = URL.createObjectURL(converted);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${document.name}.docx`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Word document downloaded",
        description: `${document.name}.docx has been downloaded successfully.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadAllDocuments = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const completedDocs = project.documents.filter(
      doc => (doc.status === 'ready' || doc.status === 'completed') && doc.download_url
    );

    if (completedDocs.length === 0) {
      toast({
        title: "No documents available",
        description: "There are no completed documents to download.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Downloading documents",
      description: `Preparing ${completedDocs.length} document(s) for download...`,
      variant: "default",
    });

    // Download each document sequentially with a small delay
    for (let i = 0; i < completedDocs.length; i++) {
      const doc = completedDocs[i];
      try {
        await handleDownloadDocument(doc);
        // Add a small delay between downloads to avoid overwhelming the browser
        if (i < completedDocs.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Failed to download ${doc.name}:`, error);
      }
    }

    toast({
      title: "Download complete",
      description: `Successfully downloaded ${completedDocs.length} document(s).`,
      variant: "default",
    });
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setViewerDocument(null);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete || deletingProjectId) return;

    const projectIdToDelete = projectToDelete.id;


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
      const result = await updateProject(projectToEdit.id, editForm);
      if (result.success) {
        toast({
          title: "Project updated",
          description: `"${editForm.name}" has been successfully updated.`,
          variant: "default",
        });

        // Close the dialog and clear the project to edit
        setEditDialogOpen(false);
        setProjectToEdit(null);

        // Refresh the entire page to show updated data
        window.location.reload();
      } else {
        throw new Error("Update was not successful");
      }
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-[18px] md:text-2xl font-bold text-gray-900 font-sans">My Projects</h1>
              <p className="text-[13px] md:text-base text-gray-600 mt-1 md:mt-2 font-sans">
                Manage your generated documentation projects
              </p>
            </div>

            <Link href="/dashboard">
              <Button className="text-white font-sans text-[13px] md:text-base px-4 py-2 md:px-6 md:py-3" style={{ backgroundColor: 'var(--steel-blue-600)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-700)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-600)'}>
                <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
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
                    className={`cursor-pointer transition-all hover:shadow-sm ${selectedProject === project.id ? 'border-opacity-100 shadow-sm' : ''
                      } border-2`}
                    style={selectedProject === project.id ? { borderColor: 'var(--steel-blue-500)' } : {}}
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="font-sans text-[16px] md:text-xl">{project.name}</CardTitle>
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
                              <div className="flex justify-between items-center text-[13px] md:text-sm mb-1">
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
                                    className="text-[13px] px-2 py-1 h-6 font-sans"
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
                                <p className="text-[13px] text-gray-500 mt-1 font-sans">
                                  {project.current_step}
                                </p>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-[13px] md:text-sm text-gray-500 font-sans">
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
                        {getProjectDocumentTypes().map((docType) => {
                          const doc = project.documents.find(d => d.type === docType);
                          const displayInfo = getDocumentDisplayInfo(docType);
                          const IconComponent = displayInfo.icon;

                          // If document doesn't exist, show placeholder
                          if (!doc) {
                            return (
                              <div
                                key={docType}
                                className="p-3 rounded-sm border-2 border-gray-200 bg-gray-50 flex flex-col justify-between items-center min-h-[80px]"
                              >
                                <IconComponent className="w-6 h-6 text-gray-400 flex-shrink-0" />
                                <div className="text-[13px] font-medium text-gray-700 font-sans text-center mt-auto">
                                  {displayInfo.name}
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={docType}
                              className={`p-3 rounded-sm border-2 relative flex flex-col justify-between items-center min-h-[80px] group ${doc.status === 'ready' || doc.status === 'completed' ? 'border-green-200 bg-green-50 cursor-pointer hover:border-green-300 hover:bg-green-100' :
                                doc.status === 'processing' ? 'border-yellow-200 bg-yellow-50' :
                                  'border-gray-200 bg-gray-50'
                                }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (doc.status === 'ready' || doc.status === 'completed') {
                                  handleViewDocument(doc);
                                }
                              }}
                            >
                              {doc.status === 'processing' && (
                                <div className="absolute top-1 right-1">
                                  <Loader2 className="w-3 h-3 animate-spin text-yellow-600" />
                                </div>
                              )}

                              {/* Action buttons overlay - only show on hover for completed documents */}
                              {(doc.status === 'ready' || doc.status === 'completed') && (
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="p-1 h-6 w-6 bg-white/80 hover:bg-white shadow-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDocument(doc);
                                    }}
                                  >
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="p-1 h-6 w-6 bg-white/80 hover:bg-white shadow-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownloadDocument(doc);
                                    }}
                                  >
                                    <Download className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}

                              <IconComponent className={`w-6 h-6 flex-shrink-0 ${doc.status === 'ready' || doc.status === 'completed' ? 'text-green-600' :
                                doc.status === 'processing' ? 'text-yellow-600' :
                                  'text-gray-400'
                                }`} />
                              <div className="text-xs font-medium text-gray-700 font-sans text-center mt-auto">
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

                              return getProjectDocumentTypes().map((docType) => {
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
                                  <div
                                    key={docType}
                                    className={`flex items-center justify-between p-3 border rounded-sm ${(doc.status === 'ready' || doc.status === 'completed')
                                      ? 'cursor-pointer hover:bg-gray-50'
                                      : ''
                                      }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (doc.status === 'ready' || doc.status === 'completed') {
                                        handleViewDocument(doc);
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <IconComponent className="w-5 h-5 text-gray-600" />
                                      <div>
                                        <div className="font-medium text-sm font-sans">{doc.name}</div>
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
                                              handleDownloadDocument(doc);
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
                                style={{ backgroundColor: 'var(--steel-blue-600)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-700)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-600)'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadAllDocuments(project.id);
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

                      return getProjectDocumentTypes().map((docType) => {
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
                          <div
                            key={docType}
                            className={`flex items-center justify-between p-3 border rounded-sm ${(doc.status === 'ready' || doc.status === 'completed')
                              ? 'cursor-pointer hover:bg-gray-50'
                              : ''
                              }`}
                            onClick={() => {
                              if (doc.status === 'ready' || doc.status === 'completed') {
                                handleViewDocument(doc);
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-5 h-5 text-gray-600" />
                              <div>
                                <div className="font-medium text-sm font-sans">{doc.name}</div>
                                {/* Size removed from project details panel per request */}
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
                                      handleDownloadDocument(doc);
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

                    <div className="pt-4">
                      <Button
                        className="w-full text-white font-sans"
                        disabled={projects.find(p => p.id === selectedProject)?.status !== 'completed'}
                        style={{ backgroundColor: 'var(--steel-blue-600)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-700)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-600)'}
                        onClick={() => selectedProject && handleDownloadAllDocuments(selectedProject)}
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
                    <h3 className="text-[16px] md:text-lg font-semibold text-gray-900 mb-2 font-sans">
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
              <h3 className="text-[16px] md:text-xl font-semibold text-gray-900 mb-2 font-sans">
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
                  <Button className="text-white font-sans" style={{ backgroundColor: 'var(--steel-blue-600)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-700)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-600)'}>
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
              style={{ backgroundColor: 'var(--steel-blue-600)' }}
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
              Are you sure you want to delete <span className="font-semibold">&quot;{projectToDelete?.name}&quot;</span>?
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
          onComplete={() => {
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