"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ValueVision } from "@/types";
import { Heart, Eye, BarChart3 } from "lucide-react";

interface FormStep4ValueVisionProps {
  data: ValueVision;
  onUpdate: (data: ValueVision) => void;
}

export function FormStep4ValueVision({ data, onUpdate }: FormStep4ValueVisionProps) {
  const updateField = (field: keyof ValueVision, value: string) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8">
      {/* Core Value Proposition */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-600" />
          <Label htmlFor="valueProposition" className="text-base font-semibold text-gray-900 font-sans">
            Core Value Proposition *
          </Label>
        </div>
        <Textarea
          id="valueProposition"
          value={data.valueProposition}
          onChange={(e) => updateField('valueProposition', e.target.value)}
          placeholder="e.g., We help remote teams complete projects 40% faster by automatically organizing tasks, predicting bottlenecks, and keeping everyone aligned without endless meetings."
          className="min-h-[100px] text-base font-sans resize-none"
          maxLength={250}
        />
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 font-sans">
            In one sentence, what specific value do you deliver to your users?
          </p>
          <span className="text-xs text-gray-500 font-sans">
            {data.valueProposition.length}/250
          </span>
        </div>
      </div>

      {/* Product Vision */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600" />
          <Label htmlFor="productVision" className="text-base font-semibold text-gray-900 font-sans">
            Product Vision *
          </Label>
        </div>
        <Textarea
          id="productVision"
          value={data.productVision}
          onChange={(e) => updateField('productVision', e.target.value)}
          placeholder="e.g., To become the intelligent workspace where distributed teams effortlessly coordinate complex projects. We envision a future where project management is invisible - teams focus on creating while our AI handles the coordination."
          className="min-h-[120px] text-base font-sans resize-none"
          maxLength={400}
        />
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 font-sans">
            Describe your long-term vision for the product (1-2 sentences)
          </p>
          <span className="text-xs text-gray-500 font-sans">
            {data.productVision.length}/400
          </span>
        </div>
      </div>

      {/* Success Metric Example */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-600" />
          <Label htmlFor="successMetric" className="text-base font-semibold text-gray-900 font-sans">
            Success Metric Example
            <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
          </Label>
        </div>
        <Textarea
          id="successMetric"
          value={data.successMetric || ""}
          onChange={(e) => updateField('successMetric', e.target.value)}
          placeholder="e.g., Increase team project completion rate by 40% within 6 months, or achieve 90% user retention after 3 months, or reduce project planning time from 4 hours to 1 hour per week."
          className="min-h-[80px] text-base font-sans resize-none"
          maxLength={200}
        />
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 font-sans">
            What&apos;s one key metric or outcome that would indicate success? (KPI/OKR example)
          </p>
          <span className="text-xs text-gray-500 font-sans">
            {(data.successMetric || "").length}/200
          </span>
        </div>
      </div>

      {/* Framework Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-5">
        <h4 className="font-semibold text-blue-900 font-sans mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Vision & Value Framework
        </h4>
        <div className="space-y-4 text-sm">
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <span className="font-medium text-blue-800 font-sans block mb-1">Value Proposition Formula:</span>
            <span className="text-blue-700 font-sans">
              &quot;We help [target users] achieve [desired outcome] by [unique approach], resulting in [specific benefit]&quot;
            </span>
          </div>
          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <span className="font-medium text-purple-800 font-sans block mb-1">Vision Statement Guide:</span>
            <span className="text-purple-700 font-sans">
              Focus on the future state you want to create and the impact you want to have on your users&apos; lives or work
            </span>
          </div>
          <div className="bg-white rounded-lg p-3 border border-green-100">
            <span className="font-medium text-green-800 font-sans block mb-1">Success Metrics Examples:</span>
            <span className="text-green-700 font-sans">
              • User engagement: &quot;90% weekly active users&quot; • Efficiency: &quot;50% reduction in task completion time&quot; • Business: &quot;25% increase in team productivity&quot;
            </span>
          </div>
        </div>
      </div>

      {/* Examples Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 font-sans mb-2 flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Real Examples
        </h4>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-yellow-800 font-sans">Slack&apos;s Value Prop:</span>
            <span className="text-yellow-700 font-sans ml-1">
              &quot;Transform how teams communicate by replacing email with organized, searchable conversations&quot;
            </span>
          </div>
          <div>
            <span className="font-medium text-yellow-800 font-sans">Notion&apos;s Vision:</span>
            <span className="text-yellow-700 font-sans ml-1">
              &quot;A workspace where teams can think, write, and plan together in one unified tool&quot;
            </span>
          </div>
          <div>
            <span className="font-medium text-yellow-800 font-sans">Success Metric:</span>
            <span className="text-yellow-700 font-sans ml-1">
              &quot;Reduce time spent in status meetings by 75% within first quarter of adoption&quot;
            </span>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 font-sans mb-2">Step 4 Progress</h4>
        <div className="space-y-1 text-sm">
          <div className={`flex items-center gap-2 ${data.valueProposition.trim() ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${data.valueProposition.trim() ? 'bg-green-500' : 'bg-gray-300'}`} />
            Core value proposition defined
          </div>
          <div className={`flex items-center gap-2 ${data.productVision.trim() ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${data.productVision.trim() ? 'bg-green-500' : 'bg-gray-300'}`} />
            Product vision articulated
          </div>
          <div className={`flex items-center gap-2 text-green-600`}>
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Success metric provided (optional)
          </div>
        </div>
      </div>
    </div>
  );
}