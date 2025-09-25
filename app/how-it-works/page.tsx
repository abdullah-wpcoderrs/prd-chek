"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, Code, Layout, BarChart3, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{backgroundColor: 'var(--steel-blue-100)', color: 'var(--steel-blue-700)'}}>
            <Sparkles className="w-4 h-4" />
            Complete Documentation Pipeline
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-sans">
            How PRD-CHEK Works
          </h1>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto font-sans leading-relaxed">
            Transform product ideas into comprehensive, AI-ready documentation through our proven 3-stage methodology designed specifically for technical product managers and context engineers.
          </p>
        </div>

        {/* Process Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-sans">
              Why Technical Product Managers Choose PRD-CHEK
            </h2>
            <p className="text-gray-700 font-sans max-w-3xl mx-auto">
              Eliminate documentation bottlenecks and accelerate product development with AI-optimized specifications that bridge the gap between product vision and technical implementation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-sans">Context Engineering</h3>
              <p className="text-sm text-gray-600 font-sans">
                Documentation structured specifically for AI development tools and cross-functional team alignment
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-sans">Technical Precision</h3>
              <p className="text-sm text-gray-600 font-sans">
                Bridge product requirements with technical implementation through detailed, actionable specifications
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-xl flex items-center justify-center mx-auto mb-3">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-sans">Development Ready</h3>
              <p className="text-sm text-gray-600 font-sans">
                Professional-grade documentation that scales from MVP to enterprise solutions with engineering teams
              </p>
            </div>
          </div>
        </div>

        {/* Complete Documentation Suite in 3 Stages */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center font-sans">
            Complete Documentation Suite in 3 Stages
          </h2>
          <p className="text-gray-600 text-center mb-12 font-sans">
            Each stage builds on the previous, creating a comprehensive development roadmap that enables seamless product-to-engineering handoff
          </p>
          
          {/* Stage 1: Discovery & Research */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <h3 className="text-2xl font-bold text-gray-900 font-sans">Discovery & Research</h3>
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Foundation
              </div>
            </div>
            <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
                      Research & Insights Report
                    </h4>
                    <p className="text-gray-600 font-sans mb-3">
                      Comprehensive market analysis, user research, and competitive landscape analysis that provides technical teams with essential context for informed architectural decisions and feature prioritization.
                    </p>
                    <div className="text-sm text-blue-600 font-medium">
                      🎯 Perfect for: Market validation, user persona definition, competitive positioning, stakeholder alignment
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stage 2: Vision & Strategy */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <h3 className="text-2xl font-bold text-gray-900 font-sans">Vision & Strategy</h3>
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                Direction
              </div>
            </div>
            <Card className="border-2 border-purple-100 hover:border-purple-200 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 font-sans">
                      Vision & Strategy Document
                    </h4>
                    <p className="text-gray-600 font-sans mb-3">
                      Strategic framework with measurable success metrics, clear product vision, and OKRs that align engineering efforts with business objectives and enable data-driven product decisions.
                    </p>
                    <div className="text-sm text-purple-600 font-medium">
                      📈 Perfect for: Goal setting, KPI definition, strategic alignment, roadmap planning
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stage 3: Requirements & Planning */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <h3 className="text-2xl font-bold text-gray-900 font-sans">Requirements & Planning</h3>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                Implementation
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 font-sans text-sm">
                    Product Requirements Document (PRD)
                  </h4>
                  <p className="text-gray-600 text-xs font-sans mb-2">
                    Detailed feature specifications with acceptance criteria and technical constraints
                  </p>
                  <div className="text-xs text-green-600 font-medium">
                    🤖 Engineering-ready format
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 font-sans text-sm">
                    Business Requirements Document (BRD)
                  </h4>
                  <p className="text-gray-600 text-xs font-sans mb-2">
                    Business rules, constraints, and stakeholder requirements alignment
                  </p>
                  <div className="text-xs text-green-600 font-medium">
                    🏢 Executive ready
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Code className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 font-sans text-sm">
                    Technical Requirements Document (TRD)
                  </h4>
                  <p className="text-gray-600 text-xs font-sans mb-2">
                    Architecture specifications, API requirements, and technical implementation guide
                  </p>
                  <div className="text-xs text-green-600 font-medium">
                    ⚙️ Development optimized
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Layout className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 font-sans text-sm">
                    Planning Toolkit
                  </h4>
                  <p className="text-gray-600 text-xs font-sans mb-2">
                    User stories, sprint planning resources, and implementation roadmap
                  </p>
                  <div className="text-xs text-green-600 font-medium">
                    📅 Sprint ready
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Technical Benefits */}
          <div className="bg-gray-900 text-white rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold mb-6 font-sans text-center">
              Built for Technical Product Management
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 font-sans text-lg">For Product Managers</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Comprehensive stakeholder alignment documentation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Clear success metrics and KPI tracking frameworks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Market research and competitive analysis reports</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Executive-ready business requirements documentation</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 font-sans text-lg">For Context Engineers</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span>AI-optimized technical specifications and constraints</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span>Detailed architecture recommendations and API specs</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span>Implementation-ready user stories and acceptance criteria</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span>Sprint planning resources and development roadmaps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Flow Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 text-center mb-8">
            <h4 className="font-semibold text-gray-900 font-sans mb-2">Document Flow & Dependencies</h4>
            <p className="text-gray-700 font-sans">
              <span className="font-medium text-blue-600">Research & Insights</span> → informs → 
              <span className="font-medium text-purple-600 mx-2">Vision & Strategy</span> → shapes → 
              <span className="font-medium text-green-600">Requirements & Planning</span>
            </p>
            <p className="text-sm text-gray-600 mt-2 font-sans">
              Each stage builds comprehensive context that enables seamless product-to-engineering handoff
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-gray-900 text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 font-sans">
              Ready to Streamline Your Product Development?
            </h3>
            <p className="text-gray-300 mb-6 font-sans max-w-2xl mx-auto">
              Join technical product managers who&apos;ve eliminated documentation bottlenecks and accelerated development cycles with comprehensive, AI-ready specifications.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm mb-6">
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>⚡ 10x faster product specification</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>🎯 Technical team alignment</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>📋 Complete requirement coverage</span>
              </div>
            </div>
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-sans flex items-center gap-2 mx-auto">
                Start Your Documentation Suite
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}