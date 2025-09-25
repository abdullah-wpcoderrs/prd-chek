"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MarketContext, Competitor } from "@/types";
import { Building2, Zap, TrendingUp, Plus, X, Edit2 } from "lucide-react";

interface FormStep3MarketContextProps {
  data: MarketContext;
  onUpdate: (data: MarketContext) => void;
}

export function FormStep3MarketContext({ data, onUpdate }: FormStep3MarketContextProps) {
  const [newCompetitor, setNewCompetitor] = useState<Competitor>({ name: "", note: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const updateField = (field: keyof MarketContext, value: string | Competitor[]) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  const addCompetitor = () => {
    if (newCompetitor.name.trim() && data.competitors.length < 8) {
      if (editingIndex !== null) {
        // Update existing competitor
        const updatedCompetitors = [...data.competitors];
        updatedCompetitors[editingIndex] = newCompetitor;
        updateField('competitors', updatedCompetitors);
        setEditingIndex(null);
      } else {
        // Add new competitor
        updateField('competitors', [...data.competitors, newCompetitor]);
      }
      setNewCompetitor({ name: "", note: "" });
    }
  };

  const editCompetitor = (index: number) => {
    setNewCompetitor(data.competitors[index]);
    setEditingIndex(index);
  };

  const removeCompetitor = (index: number) => {
    const updatedCompetitors = data.competitors.filter((_, i) => i !== index);
    updateField('competitors', updatedCompetitors);
    if (editingIndex === index) {
      setEditingIndex(null);
      setNewCompetitor({ name: "", note: "" });
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setNewCompetitor({ name: "", note: "" });
  };

  return (
    <div className="space-y-8">
      {/* Key Competitors */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-purple-600" />
          <Label className="text-base font-semibold text-gray-900 font-sans">
            Key Competitors
          </Label>
        </div>
        
        {/* Existing Competitors */}
        <div className="space-y-2">
          {data.competitors.map((competitor, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 font-sans">
                  {competitor.name}
                </div>
                {competitor.note && (
                  <div className="text-sm text-gray-600 font-sans mt-1">
                    {competitor.note}
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editCompetitor(index)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCompetitor(index)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Competitor Form */}
        {data.competitors.length < 8 && (
          <div className="space-y-3 p-4 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="flex gap-2">
              <Input
                value={newCompetitor.name}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                placeholder="Competitor name (e.g., Slack, Asana, Notion)"
                className="flex-1 font-sans"
                maxLength={50}
              />
            </div>
            <Input
              value={newCompetitor.note}
              onChange={(e) => setNewCompetitor({ ...newCompetitor, note: e.target.value })}
              placeholder="Short note about this competitor (optional)"
              className="font-sans"
              maxLength={100}
            />
            <div className="flex gap-2">
              <Button
                onClick={addCompetitor}
                disabled={!newCompetitor.name.trim()}
                variant="outline"
                className="font-sans"
              >
                <Plus className="w-4 h-4 mr-2" />
                {editingIndex !== null ? 'Update' : 'Add'} Competitor
              </Button>
              {editingIndex !== null && (
                <Button
                  onClick={cancelEdit}
                  variant="ghost"
                  className="font-sans"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-600 font-sans">
          List your main competitors or alternative solutions (optional, maximum 8)
        </p>
      </div>

      {/* What Makes Your Product Different */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          <Label htmlFor="differentiation" className="text-base font-semibold text-gray-900 font-sans">
            What makes your product different? *
          </Label>
        </div>
        <Textarea
          id="differentiation"
          value={data.differentiation}
          onChange={(e) => updateField('differentiation', e.target.value)}
          placeholder="e.g., Unlike other project management tools, we use AI to automatically prioritize tasks based on deadlines, team capacity, and project dependencies, reducing planning time by 70%."
          className="min-h-[120px] text-base font-sans resize-none"
          maxLength={400}
        />
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 font-sans">
            Describe your unique value proposition and competitive advantages
          </p>
          <span className="text-xs text-gray-500 font-sans">
            {data.differentiation.length}/400
          </span>
        </div>
      </div>

      {/* Market Trend/Insight */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <Label htmlFor="marketTrend" className="text-base font-semibold text-gray-900 font-sans">
            Market Trend / Insight
            <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
          </Label>
        </div>
        <Textarea
          id="marketTrend"
          value={data.marketTrend || ""}
          onChange={(e) => updateField('marketTrend', e.target.value)}
          placeholder="e.g., Remote work adoption has increased 300% since 2020, creating demand for better async collaboration tools. The project management software market is expected to grow 13.7% annually through 2028."
          className="min-h-[100px] text-base font-sans resize-none"
          maxLength={300}
        />
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 font-sans">
            Share relevant market trends, statistics, or insights that support your product opportunity
          </p>
          <span className="text-xs text-gray-500 font-sans">
            {(data.marketTrend || "").length}/300
          </span>
        </div>
      </div>

      {/* Examples Section */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 font-sans mb-2 flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Market Analysis Examples
        </h4>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-purple-800 font-sans">Competitors:</span>
            <span className="text-purple-700 font-sans ml-1">
              &quot;Slack (team communication), Asana (task management), Notion (documentation)&quot;
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-800 font-sans">Differentiation:</span>
            <span className="text-purple-700 font-sans ml-1">
              &quot;First tool to combine real-time collaboration with AI-powered project insights in one platform&quot;
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-800 font-sans">Market Trend:</span>
            <span className="text-purple-700 font-sans ml-1">
              &quot;85% of companies plan to increase remote work options, driving need for better digital collaboration tools&quot;
            </span>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 font-sans mb-2">Step 3 Progress</h4>
        <div className="space-y-1 text-sm">
          <div className={`flex items-center gap-2 text-green-600`}>
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Competitors identified ({data.competitors.length})
          </div>
          <div className={`flex items-center gap-2 ${data.differentiation.trim() ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${data.differentiation.trim() ? 'bg-green-500' : 'bg-gray-300'}`} />
            Differentiation described
          </div>
          <div className={`flex items-center gap-2 text-green-600`}>
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Market insights provided (optional)
          </div>
        </div>
      </div>
    </div>
  );
}