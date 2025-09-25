"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UsersProblems } from "@/types";
import { Users, AlertCircle, Target, Plus, X } from "lucide-react";

interface FormStep2UsersProblemsProps {
  data: UsersProblems;
  onUpdate: (data: UsersProblems) => void;
}

export function FormStep2UsersProblems({ data, onUpdate }: FormStep2UsersProblemsProps) {
  const [newPainPoint, setNewPainPoint] = useState("");

  const updateField = (field: keyof UsersProblems, value: string | string[]) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  const addPainPoint = () => {
    if (newPainPoint.trim() && data.painPoints.length < 5) {
      updateField('painPoints', [...data.painPoints, newPainPoint.trim()]);
      setNewPainPoint("");
    }
  };

  const removePainPoint = (index: number) => {
    const updatedPainPoints = data.painPoints.filter((_, i) => i !== index);
    updateField('painPoints', updatedPainPoints);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addPainPoint();
    }
  };

  return (
    <div className="space-y-8">
      {/* Target Users */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <Label htmlFor="targetUsers" className="text-base font-semibold text-gray-900 font-sans">
            Who are your target users? *
          </Label>
        </div>
        <Textarea
          id="targetUsers"
          value={data.targetUsers}
          onChange={(e) => updateField('targetUsers', e.target.value)}
          placeholder="e.g., Remote software development teams of 5-50 people, project managers in tech startups, freelance developers who work with multiple clients..."
          className="min-h-[120px] text-base font-sans resize-none"
          maxLength={500}
        />
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 font-sans">
            Describe your primary users, their roles, company size, and key characteristics
          </p>
          <span className="text-xs text-gray-500 font-sans">
            {data.targetUsers.length}/500
          </span>
        </div>
      </div>

      {/* Top 3 Pain Points */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <Label className="text-base font-semibold text-gray-900 font-sans">
            Top 3 Pain Points They Face *
          </Label>
        </div>
        
        {/* Existing Pain Points */}
        <div className="space-y-2">
          {data.painPoints.map((painPoint, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <div className="flex-1 text-gray-900 font-sans">
                {painPoint}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePainPoint(index)}
                className="text-gray-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add New Pain Point */}
        {data.painPoints.length < 5 && (
          <div className="flex gap-2">
            <Input
              value={newPainPoint}
              onChange={(e) => setNewPainPoint(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Pain point ${data.painPoints.length + 1}...`}
              className="flex-1 font-sans"
              maxLength={150}
            />
            <Button
              onClick={addPainPoint}
              disabled={!newPainPoint.trim()}
              variant="outline"
              className="font-sans"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 font-sans">
            List the main problems or frustrations your users currently experience (minimum 1, maximum 5)
          </p>
          <span className="text-xs text-gray-500 font-sans">
            {data.painPoints.length}/5 pain points
          </span>
        </div>
      </div>

      {/* Primary Job-To-Be-Done */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-green-600" />
          <Label htmlFor="primaryJobToBeDone" className="text-base font-semibold text-gray-900 font-sans">
            Primary Job-To-Be-Done *
          </Label>
        </div>
        <Textarea
          id="primaryJobToBeDone"
          value={data.primaryJobToBeDone}
          onChange={(e) => updateField('primaryJobToBeDone', e.target.value)}
          placeholder="e.g., Help remote teams coordinate project tasks efficiently while maintaining clear visibility into project progress and deadlines."
          className="min-h-[80px] text-base font-sans resize-none"
          maxLength={200}
        />
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 font-sans">
            What is the main job or outcome your users are trying to achieve? (One sentence)
          </p>
          <span className="text-xs text-gray-500 font-sans">
            {data.primaryJobToBeDone.length}/200
          </span>
        </div>
      </div>

      {/* Examples Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 font-sans mb-2 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Examples to Guide You
        </h4>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-blue-800 font-sans">Target Users:</span>
            <span className="text-blue-700 font-sans ml-1">
              &quot;Small business owners (5-20 employees) who manage customer relationships manually using spreadsheets or basic CRM tools&quot;
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-800 font-sans">Pain Points:</span>
            <span className="text-blue-700 font-sans ml-1">
              &quot;Lost customer data, missed follow-ups, time-consuming manual data entry&quot;
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-800 font-sans">Job-To-Be-Done:</span>
            <span className="text-blue-700 font-sans ml-1">
              &quot;Efficiently manage customer relationships and sales pipeline without complex setup or training&quot;
            </span>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 font-sans mb-2">Step 2 Progress</h4>
        <div className="space-y-1 text-sm">
          <div className={`flex items-center gap-2 ${data.targetUsers.trim() ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${data.targetUsers.trim() ? 'bg-green-500' : 'bg-gray-300'}`} />
            Target users described
          </div>
          <div className={`flex items-center gap-2 ${data.painPoints.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${data.painPoints.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
            Pain points identified ({data.painPoints.length})
          </div>
          <div className={`flex items-center gap-2 ${data.primaryJobToBeDone.trim() ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${data.primaryJobToBeDone.trim() ? 'bg-green-500' : 'bg-gray-300'}`} />
            Primary job-to-be-done defined
          </div>
        </div>
      </div>
    </div>
  );
}