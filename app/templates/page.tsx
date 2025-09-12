import { Badge } from "@/components/ui/badge";
import { TemplateCard } from "@/components/TemplateCard";
import { CreateCustomButton } from "@/components/CreateCustomButton";
import { 
  FileText, 
  Users, 
  Map, 
  Code, 
  Layout, 
  Star,
  Clock,
  Download,
  Eye
} from "lucide-react";
import { getTemplates, getTemplateStats, type Template, type TemplateStats } from "@/lib/actions/template.actions";

export default async function TemplatesPage() {
  const templates: Template[] = await getTemplates();
  const stats: TemplateStats = await getTemplateStats();
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-sans">
            Documentation Templates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
            Pre-built documentation suites for common project types. 
            Get started faster with professionally crafted templates.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-sm p-6 text-center shadow-sm">
            <div className="text-2xl font-bold mb-1" style={{color: 'var(--steel-blue-600)'}}>{stats.total_templates}</div>
            <div className="text-sm text-gray-600 font-sans">Templates Available</div>
          </div>
          <div className="bg-white rounded-sm p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {stats.total_downloads.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 font-sans">Total Downloads</div>
          </div>
          <div className="bg-white rounded-sm p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">{stats.total_categories}</div>
            <div className="text-sm text-gray-600 font-sans">Categories</div>
          </div>
          <div className="bg-white rounded-sm p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600 mb-1">{stats.average_rating}</div>
            <div className="text-sm text-gray-600 font-sans">Average Rating</div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-sm p-8 text-center text-white" style={{background: `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))`}}>
          <h2 className="text-3xl font-bold mb-4 font-sans">Don't See Your Project Type?</h2>
          <p className="text-xl mb-6 font-sans" style={{color: 'var(--steel-blue-100)'}}>
            Create custom documentation from scratch using our AI generator
          </p>
          <CreateCustomButton 
            className="px-8 py-3 text-lg font-sans" 
            style={{backgroundColor: 'white', color: 'var(--steel-blue-600)'}} 
            hoverColor="#f3f4f6" 
            defaultColor="white"
          />
        </div>
      </div>
    </div>
  );
}