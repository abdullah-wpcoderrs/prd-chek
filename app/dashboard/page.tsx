"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiStepForm } from "@/components/MultiStepForm";
import { PromptInterface } from "@/components/PromptInterface";
import { createProjectAndStartGeneration } from "@/lib/actions/project.actions";
import { ProductManagerFormData } from "@/types";
import { Sparkles, FileText, Loader2, X, MessageSquare, FormInput } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/use-toast";

import { convertTemplateToFormData } from "@/lib/utils/template-mapping";
import { Template } from "@/lib/actions/template.actions";


// Template conversion logic moved to /lib/utils/template-mapping.ts



export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [initialFormData, setInitialFormData] = useState<ProductManagerFormData | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "prompt">("form");



  // Handle template selection from URL params and sessionStorage
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const templateId = searchParams.get('template');
    
    if (templateId) {
      const templateData = sessionStorage.getItem('selectedTemplate');
      if (templateData) {
        try {
          const template = JSON.parse(templateData);
          setSelectedTemplate(template);
          
          // Convert template data to multi-step form format using enhanced mapping utility
          const formData = convertTemplateToFormData(template);
          
          setInitialFormData(formData);
          
          // Show a toast notification
          toast({
            variant: "success",
            title: "Template Selected",
            description: `${template.name} template has been loaded. You can customize the details in the form.`,
          });
          
          // Clean up URL
          window.history.replaceState({}, '', '/dashboard');
        } catch (error) {
          console.error('Failed to parse template data:', error);
        }
      }
    }
  }, [toast]);

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

  const handleFormSubmit = async (formData: ProductManagerFormData) => {
    setIsGenerating(true);
    
    try {
      console.log('🚀 Starting project creation process...');
      
      const result = await createProjectAndStartGeneration({
        formData,
        techStack: formData.step1.techStack || 'To be determined based on requirements',
        targetPlatform: formData.step1.targetPlatform || 'web',
      });
      
      console.log('✅ Project created successfully:', result.projectId);
      
      // Show success toast notification
      toast({
        title: "Generation Started Successfully!",
        description: "Your project has been created and document generation is now in progress. Redirecting to projects page...",
        variant: "default",
      });
      
      // Redirect to projects page
      setTimeout(() => {
        router.push('/projects');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Project creation failed:', error);
      
      // Extract user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      // Determine error type for better UX
      let title = "Generation Failed";
      let description = errorMessage;
      
      if (errorMessage.includes('network') || errorMessage.includes('connect')) {
        title = "Connection Error";
        description = "Unable to connect to our servers. Please check your internet connection and try again.";
      } else if (errorMessage.includes('timeout')) {
        title = "Request Timeout";
        description = "The request is taking longer than expected. Please try again.";
      } else if (errorMessage.includes('service')) {
        title = "Service Unavailable";
        description = errorMessage; // Use the specific service error message
      } else if (errorMessage.includes('webhook') || errorMessage.includes('generation service')) {
        title = "Generation Service Error";
        description = "Our document generation service is currently unavailable. Please try again in a few minutes.";
      }
      
      toast({
        variant: "destructive",
        title,
        description,
        duration: 8000, // Show error longer so user can read it
      });
      
      // Don't redirect on error - let user try again
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{backgroundColor: 'var(--steel-blue-100)', color: 'var(--steel-blue-700)'}}>
            <Sparkles className="w-4 h-4" />
            AI-Powered Documentation Generator for Technical Product Managers
          </div>
          
          <h1 className="text-3xl md:text-6xl font-bold text-gray-900 mb-6 font-sans">
            From Idea to <span className="text-blue-600">Production-Ready</span> Documentation
          </h1>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto font-sans leading-relaxed">
            Skip the documentation bottleneck. Generate comprehensive PRDs, technical specs, and planning documents that enable seamless stakeholder alignment and engineering handoff.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-sans">5-minute setup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-sans">Technical-ready specifications</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="font-sans">Export to project management tools</span>
            </div>
          </div>
        </div>

        {/* Template Selection Info */}
        {selectedTemplate && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 font-sans">Template Selected: {selectedTemplate.name}</h3>
                    <p className="text-sm text-gray-600 font-sans">{selectedTemplate.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate(null);
                    setInitialFormData(null);
                    sessionStorage.removeItem('selectedTemplate');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-3 text-sm text-gray-600 font-sans">
                <span className="font-medium">Pre-filled features:</span> {selectedTemplate.features.slice(0, 3).join(', ')}
                {selectedTemplate.features.length > 3 && ` and ${selectedTemplate.features.length - 3} more...`}
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "form" | "prompt")} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <FormInput className="w-4 h-4" />
              Form Tab
            </TabsTrigger>
            <TabsTrigger value="prompt" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Prompt Tab
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="mt-0">
            <MultiStepForm 
              onSubmit={handleFormSubmit}
              isSubmitting={isGenerating}
              initialData={initialFormData}
            />
          </TabsContent>

          <TabsContent value="prompt" className="mt-0">
            <PromptInterface
              onApprove={handleFormSubmit}
              isSubmitting={isGenerating}
            />
          </TabsContent>
        </Tabs>

        {/* Brief Process Overview */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-sans">
              Complete Documentation in 3 Stages
            </h2>
            <p className="text-gray-600 font-sans">
              Generate comprehensive, stakeholder-ready documentation optimized for technical teams and engineering handoff
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">1</div>
              <h3 className="font-semibold text-gray-900 mb-2 font-sans text-sm">Discovery & Research</h3>
              <p className="text-xs text-gray-600 font-sans">Market analysis, competitive research, and user insights</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">2</div>
              <h3 className="font-semibold text-gray-900 mb-2 font-sans text-sm">Vision & Strategy</h3>
              <p className="text-xs text-gray-600 font-sans">Strategic framework with measurable success metrics</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">3</div>
              <h3 className="font-semibold text-gray-900 mb-2 font-sans text-sm">Requirements & Planning</h3>
              <p className="text-xs text-gray-600 font-sans">PRD, BRD, TRD, and implementation toolkit</p>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/how-it-works">
              <Button variant="outline" className="font-sans">
                Learn More About Our Process →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}