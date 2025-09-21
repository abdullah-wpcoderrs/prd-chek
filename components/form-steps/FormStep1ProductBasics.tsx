"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ProductBasics } from "@/types";
import { Lightbulb, Building, TrendingUp } from "lucide-react";

interface FormStep1ProductBasicsProps {
  data: ProductBasics;
  onUpdate: (data: ProductBasics) => void;
}

const INDUSTRY_OPTIONS = [
  { value: "fintech", label: "Financial Technology" },
  { value: "healthtech", label: "Healthcare Technology" },
  { value: "edtech", label: "Education Technology" },
  { value: "ecommerce", label: "E-commerce & Retail" },
  { value: "saas", label: "Software as a Service" },
  { value: "social", label: "Social Media & Networking" },
  { value: "gaming", label: "Gaming & Entertainment" },
  { value: "productivity", label: "Productivity & Tools" },
  { value: "travel", label: "Travel & Hospitality" },
  { value: "real-estate", label: "Real Estate" },
  { value: "logistics", label: "Logistics & Supply Chain" },
  { value: "marketplace", label: "Marketplace & Platform" },
  { value: "iot", label: "Internet of Things (IoT)" },
  { value: "ai-ml", label: "AI & Machine Learning" },
  { value: "blockchain", label: "Blockchain & Crypto" },
  { value: "other", label: "Other" },
];

const STAGE_OPTIONS = [
  { 
    value: "idea", 
    label: "Idea Stage", 
    description: "Concept validation and initial planning" 
  },
  { 
    value: "mvp", 
    label: "MVP Development", 
    description: "Building minimum viable product" 
  },
  { 
    value: "growth", 
    label: "Growth Stage", 
    description: "Scaling and user acquisition" 
  },
  { 
    value: "scaling", 
    label: "Scaling Stage", 
    description: "Enterprise growth and optimization" 
  },
];

const TECH_STACK_OPTIONS = [
  { value: "mern", label: "MERN Stack (MongoDB, Express, React, Node.js)" },
  { value: "nextjs", label: "Next.js + Supabase" },
  { value: "react", label: "React + Node.js" },
  { value: "vue", label: "Vue.js + Firebase" },
  { value: "angular", label: "Angular + NestJS" },
  { value: "django", label: "Django + PostgreSQL" },
  { value: "laravel", label: "Laravel + MySQL" },
  { value: "spring", label: "Spring Boot + React" },
  { value: "flutter", label: "Flutter + Firebase" },
  { value: "react-native", label: "React Native + Node.js" },
  { value: "other", label: "Other" },
];

const TARGET_PLATFORM_OPTIONS = [
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "desktop", label: "Desktop" },
  { value: "both", label: "Web + Mobile" },
  { value: "other", label: "Other" }
];

export function FormStep1ProductBasics({ data, onUpdate }: FormStep1ProductBasicsProps) {
  const updateField = (field: keyof ProductBasics, value: string) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8">
      {/* Product Name */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          <Label htmlFor="productName" className="text-base font-semibold text-gray-900 font-sans">
            Product Name *
          </Label>
        </div>
        <Input
          id="productName"
          value={data.productName}
          onChange={(e) => updateField('productName', e.target.value)}
          placeholder="e.g., TaskFlow, MediConnect, EduPlatform"
          className="text-base font-sans"
          maxLength={100}
        />
        <p className="text-sm text-gray-600 font-sans">
          Choose a clear, memorable name for your product
        </p>
      </div>

      {/* One-line Product Pitch */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <Label htmlFor="productPitch" className="text-base font-semibold text-gray-900 font-sans">
            One-line Product Pitch *
          </Label>
        </div>
        <Textarea
          id="productPitch"
          value={data.productPitch}
          onChange={(e) => updateField('productPitch', e.target.value)}
          placeholder="e.g., A project management tool that helps remote teams collaborate seamlessly with AI-powered task prioritization and real-time progress tracking."
          className="min-h-[100px] text-base font-sans resize-none"
          maxLength={300}
        />
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 font-sans">
            Describe your product's core value in one compelling sentence
          </p>
          <span className="text-xs text-gray-500 font-sans">
            {(data.productPitch || '').length}/300
          </span>
        </div>
      </div>

      {/* Industry/Domain */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-purple-600" />
          <Label htmlFor="industry" className="text-base font-semibold text-gray-900 font-sans">
            Industry / Domain *
          </Label>
        </div>
        <Select value={data.industry} onValueChange={(value) => updateField('industry', value)}>
          <SelectTrigger className="text-base font-sans">
            <SelectValue placeholder="Select your industry or domain" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="font-sans">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-600 font-sans">
          Choose the primary industry or domain your product serves
        </p>
      </div>

      {/* Current Stage */}
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gray-900 font-sans">
          Current Stage *
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {STAGE_OPTIONS.map((stage) => (
            <div
              key={stage.value}
              onClick={() => updateField('currentStage', stage.value)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 ${
                data.currentStage === stage.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-semibold text-gray-900 font-sans mb-1">
                {stage.label}
              </div>
              <div className="text-sm text-gray-600 font-sans">
                {stage.description}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 font-sans">
          Select the current development stage of your product
        </p>
      </div>

      {/* Tech Stack Selection */}
      <div className="space-y-3">
        <Label htmlFor="techStack" className="text-base font-semibold text-gray-900 font-sans">
          Preferred Tech Stack
        </Label>
        <Select value={data.techStack || ''} onValueChange={(value) => updateField('techStack', value)}>
          <SelectTrigger className="text-base font-sans">
            <SelectValue placeholder="Select your preferred tech stack" />
          </SelectTrigger>
          <SelectContent>
            {TECH_STACK_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="font-sans">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-600 font-sans">
          Specify your preferred technology stack (optional - will be determined based on requirements if left blank)
        </p>
      </div>

      {/* Target Platform Selection */}
      <div className="space-y-3">
        <Label htmlFor="targetPlatform" className="text-base font-semibold text-gray-900 font-sans">
          Target Platform
        </Label>
        <Select value={data.targetPlatform || ''} onValueChange={(value) => updateField('targetPlatform', value)}>
          <SelectTrigger className="text-base font-sans">
            <SelectValue placeholder="Select your target platform" />
          </SelectTrigger>
          <SelectContent>
            {TARGET_PLATFORM_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="font-sans">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-600 font-sans">
          Select the primary platform for your product
        </p>
      </div>

      {/* Validation Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 font-sans mb-2">Step 1 Progress</h4>
        <div className="space-y-1 text-sm">
          <div className={`flex items-center gap-2 ${(data.productName || '').trim() ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${(data.productName || '').trim() ? 'bg-green-500' : 'bg-gray-300'}`} />
            Product name provided
          </div>
          <div className={`flex items-center gap-2 ${(data.productPitch || '').trim() ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${(data.productPitch || '').trim() ? 'bg-green-500' : 'bg-gray-300'}`} />
            Product pitch written
          </div>
          <div className={`flex items-center gap-2 ${data.industry ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${data.industry ? 'bg-green-500' : 'bg-gray-300'}`} />
            Industry selected
          </div>
          <div className={`flex items-center gap-2 ${data.currentStage ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${data.currentStage ? 'bg-green-500' : 'bg-gray-300'}`} />
            Current stage selected
          </div>
          <div className={`flex items-center gap-2 ${data.techStack ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${data.techStack ? 'bg-green-500' : 'bg-gray-300'}`} />
            Tech stack specified
          </div>
          <div className={`flex items-center gap-2 ${data.targetPlatform ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${data.targetPlatform ? 'bg-green-500' : 'bg-gray-300'}`} />
            Target platform selected
          </div>
        </div>
      </div>
    </div>
  );
}