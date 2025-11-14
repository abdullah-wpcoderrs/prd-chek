# AI Prompt Tab Implementation Plan

## 🎯 Feature Overview
Add an AI-powered prompt interface alongside the existing form tab, allowing users to describe their project in natural language and have AI extract structured data.

## 📋 Requirements

### User Interface
1. **Tab Navigation**: Form Tab | Prompt Tab
2. **Chat Interface**: Full-screen chat when Prompt Tab is active
3. **AI Response**: Structured project outline with all form fields populated
4. **Action Buttons**: 
   - "Approve" → Submit to webhook
   - "Reiterate" → Refine existing response

### AI Behavior
1. **Initial Prompt**: User describes project in natural language
2. **AI Research**: Mini-research to extract structured data
3. **Response Format**: Display all form fields that would be filled
4. **Iteration**: Update only changed fields, keep existing data
5. **Approval**: Generate exact JSON structure for webhook

### Data Flow
1. **Same as Form Tab**: Use identical webhook payload structure
2. **Supabase Integration**: Store formData in same format
3. **Project Creation**: Use `createProjectAndStartGeneration()`
4. **Redirect**: Navigate to projects page after generation starts

## 🏗️ Technical Architecture

### Components to Create
```
components/
├── PromptInterface.tsx          # Main chat interface
├── PromptMessage.tsx            # Individual message component
├── ProjectOutlinePreview.tsx    # AI response preview
└── PromptActions.tsx            # Approve/Reiterate buttons

lib/
├── ai/
│   ├── openai-client.ts         # OpenAI integration
│   ├── prompt-templates.ts      # System prompts
│   └── response-parser.ts       # Parse AI response to formData
└── hooks/
    └── usePromptChat.ts         # Chat state management

app/api/
└── ai/
    ├── generate-outline/route.ts    # Initial project outline
    └── refine-outline/route.ts      # Iteration endpoint
```

### API Endpoints

#### POST /api/ai/generate-outline
```typescript
Request: {
  userPrompt: string;
  userId: string;
}

Response: {
  outline: ProductManagerFormData;
  explanation: string;
  confidence: number;
}
```

#### POST /api/ai/refine-outline
```typescript
Request: {
  currentOutline: ProductManagerFormData;
  userFeedback: string;
  conversationHistory: Message[];
}

Response: {
  outline: ProductManagerFormData;
  changes: string[];
  explanation: string;
}
```

## 📝 Implementation Steps

### Phase 1: Setup & Infrastructure
- [ ] Install OpenAI SDK
- [ ] Create environment variables for OpenAI API key
- [ ] Create AI client utility
- [ ] Create prompt templates

### Phase 2: API Endpoints
- [ ] Create generate-outline endpoint
- [ ] Create refine-outline endpoint
- [ ] Add response parsing logic
- [ ] Add error handling

### Phase 3: UI Components
- [ ] Create PromptInterface component
- [ ] Create ProjectOutlinePreview component
- [ ] Create PromptActions component
- [ ] Add tab navigation to dashboard

### Phase 4: Integration
- [ ] Connect to existing project creation flow
- [ ] Test webhook payload compatibility
- [ ] Add loading states and error handling
- [ ] Test end-to-end flow

### Phase 5: Polish
- [ ] Add conversation history
- [ ] Add typing indicators
- [ ] Add markdown rendering
- [ ] Mobile responsiveness

## 🔧 OpenAI Integration

### System Prompt Template
```
You are a product management expert helping users create comprehensive project documentation.

Your task is to analyze the user's project description and extract structured information for:
1. Product Basics (name, pitch, industry, stage, differentiation)
2. Value & Vision (value proposition, product vision)
3. Users & Problems (target users, pain points, jobs to be done)
4. Market Context (competitors)
5. Requirements & Planning (features, constraints, prioritization)

Return a JSON object matching the ProductManagerFormData structure.
Be thorough but concise. Ask clarifying questions if critical information is missing.
```

### Response Format
```json
{
  "step1": {
    "productName": "...",
    "productPitch": "...",
    "industry": "...",
    "currentStage": "idea",
    "differentiation": "..."
  },
  "step2": {
    "valueProposition": "...",
    "productVision": "..."
  },
  "step3": {
    "targetUsers": "...",
    "painPoints": ["...", "..."],
    "primaryJobToBeDone": "..."
  },
  "step4": {
    "competitors": [
      { "name": "...", "note": "..." }
    ]
  },
  "step5": {
    "mustHaveFeatures": ["...", "..."],
    "niceToHaveFeatures": ["...", "..."],
    "constraints": "...",
    "prioritizationMethod": "RICE"
  }
}
```

## 🎨 UI/UX Design

### Tab Navigation
```
┌─────────────────────────────────────┐
│  [Form Tab]  [Prompt Tab]           │
└─────────────────────────────────────┘
```

### Chat Interface (Prompt Tab Active)
```
┌─────────────────────────────────────┐
│  Chat Messages                       │
│  ┌─────────────────────────────┐   │
│  │ User: I want to build...    │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ AI: Here's your outline...  │   │
│  │ [Project Preview Card]      │   │
│  │ [Approve] [Reiterate]       │   │
│  └─────────────────────────────┘   │
│                                      │
│  [Input Box]                  [Send]│
└─────────────────────────────────────┘
```

### Project Outline Preview
```
┌─────────────────────────────────────┐
│ 📋 Project Outline                   │
├─────────────────────────────────────┤
│ Product Name: [value]                │
│ Industry: [value]                    │
│ Target Users: [value]                │
│ Key Features:                        │
│  • [feature 1]                       │
│  • [feature 2]                       │
│ ...                                  │
├─────────────────────────────────────┤
│ [✓ Approve] [↻ Reiterate]           │
└─────────────────────────────────────┘
```

## 🔄 Iteration Flow

### First Iteration
1. User sends prompt
2. AI generates complete outline
3. Display preview with all fields
4. User can approve or reiterate

### Subsequent Iterations
1. User provides feedback (e.g., "Change target users to enterprise")
2. AI updates ONLY the relevant fields
3. Display updated preview with changes highlighted
4. Preserve all other fields unchanged

### Approval Flow
1. User clicks "Approve"
2. Convert outline to ProductManagerFormData
3. Call `createProjectAndStartGeneration({ formData })`
4. Show generation progress
5. Redirect to projects page

## 🧪 Testing Checklist

- [ ] AI generates valid ProductManagerFormData structure
- [ ] Webhook receives identical payload as form tab
- [ ] Project creation works same as form tab
- [ ] Iteration preserves unchanged fields
- [ ] Error handling for AI failures
- [ ] Loading states during AI processing
- [ ] Mobile responsive design
- [ ] Conversation history persists during session

## 🚀 Environment Variables

```env
# Add to .env.local
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
```

## 📊 Success Metrics

1. **Functional Parity**: Prompt tab creates projects identical to form tab
2. **User Experience**: Faster project creation for users with clear vision
3. **Accuracy**: AI extracts 90%+ of required information correctly
4. **Iteration**: Users can refine in 1-2 iterations on average

---

**Next Steps**: Start with Phase 1 - Setup & Infrastructure
