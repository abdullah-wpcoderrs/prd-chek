"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectSpecModal, ProjectSpec } from "@/components/ProjectSpecModal";
import { createProjectAndStartGeneration } from "@/lib/actions/project.actions";
import { Sparkles, Rocket, FileText, Users, Map, Code, Layout, Loader2, Settings, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/use-toast";

const techStackOptions = [
  { value: "react-node", label: "React + Node.js + MongoDB" },
  { value: "nextjs-supabase", label: "Next.js + Supabase + TypeScript" },
  { value: "vue-laravel", label: "Vue.js + Laravel + MySQL" },
  { value: "angular-dotnet", label: "Angular + .NET Core + SQL Server" },
  { value: "svelte-express", label: "Svelte + Express.js + PostgreSQL" },
  { value: "flutter-firebase", label: "Flutter + Firebase + Firestore" },
  { value: "react-native-expo", label: "React Native + Expo + GraphQL" },
  { value: "django-react", label: "Django + React + PostgreSQL" },
  { value: "rails-vue", label: "Ruby on Rails + Vue.js + Redis" },
  { value: "spring-boot-react", label: "Spring Boot + React + MySQL" },
];

const designStyleOptions = [
  { value: "minimalist", label: "Minimalist & Clean" },
  { value: "modern", label: "Modern & Sleek" },
  { value: "playful", label: "Playful & Vibrant" },
  { value: "professional", label: "Professional & Corporate" },
  { value: "dark", label: "Dark Mode Focused" },
  { value: "other", label: "Other (Custom)" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [techStack, setTechStack] = useState("");
  const [targetPlatform, setTargetPlatform] = useState("web");
  const [complexity, setComplexity] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [showProjectSpec, setShowProjectSpec] = useState(false);
  const [projectSpec, setProjectSpec] = useState<ProjectSpec | undefined>(undefined);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600 font-sans">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the page if user is not authenticated
  if (!user) {
    return null;
  }

  const handleGenerate = async () => {
    if (!prompt.trim() || !techStack) {
      return;
    }

    setIsGenerating(true);
    
    try {
      const result = await createProjectAndStartGeneration({
        name: projectName || 'Untitled Project',
        description: prompt,
        techStack: techStackOptions.find(opt => opt.value === techStack)?.label || techStack,
        targetPlatform,
        complexity,
        projectSpec,
      });
      
      // Show success toast notification
      toast({
        variant: "success",
        title: "Documents Being Prepared",
        description: "Your documentation suite is being generated. You can track progress in your projects dashboard.",
      });
      
      // Redirect to projects page immediately
      setTimeout(() => {
        router.push('/projects');
      }, 2000);
      
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to start generation. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };



  const handleProjectSpecSave = (spec: ProjectSpec) => {
    setProjectSpec(spec);
  };

  const handleRemoveProjectSpec = () => {
    setProjectSpec(undefined);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{backgroundColor: 'var(--steel-blue-100)', color: 'var(--steel-blue-700)'}}>
              <Sparkles className="w-4 h-4" />
              AI Documentation Generator
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-sans">
              Generate Documentation with AI
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
              Enter a simple prompt to generate stunning documentation suite
            </p>
          </div>

          {/* Main Generation Interface */}
          <Card className="max-w-4xl mx-auto mb-12 shadow-sm border-0">
            <CardHeader className="text-white rounded-t-sm" style={{background: `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))`}}>
              <CardTitle className="text-2xl font-sans">Create Your Project Documentation</CardTitle>
              <CardDescription className="font-sans" style={{color: 'var(--steel-blue-100)'}}>
                Describe your project idea and select your preferred tech stack to get started
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-sans">
                  Project Name (Optional)
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Awesome Project"
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm font-sans focus:outline-none focus:border-opacity-100"
                  style={{
                    '--focus-border-color': 'var(--steel-blue-500)',
                    '--focus-ring-color': 'var(--steel-blue-200)'
                  } as React.CSSProperties}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--steel-blue-500)';
                    e.target.style.boxShadow = '0 0 0 3px var(--steel-blue-200)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  disabled={isGenerating}
                />
              </div>

              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-sans">
                  Project Description *
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your project idea in detail... 

Example: A social media platform for developers where they can share code snippets, collaborate on projects, get feedback from peers, and showcase their work. Users can create profiles, follow other developers, like and comment on posts, and organize content by programming languages and frameworks."
                  className="min-h-[200px] resize-none font-sans text-base leading-relaxed"
                  disabled={isGenerating}
                />
                <div className="text-sm text-gray-500 font-sans">
                  {prompt.length}/2000 characters
                </div>
              </div>

              {/* Tech Stack Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-sans">
                  Preferred Tech Stack *
                </label>
                <Select value={techStack} onValueChange={setTechStack} disabled={isGenerating}>
                  <SelectTrigger className="w-full h-12 font-sans">
                    <SelectValue placeholder="Select your preferred technology stack" />
                  </SelectTrigger>
                  <SelectContent>
                    {techStackOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="font-sans">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Settings */}
              <div className="bg-gray-50 rounded-sm p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 font-sans">Additional Settings</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 font-sans">
                      Target Platform
                    </label>
                    <Select value={targetPlatform} onValueChange={setTargetPlatform} disabled={isGenerating}>
                      <SelectTrigger className="font-sans">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web" className="font-sans">Web Application</SelectItem>
                        <SelectItem value="mobile" className="font-sans">Mobile Application</SelectItem>
                        <SelectItem value="desktop" className="font-sans">Desktop Application</SelectItem>
                        <SelectItem value="both" className="font-sans">Web + Mobile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 font-sans">
                      Project Complexity
                    </label>
                    <Select value={complexity} onValueChange={setComplexity} disabled={isGenerating}>
                      <SelectTrigger className="font-sans">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple" className="font-sans">Simple (MVP)</SelectItem>
                        <SelectItem value="medium" className="font-sans">Medium (Standard)</SelectItem>
                        <SelectItem value="complex" className="font-sans">Complex (Enterprise)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Project Specification Section */}
                <div className="border-t pt-4 mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 font-sans">Project Specification</h4>
                      <p className="text-sm text-gray-600 font-sans">Add detailed requirements for more accurate documentation</p>
                    </div>
                    {!projectSpec ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowProjectSpec(true)}
                        disabled={isGenerating}
                        className="font-sans border-2"
                        style={{
                          borderColor: 'var(--steel-blue-300)',
                          color: 'var(--steel-blue-700)'
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project Spec
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-green-600 font-medium font-sans flex items-center gap-1">
                          <Settings className="w-4 h-4" />
                          Specification Added
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowProjectSpec(true)}
                          disabled={isGenerating}
                          className="font-sans text-xs"
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveProjectSpec}
                          disabled={isGenerating}
                          className="font-sans text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {projectSpec && (
                    <Card className="bg-white border" style={{ borderColor: 'var(--steel-blue-200)' }}>
                      <CardContent className="p-4">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700 font-sans">Design Style:</span>
                            <span className="ml-2 text-gray-600 font-sans">
                              {projectSpec.designStyle === 'other' && projectSpec.customDesignStyle 
                                ? projectSpec.customDesignStyle 
                                : designStyleOptions.find(opt => opt.value === projectSpec.designStyle)?.label}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 font-sans">Multi-User Roles:</span>
                            <span className="ml-2 text-gray-600 font-sans">
                              {projectSpec.multiUserRoles ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                        {(projectSpec.coreFeatures || projectSpec.targetUsers) && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="text-xs text-gray-500 font-sans">
                              Additional specifications configured for enhanced documentation generation.
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || !techStack || isGenerating}
                className="w-full h-14 text-white text-lg font-semibold font-sans rounded-sm"
                style={{background: `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))`}}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = `linear-gradient(to right, var(--steel-blue-700), var(--steel-blue-800))`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))`;
                  }
                }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Starting Generation...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    Generate Documentation Suite
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* What Will Be Generated */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-sans">
              What Will Be Generated
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-gray-300 transition-colors" style={{borderColor: 'var(--steel-blue-100)'}}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-sm flex items-center justify-center mx-auto mb-4" style={{backgroundColor: 'var(--steel-blue-100)', color: 'var(--steel-blue-600)'}}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
                    Product Requirements Document
                  </h3>
                  <p className="text-gray-600 text-sm font-sans">
                    Comprehensive PRD with features, user stories, and technical requirements
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-sm flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
                    User Journey Document
                  </h3>
                  <p className="text-gray-600 text-sm font-sans">
                    Detailed user flows, personas, and interaction patterns
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-purple-100 hover:border-purple-200 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-sm flex items-center justify-center mx-auto mb-4">
                    <Map className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
                    Sitemap Document
                  </h3>
                  <p className="text-gray-600 text-sm font-sans">
                    Complete application structure and navigation flow
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-orange-100 hover:border-orange-200 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-sm flex items-center justify-center mx-auto mb-4">
                    <Code className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
                    Tech Stack Requirements
                  </h3>
                  <p className="text-gray-600 text-sm font-sans">
                    Technology recommendations and compatibility analysis
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-indigo-100 hover:border-indigo-200 transition-colors md:col-span-2 lg:col-span-1">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-sm flex items-center justify-center mx-auto mb-4">
                    <Layout className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
                    Screen Specifications
                  </h3>
                  <p className="text-gray-600 text-sm font-sans">
                    Detailed content and functionality for each screen
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Project Specification Modal */}
      <ProjectSpecModal
        open={showProjectSpec}
        onOpenChange={setShowProjectSpec}
        onSave={handleProjectSpecSave}
        initialSpec={projectSpec}
      />
    </>
  );
}