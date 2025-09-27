"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FormPersistenceTest } from "@/components/test/FormPersistenceTest";
import { ValidationFeedback, FieldValidation, ValidationSummary } from "@/components/ValidationFeedback";
import { validateStep1, validateStep3 } from "@/lib/utils/form-validation-new";
import { ProductBasics, UsersProblems } from '@/types';

export default function TestFeaturesPage() {
  const [step1Data, setStep1Data] = useState<ProductBasics>({
    productName: "",
    productPitch: "",
    industry: "",
    currentStage: "",
    differentiation: "",
  });

  const [step3Data, setStep3Data] = useState<UsersProblems>({
    targetUsers: "",
    painPoints: [],
    primaryJobToBeDone: "",
  });

  const step1Validation = validateStep1(step1Data);
  const step3Validation = validateStep3(step3Data);

  const addPainPoint = () => {
    setStep3Data(prev => ({
      ...prev,
      painPoints: [...prev.painPoints, ""]
    }));
  };

  const updatePainPoint = (index: number, value: string) => {
    setStep3Data(prev => ({
      ...prev,
      painPoints: prev.painPoints.map((point, i) => i === index ? value : point)
    }));
  };

  const removePainPoint = (index: number) => {
    setStep3Data(prev => ({
      ...prev,
      painPoints: prev.painPoints.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PRD-Chek V2 Features Test
          </h1>
          <p className="text-lg text-gray-600">
            Test the new form persistence, validation, and error handling features
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Persistence Test */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Form Persistence Test</h2>
            <FormPersistenceTest />
          </div>

          {/* Validation Test */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Validation Test</h2>
            <ValidationSummary
              totalErrors={step1Validation.errors.length + step3Validation.errors.length}
              totalWarnings={step1Validation.warnings.length + step3Validation.warnings.length}
              completedSteps={[step1Validation.isValid, step3Validation.isValid].filter(Boolean).length}
              totalSteps={2}
            />
          </div>
        </div>

        {/* Step 1 Validation Test */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Step 1 Validation Test
                <Badge variant={step1Validation.isValid ? "default" : "destructive"}>
                  {step1Validation.isValid ? "Valid" : "Invalid"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <Input
                  value={step1Data.productName}
                  onChange={(e) => setStep1Data(prev => ({ ...prev, productName: e.target.value }))}
                  placeholder="Enter product name"
                />
                <FieldValidation
                  error={step1Validation.errors.find(e => e.field === 'productName')}
                  warning={step1Validation.warnings.find(w => w.field === 'productName')}
                  isValid={step1Data.productName.length >= 2 && step1Data.productName.length <= 100}
                  showValidIcon={step1Data.productName.length > 0}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Product Pitch</label>
                <Textarea
                  value={step1Data.productPitch}
                  onChange={(e) => setStep1Data(prev => ({ ...prev, productPitch: e.target.value }))}
                  placeholder="Enter product pitch (min 20 characters)"
                  rows={3}
                />
                <FieldValidation
                  error={step1Validation.errors.find(e => e.field === 'productPitch')}
                  warning={step1Validation.warnings.find(w => w.field === 'productPitch')}
                  isValid={step1Data.productPitch.length >= 20 && step1Data.productPitch.length <= 500}
                  showValidIcon={step1Data.productPitch.length > 0}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <Input
                  value={step1Data.industry}
                  onChange={(e) => setStep1Data(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="Enter industry"
                />
                <FieldValidation
                  error={step1Validation.errors.find(e => e.field === 'industry')}
                  isValid={!!step1Data.industry}
                  showValidIcon={!!step1Data.industry}
                />
              </div>

              <ValidationFeedback
                errors={step1Validation.errors}
                warnings={step1Validation.warnings}
                showSuccess={step1Validation.isValid}
              />
            </CardContent>
          </Card>
        </div>

        {/* Step 3 Validation Test */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Step 3 Validation Test (Array Validation)
                <Badge variant={step3Validation.isValid ? "default" : "destructive"}>
                  {step3Validation.isValid ? "Valid" : "Invalid"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Target Users</label>
                <Textarea
                  value={step3Data.targetUsers}
                  onChange={(e) => setStep3Data(prev => ({ ...prev, targetUsers: e.target.value }))}
                  placeholder="Describe your target users (min 10 characters)"
                  rows={2}
                />
                <FieldValidation
                  error={step3Validation.errors.find(e => e.field === 'targetUsers')}
                  isValid={step3Data.targetUsers.length >= 10}
                  showValidIcon={step3Data.targetUsers.length > 0}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Pain Points</label>
                  <Button onClick={addPainPoint} size="sm">Add Pain Point</Button>
                </div>
                
                <div className="space-y-2">
                  {step3Data.painPoints.map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={point}
                        onChange={(e) => updatePainPoint(index, e.target.value)}
                        placeholder={`Pain point ${index + 1}`}
                      />
                      <Button
                        onClick={() => removePainPoint(index)}
                        variant="outline"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                
                <FieldValidation
                  error={step3Validation.errors.find(e => e.field === 'painPoints')}
                  warning={step3Validation.warnings.find(w => w.field === 'painPoints')}
                  isValid={step3Data.painPoints.length > 0 && step3Data.painPoints.every(p => p.trim().length >= 5)}
                  showValidIcon={step3Data.painPoints.length > 0}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Primary Job To Be Done</label>
                <Textarea
                  value={step3Data.primaryJobToBeDone}
                  onChange={(e) => setStep3Data(prev => ({ ...prev, primaryJobToBeDone: e.target.value }))}
                  placeholder="What's the main job your product helps users accomplish? (min 10 characters)"
                  rows={2}
                />
                <FieldValidation
                  error={step3Validation.errors.find(e => e.field === 'primaryJobToBeDone')}
                  isValid={step3Data.primaryJobToBeDone.length >= 10}
                  showValidIcon={step3Data.primaryJobToBeDone.length > 0}
                />
              </div>

              <ValidationFeedback
                errors={step3Validation.errors}
                warnings={step3Validation.warnings}
                showSuccess={step3Validation.isValid}
              />
            </CardContent>
          </Card>
        </div>

        {/* Feature Status */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600">✅ Completed Features</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• V1 projects removed, V2 is now the only option</li>
                    <li>• Form data persistence with localStorage</li>
                    <li>• Auto-save functionality (30-second intervals)</li>
                    <li>• Form recovery on page refresh</li>
                    <li>• Browser navigation handling</li>
                    <li>• Comprehensive form validation rules</li>
                    <li>• Field-level error messages</li>
                    <li>• Form submission error handling</li>
                    <li>• Validation feedback UI components</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-amber-600">🔄 Next Steps</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• End-to-end workflow testing</li>
                    <li>• Backward compatibility testing</li>
                    <li>• Mobile responsiveness testing</li>
                    <li>• Cross-browser compatibility testing</li>
                    <li>• Performance testing with large form data</li>
                    <li>• API documentation updates</li>
                    <li>• Migration guide creation</li>
                    <li>• User documentation updates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}