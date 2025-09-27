"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormPersistence } from "@/lib/hooks/useFormPersistence";
import { ProductManagerFormData } from '@/types';

export function FormPersistenceTest() {
  const [testData, setTestData] = useState<ProductManagerFormData>({
    step1: {
      productName: "Test Product",
      productPitch: "This is a test product pitch",
      industry: "Technology",
      currentStage: "idea",
      differentiation: "Test differentiation",
    },
    step2: {
      valueProposition: "Test value proposition",
      productVision: "Test product vision",
    },
    step3: {
      targetUsers: "Test users",
      painPoints: ["Test pain point 1", "Test pain point 2"],
      primaryJobToBeDone: "Test job to be done",
    },
    step4: {
      competitors: [{ name: "Competitor 1", note: "Test note" }],
    },
    step5: {
      mustHaveFeatures: ["Feature 1", "Feature 2"],
      niceToHaveFeatures: ["Nice feature 1"],
      constraints: "Test constraints",
      prioritizationMethod: "RICE",
    },
  });

  const { saveNow, clearSavedData, hasSavedData } = useFormPersistence({
    key: 'test-form-data',
    data: testData,
    autoSaveInterval: 5000, // 5 seconds for testing
  });

  const updateTestData = () => {
    setTestData(prev => ({
      ...prev,
      step1: {
        ...prev.step1,
        productName: `Test Product ${Date.now()}`
      }
    }));
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Form Persistence Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">
            Current Product Name: {testData.step1.productName}
          </p>
          <p className="text-sm text-gray-600">
            Has Saved Data: {hasSavedData() ? 'Yes' : 'No'}
          </p>
        </div>
        
        <div className="space-y-2">
          <Button onClick={updateTestData} className="w-full">
            Update Test Data
          </Button>
          <Button onClick={saveNow} variant="outline" className="w-full">
            Save Now
          </Button>
          <Button onClick={clearSavedData} variant="destructive" className="w-full">
            Clear Saved Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}