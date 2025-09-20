"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RequirementsPlanning } from "@/types";
import { CheckSquare, Square, Settings, Plus, X, AlertTriangle } from "lucide-react";

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
  const [newMustHave, setNewMustHave] = useState("");
  const [newNiceToHave, setNewNiceToHave] = useState("");

  const updateField = (field: keyof RequirementsPlanning, value: string | string[]) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  const addMustHaveFeature = () => {
    if (newMustHave.trim() && data.mustHaveFeatures.length < 10) {
      updateField('mustHaveFeatures', [...data.mustHaveFeatures, newMustHave.trim()]);
      setNewMustHave("");
    }
  };

  const removeMustHaveFeature = (index: number) => {
    const updated = data.mustHaveFeatures.filter((_, i) => i !== index);
    updateField('mustHaveFeatures', updated);
  };

  const addNiceToHaveFeature = () => {
    if (newNiceToHave.trim() && data.niceToHaveFeatures.length < 10) {
      updateField('niceToHaveFeatures', [...data.niceToHaveFeatures, newNiceToHave.trim()]);
      setNewNiceToHave("");
    }
  };

  const removeNiceToHaveFeature = (index: number) => {
    const updated = data.niceToHaveFeatures.filter((_, i) => i !== index);
    updateField('niceToHaveFeatures', updated);
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'must' | 'nice') => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (type === 'must') {
        addMustHaveFeature();
      } else {
        addNiceToHaveFeature();
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Must-have Features */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-red-600" />
          <Label className="text-base font-semibold text-gray-900 font-sans">
            Must-have Features *
          </Label>
        </div>
        
        {/* Existing Must-have Features */}
        <div className="space-y-2">
          {data.mustHaveFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <CheckSquare className="w-4 h-4 text-red-600 flex-shrink-0" />
              <div className="flex-1 text-gray-900 font-sans">
                {feature}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeMustHaveFeature(index)}
                className="text-gray-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add New Must-have Feature */}
        {data.mustHaveFeatures.length < 10 && (
          <div className="flex gap-2">
            <Input
              value={newMustHave}
              onChange={(e) => setNewMustHave(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'must')}
              placeholder="e.g., User authentication and login system"
              className="flex-1 font-sans"
              maxLength={100}
            />
            <Button
              onClick={addMustHaveFeature}
              disabled={!newMustHave.trim()}
              variant="outline"
              className="font-sans"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 font-sans">
            Core features essential for your MVP (minimum 1, maximum 10)
          </p>
          <span className="text-xs text-gray-500 font-sans">
            {data.mustHaveFeatures.length}/10 features
          </span>
        </div>
      </div>

      {/* Nice-to-have Features */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Square className="w-5 h-5 text-blue-600" />
          <Label className="text-base font-semibold text-gray-900 font-sans">
            Nice-to-have Features
          </Label>
        </div>
        
        {/* Existing Nice-to-have Features */}
        <div className="space-y-2">
          {data.niceToHaveFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Square className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="flex-1 text-gray-900 font-sans">
                {feature}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNiceToHaveFeature(index)}
                className="text-gray-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add New Nice-to-have Feature */}
        {data.niceToHaveFeatures.length < 10 && (
          <div className="flex gap-2">
            <Input
              value={newNiceToHave}
              onChange={(e) => setNewNiceToHave(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'nice')}
              placeholder="e.g., Dark mode theme option"
              className="flex-1 font-sans"
              maxLength={100}
            />
            <Button
              onClick={addNiceToHaveFeature}
              disabled={!newNiceToHave.trim()}
              variant="outline"
              className="font-sans"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 font-sans">
            Features that would be valuable but aren't critical for launch (maximum 10)
          </p>
          <span className="text-xs text-gray-500 font-sans">
            {data.niceToHaveFeatures.length}/10 features
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
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 font-sans">
            Any technical limitations, budget constraints, compliance requirements, or deadlines
          </p>
          <span className="text-xs text-gray-500 font-sans">
            {(data.constraints || "").length}/400
          </span>
        </div>
      </div>

      {/* Prioritization Method */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-600" />
          <Label className="text-base font-semibold text-gray-900 font-sans">
            Prioritization Method *
          </Label>
        </div>
        
        <div className="grid gap-3">
          {PRIORITIZATION_METHODS.map((method) => (
            <div
              key={method.value}
              onClick={() => updateField('prioritizationMethod', method.value as RequirementsPlanning['prioritizationMethod'])}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-purple-300 ${
                data.prioritizationMethod === method.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-semibold text-gray-900 font-sans mb-1">
                {method.label}
              </div>
              <div className="text-sm text-gray-600 font-sans">
                {method.description}
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-600 font-sans">
          Choose the framework you'd like to use for prioritizing features in your documentation
        </p>
      </div>

      {/* Feature Examples */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 font-sans mb-2 flex items-center gap-2">
          <CheckSquare className="w-4 h-4" />
          Feature Examples
        </h4>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-green-800 font-sans">Must-have:</span>
            <span className="text-green-700 font-sans ml-1">
              "User registration, project creation, task assignment, basic notifications"
            </span>
          </div>
          <div>
            <span className="font-medium text-green-800 font-sans">Nice-to-have:</span>
            <span className="text-green-700 font-sans ml-1">
              "Advanced analytics, custom themes, third-party integrations, mobile app"
            </span>
          </div>
          <div>
            <span className="font-medium text-green-800 font-sans">Constraints:</span>
            <span className="text-green-700 font-sans ml-1">
              "Must work on mobile devices, integrate with Slack, comply with SOC 2, launch by Q3"
            </span>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 font-sans mb-2">Step 5 Progress</h4>
        <div className="space-y-1 text-sm">
          <div className={`flex items-center gap-2 ${data.mustHaveFeatures.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${data.mustHaveFeatures.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
            Must-have features defined ({data.mustHaveFeatures.length})
          </div>
          <div className={`flex items-center gap-2 text-green-600`}>
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Nice-to-have features listed ({data.niceToHaveFeatures.length})
          </div>
          <div className={`flex items-center gap-2 text-green-600`}>
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Constraints documented (optional)
          </div>
          <div className={`flex items-center gap-2 ${data.prioritizationMethod ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${data.prioritizationMethod ? 'bg-green-500' : 'bg-gray-300'}`} />
            Prioritization method selected
          </div>
        </div>
      </div>
    </div>
  );
}