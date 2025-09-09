"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DocumentViewer } from "@/components/DocumentViewer";
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
  Filter
} from "lucide-react";
import Link from "next/link";

// Mock data for demonstration
const mockProjects = [
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [viewerDocument, setViewerDocument] = useState<any>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const filteredProjects = mockProjects.filter(project =>
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
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-sans">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
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
              {filteredProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className={`cursor-pointer transition-all hover:shadow-sm ${
                    selectedProject === project.id ? 'ring-2 ring-blue-500 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="font-sans text-xl">{project.name}</CardTitle>
                          <Badge className={`${
                            project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {project.status === 'completed' ? 'Completed' : 'Processing'}
                          </Badge>
                        </div>
                        
                        <CardDescription className="font-sans text-gray-600 mb-3">
                          {project.description}
                        </CardDescription>
                        
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
                            className={`p-3 rounded-sm border-2 text-center ${
                              doc.status === 'ready' ? 'border-green-200 bg-green-50' :
                              doc.status === 'processing' ? 'border-yellow-200 bg-yellow-50' :
                              'border-gray-200 bg-gray-50'
                            }`}
                          >
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
              ))}
            </div>

            {/* Project Details Panel */}
            <div className="lg:col-span-1">
              {selectedProject ? (
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="font-sans">Project Documents</CardTitle>
                    <CardDescription className="font-sans">
                      {mockProjects.find(p => p.id === selectedProject)?.name}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {mockProjects.find(p => p.id === selectedProject)?.documents.map((doc, index) => {
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
                              <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="pt-4">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-sans">
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
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-sans">
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