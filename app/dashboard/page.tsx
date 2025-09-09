"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GenerationProgressComponent } from "@/components/GenerationProgress";
import { webhookAPI } from "@/lib/webhook";
import { Sparkles, Rocket, FileText, Users, Map, Code, Layout, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function DashboardPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [techStack, setTechStack] = useState("");
  const [targetPlatform, setTargetPlatform] = useState("web");
  const [complexity, setComplexity] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || !techStack) {
      return;
    }

    setIsGenerating(true);
    
    try {
      const result = await webhookAPI.submitProjectGeneration({
        projectName: projectName || undefined,
        description: prompt,
        techStack: techStackOptions.find(opt => opt.value === techStack)?.label || techStack,
        targetPlatform,
        complexity,
      });
      
      setCurrentProjectId(result.projectId);
      setShowProgress(true);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to start generation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerationComplete = (projectId: string) => {
    setShowProgress(false);
    setCurrentProjectId(null);
    router.push('/projects');
  };

  const handleCancelGeneration = () => {
    setShowProgress(false);
    setCurrentProjectId(null);
    setIsGenerating(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
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
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-t-sm">
              <CardTitle className="text-2xl font-sans">Create Your Project Documentation</CardTitle>
              <CardDescription className="text-blue-100 font-sans">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
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
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || !techStack || isGenerating}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white text-lg font-semibold font-sans rounded-sm"
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
              <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-sm flex items-center justify-center mx-auto mb-4">
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

      {/* Generation Progress Modal */}
      {showProgress && currentProjectId && (
        <GenerationProgressComponent
          projectId={currentProjectId}
          onComplete={handleGenerationComplete}
          onCancel={handleCancelGeneration}
        />
      )}
    </>
  );
}