"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Users, Palette, FileText, UserCheck, Save } from "lucide-react";

export interface ProjectSpec {
  coreFeatures: string;
  targetUsers: string;
  designStyle: string;
  customDesignStyle?: string;
  brandGuidelines: string;
  multiUserRoles: boolean;
  roleDefinitions?: string;
}

interface ProjectSpecModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (spec: ProjectSpec) => void;
  initialSpec?: ProjectSpec;
}

const designStyleOptions = [
  { value: "minimalist", label: "Minimalist & Clean" },
  { value: "modern", label: "Modern & Sleek" },
  { value: "playful", label: "Playful & Vibrant" },
  { value: "professional", label: "Professional & Corporate" },
  { value: "dark", label: "Dark Mode Focused" },
  { value: "other", label: "Other (Custom)" },
];

export function ProjectSpecModal({ open, onOpenChange, onSave, initialSpec }: ProjectSpecModalProps) {
  const [spec, setSpec] = useState<ProjectSpec>(
    initialSpec || {
      coreFeatures: "",
      targetUsers: "",
      designStyle: "",
      customDesignStyle: "",
      brandGuidelines: "",
      multiUserRoles: false,
      roleDefinitions: "",
    }
  );

  const handleSave = () => {
    onSave(spec);
    onOpenChange(false);
  };

  const updateSpec = (field: keyof ProjectSpec, value: string | boolean) => {
    setSpec(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = spec.coreFeatures.trim() && spec.targetUsers.trim() && spec.designStyle;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 font-sans">
            <Settings className="w-6 h-6" style={{ color: 'var(--steel-blue-600)' }} />
            Project Specification
          </DialogTitle>
          <DialogDescription className="font-sans">
            Add detailed specifications to generate more accurate and tailored documentation for your project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Core Features */}
          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--steel-blue-50)' }}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5" style={{ color: 'var(--steel-blue-600)' }} />
                <Label htmlFor="coreFeatures" className="text-base font-semibold text-gray-900 font-sans">
                  Core Features *
                </Label>
              </div>
              <Textarea
                id="coreFeatures"
                value={spec.coreFeatures}
                onChange={(e) => updateSpec('coreFeatures', e.target.value)}
                placeholder="Describe the main features and functionality of your project..."
                className="min-h-[100px] font-sans"
              />
            </CardContent>
          </Card>

          {/* Target Users */}
          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--steel-blue-50)' }}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5" style={{ color: 'var(--steel-blue-600)' }} />
                <Label htmlFor="targetUsers" className="text-base font-semibold text-gray-900 font-sans">
                  Target Users *
                </Label>
              </div>
              <Textarea
                id="targetUsers"
                value={spec.targetUsers}
                onChange={(e) => updateSpec('targetUsers', e.target.value)}
                placeholder="Who are the primary users of this product? Describe their needs, goals, and characteristics..."
                className="min-h-[100px] font-sans"
              />
            </CardContent>
          </Card>

          {/* Two-column layout for dropdowns and shorter fields */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Design Style */}
            <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--steel-blue-50)' }}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="w-5 h-5" style={{ color: 'var(--steel-blue-600)' }} />
                  <Label htmlFor="designStyle" className="text-base font-semibold text-gray-900 font-sans">
                    Design Style *
                  </Label>
                </div>
                <Select 
                  value={spec.designStyle} 
                  onValueChange={(value) => updateSpec('designStyle', value)}
                >
                  <SelectTrigger className="font-sans">
                    <SelectValue placeholder="Select design style..." />
                  </SelectTrigger>
                  <SelectContent>
                    {designStyleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="font-sans">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {spec.designStyle === "other" && (
                  <Input
                    value={spec.customDesignStyle || ""}
                    onChange={(e) => updateSpec('customDesignStyle', e.target.value)}
                    placeholder="Describe your custom design style..."
                    className="font-sans"
                  />
                )}
              </CardContent>
            </Card>

            {/* Multi-user Roles */}
            <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--steel-blue-50)' }}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="w-5 h-5" style={{ color: 'var(--steel-blue-600)' }} />
                  <Label className="text-base font-semibold text-gray-900 font-sans">
                    Multi-User Roles
                  </Label>
                </div>
                <Select 
                  value={spec.multiUserRoles ? "yes" : "no"} 
                  onValueChange={(value) => updateSpec('multiUserRoles', value === "yes")}
                >
                  <SelectTrigger className="font-sans">
                    <SelectValue placeholder="Support multiple user roles?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no" className="font-sans">No</SelectItem>
                    <SelectItem value="yes" className="font-sans">Yes</SelectItem>
                  </SelectContent>
                </Select>
                
                {spec.multiUserRoles && (
                  <Textarea
                    value={spec.roleDefinitions || ""}
                    onChange={(e) => updateSpec('roleDefinitions', e.target.value)}
                    placeholder="Define the different user roles (e.g., Admin, User, Moderator) and their permissions..."
                    className="min-h-[80px] font-sans"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Brand Guidelines - Full width */}
          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--steel-blue-50)' }}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5" style={{ color: 'var(--steel-blue-600)' }} />
                <Label htmlFor="brandGuidelines" className="text-base font-semibold text-gray-900 font-sans">
                  Brand Guidelines & Design System
                </Label>
              </div>
              <Textarea
                id="brandGuidelines"
                value={spec.brandGuidelines}
                onChange={(e) => updateSpec('brandGuidelines', e.target.value)}
                placeholder="Describe your brand colors, typography, logo requirements, design system preferences, or any existing brand guidelines..."
                className="min-h-[100px] font-sans"
              />
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="font-sans"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isFormValid}
            className="font-sans text-white"
            style={{ background: `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))` }}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Specification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}