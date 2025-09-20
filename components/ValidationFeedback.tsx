"use client";

import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { ValidationError } from "@/lib/utils/form-validation";

interface ValidationFeedbackProps {
  errors?: ValidationError[];
  warnings?: ValidationError[];
  className?: string;
  showSuccess?: boolean;
}

export function ValidationFeedback({ 
  errors = [], 
  warnings = [], 
  className = "",
  showSuccess = false 
}: ValidationFeedbackProps) {
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;
  const isValid = !hasErrors && !hasWarnings;

  if (!hasErrors && !hasWarnings && !showSuccess) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Success state */}
      {isValid && showSuccess && (
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-800 font-sans">
            All fields are valid
          </div>
        </div>
      )}

      {/* Errors */}
      {hasErrors && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800 font-sans">
                <span className="font-medium">Error:</span> {error.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warnings */}
      {hasWarnings && (
        <div className="space-y-2">
          {warnings.map((warning, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800 font-sans">
                <span className="font-medium">Warning:</span> {warning.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface FieldValidationProps {
  error?: ValidationError;
  warning?: ValidationError;
  isValid?: boolean;
  showValidIcon?: boolean;
}

export function FieldValidation({ 
  error, 
  warning, 
  isValid = false,
  showValidIcon = false 
}: FieldValidationProps) {
  if (!error && !warning && !showValidIcon) {
    return null;
  }

  return (
    <div className="mt-1">
      {error && (
        <div className="flex items-center gap-1 text-red-600">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span className="text-xs font-sans">{error.message}</span>
        </div>
      )}
      
      {!error && warning && (
        <div className="flex items-center gap-1 text-amber-600">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <span className="text-xs font-sans">{warning.message}</span>
        </div>
      )}
      
      {!error && !warning && isValid && showValidIcon && (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="w-3 h-3 flex-shrink-0" />
          <span className="text-xs font-sans">Valid</span>
        </div>
      )}
    </div>
  );
}

interface ValidationSummaryProps {
  totalErrors: number;
  totalWarnings: number;
  completedSteps: number;
  totalSteps: number;
}

export function ValidationSummary({ 
  totalErrors, 
  totalWarnings, 
  completedSteps, 
  totalSteps 
}: ValidationSummaryProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900 font-sans">Form Status</h4>
        <div className="text-sm text-gray-600 font-sans">
          {completedSteps}/{totalSteps} steps completed
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-green-600">
            {completedSteps}
          </div>
          <div className="text-xs text-gray-600 font-sans">Completed</div>
        </div>
        
        <div className="space-y-1">
          <div className="text-2xl font-bold text-amber-600">
            {totalWarnings}
          </div>
          <div className="text-xs text-gray-600 font-sans">Warnings</div>
        </div>
        
        <div className="space-y-1">
          <div className="text-2xl font-bold text-red-600">
            {totalErrors}
          </div>
          <div className="text-xs text-gray-600 font-sans">Errors</div>
        </div>
      </div>
      
      {totalErrors === 0 && totalWarnings === 0 && completedSteps === totalSteps && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-center">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium font-sans">Ready to generate!</span>
          </div>
        </div>
      )}
    </div>
  );
}