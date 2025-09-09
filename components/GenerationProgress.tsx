"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Users, 
  Map, 
  Code, 
  Layout, 
  Clock,
  CheckCircle2,
  Loader2,
  XCircle,
  AlertCircle
} from "lucide-react";

interface GenerationProgress {
  projectId: string;
  projectName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  estimatedTime?: number;
  documents: Array<{
    type: string;
    name: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    size?: string;
  }>;
}

interface GenerationProgressComponentProps {
  projectId: string;
  onComplete: (projectId: string) => void;
  onCancel: () => void;
}

const documentIcons = {
  "PRD": FileText,
  "User Stories": Users,
  "Sitemap": Map,
  "Tech Stack": Code,
  "Screens": Layout
};

const statusConfig: Record<string, {
  icon: any;
  color: string;
  bgColor: string;
  label: string;
  animate?: boolean;
}> = {
  pending: {
    icon: Clock,
    color: "text-gray-400",
    bgColor: "bg-gray-100",
    label: "Waiting"
  },
  processing: {
    icon: Loader2,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    label: "Processing",
    animate: true
  },
  completed: {
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-100",
    label: "Complete"
  },
  failed: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    label: "Failed"
  }
};

export function GenerationProgressComponent({ 
  projectId, 
  onComplete, 
  onCancel 
}: GenerationProgressComponentProps) {
  const [progress, setProgress] = useState<GenerationProgress>({
    projectId,
    projectName: "New Project",
    status: 'pending',
    progress: 0,
    currentStep: "Initializing...",
    documents: [
      { type: "PRD", name: "Product Requirements Document", status: "pending" },
      { type: "User Stories", name: "User Journey Document", status: "pending" },
      { type: "Sitemap", name: "Application Sitemap", status: "pending" },
      { type: "Tech Stack", name: "Technology Requirements", status: "pending" },
      { type: "Screens", name: "Screen Specifications", status: "pending" }
    ]
  });

  useEffect(() => {
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev.status === 'completed' || prev.status === 'failed') {
          clearInterval(interval);
          return prev;
        }

        const newProgress = Math.min(100, prev.progress + Math.random() * 10);
        const completedDocs = Math.floor(newProgress / 20);
        
        const updatedDocuments = prev.documents.map((doc, index) => {
          if (index < completedDocs) {
            return { 
              ...doc, 
              status: 'completed' as const,
              size: `${(Math.random() * 3 + 1).toFixed(1)} MB`
            };
          } else if (index === completedDocs && newProgress % 20 > 0) {
            return { ...doc, status: 'processing' as const };
          }
          return doc;
        });

        const processingDoc = updatedDocuments.find(doc => doc.status === 'processing');
        const currentStep = processingDoc 
          ? `Generating ${processingDoc.name}...`
          : newProgress >= 100 
            ? "Finalizing documents..."
            : "Preparing generation...";

        const status = newProgress >= 100 ? 'completed' : 'processing';
        
        if (status === 'completed') {
          setTimeout(() => onComplete(projectId), 2000);
        }

        return {
          ...prev,
          progress: newProgress,
          status,
          currentStep,
          documents: updatedDocuments,
          estimatedTime: status === 'processing' ? Math.max(0, (100 - newProgress) * 3000) : 0
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [projectId, onComplete]);

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-sans">
                {progress.status === 'processing' && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
                {progress.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                {progress.status === 'failed' && <XCircle className="w-5 h-5 text-red-600" />}
                {progress.status === 'pending' && <Clock className="w-5 h-5 text-gray-400" />}
                
                {progress.status === 'pending' && "Preparing Generation..."}
                {progress.status === 'processing' && "Generating Documentation"}
                {progress.status === 'completed' && "Generation Complete!"}
                {progress.status === 'failed' && "Generation Failed"}
              </CardTitle>
              
              <p className="text-sm text-gray-600 mt-1 font-sans">
                {progress.currentStep}
              </p>
            </div>
            
            {progress.status !== 'completed' && (
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="font-sans"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700 font-sans">Overall Progress</span>
              <span className="text-gray-600 font-sans">{Math.round(progress.progress)}%</span>
            </div>
            <Progress value={progress.progress} className="h-2" />
            {progress.estimatedTime && progress.estimatedTime > 0 && (
              <p className="text-xs text-gray-500 font-sans">
                Estimated time remaining: {formatTime(progress.estimatedTime)}
              </p>
            )}
          </div>

          {/* Document Status */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 font-sans">Document Generation Status</h3>
            <div className="grid gap-3">
              {progress.documents.map((doc, index) => {
                const IconComponent = documentIcons[doc.type as keyof typeof documentIcons];
                const config = statusConfig[doc.status];
                const StatusIcon = config.icon;

                return (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${config.bgColor}`}>
                        <IconComponent className="w-5 h-5 text-gray-600" />
                      </div>
                      
                      <div>
                        <div className="font-medium text-sm text-gray-900 font-sans">
                          {doc.name}
                        </div>
                        {doc.size && (
                          <div className="text-xs text-gray-500 font-sans">
                            {doc.size}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${config.color} border-current font-sans`}
                      >
                        <StatusIcon className={`w-3 h-3 mr-1 ${config.animate === true ? 'animate-spin' : ''}`} />
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Success Message */}
          {progress.status === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-sm p-4">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold font-sans">Success!</span>
              </div>
              <p className="text-sm text-green-700 font-sans">
                Your documentation suite has been generated successfully. 
                You'll be redirected to your projects dashboard in a moment.
              </p>
            </div>
          )}

          {/* Error Message */}
          {progress.status === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-sm p-4">
              <div className="flex items-center gap-2 text-red-800 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold font-sans">Generation Failed</span>
              </div>
              <p className="text-sm text-red-700 mb-3 font-sans">
                Something went wrong during the generation process. Please try again.
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onCancel}
                  className="font-sans"
                >
                  Close
                </Button>
                <Button 
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white font-sans"
                >
                  Retry Generation
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}