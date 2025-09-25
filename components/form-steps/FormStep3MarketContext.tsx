"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MarketContext, Competitor } from "@/types";
import { Building2, Zap, TrendingUp } from "lucide-react";

interface FormStep3MarketContextProps {
  data: MarketContext;
  onUpdate: (data: MarketContext) => void;
}

export function FormStep3MarketContext({ data, onUpdate }: FormStep3MarketContextProps) {
  const updateField = (field: keyof MarketContext, value: string | Competitor[]) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8">
      {/* Key Competitors */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-purple-600" />
          <Label htmlFor="competitors" className="text-base font-semibold text-gray-900 font-sans">
            Key Competitors
          </Label>
        </div>
        <Textarea
          id="competitors"
          value={data.competitors.map(comp => comp.note ? `${comp.name} - ${comp.note}` : comp.name).join('\n')}
          onChange={(e) => {
            const lines = e.target.value.split('\n').filter(line => line.trim());
            const competitors = lines.map(line => {
              const dashIndex = line.indexOf(' - ');
              if (dashIndex > 0) {
                return {
                  name: line.substring(0, dashIndex).trim(),
                  note: line.substring(dashIndex + 3).trim()
                };
              }
              return { name: line.trim(), note: '' };
            });
            updateField('competitors', competitors);
          }}
          placeholder="List your main competitors or alternative solutions (one per line)&#10;e.g.:&#10;Slack - team communication&#10;Asana - task management&#10;Notion - documentation"
          className="min-h-[120px] text-base font-sans resize-none"
          maxLength={800}
        />
        <div className="flex justify-end">
          <span className="text-xs text-gray-500 font-sans">
            {data.competitors.map(comp => comp.note ? `${comp.name} - ${comp.note}` : comp.name).join('\n').length}/800
          </span>
        </div>
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
        <div className="flex justify-end">
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
        <div className="flex justify-end">
          <span className="text-xs text-gray-500 font-sans">
            {(data.marketTrend || "").length}/300
          </span>
        </div>
      </div>


    </div>
  );
}