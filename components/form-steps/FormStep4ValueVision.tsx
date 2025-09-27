"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ValueVision } from "@/types";
import { Heart, Eye } from "lucide-react";

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
        <div className="flex justify-end">
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
        <div className="flex justify-end">
          <span className="text-xs text-gray-500 font-sans">
            {data.productVision.length}/400
          </span>
        </div>
      </div>




    </div>
  );
}