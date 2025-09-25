"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Users, Map, Code, Layout, ArrowRight, Sparkles, Zap, Shield, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: 'var(--steel-blue-100)', color: 'var(--steel-blue-700)' }}>
              <Sparkles className="w-4 h-4" />
              AI-Powered Documentation Generator
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 font-sans leading-tight">
              PRD Generator
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto font-sans leading-relaxed">
              Create, customize, and generate comprehensive project documentation in seconds.
              The ultimate tool for Product Managers and Context Engineers building with Tech Products with AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button className="text-white px-10 py-6 text-md rounded-sm font-medium font-sans flex items-center gap-2" style={{ backgroundColor: 'var(--steel-blue-600)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-700)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-600)'}>
                  <span>Start Generating</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Button variant="outline" className="px-10 py-6 text-md rounded-sm font-medium font-sans border-2 border-gray-300 hover:border-gray-400">
                View Templates
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-6 font-sans">
              Totally Free. No sign-up required. All documents are processed securely.
            </p>
          </div>

          {/* Feature Preview */}
          <div className="relative bg-white rounded-sm shadow-sm p-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-sm text-white" style={{ background: `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))` }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold font-sans">Generate Documentation Suite</h3>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/50 rounded-full"></div>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              <p className="mb-6 font-sans" style={{ color: 'var(--steel-blue-100)' }}>
                Describe your project idea and select your preferred tech stack.
                Get a complete documentation suite in minutes.
              </p>

              <div className="bg-white/10 rounded-sm p-4 backdrop-blur-sm">
                <div className="text-sm mb-2 font-sans" style={{ color: 'var(--steel-blue-100)' }}>Project Description</div>
                <div className="bg-white/20 rounded-sm px-3 py-2 text-white font-sans text-sm">
                  A social media app for developers to share code snippets and collaborate...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Do Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
              What You Can Do
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
              Everything you need to transform your ideas into well-documented,
              development-ready projects
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 rounded-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'var(--steel-blue-100)', color: 'var(--steel-blue-600)' }}>
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sans">Generate PRDs</h3>
              <p className="text-gray-600 font-sans">
                Create comprehensive Product Requirement Documents with AI precision
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sans">User Stories</h3>
              <p className="text-gray-600 font-sans">
                Detailed user journey mapping and story documentation for better UX
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sans">Smart Sitemaps</h3>
              <p className="text-gray-600 font-sans">
                Screen-by-screen application flow with intelligent navigation mapping
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Code className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sans">Tech Specs</h3>
              <p className="text-gray-600 font-sans">
                Technology stack recommendations with compatibility analysis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
              Simple 3-step process to get your complete documentation suite
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold" style={{ backgroundColor: 'var(--steel-blue-600)' }}>
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 font-sans">
                Describe Your Project
              </h3>
              <p className="text-gray-600 font-sans leading-relaxed">
                Tell us about your project idea, target audience, and core features.
                Our AI understands context and requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold" style={{ backgroundColor: 'var(--steel-blue-600)' }}>
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 font-sans">
                Select Tech Stack
              </h3>
              <p className="text-gray-600 font-sans leading-relaxed">
                Choose your preferred technologies and frameworks.
                We'll ensure compatibility and provide recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold" style={{ backgroundColor: 'var(--steel-blue-600)' }}>
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 font-sans">
                Get Your Documents
              </h3>
              <p className="text-gray-600 font-sans leading-relaxed">
                Receive a complete suite of 5 professional documents ready for
                development and team collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">
                Built for Vibe Coders
              </h2>
              <p className="text-xl text-gray-600 mb-8 font-sans leading-relaxed">
                Perfect for developers who build with AI tools and need comprehensive
                documentation to guide their development process.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: 'var(--steel-blue-100)', color: 'var(--steel-blue-600)' }}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 font-sans">Lightning Fast</h3>
                    <p className="text-gray-600 font-sans">Generate complete documentation suites in under 5 minutes</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-sm flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 font-sans">Secure & Private</h3>
                    <p className="text-gray-600 font-sans">Your project ideas and documents are processed securely</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-sm flex items-center justify-center flex-shrink-0 mt-1">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 font-sans">Export Anywhere</h3>
                    <p className="text-gray-600 font-sans">Download PDFs or view online - use with any AI coding IDE</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 text-white" style={{ background: `linear-gradient(to right, var(--steel-blue-500), var(--steel-blue-600))` }}>
              <h3 className="text-2xl font-bold mb-6 font-sans">Documentation Suite Includes:</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <span className="font-sans">Product Requirement Document</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span className="font-sans">User Journey & Story Document</span>
                </div>
                <div className="flex items-center gap-3">
                  <Map className="w-5 h-5" />
                  <span className="font-sans">Sitemap Document</span>
                </div>
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5" />
                  <span className="font-sans">Features & Tech Stack Requirements</span>
                </div>
                <div className="flex items-center gap-3">
                  <Layout className="w-5 h-5" />
                  <span className="font-sans">Screen-by-Screen Specifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-white" style={{ background: `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))` }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-sans">
            Ready to Build Your Dream Project?
          </h2>
          <p className="text-xl mb-8 font-sans" style={{ color: 'var(--steel-blue-100)' }}>
            Join thousands of vibe coders who trust PRDGen for their documentation needs
          </p>

          <Link href="/dashboard">
            <Button className="text-white px-8 py-4 text-lg rounded-sm font-medium font-sans" style={{ backgroundColor: 'white', color: 'var(--steel-blue-600)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
              Start Generating Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
