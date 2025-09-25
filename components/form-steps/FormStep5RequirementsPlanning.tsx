"use client";

import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RequirementsPlanning } from "@/types";
import { CheckSquare, Square, Settings, AlertTriangle } from "lucide-react";

interface FormStep5RequirementsPlanningProps {
  data: RequirementsPlanning;
  onUpdate: (data: RequirementsPlanning) => void;
}

const PRIORITIZATION_METHODS = [
  {
    value: "RICE",
    label: "RICE Framework",
    description: "Reach × Impact × Confidence ÷ Effort"
  },
  {
    value: "MoSCoW",
    label: "MoSCoW Method",
    description: "Must have, Should have, Could have, Won't have"
  },
  {
    value: "Kano",
    label: "Kano Model",
    description: "Basic, Performance, Excitement features"
  }
];

export function FormStep5RequirementsPlanning({ data, onUpdate }: FormStep5RequirementsPlanningProps) {
  const updateField = (field: keyof RequirementsPlanning, value: string | string[]) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8">
      {/* Must-have Features */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-red-600" />
          <Label htmlFor="mustHaveFeatures" className="text-base font-semibold text-gray-900 font-sans">
            Must-have Features *
          </Label>
        </div>
        <Textarea
          id="mustHaveFeatures"
          value={data.mustHaveFeatures.join('\n')}
          onChange={(e) => updateField('mustHaveFeatures', e.target.value.split('\n').filter(feature => feature.trim()))}
          placeholder="List core features essential for your MVP (one per line)&#10;e.g.:&#10;User authentication and login system&#10;Project creation and management&#10;Task assignment and tracking&#10;Basic notifications"
          className="min-h-[120px] text-base font-sans resize-none"
          maxLength={1000}
        />
        <div className="flex justify-end">
          <span className="text-xs text-gray-500 font-sans">
            {data.mustHaveFeatures.join('\n').length}/1000
          </span>
        </div>
      </div>

      {/* Nice-to-have Features */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Square className="w-5 h-5 text-blue-600" />
          <Label htmlFor="niceToHaveFeatures" className="text-base font-semibold text-gray-900 font-sans">
            Nice-to-have Features
          </Label>
        </div>
        <Textarea
          id="niceToHaveFeatures"
          value={data.niceToHaveFeatures.join('\n')}
          onChange={(e) => updateField('niceToHaveFeatures', e.target.value.split('\n').filter(feature => feature.trim()))}
          placeholder="List features that would be valuable but aren't critical for launch (one per line)&#10;e.g.:&#10;Dark mode theme option&#10;Advanced analytics dashboard&#10;Third-party integrations&#10;Mobile app"
          className="min-h-[100px] text-base font-sans resize-none"
          maxLength={800}
        />
        <div className="flex justify-end">
          <span className="text-xs text-gray-500 font-sans">
            {data.niceToHaveFeatures.join('\n').length}/800
          </span>
        </div>
      </div>

      {/* Technical or Business Constraints */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <Label htmlFor="constraints" className="text-base font-semibold text-gray-900 font-sans">
            Technical or Business Constraints
            <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
          </Label>
        </div>
        <Textarea
          id="constraints"
          value={data.constraints || ""}
          onChange={(e) => updateField('constraints', e.target.value)}
          placeholder="e.g., Must integrate with existing Salesforce system, GDPR compliance required, mobile-first design mandatory, budget limit of $50k, launch deadline of Q2 2024..."
          className="min-h-[100px] text-base font-sans resize-none"
          maxLength={400}
        />
        <div className="flex justify-end">
          <span className="text-xs text-gray-500 font-sans">
            {(data.constraints || "").length}/400
          </span>
        </div>
      </div>

      {/* Prioritization Method */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-600" />
          <Label htmlFor="prioritizationMethod" className="text-base font-semibold text-gray-900 font-sans">
            Prioritization Method *
          </Label>
        </div>
        <Select value={data.prioritizationMethod || ''} onValueChange={(value) => updateField('prioritizationMethod', value as RequirementsPlanning['prioritizationMethod'])}>
          <SelectTrigger className="text-base font-sans">
            <SelectValue placeholder="Select prioritization framework" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIZATION_METHODS.map((method) => (
              <SelectItem key={method.value} value={method.value} className="font-sans">
                <div>
                  <div className="font-medium">{method.label}</div>
                  <div className="text-sm text-white-300">{method.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


    </div>
  );
}