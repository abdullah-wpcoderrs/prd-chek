"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductManagerFormData } from "@/types";
import { CheckCircle, RefreshCw, Sparkles } from "lucide-react";

interface ProjectOutlinePreviewProps {
  outline: ProductManagerFormData;
  changes?: string[];
  onApprove: () => void;
  onReiterate: () => void;
  isSubmitting?: boolean;
}

export function ProjectOutlinePreview({
  outline,
  changes = [],
  onApprove,
  onReiterate,
  isSubmitting = false
}: ProjectOutlinePreviewProps) {
  return (
    <Card className="mt-4 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Project Outline
          </CardTitle>
          {changes.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {changes.length} change{changes.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Product Basics */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Product Basics</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>{" "}
              <span className="font-medium">{outline.step1.productName}</span>
            </div>
            <div>
              <span className="text-gray-600">Industry:</span>{" "}
              <span className="font-medium">{outline.step1.industry}</span>
            </div>
            <div>
              <span className="text-gray-600">Stage:</span>{" "}
              <Badge variant="outline" className="ml-1">
                {outline.step1.currentStage}
              </Badge>
            </div>
            <div>
              <span className="text-gray-600">Pitch:</span>{" "}
              <p className="text-gray-900 mt-1">{outline.step1.productPitch}</p>
            </div>
          </div>
        </div>

        {/* Value & Vision */}
        <div className="border-t pt-3">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Value & Vision</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Value Proposition:</span>
              <p className="text-gray-900 mt-1">{outline.step2.valueProposition}</p>
            </div>
            <div>
              <span className="text-gray-600">Vision:</span>
              <p className="text-gray-900 mt-1">{outline.step2.productVision}</p>
            </div>
          </div>
        </div>

        {/* Target Users */}
        <div className="border-t pt-3">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Target Users</h4>
          <p className="text-sm text-gray-900">{outline.step3.targetUsers}</p>
        </div>

        {/* Pain Points */}
        <div className="border-t pt-3">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">
            Pain Points ({outline.step3.painPoints.length})
          </h4>
          <ul className="space-y-1 text-sm">
            {outline.step3.painPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span className="text-gray-900">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Must-Have Features */}
        <div className="border-t pt-3">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">
            Must-Have Features ({outline.step5.mustHaveFeatures.length})
          </h4>
          <ul className="space-y-1 text-sm">
            {outline.step5.mustHaveFeatures.slice(0, 5).map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-900">{feature}</span>
              </li>
            ))}
            {outline.step5.mustHaveFeatures.length > 5 && (
              <li className="text-gray-500 text-xs ml-6">
                +{outline.step5.mustHaveFeatures.length - 5} more features
              </li>
            )}
          </ul>
        </div>

        {/* Competitors */}
        {outline.step4.competitors.length > 0 && (
          <div className="border-t pt-3">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">
              Competitors ({outline.step4.competitors.length})
            </h4>
            <div className="space-y-2">
              {outline.step4.competitors.map((competitor, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium text-gray-900">{competitor.name}</span>
                  {competitor.note && (
                    <p className="text-gray-600 text-xs mt-0.5">{competitor.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Changes Summary */}
        {changes.length > 0 && (
          <div className="border-t pt-3">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Recent Changes</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              {changes.map((change, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600">→</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={onApprove}
            disabled={isSubmitting}
            className="flex-1 text-white"
            style={{ background: `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))` }}
          >
            {isSubmitting ? (
              <>Generating...</>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve & Generate
              </>
            )}
          </Button>
          <Button
            onClick={onReiterate}
            disabled={isSubmitting}
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reiterate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
