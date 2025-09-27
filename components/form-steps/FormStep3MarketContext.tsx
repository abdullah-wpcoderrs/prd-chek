"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Building2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { MarketContext, Competitor } from "@/types";

interface FormStep3MarketContextProps {
  data: MarketContext;
  onUpdate: (data: MarketContext) => void;
}

export function FormStep3MarketContext({ data, onUpdate }: FormStep3MarketContextProps) {
  const handleCompetitorChange = (index: number, field: keyof Competitor, value: string) => {
    const newCompetitors = [...data.competitors];
    newCompetitors[index] = { ...newCompetitors[index], [field]: value };
    onUpdate({ ...data, competitors: newCompetitors });
  };

  const addCompetitor = () => {
    onUpdate({ ...data, competitors: [...data.competitors, { name: "", note: "" }] });
  };

  const removeCompetitor = (index: number) => {
    const newCompetitors = data.competitors.filter((_, i) => i !== index);
    onUpdate({ ...data, competitors: newCompetitors });
  };

  return (
    <div className="space-y-8">
      {/* Key Competitors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            <Label className="text-base font-semibold text-gray-900 font-sans">
              Key Competitors
            </Label>
          </div>
          <Button variant="outline" size="sm" onClick={addCompetitor}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Competitor
          </Button>
        </div>

        {data.competitors.length === 0 && (
          <div className="text-center text-gray-500 py-4 border-2 border-dashed rounded-lg">
            <p>No competitors added yet.</p>
          </div>
        )}

        <div className="space-y-4">
          {data.competitors.map((competitor, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-800">Competitor #{index + 1}</p>
                <Button variant="ghost" size="sm" onClick={() => removeCompetitor(index)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`competitor-name-${index}`} className="text-sm font-medium text-gray-700">Name</Label>
                  <Input
                    id={`competitor-name-${index}`}
                    value={competitor.name}
                    onChange={(e) => handleCompetitorChange(index, 'name', e.target.value)}
                    placeholder="e.g., Slack, Asana, Notion"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`competitor-note-${index}`} className="text-sm font-medium text-gray-700">Note</Label>
                  <Input
                    id={`competitor-note-${index}`}
                    value={competitor.note}
                    onChange={(e) => handleCompetitorChange(index, 'note', e.target.value)}
                    placeholder="e.g., Team communication, Task management"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}