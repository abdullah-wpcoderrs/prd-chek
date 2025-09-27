// Enhanced V2 Document Generation Prompts
// These prompts utilize the rich multi-step form data for superior document quality

import { ProductManagerFormData } from '@/types';

export interface DocumentPromptContext {
  formData: ProductManagerFormData;
  techStack: string;
  targetPlatform: string;
  complexity?: string; // Make complexity optional
  projectName: string;
}

export class V2DocumentPrompts {
  
  /**
   * Research & Insights Report Prompt
   * Stage: Discovery
   */
  static generateResearchInsightsPrompt(context: DocumentPromptContext): string {
    const { formData, techStack, targetPlatform } = context;
    
    return `
# Research & Insights Report Generation

Create a comprehensive Research & Insights Report for "${formData.step1.productName}" with the following structure:

## Executive Summary
- Product: ${formData.step1.productName}
- Industry: ${formData.step1.industry}
- Current Stage: ${formData.step1.currentStage}
- Target Platform: ${targetPlatform}

## Market Research
### Target User Analysis
Primary Users: ${formData.step3.targetUsers}

### Pain Point Analysis
Current Challenges:
${formData.step3.painPoints.map(pain => `- ${pain}`).join('\n')}

Primary Job to be Done: ${formData.step3.primaryJobToBeDone}

### Competitive Landscape
${formData.step4.competitors.map(comp => `**${comp.name}**: ${comp.note}`).join('\n')}

## Key Insights
1. **User Needs**: Analyze the pain points and derive key user needs
2. **Market Opportunity**: Based on competitive analysis
3. **Differentiation Potential**: ${formData.step1.differentiation}
4. **Technology Fit**: How ${techStack} aligns with user needs and market demands

## Recommendations
- Strategic recommendations based on research findings
- Technology considerations for ${techStack}
- User experience priorities
- Market positioning suggestions

Generate a detailed, professional research report with data-driven insights and actionable recommendations.
`;
  }

  /**
   * Vision & Strategy Document Prompt  
   * Stage: Strategy
   */
  static generateVisionStrategyPrompt(context: DocumentPromptContext): string {
    const { formData } = context;
    
    return `
# Vision & Strategy Document Generation

Create a comprehensive Vision & Strategy Document for "${formData.step1.productName}":

## Product Vision
${formData.step2.productVision}

## Value Proposition
${formData.step2.valueProposition}

## Strategic Framework

### Market Position
- Industry: ${formData.step1.industry}
- Current Stage: ${formData.step1.currentStage}
- Differentiation: ${formData.step1.differentiation}

### Target Market
- Primary Users: ${formData.step3.targetUsers}

## Strategic Objectives
Based on the vision and value proposition, define:
1. Short-term objectives (3-6 months)
2. Medium-term goals (6-12 months)  
3. Long-term vision (1-2 years)

## Go-to-Market Strategy
- Target user acquisition approach
- Value communication strategy
- Competitive positioning
- Market entry tactics

## Risk Assessment & Mitigation
- Market risks and mitigation strategies
- Technical risks and contingencies
- Competitive threats and responses

Generate a strategic document that provides clear direction and actionable strategic guidance.
`;
  }

  /**
   * Product Requirements Document (PRD) Prompt
   * Stage: Planning
   */
  static generatePRDPrompt(context: DocumentPromptContext): string {
    const { formData, techStack, targetPlatform, complexity } = context;
    
    return `
# Product Requirements Document (PRD) Generation

Create a comprehensive PRD for "${formData.step1.productName}":

## Product Overview
- **Product Name**: ${formData.step1.productName}
- **Description**: ${formData.step1.productPitch}
- **Industry**: ${formData.step1.industry}
- **Target Platform**: ${targetPlatform}
- **Complexity**: ${complexity || 'To be determined'}
- **Technology Stack**: ${techStack}

## User Requirements
### Primary Users
${formData.step3.targetUsers}

### User Problems & Needs
${formData.step3.painPoints.map(pain => `- ${pain}`).join('\n')}

Primary Job to be Done: ${formData.step3.primaryJobToBeDone}

## Feature Requirements

### Must-Have Features (Critical)
${formData.step5.mustHaveFeatures.map((feature, index) => `${index + 1}. ${feature}`).join('\n')}

### Nice-to-Have Features (Optional)
${formData.step5.niceToHaveFeatures.map((feature, index) => `${index + 1}. ${feature}`).join('\n')}

### Feature Prioritization
Method: ${formData.step5.prioritizationMethod}

## Technical Requirements
- **Platform**: ${targetPlatform}
- **Technology Stack**: ${techStack}
- **Complexity Level**: ${complexity}

## Constraints & Assumptions
${formData.step5.constraints}

## Detailed Functional Requirements
For each must-have feature, provide:
1. Detailed functional specification
2. User acceptance criteria
3. Technical considerations
4. Dependencies and assumptions

## Non-Functional Requirements
- Performance requirements
- Security requirements  
- Scalability requirements
- Usability requirements
- Compatibility requirements

Generate a detailed, technical PRD that serves as the definitive product specification.
`;
  }

  /**
   * Business Requirements Document (BRD) Prompt
   * Stage: Planning
   */
  static generateBRDPrompt(context: DocumentPromptContext): string {
    const { formData } = context;
    
    return `
# Business Requirements Document (BRD) Generation

Create a comprehensive BRD for "${formData.step1.productName}":

## Business Overview
- **Product**: ${formData.step1.productName}
- **Business Pitch**: ${formData.step1.productPitch}
- **Industry**: ${formData.step1.industry}
- **Current Stage**: ${formData.step1.currentStage}

## Business Objectives
### Primary Value Proposition
${formData.step2.valueProposition}

### Business Vision
${formData.step2.productVision}

## Market Analysis
### Target Market
${formData.step3.targetUsers}

### Market Problems
${formData.step3.painPoints.map(pain => `- ${pain}`).join('\n')}

### Competitive Landscape
${formData.step4.competitors.map(comp => `**${comp.name}**: ${comp.note}`).join('\n')}

### Market Differentiation
${formData.step1.differentiation}

## Business Requirements

### Functional Business Requirements
Based on must-have features:
${formData.step5.mustHaveFeatures.map((feature, index) => `${index + 1}. ${feature} - Business justification and ROI`).join('\n')}

### Business Constraints
${formData.step5.constraints}

## Stakeholder Analysis
- Primary stakeholders and their interests
- Decision makers and influencers
- User groups and their needs

## Business Process Requirements
- Current state business processes
- Future state business processes
- Process improvements and automation

## Financial Considerations
- Revenue model implications
- Cost considerations
- ROI projections
- Budget constraints

## Risk Assessment
- Business risks and mitigation strategies
- Market risks and contingencies
- Operational risks and responses

Generate a comprehensive business document that justifies the product from a business perspective.
`;
  }

  /**
   * Technical Requirements Document (TRD) Prompt
   * Stage: Planning
   */
  static generateTRDPrompt(context: DocumentPromptContext): string {
    const { formData, techStack, targetPlatform, complexity } = context;
    
    return `
# Technical Requirements Document (TRD) Generation

Create a comprehensive TRD for "${formData.step1.productName}":

## Technical Overview
- **Product**: ${formData.step1.productName}
- **Technology Stack**: ${techStack}
- **Target Platform**: ${targetPlatform}
- **Complexity Level**: ${complexity || 'To be determined'}
- **Industry**: ${formData.step1.industry}

## Architecture Requirements

### System Architecture
Based on ${techStack} and ${targetPlatform} platform:
- High-level system architecture
- Component architecture
- Data architecture
- Integration architecture

### Technical Constraints
${formData.step5.constraints}

## Feature Technical Specifications

### Core Technical Features
${formData.step5.mustHaveFeatures.map((feature, index) => 
  `${index + 1}. **${feature}**
     - Technical implementation approach
     - Technology components required
     - Performance requirements
     - Security considerations`
).join('\n\n')}

### Optional Technical Features  
${formData.step5.niceToHaveFeatures.map((feature, index) => 
  `${index + 1}. **${feature}**
     - Technical feasibility analysis
     - Implementation complexity
     - Resource requirements`
).join('\n\n')}

## Infrastructure Requirements
- Hosting and deployment requirements
- Database requirements
- Third-party service integrations
- Monitoring and logging requirements

## Security Requirements
- Authentication and authorization
- Data protection and privacy
- Security compliance requirements
- Vulnerability management

## Performance Requirements
- Response time requirements
- Throughput requirements
- Scalability requirements
- Availability requirements

## Development Requirements
- Development environment setup
- Testing requirements
- Deployment pipeline
- Code quality standards

## Integration Requirements
- External system integrations
- API requirements
- Data synchronization needs
- Third-party service dependencies

Generate a detailed technical specification that guides the development team.
`;
  }

  /**
   * Planning Toolkit Prompt
   * Stage: Planning
   */
  static generatePlanningToolkitPrompt(context: DocumentPromptContext): string {
    const { formData, techStack, complexity } = context;
    
    return `
# Planning Toolkit Generation

Create a comprehensive Planning Toolkit for "${formData.step1.productName}":

## Project Overview
- **Product**: ${formData.step1.productName}
- **Current Stage**: ${formData.step1.currentStage}
- **Technology**: ${techStack}
- **Complexity**: ${complexity || 'To be determined'}

## Feature Roadmap

### Phase 1: Core Features (Must-Have)
${formData.step5.mustHaveFeatures.map((feature, index) => 
  `${index + 1}. ${feature}
     - Estimated effort: [To be determined]
     - Dependencies: [To be analyzed]
     - Priority: Critical`
).join('\n\n')}

### Phase 2: Enhanced Features (Nice-to-Have)
${formData.step5.niceToHaveFeatures.map((feature, index) => 
  `${index + 1}. ${feature}
     - Estimated effort: [To be determined]
     - Dependencies: [To be analyzed]  
     - Priority: Optional`
).join('\n\n')}

## Prioritization Framework
**Method**: ${formData.step5.prioritizationMethod}

### RICE Scoring (if applicable)
For each feature, provide:
- Reach: Number of users affected
- Impact: Impact on user experience (1-3 scale)
- Confidence: Confidence in estimates (%)
- Effort: Development effort required

## Development Planning

### Sprint Planning
- Recommended sprint duration
- Feature breakdown by sprint
- Sprint goals and deliverables

### Resource Planning
- Team composition requirements
- Skill requirements
- Timeline estimates

### Risk Management
- Technical risks and mitigation
- Resource risks and contingencies
- Timeline risks and buffers

## Success Tracking

### Key Performance Indicators (KPIs)
Additional KPIs:
- User adoption metrics
- Feature usage metrics
- Performance metrics
- Business metrics

### Milestone Tracking
- Development milestones
- Testing milestones
- Launch milestones
- Post-launch milestones

## Implementation Guidelines

### Development Best Practices
- Code quality standards
- Testing requirements
- Documentation requirements
- Review processes

### Project Constraints
${formData.step5.constraints}

### Quality Assurance
- Testing strategy
- Quality gates
- Acceptance criteria
- Performance benchmarks

Generate a comprehensive planning toolkit that provides actionable guidance for project execution.
`;
  }

  /**
   * Get all prompts for a complete document suite
   */
  static getAllPrompts(context: DocumentPromptContext) {
    return {
      research_insights: this.generateResearchInsightsPrompt(context),
      vision_strategy: this.generateVisionStrategyPrompt(context),
      prd: this.generatePRDPrompt(context),
      brd: this.generateBRDPrompt(context),
      trd: this.generateTRDPrompt(context),
      planning_toolkit: this.generatePlanningToolkitPrompt(context)
    };
  }
}

export default V2DocumentPrompts;
