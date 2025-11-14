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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] md:text-sm font-medium mb-6" style={{ backgroundColor: 'var(--steel-blue-100)', color: 'var(--steel-blue-700)' }}>
              <Sparkles className="w-4 h-4" />
              AI-Powered Documentation Generator for Technical Product Managers
            </div>

            <h1 className="text-[18px] md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 font-sans leading-tight">
              PRD-CHEK
            </h1>

            <p className="text-[13px] md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 max-w-4xl mx-auto font-sans leading-relaxed px-4">
              Transform product concepts into comprehensive, AI-ready documentation suites.
              The essential toolkit for <span className="font-semibold text-gray-900">Technical Product Managers</span> and <span className="font-semibold text-gray-900">Context Engineers</span> building next-generation products.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
              <Link href="/dashboard">
                <Button className="text-white px-6 py-3 md:px-10 md:py-6 text-[13px] md:text-base rounded-sm font-medium font-sans flex items-center gap-2 w-full sm:w-auto" style={{ backgroundColor: 'var(--steel-blue-600)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-700)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--steel-blue-600)'}>
                  <span>Start Generating</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </Link>

              <Button variant="outline" className="px-6 py-3 md:px-10 md:py-6 text-[13px] md:text-base rounded-sm font-medium font-sans border-2 border-gray-300 hover:border-gray-400 w-full sm:w-auto">
                <Link href="/how-it-works">How it Works</Link>
              </Button>
            </div>

            <p className="text-[13px] md:text-sm text-gray-500 mt-4 md:mt-6 font-sans px-4">
              Free to use. No sign-up required. Enterprise-grade security for your product specifications.
            </p>
          </div>

          {/* Feature Preview */}
          <div className="relative bg-white rounded-sm shadow-sm p-4 md:p-8 max-w-5xl mx-auto">
            <div className="p-4 md:p-6 rounded-sm text-white" style={{ background: `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))` }}>
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-[16px] md:text-xl font-semibold font-sans">Generate Documentation Suite</h3>
                <div className="flex gap-1.5 md:gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-white/30 rounded-full"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-white/50 rounded-full"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
                </div>
              </div>

              <p className="mb-4 md:mb-6 font-sans text-[13px] md:text-base" style={{ color: 'var(--steel-blue-100)' }}>
                Input your product concept, technical requirements, and strategic objectives.
                Generate a complete documentation suite optimized for technical teams and stakeholder alignment.
              </p>

              <div className="bg-white/10 rounded-sm p-3 md:p-4 backdrop-blur-sm">
                <div className="text-[13px] md:text-sm mb-2 font-sans" style={{ color: 'var(--steel-blue-100)' }}>Project Description</div>
                <div className="bg-white/20 rounded-sm px-2 py-1.5 md:px-3 md:py-2 text-white font-sans text-[13px] md:text-sm">
                  AI-powered task management platform for distributed engineering teams with real-time collaboration features, automated sprint planning, and predictive analytics for delivery optimization...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Do Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 px-4">
            <h2 className="text-[18px] md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 font-sans">
              Documentation Suite for Technical Teams
            </h2>
            <p className="text-[13px] md:text-xl text-gray-600 max-w-3xl mx-auto font-sans">
              Generate comprehensive, stakeholder-ready documentation that bridges the gap between product vision and technical implementation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4">
            <div className="text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-sm flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'var(--steel-blue-100)', color: 'var(--steel-blue-600)' }}>
                <FileText className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-[16px] md:text-xl font-semibold text-gray-900 mb-2 font-sans">Product Requirements (PRD)</h3>
              <p className="text-[13px] md:text-base text-gray-600 font-sans">
                Comprehensive product specifications with technical constraints, acceptance criteria, and engineering-ready feature definitions
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 text-green-600 rounded-sm flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-[16px] md:text-xl font-semibold text-gray-900 mb-2 font-sans">Business Requirements (BRD)</h3>
              <p className="text-[13px] md:text-base text-gray-600 font-sans">
                Executive-level business requirements, stakeholder alignment documentation, and strategic objectives with measurable outcomes
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 text-purple-600 rounded-sm flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <Map className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-[16px] md:text-xl font-semibold text-gray-900 mb-2 font-sans">Technical Requirements (TRD)</h3>
              <p className="text-[13px] md:text-base text-gray-600 font-sans">
                Architecture specifications, API requirements, technical constraints, and implementation guidelines for development teams
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 text-orange-600 rounded-sm flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-[16px] md:text-xl font-semibold text-gray-900 mb-2 font-sans">Research & Strategy</h3>
              <p className="text-[13px] md:text-base text-gray-600 font-sans">
                Market analysis, competitive research, user insights, and strategic framework to guide product development decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 px-4">
            <h2 className="text-[18px] md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 font-sans">
              3-Stage Documentation Process
            </h2>
            <p className="text-[13px] md:text-xl text-gray-600 max-w-3xl mx-auto font-sans">
              From product concept to implementation-ready specifications in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto px-4">
            <div className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 text-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-lg md:text-xl font-bold" style={{ backgroundColor: 'var(--steel-blue-600)' }}>
                1
              </div>
              <h3 className="text-[16px] md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 font-sans">
                Discovery & Research
              </h3>
              <p className="text-[13px] md:text-base text-gray-600 font-sans leading-relaxed">
                Input product concept, target users, and market context. Generate comprehensive market research and competitive analysis that informs technical decisions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 text-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-lg md:text-xl font-bold" style={{ backgroundColor: 'var(--steel-blue-600)' }}>
                2
              </div>
              <h3 className="text-[16px] md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 font-sans">
                Vision & Strategy
              </h3>
              <p className="text-[13px] md:text-base text-gray-600 font-sans leading-relaxed">
                Define product vision, success metrics, and strategic objectives. Create alignment framework between business goals and technical implementation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 text-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-lg md:text-xl font-bold" style={{ backgroundColor: 'var(--steel-blue-600)' }}>
                3
              </div>
              <h3 className="text-[16px] md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 font-sans">
                Requirements & Planning
              </h3>
              <p className="text-[13px] md:text-base text-gray-600 font-sans leading-relaxed">
                Generate complete PRD, BRD, TRD, and planning toolkit. Receive implementation-ready documentation for immediate development handoff.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/how-it-works">
              <Button variant="outline" className="font-sans">
                View Complete Process →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="px-4">
              <h2 className="text-[18px] md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 font-sans">
                Built for Technical Product Management
              </h2>
              <p className="text-[13px] md:text-xl text-gray-600 mb-6 md:mb-8 font-sans leading-relaxed">
                Designed specifically for technical product managers and context engineers who need comprehensive documentation that bridges product vision with engineering implementation.
              </p>

              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-sm flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: 'var(--steel-blue-100)', color: 'var(--steel-blue-600)' }}>
                    <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                  <div>
                    <h3 className="text-[16px] md:text-lg font-semibold text-gray-900 mb-1 font-sans">AI-Optimized for Technical Teams</h3>
                    <p className="text-[13px] md:text-base text-gray-600 font-sans">Documentation structured specifically for engineering handoff and technical stakeholder alignment</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-green-100 text-green-600 rounded-sm flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                  <div>
                    <h3 className="text-[16px] md:text-lg font-semibold text-gray-900 mb-1 font-sans">Enterprise-Grade Security</h3>
                    <p className="text-[13px] md:text-base text-gray-600 font-sans">Your product specifications and strategic information are processed with bank-level security</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-purple-100 text-purple-600 rounded-sm flex items-center justify-center flex-shrink-0 mt-1">
                    <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                  <div>
                    <h3 className="text-[16px] md:text-lg font-semibold text-gray-900 mb-1 font-sans">Integration Ready</h3>
                    <p className="text-[13px] md:text-base text-gray-600 font-sans">Export to PDF, integrate with project management tools, or use directly in technical planning sessions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 text-white" style={{ background: `linear-gradient(to right, var(--steel-blue-500), var(--steel-blue-600))` }}>
              <h3 className="text-[16px] md:text-2xl font-bold mb-4 md:mb-6 font-sans">Complete Documentation Suite:</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <FileText className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="font-sans text-[13px] md:text-base">Product Requirements Document (PRD)</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Users className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="font-sans text-[13px] md:text-base">Business Requirements Document (BRD)</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Code className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="font-sans text-[13px] md:text-base">Technical Requirements Document (TRD)</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Map className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="font-sans text-[13px] md:text-base">Research & Insights Report</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Layout className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="font-sans text-[13px] md:text-base">Vision & Strategy Document</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 text-white" style={{ background: `linear-gradient(to right, var(--steel-blue-600), var(--steel-blue-700))` }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[18px] md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 font-sans">
            Ready to Accelerate Your Product Development?
          </h2>
          <p className="text-[13px] md:text-xl mb-6 md:mb-8 font-sans" style={{ color: 'var(--steel-blue-100)' }}>
            Join technical product managers who trust PRD-CHEK for comprehensive, stakeholder-ready documentation
          </p>

          <Link href="/dashboard">
            <Button className="text-white px-6 py-3 md:px-8 md:py-4 text-[13px] md:text-lg rounded-sm font-medium font-sans" style={{ backgroundColor: 'white', color: 'var(--steel-blue-600)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
              Start Generating Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
