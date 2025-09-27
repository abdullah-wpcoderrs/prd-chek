
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ProductBasics } from "@/types";
import { Lightbulb, Building, TrendingUp, Zap } from "lucide-react";

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
  { value: "idea", label: "Idea Stage" },
  { value: "mvp", label: "MVP Development" },
  { value: "growth", label: "Growth Stage" },
  { value: "scaling", label: "Scaling Stage" },
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
        <div className="flex justify-end">
          <span className="text-xs text-gray-500 font-sans">
            {(data.productPitch || '').length}/300
          </span>
        </div>
      </div>

      {/* Two Column Layout - First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div>

        {/* Current Stage */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-900 font-sans">
            Current Stage *
          </Label>
          <Select value={data.currentStage} onValueChange={(value) => updateField('currentStage', value)}>
            <SelectTrigger className="text-base font-sans">
              <SelectValue placeholder="Select current stage" />
            </SelectTrigger>
            <SelectContent>
              {STAGE_OPTIONS.map((stage) => (
                <SelectItem key={stage.value} value={stage.value} className="font-sans">
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Two Column Layout - Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div>
      </div>

      {/* Product Differentiation */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          <Label htmlFor="differentiation" className="text-base font-semibold text-gray-900 font-sans">
            What makes your product different? *
          </Label>
        </div>
        <Textarea
          id="differentiation"
          value={data.differentiation || ''}
          onChange={(e) => updateField('differentiation', e.target.value)}
          placeholder="e.g., Unlike other project management tools, we use AI to automatically prioritize tasks based on deadlines, team capacity, and project dependencies, reducing planning time by 70%."
          className="min-h-[120px] text-base font-sans resize-none"
        />
      </div>
    </div>
  );
}