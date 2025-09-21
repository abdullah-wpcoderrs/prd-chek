# N8N V2 Integration Guide - Enhanced 6-Document Pipeline

## 🚀 **V2 PIPELINE OVERVIEW**

The new V2 system introduces an enhanced 6-document generation pipeline with rich multi-step form data and a 3-stage workflow.

### **Enhanced Document Structure (V2)**

#### **Stage 1: Discovery & Research**
- `Research_Insights` - Research & Insights Report

#### **Stage 2: Vision & Strategy**  
- `Vision_Strategy` - Vision & Strategy Document

#### **Stage 3: Requirements & Planning**
- `PRD` - Product Requirements Document
- `BRD` - Business Requirements Document  
- `TRD` - Technical Requirements Document
- `Planning_Toolkit` - Planning Toolkit

---

## 📡 **Enhanced Webhook Payload (V2)**

### **New V2 Request Structure**
```
{
  "projectId": "project_123",
  "userId": "user_456", 
  "userEmail": "user@example.com",
  "projectName": "AI-Powered Task Manager",
  "description": "Intelligent task management with AI prioritization",
  "techStack": "Next.js + Supabase + TypeScript",
  "targetPlatform": "web",
  "timestamp": "2025-01-10T12:00:00.000Z",
  "requestId": "req_1704974400000_abc123",
  
  // NEW V2 FIELDS
  "projectVersion": "v2",
  "formData": {
    "step1": {
      "productName": "AI Task Manager Pro",
      "productPitch": "Revolutionary task management with AI-powered prioritization",
      "industry": "productivity", 
      "currentStage": "mvp",
      "techStack": "Next.js + Supabase + TypeScript",
      "targetPlatform": "web"
    },
    "step2": {
      "targetUsers": "Knowledge workers, remote teams, project managers",
      "painPoints": [
        "Time management and task prioritization issues",
        "Scattered tools and lack of integration", 
        "Difficulty maintaining focus and avoiding distractions"
      ],
      "primaryJobToBeDone": "Efficiently manage productivity operations and workflows"
    },
    "step3": {
      "competitors": [
        {"name": "Notion", "note": "All-in-one workspace and note-taking"},
        {"name": "Trello", "note": "Kanban-style project management"},
        {"name": "Todoist", "note": "Task management and productivity app"}
      ],
      "differentiation": "AI-powered prioritization and smart automation",
      "marketTrend": "Growing demand for intelligent productivity solutions"
    },
    "step4": {
      "valueProposition": "Maximize productivity with AI-driven task optimization",
      "productVision": "The future of intelligent task management",
      "successMetric": "40% improvement in user productivity within 6 months"
    },
    "step5": {
      "mustHaveFeatures": [
        "AI-powered task prioritization",
        "Smart scheduling and reminders", 
        "Cross-platform synchronization",
        "Team collaboration tools",
        "Analytics and insights"
      ],
      "niceToHaveFeatures": [
        "Voice commands and dictation",
        "Advanced automation rules",
        "Third-party integrations",
        "Custom themes and layouts"
      ],
      "constraints": "Budget limitations, mobile performance requirements",
      "prioritizationMethod": "RICE"
    }
  }
}
```

---

## 🎯 **V2 Document Generation Requirements**

### **1. Research & Insights Report**
- **Type**: `"Research_Insights"`
- **Stage**: `"discovery"`
- **Enhanced Content Sources**:
  - Market analysis from `formData.step3.competitors`
  - User research from `formData.step2.targetUsers` and `painPoints`
  - Industry trends from `formData.step3.marketTrend`
  - Competitive landscape analysis

### **2. Vision & Strategy Document**  
- **Type**: `"Vision_Strategy"`
- **Stage**: `"strategy"`
- **Enhanced Content Sources**:
  - Product vision from `formData.step4.productVision`
  - Value proposition from `formData.step4.valueProposition`
  - Success metrics from `formData.step4.successMetric`
  - Strategic differentiation from `formData.step3.differentiation`

### **3. Product Requirements Document (PRD)**
- **Type**: `"PRD"`  
- **Stage**: `"planning"`
- **Enhanced Content Sources**:
  - Core features from `formData.step5.mustHaveFeatures`
  - Feature prioritization using `formData.step5.prioritizationMethod`
  - Product constraints from `formData.step5.constraints`
  - User requirements from `formData.step2`

### **4. Business Requirements Document (BRD)**
- **Type**: `"BRD"`
- **Stage**: `"planning"`  
- **Enhanced Content Sources**:
  - Business objectives from `formData.step4.valueProposition`
  - Target market from `formData.step2.targetUsers`
  - Success criteria from `formData.step4.successMetric`
  - Market positioning from `formData.step3`

### **5. Technical Requirements Document (TRD)**
- **Type**: `"TRD"`
- **Stage**: `"planning"`
- **Enhanced Content Sources**:
  - Technology stack from `techStack`
  - Platform requirements from `targetPlatform`
  - Technical constraints from `formData.step5.constraints`

### **6. Planning Toolkit**
- **Type**: `"Planning_Toolkit"`
- **Stage**: `"planning"`
- **Enhanced Content Sources**:
  - Feature roadmap from `formData.step5` features
  - Prioritization framework from `formData.step5.prioritizationMethod`
  - Development phases based on `formData.step1.currentStage`
  - Resource planning considerations

---

## 🔧 **N8N Workflow Configuration (V2)**

### **Enhanced Status Response Structure**
```
{
  "projectId": "project_123",
  "status": "processing",
  "progress": 50,
  "currentStep": "Generating Vision & Strategy Document...",
  "estimatedTime": 180000,
  "projectVersion": "v2",
  "documents": [
    {
      "type": "Research_Insights",
      "name": "Research & Insights Report", 
      "status": "completed",
      "stage": "discovery",
      "downloadUrl": "https://storage.com/research_insights_123.pdf",
      "size": "1.8 MB"
    },
    {
      "type": "Vision_Strategy",
      "name": "Vision & Strategy Document",
      "status": "processing", 
      "stage": "strategy",
      "downloadUrl": null,
      "size": null
    },
    {
      "type": "PRD",
      "name": "Product Requirements Document",
      "status": "pending",
      "stage": "planning", 
      "downloadUrl": null,
      "size": null
    },
    {
      "type": "BRD", 
      "name": "Business Requirements Document",
      "status": "pending",
      "stage": "planning",
      "downloadUrl": null,
      "size": null
    },
    {
      "type": "TRD",
      "name": "Technical Requirements Document", 
      "status": "pending",
      "stage": "planning",
      "downloadUrl": null,
      "size": null
    },
    {
      "type": "Planning_Toolkit",
      "name": "Planning Toolkit",
      "status": "pending",
      "stage": "planning",
      "downloadUrl": null, 
      "size": null
    }
  ]
}
```

---

## 🎨 **Enhanced Content Generation Strategies**

### **Utilizing Rich Form Data**

#### **1. Product Basics (Step 1)**
```javascript
// N8N JavaScript Node Example
const productName = $json.formData.step1.productName;
const productPitch = $json.formData.step1.productPitch;
const industry = $json.formData.step1.industry;
const currentStage = $json.formData.step1.currentStage;

// Tailor content based on industry and stage
let industryContext = "";
switch(industry) {
  case 'productivity': 
    industryContext = "Focus on efficiency, automation, and user workflow optimization";
    break;
  case 'saas':
    industryContext = "Emphasize scalability, multi-tenancy, and enterprise features";
    break;
  // Add other industries...
}
```

#### **2. User & Problem Analysis (Step 2)**
```javascript
const targetUsers = $json.formData.step2.targetUsers;
const painPoints = $json.formData.step2.painPoints;
const primaryJob = $json.formData.step2.primaryJobToBeDone;

// Generate detailed user personas
const userPersonas = `
Primary Users: ${targetUsers}
Key Pain Points: ${painPoints.join(', ')}
Primary Job to be Done: ${primaryJob}
`;
```

#### **3. Competitive Intelligence (Step 3)**
```javascript
const competitors = $json.formData.step3.competitors;
const differentiation = $json.formData.step3.differentiation;
const marketTrend = $json.formData.step3.marketTrend;

// Build competitive analysis
const competitiveAnalysis = competitors.map(comp => 
  `${comp.name}: ${comp.note}`
).join('\n');
```

#### **4. Vision & Value (Step 4)**
```javascript
const valueProposition = $json.formData.step4.valueProposition;
const productVision = $json.formData.step4.productVision;
const successMetric = $json.formData.step4.successMetric;

// Create strategic content
const strategicFramework = `
Value Proposition: ${valueProposition}
Long-term Vision: ${productVision}  
Success Measurement: ${successMetric}
`;
```

#### **5. Feature Planning (Step 5)**
```javascript
const mustHaveFeatures = $json.formData.step5.mustHaveFeatures;
const niceToHaveFeatures = $json.formData.step5.niceToHaveFeatures;
const constraints = $json.formData.step5.constraints;
const prioritizationMethod = $json.formData.step5.prioritizationMethod;

// Generate feature specifications
const featureMatrix = {
  critical: mustHaveFeatures,
  optional: niceToHaveFeatures,
  constraints: constraints,
  method: prioritizationMethod
};
```

---

## 📊 **Stage-Based Progress Tracking**

### **Progress Calculation Logic**
```javascript
// N8N Progress Calculation
function calculateProgress(documents) {
  const stageWeights = {
    'discovery': 20,    // 20% for Research & Insights
    'strategy': 30,     // 30% for Vision & Strategy  
    'planning': 50      // 50% for all Planning documents (12.5% each)
  };
  
  let totalProgress = 0;
  
  documents.forEach(doc => {
    if (doc.status === 'completed') {
      if (doc.stage === 'planning') {
        totalProgress += stageWeights.planning / 4; // 4 planning docs
      } else {
        totalProgress += stageWeights[doc.stage];
      }
    }
  });
  
  return Math.round(totalProgress);
}
```

---

## 🔄 **Migration from V1 to V2**

### **Backward Compatibility**
Your N8N workflow should handle both V1 and V2 projects:

```javascript
// N8N Version Detection
const projectVersion = $json.projectVersion || 'v1';

if (projectVersion === 'v2') {
  // Use enhanced formData for rich content generation
  const formData = $json.formData;
  // Generate 6 documents with enhanced content
} else {
  // Use legacy projectSpec for basic content generation  
  const projectSpec = $json.projectSpec;
  // Generate 5 documents with basic content
}
```

---

## ✅ **V2 Testing Checklist**

### **Enhanced Webhook Testing**
- [ ] V2 payload structure validation
- [ ] Multi-step form data processing
- [ ] 6-document generation pipeline
- [ ] Stage-based progress tracking
- [ ] Enhanced content quality verification
- [ ] Backward compatibility with V1 projects

### **Content Quality Validation**
- [ ] Research report includes competitive analysis
- [ ] Vision document reflects strategic framework
- [ ] PRD incorporates feature prioritization
- [ ] BRD aligns with business objectives
- [ ] TRD matches technical requirements
- [ ] Planning toolkit provides actionable roadmap

---

**Status**: 🔄 **READY FOR V2 IMPLEMENTATION**

*This guide provides the complete specification for upgrading your N8N workflow to support the enhanced V2 pipeline with rich multi-step form data and 6-document generation.*