"use client";

import { useState, useEffect } from "react";
import { MultiStepForm } from "@/components/MultiStepForm";
import { createProjectAndStartGeneration } from "@/lib/actions/project.actions";
import { ProductManagerFormData } from "@/types";
import { Sparkles, FileText, Users, Map, Code, Layout, Loader2, BarChart3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { convertTemplateToFormData } from "@/lib/utils/template-mapping";
import GenerationProgressV2 from "@/components/GenerationProgressV2";

// Template conversion logic moved to /lib/utils/template-mapping.ts



export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [initialFormData, setInitialFormData] = useState<ProductManagerFormData | null>(null);



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
            Product Management Suite Generator
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-sans">
            Complete Product Documentation
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Answer 5 simple questions to generate a comprehensive documentation suite for your product
          </p>
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

        {/* Multi-Step Form */}
        <MultiStepForm 
          onSubmit={handleFormSubmit}
          isSubmitting={isGenerating}
          initialData={initialFormData}
        />

        {/* What Will Be Generated - Enhanced */}
        <div className="max-w-5xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center font-sans">
            3-Stage Documentation Pipeline
          </h2>
          <p className="text-gray-600 text-center mb-12 font-sans">
            Your responses will generate a complete product management workflow
          </p>
          
          {/* Stage 1: Discovery & Research */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <h3 className="text-2xl font-bold text-gray-900 font-sans">Discovery & Research</h3>
            </div>
            <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
                      Research & Insights Report
                    </h4>
                    <p className="text-gray-600 font-sans">
                      Combines market research, user research, problem statement, and value proposition analysis based on your inputs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stage 2: Vision & Strategy */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <h3 className="text-2xl font-bold text-gray-900 font-sans">Vision & Strategy</h3>
            </div>
            <Card className="border-2 border-purple-100 hover:border-purple-200 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
                      Vision & Strategy Document
                    </h4>
                    <p className="text-gray-600 font-sans">
                      Defines product vision, strategy, and success metrics (KPIs/OKRs) based on your value proposition and goals
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stage 3: Requirements & Planning */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <h3 className="text-2xl font-bold text-gray-900 font-sans">Requirements & Planning</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 font-sans text-sm">
                    Product Requirements Document (PRD)
                  </h4>
                  <p className="text-gray-600 text-xs font-sans">
                    Main product scope and features
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 font-sans text-sm">
                    Business Requirements Document (BRD)
                  </h4>
                  <p className="text-gray-600 text-xs font-sans">
                    Business and executive alignment
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Code className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 font-sans text-sm">
                    Technical Requirements Document (TRD)
                  </h4>
                  <p className="text-gray-600 text-xs font-sans">
                    Engineering feasibility analysis
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Layout className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 font-sans text-sm">
                    Planning Toolkit
                  </h4>
                  <p className="text-gray-600 text-xs font-sans">
                    Prioritization frameworks and user stories
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Flow Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 text-center">
            <h4 className="font-semibold text-gray-900 font-sans mb-2">Document Flow</h4>
            <p className="text-gray-700 font-sans">
              <span className="font-medium text-blue-600">Research & Insights</span> → informs → 
              <span className="font-medium text-purple-600 mx-2">Vision & Strategy</span> → shapes → 
              <span className="font-medium text-green-600">Requirements & Planning</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}