"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Star,
  Clock,
  Download,
  Eye,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Template, incrementTemplateDownloads } from "@/lib/actions/template.actions";

const categoryColors = {
  "Social": "bg-purple-100 text-purple-700",
  "E-commerce": "bg-green-100 text-green-700", 
  "Business": "text-white",
  "Education": "bg-orange-100 text-orange-700",
  "Healthcare": "bg-red-100 text-red-700",
  "Productivity": "bg-indigo-100 text-indigo-700"
};

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  const handleUseTemplate = async () => {
    try {
      // Increment download count
      await incrementTemplateDownloads(template.id);
    } catch (error) {
      console.error('Failed to increment downloads:', error);
    }
    
    // Store template data in sessionStorage for the dashboard to use
    sessionStorage.setItem('selectedTemplate', JSON.stringify({
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      tech_stacks: template.tech_stacks,
      features: template.features
    }));
    
    // Navigate to dashboard
    router.push('/dashboard?template=' + template.id);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <>
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start mb-3">
            <Badge 
              className={template.category === 'Business' ? 'text-white' : categoryColors[template.category as keyof typeof categoryColors]}
              style={template.category === 'Business' ? {backgroundColor: 'var(--steel-blue-600)'} : {}}
            >
              {template.category}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {template.rating}
            </div>
          </div>
          
          <CardTitle className="font-sans text-xl mb-2">{template.name}</CardTitle>
          <CardDescription className="font-sans">{template.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Tech Stacks */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2 font-sans">Compatible Tech Stacks:</div>
            <div className="flex flex-wrap gap-1">
              {template.tech_stacks.map((stack, index) => (
                <Badge key={index} variant="outline" className="text-xs font-sans">
                  {stack}
                </Badge>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2 font-sans">Key Features:</div>
            <ul className="text-xs text-gray-600 space-y-1 font-sans">
              {template.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full" style={{backgroundColor: 'var(--steel-blue-500)'}}></div>
                  {feature}
                </li>
              ))}
              {template.features.length > 3 && (
                <li 
                  className="cursor-pointer hover:underline" 
                  style={{color: 'var(--steel-blue-600)'}}
                  onClick={handlePreview}
                >
                  +{template.features.length - 3} more features
                </li>
              )}
            </ul>
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center text-sm text-gray-500 font-sans">
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              {template.downloads.toLocaleString()} downloads
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {template.document_count} documents
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 font-sans"
              onClick={handlePreview}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <InteractiveButton 
              size="sm" 
              className="flex-1 text-white font-sans" 
              style={{backgroundColor: 'var(--steel-blue-600)'}} 
              hoverColor="var(--steel-blue-700)" 
              defaultColor="var(--steel-blue-600)"
              onClick={handleUseTemplate}
            >
              Use Template
            </InteractiveButton>
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold font-sans flex items-center gap-2">
                <Eye className="w-6 h-6" style={{ color: 'var(--steel-blue-600)' }} />
                {template.name} Preview
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowPreview(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <DialogDescription className="font-sans">
              Detailed overview of this template's features and capabilities
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Template Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 font-sans">Category</h3>
                <Badge 
                  className={template.category === 'Business' ? 'text-white' : categoryColors[template.category as keyof typeof categoryColors]}
                  style={template.category === 'Business' ? {backgroundColor: 'var(--steel-blue-600)'} : {}}
                >
                  {template.category}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 font-sans">Rating & Downloads</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {template.rating} rating
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {template.downloads.toLocaleString()} downloads
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 font-sans">Description</h3>
              <p className="text-gray-600 font-sans">{template.description}</p>
            </div>

            {/* Tech Stacks */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 font-sans">Compatible Tech Stacks</h3>
              <div className="flex flex-wrap gap-2">
                {template.tech_stacks.map((stack, index) => (
                  <Badge key={index} variant="outline" className="font-sans">
                    {stack}
                  </Badge>
                ))}
              </div>
            </div>

            {/* All Features */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 font-sans">All Features</h3>
              <ul className="text-sm text-gray-600 space-y-2 font-sans">
                {template.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'var(--steel-blue-500)'}}></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Documents */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 font-sans">Generated Documents</h3>
              <p className="text-sm text-gray-600 font-sans mb-3">
                This template will generate {template.document_count} comprehensive documents:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 font-sans">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Product Requirements Document (PRD)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  User Stories & Journey Document
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  Application Sitemap
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  Tech Stack Requirements
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  Screen Specifications
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
              <InteractiveButton 
                size="lg"
                className="px-8 py-3 text-white font-sans" 
                style={{backgroundColor: 'var(--steel-blue-600)'}} 
                hoverColor="var(--steel-blue-700)" 
                defaultColor="var(--steel-blue-600)"
                onClick={() => {
                  setShowPreview(false);
                  handleUseTemplate();
                }}
              >
                Use This Template
              </InteractiveButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}