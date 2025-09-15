-- Insert template data with comprehensive prompts
-- Run this SQL after creating the templates table

INSERT INTO public.templates (
  name, description, category, tech_stacks, features, rating, downloads,
  prd_prompt, user_stories_prompt, sitemap_prompt, tech_stack_prompt, screens_prompt
) VALUES

-- Social Media Platform Template
(
  'Social Media Platform',
  'Complete documentation suite for building a modern social media application',
  'Social',
  ARRAY['React + Node.js', 'Next.js + Supabase', 'Vue + Laravel'],
  ARRAY['User authentication & profiles', 'Real-time messaging', 'Content sharing & feeds', 'Social interactions', 'Mobile responsive design'],
  4.8,
  1247,
  
  -- PRD Prompt
  'Generate a comprehensive Product Requirements Document for a modern social media platform. Include: Executive Summary, Market Analysis targeting Gen Z and Millennials, Core Features (user profiles, content feeds, real-time messaging, social interactions like likes/comments/shares, discovery algorithms), Technical Requirements for scalability, Security & Privacy considerations for user data protection, Content moderation policies, Monetization strategy through ads and premium features, Success Metrics (DAU, engagement rates, retention), and Implementation Timeline with MVP and future phases.',
  
  -- User Stories Prompt  
  'Create detailed user stories for a social media platform covering: New User Onboarding (account creation, profile setup, friend discovery), Content Creation & Sharing (posts, photos, videos, stories), Social Interactions (following, messaging, commenting, liking), Content Discovery (trending content, hashtags, recommendations), Privacy Controls (account settings, content visibility, blocking), Notifications & Engagement, Mobile App Experience, and Admin/Moderation workflows. Include acceptance criteria, edge cases, and user personas (casual users, content creators, business accounts).',
  
  -- Sitemap Prompt
  'Design a comprehensive sitemap for a social media platform including: Authentication flows (login, signup, password reset, email verification), Main Dashboard/Feed, User Profile sections (public profile, settings, privacy controls), Content Management (create post, photo/video upload, story creation), Social Features (friends/followers, messaging, notifications), Discovery pages (trending, hashtags, search results), Help & Support sections, Admin Panel for content moderation, Mobile app navigation structure, and API endpoint organization.',
  
  -- Tech Stack Prompt
  'Recommend optimal technology stack for a scalable social media platform including: Frontend frameworks (React/Vue/Angular) with real-time capabilities, Backend technologies (Node.js/Python/Java) for API development, Database solutions (PostgreSQL for user data, Redis for caching, MongoDB for posts), Real-time infrastructure (WebSockets, Socket.io, Firebase), Cloud services (AWS/GCP/Azure) for hosting and CDN, Image/Video processing services, Authentication systems (Auth0, Firebase Auth), Message queuing (Redis, RabbitMQ), Search engines (Elasticsearch), Monitoring & Analytics tools, and Security frameworks.',
  
  -- Screens Prompt
  'Design comprehensive screen specifications for a social media platform including: Login/Signup screens with social authentication options, Main Feed with infinite scroll and engagement actions, User Profile screens (public view, edit profile, settings), Content Creation screens (new post, photo editor, story creator), Social interaction screens (comments, messaging, friends list), Discovery screens (trending, hashtags, search), Notification center, Privacy settings, Help & Support sections, and responsive design considerations for mobile, tablet, and desktop views. Include wireframes, component specifications, and user flow diagrams.'
),

-- E-commerce Marketplace Template
(
  'E-commerce Marketplace',
  'Comprehensive docs for building a multi-vendor marketplace platform',
  'E-commerce',
  ARRAY['React Native', 'Flutter', 'Next.js + Stripe'],
  ARRAY['Vendor management system', 'Payment processing', 'Inventory management', 'Order tracking', 'Review & rating system'],
  4.9,
  856,
  
  -- PRD Prompt
  'Generate a comprehensive Product Requirements Document for a multi-vendor e-commerce marketplace. Include: Executive Summary, Market Analysis of B2B and B2C opportunities, Core Features (vendor onboarding, product catalog management, order processing, payment systems, shipping integration), Multi-vendor capabilities (commission structures, vendor dashboards, dispute resolution), Customer experience (search & discovery, reviews, recommendations, wishlist), Technical Requirements for high-traffic handling, Security & Compliance (PCI DSS, data protection), Revenue model (commissions, listing fees, advertising), Analytics & Reporting for vendors and platform, and Go-to-market strategy.',
  
  -- User Stories Prompt
  'Create detailed user stories for an e-commerce marketplace covering three user types: Customers (account creation, product browsing, search & filters, cart management, checkout process, order tracking, reviews & ratings), Vendors (store setup, product listing, inventory management, order fulfillment, analytics dashboard, customer communication), and Platform Administrators (vendor approval, content moderation, dispute resolution, platform analytics, payment management). Include acceptance criteria, error handling scenarios, and edge cases for each user journey.',
  
  -- Sitemap Prompt
  'Design a comprehensive sitemap for an e-commerce marketplace including: Public storefront (homepage, product categories, search results, product details), User account areas (customer dashboard, vendor dashboard, admin panel), Transaction flows (shopping cart, checkout, payment processing, order confirmation), Support sections (help center, contact forms, dispute resolution), Vendor onboarding process, Product management interfaces, Analytics & reporting sections, Mobile app structure, API documentation layout, and SEO-optimized page structures.',
  
  -- Tech Stack Prompt
  'Recommend optimal technology stack for a scalable e-commerce marketplace including: Frontend technologies (Next.js/React for web, React Native/Flutter for mobile), Backend services (Node.js/Python/Java with microservices architecture), Database solutions (PostgreSQL for transactions, MongoDB for product catalog, Redis for sessions), Payment processing (Stripe, PayPal, Square), Search & discovery (Elasticsearch, Algolia), Cloud infrastructure (AWS/GCP with auto-scaling), CDN for product images, Inventory management systems, Shipping APIs (FedEx, UPS, USPS), Email services, Analytics platforms, and Security tools for PCI compliance.',
  
  -- Screens Prompt
  'Design comprehensive screen specifications for an e-commerce marketplace including: Homepage with featured products and categories, Product listing pages with filters and sorting, Product detail pages with reviews and recommendations, Shopping cart and checkout flow, User account management (customer & vendor dashboards), Vendor store management screens, Order tracking interfaces, Review & rating systems, Search results and filters, Mobile-responsive design considerations, Admin panel for platform management, Payment processing screens, and shipping/tracking interfaces. Include wireframes, responsive breakpoints, and accessibility considerations.'
),

-- SaaS Dashboard Template  
(
  'SaaS Dashboard',
  'Business intelligence and analytics dashboard documentation',
  'Business',
  ARRAY['Angular + .NET', 'React + Django', 'Vue + Spring Boot'],
  ARRAY['Data visualization', 'User role management', 'API integration', 'Reporting system', 'Multi-tenant architecture'],
  4.7,
  692,
  
  -- PRD Prompt
  'Generate a comprehensive Product Requirements Document for a SaaS analytics dashboard. Include: Executive Summary for B2B market, Target audience analysis (SMBs to Enterprise), Core Features (customizable dashboards, data visualization, real-time analytics, reporting tools, data integrations), Multi-tenant architecture requirements, User roles & permissions (admin, manager, analyst, viewer), Data security & compliance (GDPR, SOX, HIPAA considerations), API integration capabilities, White-label options, Pricing strategy (freemium to enterprise tiers), Performance requirements for large datasets, and Competitive analysis against Tableau, Power BI.',
  
  -- User Stories Prompt
  'Create detailed user stories for a SaaS dashboard covering multiple user roles: System Administrators (tenant management, user provisioning, system monitoring, billing management), Business Managers (dashboard creation, team management, report scheduling, data source configuration), Data Analysts (widget creation, custom queries, data exploration, export functions), and End Users (dashboard viewing, filtering, drill-down analysis, sharing). Include acceptance criteria for data visualization, real-time updates, mobile access, and integration scenarios.',
  
  -- Sitemap Prompt
  'Design a comprehensive sitemap for a SaaS dashboard platform including: Public marketing site, Authentication & onboarding flows, Main dashboard interface, Data source management, Widget & chart configuration, Report builder, User & role management, Billing & subscription management, API documentation, Help center & tutorials, Admin control panel, White-label customization options, Mobile app navigation, and multi-tenant separation architecture.',
  
  -- Tech Stack Prompt
  'Recommend optimal technology stack for a scalable SaaS dashboard including: Frontend frameworks (React/Angular/Vue) with charting libraries (D3.js, Chart.js, Recharts), Backend technologies (Node.js/Python/Java) with API gateway, Database solutions (PostgreSQL for metadata, ClickHouse/BigQuery for analytics data, Redis for caching), Data processing (Apache Kafka, Apache Spark), Visualization engines, Multi-tenant architecture patterns, Authentication systems (Auth0, Okta), API management tools, Cloud services with auto-scaling, Monitoring & observability tools, and CI/CD pipelines for SaaS deployment.',
  
  -- Screens Prompt
  'Design comprehensive screen specifications for a SaaS dashboard including: Landing page with feature highlights, Authentication screens (login, signup, MFA), Main dashboard with customizable widgets, Data source connection wizards, Chart & widget configuration interfaces, Report builder with drag-and-drop functionality, User management & role assignment screens, Billing & subscription management, API keys & integrations management, Mobile dashboard views, Admin panel for tenant management, White-label customization interface, and responsive design for all device types. Include component libraries, design systems, and accessibility standards.'
),

-- Learning Management System Template
(
  'Learning Management System',
  'Educational platform with course creation and student management',
  'Education', 
  ARRAY['React + Rails', 'Next.js + PostgreSQL', 'Vue + Express'],
  ARRAY['Course creation tools', 'Student progress tracking', 'Assignment management', 'Video streaming', 'Certificate generation'],
  4.6,
  534,
  
  -- PRD Prompt
  'Generate a comprehensive Product Requirements Document for a Learning Management System. Include: Executive Summary targeting educational institutions and corporate training, Market Analysis of EdTech landscape, Core Features (course creation, content management, student enrollment, progress tracking, assessments, gradebooks), Video streaming & content delivery, Communication tools (discussions, messaging, announcements), Mobile learning capabilities, Integration requirements (SSO, third-party tools), Accessibility compliance (WCAG, ADA), Analytics & reporting for educators, Certification & credentialing features, and Scalability requirements for large institutions.',
  
  -- User Stories Prompt
  'Create detailed user stories for an LMS covering multiple user roles: Students (course enrollment, content consumption, assignment submission, progress tracking, peer interaction, certificate earning), Instructors (course creation, content upload, student management, grading, analytics viewing), Administrators (user management, course approval, system configuration, reporting), and IT Managers (integration setup, security management, system monitoring). Include acceptance criteria for mobile learning, offline content access, and assessment security.',
  
  -- Sitemap Prompt
  'Design a comprehensive sitemap for an LMS including: Public course catalog, Student portal (enrolled courses, progress dashboard, assignments, grades), Instructor dashboard (course management, student analytics, content creation tools), Administrator panel (user management, course approval, system settings), Assessment & quiz interfaces, Discussion forums, Video streaming platform, Mobile app structure, API documentation, Help & support sections, and integration management interfaces.',
  
  -- Tech Stack Prompt
  'Recommend optimal technology stack for a scalable LMS including: Frontend frameworks (React/Vue with responsive design), Backend technologies (Node.js/Python/Ruby) with RESTful APIs, Database solutions (PostgreSQL for user data, MongoDB for content), Video streaming (AWS CloudFront, Vimeo API, Wistia), Content delivery networks, Learning analytics platforms, Authentication systems with SSO support, Mobile development (React Native/Flutter), Assessment security tools, Integration platforms (LTI standards), Real-time communication tools, and cloud hosting with global CDN.',
  
  -- Screens Prompt
  'Design comprehensive screen specifications for an LMS including: Course catalog with search & filtering, Student dashboard with progress indicators, Course content viewing (videos, documents, interactive content), Assignment submission interfaces, Quiz & assessment screens with security features, Gradebook & progress tracking, Discussion forums & messaging, Instructor course creation tools, Student management interfaces, Mobile learning app screens, Certificate & credential displays, Analytics dashboards, and administrative control panels. Include accessibility features, responsive design patterns, and offline capability considerations.'
),

-- Healthcare Management Template
(
  'Healthcare Management',
  'Patient management and telemedicine platform documentation',
  'Healthcare',
  ARRAY['React + Node.js', 'Flutter + Firebase', 'Angular + MongoDB'],
  ARRAY['Patient records management', 'Appointment scheduling', 'Telemedicine integration', 'Medical history tracking', 'HIPAA compliance features'],
  4.8,
  423,
  
  -- PRD Prompt
  'Generate a comprehensive Product Requirements Document for a Healthcare Management System. Include: Executive Summary for healthcare providers, Regulatory compliance requirements (HIPAA, HITECH, state regulations), Core Features (patient records, appointment scheduling, telemedicine, billing integration, prescription management), Security & privacy requirements for PHI protection, Interoperability with EHR systems (HL7 FHIR), Telemedicine capabilities with video conferencing, Mobile health features, Clinical workflow automation, Analytics & reporting for population health, Integration with insurance systems, and Audit logging for compliance.',
  
  -- User Stories Prompt
  'Create detailed user stories for a healthcare management system covering: Patients (account creation, appointment booking, medical record access, telemedicine consultations, prescription requests, bill payment), Healthcare Providers (patient chart management, appointment scheduling, clinical notes, prescription writing, telemedicine sessions), Administrative Staff (patient registration, insurance verification, billing management, appointment coordination), and IT Administrators (user management, system security, compliance monitoring, integration management). Include HIPAA compliance requirements and emergency access scenarios.',
  
  -- Sitemap Prompt
  'Design a comprehensive sitemap for a healthcare management system including: Patient portal (health records, appointments, messaging, billing), Provider dashboard (patient charts, schedules, clinical tools), Administrative interfaces (registration, billing, insurance), Telemedicine platform integration, Prescription management system, Clinical decision support tools, Reporting & analytics sections, Compliance management interfaces, Mobile app navigation, API documentation for integrations, and emergency access procedures.',
  
  -- Tech Stack Prompt
  'Recommend optimal technology stack for a HIPAA-compliant healthcare management system including: Frontend frameworks (React/Angular) with secure authentication, Backend technologies (Node.js/Python/.NET) with encryption at rest and in transit, Database solutions (PostgreSQL with encryption, secure backup systems), Cloud infrastructure (AWS/Azure with HIPAA compliance), Video conferencing APIs (Twilio, Agora) for telemedicine, EHR integration standards (HL7 FHIR), Identity management (OAuth 2.0, SAML), Audit logging systems, Mobile development with security frameworks, Payment processing (HIPAA-compliant), and monitoring tools for security incidents.',
  
  -- Screens Prompt
  'Design comprehensive screen specifications for a healthcare management system including: Patient portal with health dashboard, Appointment scheduling with provider availability, Telemedicine video consultation interface, Medical records viewing with timeline, Prescription management screens, Provider clinical workflow interfaces, Administrative billing & insurance screens, Mobile health app design, Emergency access interfaces, Compliance reporting dashboards, Secure messaging between patients and providers, and audit trail viewing capabilities. Include security considerations, accessibility for diverse user populations, and responsive design for various devices.'
),

-- Task Management Tool Template
(
  'Task Management Tool', 
  'Project and team collaboration platform with advanced features',
  'Productivity',
  ARRAY['Svelte + Express', 'React + GraphQL', 'Next.js + Prisma'],
  ARRAY['Project planning tools', 'Team collaboration', 'Time tracking', 'Resource management', 'Gantt charts & reporting'],
  4.5,
  789,
  
  -- PRD Prompt
  'Generate a comprehensive Product Requirements Document for a Task Management & Team Collaboration platform. Include: Executive Summary targeting remote teams and project managers, Market Analysis against Asana, Trello, Monday.com, Core Features (task creation, project organization, team collaboration, time tracking, resource allocation), Advanced project management (Gantt charts, dependencies, milestones), Real-time collaboration (comments, file sharing, notifications), Reporting & analytics (productivity metrics, project insights), Integration capabilities (Slack, Google Workspace, GitHub), Mobile applications, Pricing strategy (freemium to enterprise), and Scalability requirements for large organizations.',
  
  -- User Stories Prompt
  'Create detailed user stories for a task management platform covering: Individual Users (task creation, personal organization, time tracking, deadline management), Team Members (collaborative project work, file sharing, progress updates, communication), Project Managers (project planning, team oversight, resource allocation, progress reporting), and Administrators (user management, workspace configuration, billing management, integration setup). Include acceptance criteria for real-time updates, mobile synchronization, and offline capability.',
  
  -- Sitemap Prompt
  'Design a comprehensive sitemap for a task management platform including: Dashboard with project overview, Task management interfaces (lists, boards, calendar views), Project planning tools (Gantt charts, timeline views), Team collaboration spaces, Time tracking & reporting, Resource management interfaces, Integration management, Mobile app navigation, Admin panel for workspace management, Help center & tutorials, API documentation, and billing & subscription management.',
  
  -- Tech Stack Prompt
  'Recommend optimal technology stack for a scalable task management platform including: Frontend frameworks (React/Vue/Svelte) with real-time updates, Backend technologies (Node.js/Python) with GraphQL APIs, Database solutions (PostgreSQL for structured data, Redis for real-time features), Real-time infrastructure (WebSockets, GraphQL subscriptions), File storage & sharing (AWS S3, Google Drive API), Authentication systems with SSO support, Mobile development (React Native/Flutter), Integration platforms (Zapier, webhooks), Search capabilities (Elasticsearch), Analytics tools, and cloud hosting with global distribution.',
  
  -- Screens Prompt
  'Design comprehensive screen specifications for a task management platform including: Project dashboard with progress overview, Task list & board views (Kanban, list, calendar), Gantt chart & timeline interfaces, Team collaboration workspaces, Time tracking interfaces with timers, Resource allocation & capacity planning screens, Reporting & analytics dashboards, File sharing & version control interfaces, Mobile app screens for on-the-go task management, Admin configuration panels, Integration setup wizards, and notification management interfaces. Include responsive design, keyboard shortcuts, and accessibility features for power users.'
);

-- Update statistics to reset them
UPDATE public.templates SET 
  downloads = FLOOR(RANDOM() * 1000 + 100),
  rating = ROUND((RANDOM() * 1.5 + 3.5)::numeric, 1)
WHERE id IS NOT NULL;