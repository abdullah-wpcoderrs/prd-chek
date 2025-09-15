# Dashboard Test Data - Social App Creator

This file contains pseudo information for testing the dashboard form and webhook functionality for a social media application creator project.

## Basic Project Information

**Project Name:** SocialHub Creator

**Project Description:**
A comprehensive social media platform creator that allows users to build, customize, and deploy their own social networking applications. The platform provides drag-and-drop interface builders, pre-built social features, user management systems, and real-time communication tools. Users can create communities around specific interests, implement monetization features, and scale their social apps with built-in analytics and moderation tools.

Key features include:
- Visual app builder with customizable themes
- Real-time messaging and video calls
- User-generated content management
- Advanced privacy controls and moderation
- Social commerce integration
- Analytics dashboard for app creators
- Multi-platform deployment (web, iOS, Android)
- Subscription and payment processing
- Community management tools
- API integrations for third-party services

## Form Settings

**Tech Stack:** Next.js + Supabase + TypeScript

**Target Platform:** Web + Mobile

**Project Complexity:** Complex (Enterprise)

## Project Specification Details

### Core Features
- User registration and authentication with social login options
- Profile creation and customization with photo/video uploads
- Real-time messaging system with text, voice, and video capabilities
- News feed with algorithmic content discovery
- Community creation and management tools
- Live streaming and story features
- Social commerce marketplace integration
- Advanced search and discovery mechanisms
- Push notifications and email alerts
- Content moderation and reporting systems
- Analytics dashboard for creators and administrators
- Multi-language support and accessibility features

### Target Users
Primary users are entrepreneurs, content creators, and community builders aged 25-45 who want to create niche social platforms. Secondary users include small businesses looking to build customer communities, educational institutions creating learning networks, and hobby groups establishing dedicated social spaces. Users typically have basic technical knowledge but need user-friendly tools to bring their social app ideas to life without extensive coding skills.

### Design Style
Modern & Sleek

### Brand Guidelines & Design System
Clean, modern interface with a focus on user experience and accessibility. Color palette should emphasize trust and creativity with primary colors in blue tones (#2563eb, #1d4ed8) and accent colors in green (#10b981). Typography should be clean and readable with Inter or similar sans-serif fonts. The design should be mobile-first with responsive layouts. Include subtle animations and micro-interactions to enhance user engagement. Maintain consistency across all components with a comprehensive design system including spacing, shadows, and component libraries.

### Multi-User Roles
Yes

### Role Definitions
- **App Creator/Owner**: Full administrative access, can customize app design, manage users, access analytics, configure monetization, and deploy apps
- **Community Moderator**: Can moderate content, manage user reports, ban/unban users, and oversee community guidelines enforcement
- **Content Creator**: Can create and publish content, access basic analytics for their posts, manage their profile, and interact with followers
- **Premium User**: Enhanced features like advanced customization options, priority support, extended storage, and early access to new features
- **Standard User**: Basic social features including posting, commenting, messaging, joining communities, and consuming content
- **Guest User**: Limited read-only access to public content, can view profiles and posts but cannot interact or create content

## Webhook Test Data Structure

This data can be used when testing the webhook endpoint to ensure proper handling of project specifications and generation workflows.

```json
{
  "projectName": "SocialHub Creator",
  "description": "A comprehensive social media platform creator that allows users to build, customize, and deploy their own social networking applications...",
  "techStack": "Next.js + Supabase + TypeScript",
  "targetPlatform": "both",
  "complexity": "complex",
  "projectSpec": {
    "coreFeatures": "User registration and authentication with social login options, Profile creation and customization with photo/video uploads, Real-time messaging system with text, voice, and video capabilities...",
    "targetUsers": "Primary users are entrepreneurs, content creators, and community builders aged 25-45 who want to create niche social platforms...",
    "designStyle": "modern",
    "brandGuidelines": "Clean, modern interface with a focus on user experience and accessibility. Color palette should emphasize trust and creativity...",
    "multiUserRoles": true,
    "roleDefinitions": "App Creator/Owner: Full administrative access... Community Moderator: Can moderate content... Content Creator: Can create and publish content..."
  }
}
```

## Expected Generated Documents

When this data is processed through the webhook, it should generate:

1. **Product Requirements Document (PRD)** - Comprehensive feature specifications
2. **User Journey Document** - Detailed user flows for different role types
3. **Application Sitemap** - Complete app structure and navigation
4. **Technology Requirements** - Tech stack analysis and recommendations
5. **Screen Specifications** - Detailed UI/UX specifications for each screen

## Testing Notes

- Use this data to test the complete flow from dashboard form submission to webhook processing
- Verify that all project specification fields are properly transmitted
- Test the real-time progress updates during generation
- Confirm that document status updates are reflected in the UI
- Validate that the generated documents meet the specified requirements