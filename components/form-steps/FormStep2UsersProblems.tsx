"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UsersProblems } from "@/types";
import { Users, AlertCircle, Target } from "lucide-react";

interface FormStep2UsersProblemsProps {
  data: UsersProblems;
  onUpdate: (data: UsersProblems) => void;
}

export function FormStep2UsersProblems({ data, onUpdate }: FormStep2UsersProblemsProps) {
  const updateField = (field: keyof UsersProblems, value: string | string[]) => {
    onUpdate({
      ...data,
      [field]: value,
    });
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
        <div className="flex justify-end">
          <span className="text-xs text-gray-500 font-sans">
            {data.targetUsers.length}/500
          </span>
        </div>
      </div>

      {/* Top Pain Points */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <Label htmlFor="painPoints" className="text-base font-semibold text-gray-900 font-sans">
            Top Pain Points They Face *
          </Label>
        </div>
        <Textarea
          id="painPoints"
          value={data.painPoints.join('\n')}
          onChange={(e) => updateField('painPoints', e.target.value.split('\n').filter(point => point.trim()))}
          placeholder="List the main problems or frustrations your users currently experience (one per line)&#10;e.g.:&#10;Lost customer data&#10;Missed follow-ups&#10;Time-consuming manual data entry"
          className="min-h-[120px] text-base font-sans resize-none"
          maxLength={750}
        />
        <div className="flex justify-end">
          <span className="text-xs text-gray-500 font-sans">
            {data.painPoints.join('\n').length}/750
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
        <div className="flex justify-end">
          <span className="text-xs text-gray-500 font-sans">
            {data.primaryJobToBeDone.length}/200
          </span>
        </div>
      </div>


    </div>
  );
}