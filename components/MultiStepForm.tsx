"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, CheckCircle, Save, AlertCircle, Clock } from "lucide-react";
import { ProductManagerFormData } from "@/types";
import { useToast } from "@/lib/hooks/use-toast";

// Import step components
import { FormStep1ProductBasics } from "@/components/form-steps/FormStep1ProductBasics";
import { FormStep2UsersProblems } from "@/components/form-steps/FormStep2UsersProblems";
import { FormStep3MarketContext } from "@/components/form-steps/FormStep3MarketContext";
import { FormStep4ValueVision } from "@/components/form-steps/FormStep4ValueVision";
import { FormStep5RequirementsPlanning } from "@/components/form-steps/FormStep5RequirementsPlanning";

// Import new components and utilities
import { useFormPersistence } from "@/lib/hooks/useFormPersistence";
import { FormRecoveryDialog } from "@/components/FormRecoveryDialog";
import { ValidationFeedback, ValidationSummary } from "@/components/ValidationFeedback";
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
  validateEntireForm,
  StepValidationResult
} from "@/lib/utils/form-validation";

interface MultiStepFormProps {
  onSubmit: (data: ProductManagerFormData) => void;
  isSubmitting?: boolean;
  initialData?: ProductManagerFormData | null;
}

const STEPS = [
  { id: 1, title: "Product Basics", description: "Core product information" },
  { id: 2, title: "Users & Problems", description: "Target users and pain points" },
  { id: 3, title: "Market Context", description: "Competitive landscape" },
  { id: 4, title: "Value & Vision", description: "Value proposition and vision" },
  { id: 5, title: "Requirements & Planning", description: "Features and planning" },
];

export function MultiStepForm({ onSubmit, isSubmitting = false, initialData }: MultiStepFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [savedFormData, setSavedFormData] = useState<ProductManagerFormData | null>(null);
  const [savedTimestamp, setSavedTimestamp] = useState<number>();
  const [validationResults, setValidationResults] = useState<Record<string, StepValidationResult>>({});
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const hasRestoredRef = useRef(false);

  // Form data state
  const [formData, setFormData] = useState<ProductManagerFormData>({
    step1: {
      productName: "",
      productPitch: "",
      industry: "",
      currentStage: "idea",
    },
    step2: {
      targetUsers: "",
      painPoints: [],
      primaryJobToBeDone: "",
    },
    step3: {
      competitors: [],
      differentiation: "",
      marketTrend: "",
    },
    step4: {
      valueProposition: "",
      productVision: "",
      successMetric: "",
    },
    step5: {
      mustHaveFeatures: [],
      niceToHaveFeatures: [],
      constraints: "",
      prioritizationMethod: "RICE",
    },
  });

  // Helper function to check if there are unsaved changes
  const hasUnsavedChanges = useCallback((): boolean => {
    const emptyForm = {
      step1: { productName: "", productPitch: "", industry: "", currentStage: "idea" as const },
      step2: { targetUsers: "", painPoints: [], primaryJobToBeDone: "" },
      step3: { competitors: [], differentiation: "", marketTrend: "" },
      step4: { valueProposition: "", productVision: "", successMetric: "" },
      step5: { mustHaveFeatures: [], niceToHaveFeatures: [], constraints: "", prioritizationMethod: "RICE" as const }
    };

    return JSON.stringify(formData) !== JSON.stringify(emptyForm);
  }, [formData]);

  // Update validation and completion status
  const updateValidationAndCompletion = useCallback((data: ProductManagerFormData) => {
    const results = {
      step1: validateStep1(data.step1),
      step2: validateStep2(data.step2),
      step3: validateStep3(data.step3),
      step4: validateStep4(data.step4),
      step5: validateStep5(data.step5)
    };

    setValidationResults(results);

    // Update completed steps based on validation
    const newCompletedSteps = new Set<number>();
    Object.entries(results).forEach(([step, result]) => {
      if (result.isValid) {
        newCompletedSteps.add(parseInt(step.replace('step', '')));
      }
    });
    setCompletedSteps(newCompletedSteps);
  }, []);

  // Form persistence hook
  const { saveNow, clearSavedData, hasSavedData, loadFromStorage } = useFormPersistence({
    key: 'prd-chek-form-data',
    data: formData,
    autoSaveInterval: 30000, // 30 seconds
    onRestore: (data) => {
      if (!hasRestoredRef.current && !initialData) {
        setSavedFormData(data);
        setSavedTimestamp(Date.now());
        setShowRecoveryDialog(true);
        hasRestoredRef.current = true;
      }
    }
  });

  // Check for saved data on mount (only once)
  useEffect(() => {
    if (!hasRestoredRef.current && hasSavedData() && !initialData) {
      const saved = loadFromStorage();
      if (saved) {
        setSavedFormData(saved);
        setSavedTimestamp(Date.now());
        setShowRecoveryDialog(true);
        hasRestoredRef.current = true;
      }
    }
  }, [hasSavedData, initialData, loadFromStorage]);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      updateValidationAndCompletion(initialData);
      // Don't mark as interacted for initial data from templates
      // Let user interact naturally first
    }
  }, [initialData, updateValidationAndCompletion]);

  // Update validation results when form data changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateValidationAndCompletion(formData);
    }, 100); // 100ms debounce

    return () => clearTimeout(timeoutId);
  }, [formData, updateValidationAndCompletion]);

  // Handle browser navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    const handlePopState = () => {
      if (hasUnsavedChanges()) {
        const shouldLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
        if (!shouldLeave) {
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);

  const isStepValid = useCallback((step: number): boolean => {
    const stepKey = `step${step}` as keyof typeof validationResults;
    return validationResults[stepKey]?.isValid || false;
  }, [validationResults]);

  const updateStepData = useCallback((step: keyof ProductManagerFormData, data: unknown) => {
    // Mark that user has interacted with the form
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }

    setFormData(prev => {
      // Only update if data has actually changed
      if (JSON.stringify(prev[step]) === JSON.stringify(data)) {
        return prev;
      }

      const newData = {
        ...prev,
        [step]: data,
      };
      return newData;
    });
    setLastSaveTime(new Date());
  }, [hasUserInteracted]);

  const handleNext = () => {
    // Mark user interaction when they try to navigate
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }

    if (isStepValid(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
      saveNow(); // Save progress when moving to next step
    } else {
      toast({
        title: "Please fix validation errors",
        description: "Complete all required fields before proceeding to the next step.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Mark user interaction when they try to submit
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }

    const fullValidation = validateEntireForm(formData);

    if (!fullValidation.isValid) {
      toast({
        title: "Form validation failed",
        description: `Please fix ${fullValidation.totalErrors} error${fullValidation.totalErrors !== 1 ? 's' : ''} before submitting.`,
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);
      clearSavedData(); // Clear saved data after successful submission
      // Success toast is handled by the parent component (dashboard)
    } catch (error) {
      // Error handling is done by the parent component
      // Just ensure form stays interactive for retry
      console.error('Form submission error:', error);
    }
  };

  // Recovery dialog handlers
  const handleRestoreProgress = () => {
    if (savedFormData) {
      setFormData(savedFormData);
      updateValidationAndCompletion(savedFormData);
      setShowRecoveryDialog(false);
      hasRestoredRef.current = true;
      setHasUserInteracted(true); // Mark as interacted when restoring
      toast({
        title: "Progress restored",
        description: "Your previous form data has been restored.",
        variant: "default",
      });
    }
  };

  const handleDiscardProgress = () => {
    clearSavedData();
    setShowRecoveryDialog(false);
    hasRestoredRef.current = true;
    toast({
      title: "Starting fresh",
      description: "Previous progress has been cleared.",
      variant: "default",
    });
  };

  // Manual save handler
  const handleManualSave = () => {
    saveNow();
    setLastSaveTime(new Date());
    toast({
      title: "Progress saved",
      description: "Your form progress has been saved.",
      variant: "default",
    });
  };

  const goToStep = (step: number) => {
    // Allow navigation to completed steps or the next step after the last completed
    const maxAllowedStep = Math.max(...Array.from(completedSteps), 0) + 1;
    if (step <= maxAllowedStep && step >= 1) {
      setCurrentStep(step);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep1ProductBasics
            data={formData.step1}
            onUpdate={(data) => updateStepData('step1', data)}
          />
        );
      case 2:
        return (
          <FormStep2UsersProblems
            data={formData.step2}
            onUpdate={(data) => updateStepData('step2', data)}
          />
        );
      case 3:
        return (
          <FormStep3MarketContext
            data={formData.step3}
            onUpdate={(data) => updateStepData('step3', data)}
          />
        );
      case 4:
        return (
          <FormStep4ValueVision
            data={formData.step4}
            onUpdate={(data) => updateStepData('step4', data)}
          />
        );
      case 5:
        return (
          <FormStep5RequirementsPlanning
            data={formData.step5}
            onUpdate={(data) => updateStepData('step5', data)}
          />
        );
      default:
        return null;
    }
  };

  const progress = (currentStep / 5) * 100;
  const currentStepValidation = validationResults[`step${currentStep}` as keyof typeof validationResults];
  const fullValidation = validateEntireForm(formData);

  return (
    <>
      {/* Recovery Dialog */}
      <FormRecoveryDialog
        isOpen={showRecoveryDialog}
        onRestore={handleRestoreProgress}
        onDiscard={handleDiscardProgress}
        savedData={savedFormData}
        timestamp={savedTimestamp}
      />

      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 font-sans">
              Create Your Product Documentation
            </h2>
            <div className="flex items-center gap-4">
              {/* Auto-save indicator */}
              {lastSaveTime && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span className="font-sans">
                    Saved {lastSaveTime.toLocaleTimeString()}
                  </span>
                </div>
              )}

              {/* Manual save button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualSave}
                className="font-sans"
              >
                <Save className="w-3 h-3 mr-1" />
                Save
              </Button>

              <div className="text-sm text-gray-600 font-sans">
                Step {currentStep} of 5
              </div>
            </div>
          </div>

          <Progress value={progress} className="mb-6" />

          {/* Step Navigation - Mobile Responsive */}
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {STEPS.map((step, index) => {
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = currentStep === step.id;
              const isAccessible = step.id <= Math.max(...Array.from(completedSteps), 0) + 1;

              return (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => goToStep(step.id)}
                    disabled={!isAccessible}
                    className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 font-semibold text-xs md:text-sm transition-colors ${isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isCurrent
                        ? 'border-blue-500 text-blue-500 bg-blue-50'
                        : isAccessible
                          ? 'border-gray-300 text-gray-500 hover:border-gray-400'
                          : 'border-gray-200 text-gray-300 cursor-not-allowed'
                      }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-3 h-3 md:w-5 md:h-5" />
                    ) : (
                      step.id
                    )}
                  </button>

                  {index < STEPS.length - 1 && (
                    <div className={`w-8 md:w-16 h-0.5 mx-1 md:mx-2 ${completedSteps.has(step.id) ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-4">
            <h3 className="text-lg font-semibold text-gray-900 font-sans">
              {STEPS[currentStep - 1].title}
            </h3>
            <p className="text-gray-600 font-sans">
              {STEPS[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Validation Summary - Only show after user interaction */}
        {hasUserInteracted && (
          <div className="mb-6">
            <ValidationSummary
              totalErrors={fullValidation.totalErrors}
              totalWarnings={fullValidation.totalWarnings}
              completedSteps={completedSteps.size}
              totalSteps={5}
            />
          </div>
        )}

        {/* Form Content */}
        <Card className="shadow-sm border-0">
          <CardContent className="p-8">
            {renderCurrentStep()}

            {/* Current Step Validation - Only show after user interaction */}
            {hasUserInteracted && currentStepValidation && (
              <div className="mt-6">
                <ValidationFeedback
                  errors={currentStepValidation.errors}
                  warnings={currentStepValidation.warnings}
                  showSuccess={currentStepValidation.isValid && currentStepValidation.errors.length === 0 && currentStepValidation.warnings.length === 0}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting}
            className="font-sans w-full sm:w-auto"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid(currentStep) || isSubmitting}
              className="font-sans text-white w-full sm:w-auto"
              style={{ background: `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))` }}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!fullValidation.isValid || isSubmitting}
              className="font-sans text-white w-full sm:w-auto"
              style={{ background: `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))` }}
            >
              {isSubmitting ? 'Generating...' : 'Generate Documents'}
              {fullValidation.totalErrors > 0 && (
                <AlertCircle className="w-4 h-4 ml-2" />
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}