"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, AlertCircle } from "lucide-react";
import { ProductManagerFormData } from '@/types';

interface FormRecoveryDialogProps {
  isOpen: boolean;
  onRestore: () => void;
  onDiscard: () => void;
  savedData: ProductManagerFormData | null;
  timestamp?: number;
}

export function FormRecoveryDialog({
  isOpen,
  onRestore,
  onDiscard,
  savedData,
  timestamp
}: FormRecoveryDialogProps) {
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await onRestore();
    } finally {
      setIsRestoring(false);
    }
  };

  const formatTimestamp = (ts?: number) => {
    if (!ts) return 'Unknown time';
    
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const getCompletionSummary = () => {
    if (!savedData) return null;

    const checkFieldValue = (data: unknown, field: string): boolean => {
      const obj = data as Record<string, unknown>;
      const value = obj[field];
      return Array.isArray(value) ? value.length > 0 : Boolean(value?.toString?.().trim());
    };

    const steps = [
      { name: 'Product Basics', data: savedData.step1, required: ['productName', 'productPitch', 'industry'] },
      { name: 'Users & Problems', data: savedData.step2, required: ['targetUsers', 'primaryJobToBeDone'] },
      { name: 'Market Context', data: savedData.step3, required: ['differentiation'] },
      { name: 'Value & Vision', data: savedData.step4, required: ['valueProposition', 'productVision'] },
      { name: 'Requirements', data: savedData.step5, required: ['mustHaveFeatures'] }
    ];

    return steps.map((step, index) => {
      const isComplete = step.required.every(field => checkFieldValue(step.data, field));

      return {
        ...step,
        isComplete,
        stepNumber: index + 1
      };
    });
  };

  const completionSummary = getCompletionSummary();
  const completedSteps = completionSummary?.filter(step => step.isComplete).length || 0;
  const totalSteps = completionSummary?.length || 5;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-sans">
            <FileText className="w-5 h-5 text-blue-600" />
            Restore Previous Progress?
          </DialogTitle>
          <DialogDescription className="font-sans">
            We found a saved draft of your form from {formatTimestamp(timestamp)}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900 font-sans">
                Progress Summary
              </span>
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                {completedSteps}/{totalSteps} steps
              </Badge>
            </div>
            
            <div className="space-y-2">
              {completionSummary?.map((step) => (
                <div key={step.stepNumber} className="flex items-center gap-2 text-sm">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.isComplete 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.isComplete ? '✓' : step.stepNumber}
                  </div>
                  <span className={`font-sans ${
                    step.isComplete ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Name Preview */}
          {savedData?.step1?.productName && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs font-medium text-gray-600 mb-1 font-sans">Product Name</div>
              <div className="text-sm font-medium text-gray-900 font-sans">
                {savedData.step1.productName}
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800 font-sans">
              Choosing &quot;Start Fresh&quot; will permanently delete your saved progress.
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onDiscard}
            disabled={isRestoring}
            className="font-sans"
          >
            Start Fresh
          </Button>
          <Button
            onClick={handleRestore}
            disabled={isRestoring}
            className="font-sans text-white"
            style={{ backgroundColor: 'var(--steel-blue-600)' }}
          >
            {isRestoring ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Restoring...
              </>
            ) : (
              'Restore Progress'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}