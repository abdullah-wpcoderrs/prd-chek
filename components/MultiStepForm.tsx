"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { ProductManagerFormData, ProductBasics, UsersProblems, MarketContext, ValueVision, RequirementsPlanning } from "@/types";

// Import step components
import { FormStep1ProductBasics } from "@/components/form-steps/FormStep1ProductBasics";
import { FormStep2UsersProblems } from "@/components/form-steps/FormStep2UsersProblems";
import { FormStep3MarketContext } from "@/components/form-steps/FormStep3MarketContext";
import { FormStep4ValueVision } from "@/components/form-steps/FormStep4ValueVision";
import { FormStep5RequirementsPlanning } from "@/components/form-steps/FormStep5RequirementsPlanning";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Form data state
  const [formData, setFormData] = useState<ProductManagerFormData>(
    initialData || {
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
    }
  );

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Mark steps as completed if they have data
      const newCompletedSteps = new Set<number>();
      if (validateStep1(initialData.step1)) newCompletedSteps.add(1);
      if (validateStep2(initialData.step2)) newCompletedSteps.add(2);
      if (validateStep3(initialData.step3)) newCompletedSteps.add(3);
      if (validateStep4(initialData.step4)) newCompletedSteps.add(4);
      if (validateStep5(initialData.step5)) newCompletedSteps.add(5);
      setCompletedSteps(newCompletedSteps);
    }
  }, [initialData]);

  // Validation functions for each step
  const validateStep1 = (data: ProductBasics): boolean => {
    return !!(data.productName.trim() && data.productPitch.trim() && data.industry);
  };

  const validateStep2 = (data: UsersProblems): boolean => {
    return !!(data.targetUsers.trim() && data.painPoints.length > 0 && data.primaryJobToBeDone.trim());
  };

  const validateStep3 = (data: MarketContext): boolean => {
    return !!(data.differentiation.trim());
  };

  const validateStep4 = (data: ValueVision): boolean => {
    return !!(data.valueProposition.trim() && data.productVision.trim());
  };

  const validateStep5 = (data: RequirementsPlanning): boolean => {
    return !!(data.mustHaveFeatures.length > 0);
  };

  const isStepValid = useCallback((step: number): boolean => {
    switch (step) {
      case 1: return validateStep1(formData.step1);
      case 2: return validateStep2(formData.step2);
      case 3: return validateStep3(formData.step3);
      case 4: return validateStep4(formData.step4);
      case 5: return validateStep5(formData.step5);
      default: return false;
    }
  }, [formData]);

  const updateStepData = useCallback((step: keyof ProductManagerFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data,
    }));
  }, []);

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (isStepValid(5)) {
      setCompletedSteps(prev => new Set([...prev, 5]));
      onSubmit(formData);
    }
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 font-sans">
            Create Your Product Documentation
          </h2>
          <div className="text-sm text-gray-600 font-sans">
            Step {currentStep} of 5
          </div>
        </div>

        <Progress value={progress} className="mb-6" />

        {/* Step Navigation */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = currentStep === step.id;
            const isAccessible = step.id <= Math.max(...Array.from(completedSteps), 0) + 1;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  disabled={!isAccessible}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm transition-colors ${isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isCurrent
                        ? 'border-blue-500 text-blue-500 bg-blue-50'
                        : isAccessible
                          ? 'border-gray-300 text-gray-500 hover:border-gray-400'
                          : 'border-gray-200 text-gray-300 cursor-not-allowed'
                    }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </button>

                {index < STEPS.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${completedSteps.has(step.id) ? 'bg-green-500' : 'bg-gray-200'
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

      {/* Form Content */}
      <Card className="shadow-sm border-0">
        <CardContent className="p-8">
          {renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1 || isSubmitting}
          className="font-sans"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < 5 ? (
          <Button
            onClick={handleNext}
            disabled={!isStepValid(currentStep) || isSubmitting}
            className="font-sans text-white"
            style={{ background: `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))` }}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!isStepValid(5) || isSubmitting}
            className="font-sans text-white"
            style={{ background: `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))` }}
          >
            {isSubmitting ? 'Generating...' : 'Generate Documents'}
          </Button>
        )}
      </div>
    </div>
  );
}