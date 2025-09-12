import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const categoryColors = {
  "Social": "bg-purple-100 text-purple-700",
  "E-commerce": "bg-green-100 text-green-700", 
  "Business": "text-white",
  "Education": "bg-orange-100 text-orange-700",
  "Healthcare": "bg-red-100 text-red-700",
  "Productivity": "bg-indigo-100 text-indigo-700"
};

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
            <Card key={template.id} className="hover:shadow-sm transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-3">
                  <Badge 
                    className={template.category === 'Business' ? 'text-white' : categoryColors[template.category as keyof typeof categoryColors]}
                    style={template.category === 'Business' ? {backgroundColor: 'var(--steel-blue-600)'} : {}}
                  >
                    {template.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {template.rating}
                  </div>
                </div>
                
                <CardTitle className="font-sans text-xl mb-2">{template.name}</CardTitle>
                <CardDescription className="font-sans">{template.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Tech Stacks */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2 font-sans">Compatible Tech Stacks:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.tech_stacks.map((stack, index) => (
                      <Badge key={index} variant="outline" className="text-xs font-sans">
                        {stack}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2 font-sans">Key Features:</div>
                  <ul className="text-xs text-gray-600 space-y-1 font-sans">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full" style={{backgroundColor: 'var(--steel-blue-500)'}}></div>
                        {feature}
                      </li>
                    ))}
                    {template.features.length > 3 && (
                      <li className="cursor-pointer hover:underline" style={{color: 'var(--steel-blue-600)'}}>
                        +{template.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center text-sm text-gray-500 font-sans">
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {template.downloads.toLocaleString()} downloads
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {template.document_count} documents
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 font-sans">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1 text-white font-sans" style={{backgroundColor: 'var(--steel-blue-600)'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-700)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-600)'}>
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-sm p-8 text-center text-white" style={{background: `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))`}}>
          <h2 className="text-3xl font-bold mb-4 font-sans">Don't See Your Project Type?</h2>
          <p className="text-xl mb-6 font-sans" style={{color: 'var(--steel-blue-100)'}}>
            Create custom documentation from scratch using our AI generator
          </p>
          <Button className="px-8 py-3 text-lg font-sans" style={{backgroundColor: 'white', color: 'var(--steel-blue-600)'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
            Create Custom Documentation
          </Button>
        </div>
      </div>
    </div>
  );
}