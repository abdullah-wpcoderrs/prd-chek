"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Eye, 
  FileText, 
  Share2, 
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface DocumentViewerProps {
  document: {
    id: string;
    name: string;
    type: string;
    size: string;
    content?: string;
    downloadUrl?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewer({ document, isOpen, onClose }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Mock document content for demonstration
  const mockContent = `
# ${document.name}

## Executive Summary

This document outlines the comprehensive requirements for developing a modern web application. The project aims to create a scalable, user-friendly platform that meets current market demands and provides exceptional user experience.

## Project Overview

### Purpose
The application is designed to solve specific user problems while providing a seamless digital experience across multiple platforms and devices.

### Target Audience
- Primary users: Tech-savvy individuals aged 25-45
- Secondary users: Business professionals and entrepreneurs
- Tertiary users: General consumers seeking digital solutions

## Core Features

### 1. User Authentication & Management
- Secure login/registration system
- Multi-factor authentication
- User profile management
- Role-based access control
- Password reset functionality
- Account verification systems
- Social media login integration
- Session management

### 2. Dashboard & Analytics
- Real-time data visualization
- Customizable widgets
- Export functionality
- Performance metrics
- User activity tracking
- Advanced reporting tools
- Data filtering and sorting
- Interactive charts and graphs

### 3. Content Management
- Create, edit, and delete content
- Version control system
- Collaborative editing
- Media upload and management
- Content scheduling
- SEO optimization tools
- Content approval workflows
- Automated content backup

### 4. Communication Features
- In-app messaging system
- Email notifications
- Push notifications
- Comment and review systems
- File sharing capabilities
- Video conferencing integration
- Chat functionality
- Community forums

## Technical Requirements

### Frontend
- Modern JavaScript framework (React/Vue/Angular)
- Responsive design for mobile and desktop
- Progressive Web App capabilities
- Accessibility compliance (WCAG 2.1)
- Cross-browser compatibility
- Performance optimization
- Component-based architecture
- State management implementation

### Backend
- RESTful API architecture
- Database optimization
- Caching strategies
- Security implementations
- Microservices architecture
- Load balancing
- API rate limiting
- Error handling and logging

### Infrastructure
- Cloud hosting solution
- Content Delivery Network (CDN)
- Automated backup systems
- Monitoring and logging
- Scalability planning
- Disaster recovery plan
- Security scanning
- Performance monitoring

## User Experience Design

### Navigation
- Intuitive menu structure
- Breadcrumb navigation
- Search functionality
- Quick actions toolbar
- Mobile-first design
- Consistent UI patterns
- Accessibility features
- User flow optimization

### Interface Design
- Clean, modern aesthetic
- Consistent color scheme
- Typography hierarchy
- Interactive elements
- Visual feedback systems
- Loading states
- Error handling
- Responsive layouts

## Implementation Timeline

### Phase 1: Foundation (Weeks 1-4)
- Project setup and configuration
- Basic authentication system
- Core database schema
- Initial UI components
- Development environment setup
- CI/CD pipeline configuration
- Testing framework implementation
- Documentation structure

### Phase 2: Core Features (Weeks 5-8)
- Main functionality implementation
- User dashboard development
- API endpoints creation
- Integration testing
- UI/UX refinements
- Performance optimization
- Security implementation
- Quality assurance testing

### Phase 3: Enhancement (Weeks 9-12)
- Advanced features addition
- Performance optimization
- Security hardening
- User acceptance testing
- Bug fixes and improvements
- Final integrations
- Deployment preparation
- Documentation completion

### Phase 4: Launch & Support (Weeks 13-16)
- Production deployment
- User training
- Support documentation
- Performance monitoring
- Bug tracking and fixes
- User feedback collection
- Feature enhancement planning
- Maintenance procedures

## Success Metrics

### Performance
- Page load time < 3 seconds
- 99.9% uptime guarantee
- Support for 10,000+ concurrent users
- Mobile performance score > 90
- API response time < 500ms
- Database query optimization
- CDN cache hit ratio > 95%
- Error rate < 0.1%

### User Engagement
- Daily active users growth
- Session duration metrics
- Feature adoption rates
- User satisfaction scores
- Conversion rate tracking
- Retention rate analysis
- Support ticket volume
- User feedback ratings

### Business Metrics
- Revenue growth targets
- Cost per acquisition
- Customer lifetime value
- Market penetration
- Competitive positioning
- ROI measurements
- Operational efficiency
- Scalability benchmarks

## Risk Assessment

### Technical Risks
- Third-party API dependencies
- Scalability challenges
- Security vulnerabilities
- Browser compatibility issues
- Performance bottlenecks
- Data migration challenges
- Integration complexities
- Technology obsolescence

### Business Risks
- Market competition
- Budget constraints
- Timeline delays
- Resource availability
- Regulatory compliance
- User adoption challenges
- Technology changes
- Economic factors

### Mitigation Strategies
- Comprehensive testing protocols
- Backup and recovery plans
- Regular security audits
- Performance monitoring
- Agile development methodology
- Risk monitoring procedures
- Contingency planning
- Stakeholder communication

## Quality Assurance

### Testing Strategy
- Unit testing coverage > 90%
- Integration testing
- End-to-end testing
- Performance testing
- Security testing
- Accessibility testing
- Cross-browser testing
- Mobile device testing

### Code Quality
- Code review processes
- Coding standards enforcement
- Documentation requirements
- Version control best practices
- Automated code analysis
- Performance profiling
- Security scanning
- Dependency management

## Deployment & Maintenance

### Deployment Strategy
- Blue-green deployment
- Automated deployment pipeline
- Environment configuration
- Database migration scripts
- Rollback procedures
- Monitoring setup
- Performance baseline
- Security configuration

### Ongoing Maintenance
- Regular updates and patches
- Performance monitoring
- Security updates
- Feature enhancements
- Bug fixes
- User support
- System optimization
- Backup verification

## Conclusion

This project represents a significant opportunity to create a valuable digital solution. With proper planning, execution, and ongoing optimization, the application will meet user needs while achieving business objectives.

The success of this project depends on careful attention to user experience, technical excellence, and continuous improvement based on user feedback and market demands.

### Next Steps
1. Stakeholder approval of requirements
2. Technical architecture finalization
3. Development team assembly
4. Project timeline confirmation
5. Budget allocation approval
6. Risk mitigation planning
7. Quality assurance setup
8. Launch preparation

### Contact Information
For questions or clarifications regarding this document, please contact the project team through the designated communication channels.

---

*This document is confidential and proprietary. Distribution is restricted to authorized personnel only.*
  `;

  if (!isOpen) return null;

  const handleDownload = () => {
    // In a real app, this would download the actual PDF
    const blob = new Blob([mockContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.name}.txt`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.name,
          text: `Check out this document: ${document.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 ${
      isFullscreen ? 'p-0' : ''
    }`}>
      <div className={`bg-white rounded-sm shadow-sm flex flex-col ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-sm">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5" style={{color: 'var(--steel-blue-600)'}} />
            <div>
              <h2 className="font-semibold text-gray-900 font-sans">{document.name}</h2>
              <p className="text-sm text-gray-600 font-sans">
                {document.type} • {document.size}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(50, zoom - 25))}
              className="font-sans"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <span className="text-sm text-gray-600 px-2 font-sans">{zoom}%</span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              className="font-sans"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="font-sans"
            >
              <Maximize className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="font-sans"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="font-sans"
            >
              <Download className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="font-sans"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Document Area */}
          <div className="flex-1 overflow-auto bg-gray-100 p-8">
            <div 
              className="bg-white shadow-lg mx-auto p-8"
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                width: zoom === 100 ? '210mm' : `${21000 / zoom}px`, // A4 width scaled
                minHeight: '297mm', // A4 height
                marginBottom: zoom !== 100 ? `${(zoom - 100) * 3}px` : '0'
              }}
            >
              <div 
                className="prose prose-lg max-w-none font-sans"
                dangerouslySetInnerHTML={{ 
                  __html: mockContent.replace(/\\n/g, '<br>').replace(/###? /g, '<h3>').replace(/## /g, '<h2>').replace(/# /g, '<h1>') 
                }}
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-64 border-l bg-white p-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-sans">Document Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-sans">Type:</span>
                  <Badge variant="outline" className="font-sans">{document.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-sans">Size:</span>
                  <span className="font-sans">{document.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-sans">Pages:</span>
                  <span className="font-sans">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-sans">Created:</span>
                  <span className="font-sans">Today</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-sans">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full font-sans"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full font-sans"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full font-sans"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-sans">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="cursor-pointer font-sans" onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--steel-blue-600)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}>1. Executive Summary</div>
                  <div className="cursor-pointer font-sans" onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--steel-blue-600)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}>2. Project Overview</div>
                  <div className="cursor-pointer font-sans" onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--steel-blue-600)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}>3. Core Features</div>
                  <div className="cursor-pointer font-sans" onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--steel-blue-600)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}>4. Technical Requirements</div>
                  <div className="cursor-pointer font-sans" onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--steel-blue-600)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}>5. User Experience Design</div>
                  <div className="cursor-pointer font-sans" onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--steel-blue-600)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}>6. Implementation Timeline</div>
                  <div className="cursor-pointer font-sans" onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--steel-blue-600)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}>7. Success Metrics</div>
                  <div className="cursor-pointer font-sans" onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--steel-blue-600)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}>8. Risk Assessment</div>
                  <div className="cursor-pointer font-sans" onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--steel-blue-600)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}>9. Quality Assurance</div>
                  <div className="cursor-pointer font-sans" onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--steel-blue-600)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}>10. Deployment & Maintenance</div>
                  <div className="cursor-pointer font-sans" onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--steel-blue-600)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'inherit'}>11. Conclusion</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="font-sans"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <span className="text-sm text-gray-600 font-sans">
              Page {currentPage} of 12
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(12, currentPage + 1))}
              disabled={currentPage === 12}
              className="font-sans"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-sm text-gray-500 font-sans">
            Generated by PRDGen • {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}