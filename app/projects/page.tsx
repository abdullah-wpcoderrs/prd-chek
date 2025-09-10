"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DocumentViewer } from "@/components/DocumentViewer";
import { useGeneration } from "@/lib/context/GenerationContext";
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
  Loader2
} from "lucide-react";
import Link from "next/link";

// Mock data for demonstration
interface Project {
  id: number | string;
  name: string;
  description: string;
  techStack: string;
  createdAt: string;
  status: string;
  progress?: number;
  currentStep?: string;
  documents: Array<{
    type: string;
    name: string;
    status: string;
    size?: string | null;
  }>;
}

const mockProjects: Project[] = [
  {
    id: 1,
    name: "Social Media for Developers",
    description: "A platform for developers to share code snippets and collaborate",
    techStack: "React + Node.js + MongoDB",
    createdAt: "2024-01-15",
    status: "completed",
    documents: [
      { type: "PRD", name: "Product Requirements Document", status: "ready", size: "2.4 MB" },
      { type: "User Stories", name: "User Journey Document", status: "ready", size: "1.8 MB" },
      { type: "Sitemap", name: "Application Sitemap", status: "ready", size: "1.2 MB" },
      { type: "Tech Stack", name: "Technology Requirements", status: "ready", size: "2.1 MB" },
      { type: "Screens", name: "Screen Specifications", status: "ready", size: "3.2 MB" }
    ]
  },
  {
    id: 2,
    name: "E-commerce Mobile App",
    description: "Modern mobile shopping application with AI recommendations",
    techStack: "React Native + Firebase",
    createdAt: "2024-01-12",
    status: "processing",
    documents: [
      { type: "PRD", name: "Product Requirements Document", status: "ready", size: "2.1 MB" },
      { type: "User Stories", name: "User Journey Document", status: "ready", size: "1.5 MB" },
      { type: "Sitemap", name: "Application Sitemap", status: "processing", size: null },
      { type: "Tech Stack", name: "Technology Requirements", status: "pending", size: null },
      { type: "Screens", name: "Screen Specifications", status: "pending", size: null }
    ]
  },
  {
    id: 3,
    name: "Task Management SaaS",
    description: "Team productivity tool with advanced project management features",
    techStack: "Next.js + Supabase + TypeScript",
    createdAt: "2024-01-10",
    status: "completed",
    documents: [
      { type: "PRD", name: "Product Requirements Document", status: "ready", size: "2.8 MB" },
      { type: "User Stories", name: "User Journey Document", status: "ready", size: "2.0 MB" },
      { type: "Sitemap", name: "Application Sitemap", status: "ready", size: "1.4 MB" },
      { type: "Tech Stack", name: "Technology Requirements", status: "ready", size: "1.9 MB" },
      { type: "Screens", name: "Screen Specifications", status: "ready", size: "3.8 MB" }
    ]
  }
];

const documentIcons = {
  "PRD": FileText,
  "User Stories": Users,
  "Sitemap": Map,
  "Tech Stack": Code,
  "Screens": Layout
};

const statusColors = {
  ready: "bg-green-100 text-green-700",
  processing: "bg-yellow-100 text-yellow-700",
  pending: "bg-gray-100 text-gray-700"
};

export default function ProjectsPage() {
  const { activeGenerations } = useGeneration();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<number | string | null>(null);
  const [viewerDocument, setViewerDocument] = useState<any>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Combine mock projects with active generations
  const [allProjects, setAllProjects] = useState<Project[]>(mockProjects);
  
  useEffect(() => {
    // Convert active generations to project format and merge with mock projects
    const generationProjects = Array.from(activeGenerations.values()).map(generation => ({
      id: generation.projectId,
      name: `Project ${generation.projectId.slice(-8)}`, // Use last 8 chars of ID as name
      description: "AI-generated documentation project",
      techStack: "AI Generated",
      createdAt: new Date().toISOString().split('T')[0],
      status: generation.status,
      progress: generation.progress,
      currentStep: generation.currentStep,
      documents: generation.documents.map(doc => ({
        type: doc.type,
        name: doc.name,
        status: doc.status === 'completed' ? 'ready' : doc.status,
        size: doc.size || null
      }))
    }));
    
    // Remove any mock projects that might conflict with active generations
    const filteredMockProjects = mockProjects.filter(project => 
      !Array.from(activeGenerations.keys()).includes(project.id.toString())
    );
    
    setAllProjects([...generationProjects, ...filteredMockProjects]);
  }, [activeGenerations]);

  const filteredProjects = allProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDocument = (document: any) => {
    setViewerDocument({
      id: `${selectedProject}-${document.type}`,
      name: document.name,
      type: document.type,
      size: document.size || "Processing...",
      downloadUrl: `#download-${document.type}`
    });
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setViewerDocument(null);
  };

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
              const isActiveGeneration = typeof project.id === 'string' && activeGenerations.has(project.id);
              
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
                          <Badge className={`${
                            project.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            project.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {isActiveGeneration && project.status === 'processing' && (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            )}
                            {project.status === 'completed' ? 'Completed' : 
                             project.status === 'processing' ? 'Processing' : 'Pending'}
                          </Badge>
                        </div>
                        
                        <CardDescription className="font-sans text-gray-600 mb-3">
                          {project.description}
                        </CardDescription>
                        
                        {/* Show progress for active generations */}
                        {isActiveGeneration && project.progress !== undefined && (
                          <div className="mb-3">
                            <div className="flex justify-between items-center text-sm mb-1">
                              <span className="font-medium text-gray-700 font-sans">Progress</span>
                              <span className="text-gray-600 font-sans">{Math.round(project.progress)}%</span>
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
                            {project.currentStep && (
                              <p className="text-xs text-gray-500 mt-1 font-sans">
                                {project.currentStep}
                              </p>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 font-sans">
                          <div className="flex items-center gap-1">
                            <Code className="w-4 h-4" />
                            {project.techStack}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
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
                              doc.status === 'ready' ? 'border-green-200 bg-green-50' :
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
                              doc.status === 'ready' ? 'text-green-600' :
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
                      {allProjects.find(p => p.id === selectedProject)?.name}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {allProjects.find(p => p.id === selectedProject)?.documents.map((doc, index) => {
                      const IconComponent = documentIcons[doc.type as keyof typeof documentIcons];
                      return (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-sm">
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-5 h-5 text-gray-600" />
                            <div>
                              <div className="font-medium text-sm font-sans">{doc.name}</div>
                              <div className="text-xs text-gray-500 font-sans">
                                {doc.size || 'Processing...'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            {doc.status === 'ready' && (
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
                        disabled={allProjects.find(p => p.id === selectedProject)?.status !== 'completed'}
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