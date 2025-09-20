-- Enhanced template data with better multi-step form field mappings
-- Run this SQL after creating the templates table

-- First, let's update existing templates with enhanced data
UPDATE public.templates SET
  features = ARRAY[
    'User authentication & profiles',
    'Real-time messaging system',
    'Content sharing & feeds',
    'Social interactions (likes, comments, shares)',
    'Mobile responsive design',
    'Advanced privacy controls',
    'Content moderation tools',
    'Push notifications',
    'Story/status updates',
    'Friend/follower system'
  ]
WHERE name = 'Social Media Platform';

UPDATE public.templates SET
  features = ARRAY[
    'Vendor management system',
    'Payment processing integration',
    'Inventory management',
    'Order tracking & fulfillment',
    'Review & rating system',
    'Multi-currency support',
    'Shipping calculator',
    'Product catalog management',
    'Analytics dashboard',
    'Customer support chat'
  ]
WHERE name = 'E-commerce Marketplace';

-- Add new enhanced templates with comprehensive feature sets

-- Business SaaS Platform Template
INSERT INTO public.templates (
  name, description, category, tech_stacks, features, rating, downloads,
  prd_prompt, user_stories_prompt, sitemap_prompt, tech_stack_prompt, screens_prompt,
  document_count, is_active, created_at, updated_at
) VALUES (
  'Business SaaS Platform',
  'Comprehensive business software-as-a-service platform with enterprise-grade features for team collaboration, project management, and business intelligence.',
  'Business',
  ARRAY['React + Node.js', 'Vue.js + Express', 'Angular + NestJS', 'Next.js + Supabase', 'Django + PostgreSQL'],
  ARRAY[
    'Multi-tenant architecture',
    'Role-based access control (RBAC)',
    'Advanced analytics dashboard',
    'API management & documentation',
    'Automated billing & subscription management',
    'Real-time collaboration tools',
    'Custom workflow automation',
    'Enterprise SSO integration',
    'Data export & backup systems',
    'White-label customization',
    'Advanced reporting & insights',
    'Third-party integrations hub',
    'Mobile-responsive design',
    'Audit logs & compliance tracking',
    'Performance monitoring & alerts'
  ],
  4.8,
  2847,
  'Create a comprehensive PRD for a Business SaaS Platform that serves as an all-in-one solution for modern enterprises. The platform should focus on streamlining business operations through integrated tools for project management, team collaboration, customer relationship management, and business intelligence. Key considerations: multi-tenant architecture for scalability, enterprise-grade security with SSO integration, customizable workflows, comprehensive API ecosystem, and advanced analytics. The platform should support various business sizes from startups to enterprise clients with flexible pricing tiers and white-label options.',
  'Generate detailed user stories for a Business SaaS Platform focusing on different user roles (admin, team lead, member, guest). Include stories for user management, project collaboration, analytics viewing, billing management, and system configuration. Each story should follow the format: "As a [user type], I want to [action] so that [benefit]". Cover both core functionality and edge cases.',
  'Create a comprehensive sitemap for a Business SaaS Platform including main navigation (Dashboard, Projects, Teams, Analytics, Billing, Settings), user management flows, project management sections, collaboration tools, reporting modules, and administrative areas. Include both authenticated and public pages, with clear hierarchy and user role-based access patterns.',
  'Recommend optimal tech stack for a Business SaaS Platform considering scalability, security, and maintainability. Include frontend framework, backend architecture, database solutions, authentication systems, payment processing, real-time features, monitoring tools, and deployment infrastructure. Provide rationale for each choice and alternative options.',
  'Design comprehensive screen layouts for a Business SaaS Platform including dashboard overview, project management interface, team collaboration views, analytics reports, billing management, user settings, and administrative panels. Focus on responsive design, user experience, accessibility, and efficient workflows for different user roles.',
  6,
  true,
  NOW(),
  NOW()
);

-- Project Management Tool Template  
INSERT INTO public.templates (
  name, description, category, tech_stacks, features, rating, downloads,
  prd_prompt, user_stories_prompt, sitemap_prompt, tech_stack_prompt, screens_prompt,
  document_count, is_active, created_at, updated_at
) VALUES (
  'Project Management Tool',
  'Advanced project management platform with agile methodologies, resource planning, and team collaboration features for efficient project delivery.',
  'Productivity',
  ARRAY['React + Node.js', 'Vue.js + Laravel', 'Angular + Spring Boot', 'Next.js + Prisma', 'Flutter + Firebase'],
  ARRAY[
    'Agile & Scrum board management',
    'Gantt charts & timeline visualization',
    'Resource allocation & capacity planning',
    'Time tracking & timesheet management',
    'Budget tracking & cost management',
    'Team collaboration & communication',
    'File sharing & document management',
    'Custom project templates',
    'Automated progress reporting',
    'Risk management & issue tracking',
    'Client portal & stakeholder access',
    'Integration with development tools',
    'Mobile project management app',
    'Advanced project analytics',
    'Milestone tracking & notifications'
  ],
  4.7,
  1923,
  'Develop a comprehensive PRD for a Project Management Tool that empowers teams to deliver projects efficiently using modern methodologies. The tool should support both agile and traditional project management approaches with features for planning, execution, monitoring, and delivery. Focus on intuitive user experience, powerful visualization tools, comprehensive resource management, and seamless team collaboration. The platform should integrate with popular development and business tools while providing detailed analytics and reporting capabilities.',
  'Create detailed user stories for a Project Management Tool covering project managers, team members, stakeholders, and administrators. Include stories for project creation, task management, resource allocation, progress tracking, collaboration, reporting, and system administration. Focus on agile workflows, traditional project management, and hybrid approaches.',
  'Design a comprehensive sitemap for a Project Management Tool including project dashboard, task boards, Gantt charts, resource management, team collaboration, reporting sections, and administrative areas. Structure navigation for different user roles and project methodologies (Agile, Waterfall, Hybrid).',
  'Recommend optimal tech stack for a Project Management Tool emphasizing real-time collaboration, scalability, and integration capabilities. Include frontend frameworks, backend architecture, database design, real-time communication, file storage, notification systems, and third-party integrations.',
  'Design intuitive screen layouts for a Project Management Tool including project dashboard, Kanban boards, Gantt charts, resource allocation views, team collaboration interfaces, reporting dashboards, and mobile app screens. Focus on productivity, visual clarity, and efficient project workflows.',
  6,
  true,
  NOW(),
  NOW()
);

-- CRM System Template
INSERT INTO public.templates (
  name, description, category, tech_stacks, features, rating, downloads,
  prd_prompt, user_stories_prompt, sitemap_prompt, tech_stack_prompt, screens_prompt,
  document_count, is_active, created_at, updated_at
) VALUES (
  'CRM System',
  'Customer relationship management system with sales pipeline management, marketing automation, and customer service tools for business growth.',
  'Business',
  ARRAY['React + Node.js', 'Vue.js + Django', 'Angular + .NET Core', 'Next.js + Supabase', 'Salesforce Platform'],
  ARRAY[
    'Lead management & qualification',
    'Sales pipeline & opportunity tracking',
    'Contact & account management',
    'Email marketing automation',
    'Customer service ticketing system',
    'Sales forecasting & analytics',
    'Quote & proposal generation',
    'Territory & commission management',
    'Customer segmentation & targeting',
    'Integration with email & calendar',
    'Mobile CRM application',
    'Social media integration',
    'Custom fields & workflows',
    'Advanced reporting & dashboards',
    'API for third-party integrations'
  ],
  4.6,
  1654,
  'Create a detailed PRD for a CRM System that serves as the central hub for customer relationship management across sales, marketing, and service teams. The system should provide a 360-degree view of customer interactions, automate routine tasks, and provide actionable insights for business growth. Key features should include comprehensive contact management, sales pipeline visualization, marketing automation, customer service tools, and advanced analytics. The platform should be highly customizable and integrate seamlessly with existing business tools.',
  'Generate comprehensive user stories for a CRM System covering sales representatives, marketing managers, customer service agents, sales managers, and system administrators. Include stories for lead management, opportunity tracking, customer communication, marketing campaigns, service tickets, and analytics reporting.',
  'Create a detailed sitemap for a CRM System including sales dashboard, lead management, opportunity pipeline, contact database, marketing automation, customer service, analytics reports, and administrative settings. Structure for different user roles and business processes.',
  'Recommend optimal tech stack for a CRM System focusing on data management, integration capabilities, and scalability. Include customer data platform, marketing automation tools, communication systems, analytics engines, and third-party integrations with email, calendar, and business tools.',
  'Design comprehensive screen layouts for a CRM System including sales dashboard, lead management interface, opportunity pipeline, contact profiles, marketing campaign builder, customer service ticketing, analytics reports, and mobile CRM app. Focus on data visualization and workflow efficiency.',
  6,
  true,
  NOW(),
  NOW()
);

-- Learning Management System Template
INSERT INTO public.templates (
  name, description, category, tech_stacks, features, rating, downloads,
  prd_prompt, user_stories_prompt, sitemap_prompt, tech_stack_prompt, screens_prompt,
  document_count, is_active, created_at, updated_at
) VALUES (
  'Learning Management System',
  'Comprehensive educational platform with course creation, student management, assessment tools, and progress tracking for online learning.',
  'Education',
  ARRAY['React + Node.js', 'Vue.js + Laravel', 'Angular + Spring Boot', 'Next.js + Supabase', 'Moodle Platform'],
  ARRAY[
    'Course creation & content management',
    'Student enrollment & management',
    'Interactive video & multimedia support',
    'Assessment & quiz builder',
    'Gradebook & progress tracking',
    'Discussion forums & collaboration',
    'Live virtual classroom integration',
    'Certificate & badge system',
    'Mobile learning application',
    'Plagiarism detection tools',
    'Parent/guardian portal access',
    'Advanced analytics & reporting',
    'Multi-language support',
    'Accessibility compliance (WCAG)',
    'Integration with external tools'
  ],
  4.5,
  1387,
  'Develop a comprehensive PRD for a Learning Management System that facilitates effective online education delivery. The platform should support diverse learning styles through multimedia content, interactive assessments, and collaborative tools. Key focus areas include intuitive course creation, robust student management, comprehensive assessment tools, and detailed progress analytics. The system should be accessible, mobile-friendly, and support various educational models from K-12 to corporate training.',
  'Create detailed user stories for a Learning Management System covering instructors, students, administrators, and parents/guardians. Include stories for course creation, content delivery, assessment management, progress tracking, communication, and system administration. Cover various educational contexts from K-12 to corporate training.',
  'Design a comprehensive sitemap for a Learning Management System including course catalog, learning dashboard, content library, assessment center, gradebook, discussion forums, virtual classroom, and administrative areas. Structure for different user roles and educational workflows.',
  'Recommend optimal tech stack for a Learning Management System emphasizing content delivery, scalability, and accessibility. Include learning content management, video streaming, assessment engines, collaboration tools, mobile learning, analytics platforms, and integration with educational tools.',
  'Design intuitive screen layouts for a Learning Management System including course dashboard, content viewer, assessment interface, gradebook, discussion forums, virtual classroom, mobile learning app, and administrative panels. Focus on learning experience, accessibility, and educational effectiveness.',
  6,
  true,
  NOW(),
  NOW()
);

-- Telemedicine Platform Template
INSERT INTO public.templates (
  name, description, category, tech_stacks, features, rating, downloads,
  prd_prompt, user_stories_prompt, sitemap_prompt, tech_stack_prompt, screens_prompt,
  document_count, is_active, created_at, updated_at
) VALUES (
  'Telemedicine Platform',
  'HIPAA-compliant telemedicine platform with video consultations, patient management, prescription handling, and healthcare provider tools.',
  'Healthcare',
  ARRAY['React + Node.js', 'Vue.js + Django', 'Angular + .NET Core', 'Next.js + Supabase', 'Epic Integration'],
  ARRAY[
    'HIPAA-compliant video consultations',
    'Patient portal & health records',
    'Appointment scheduling & management',
    'Electronic prescription system',
    'Medical billing & insurance processing',
    'Provider dashboard & tools',
    'Secure messaging & communication',
    'Medical device integration',
    'Telehealth analytics & reporting',
    'Multi-provider practice management',
    'Patient consent & documentation',
    'Emergency consultation protocols',
    'Mobile health monitoring',
    'Integration with EHR systems',
    'Compliance & audit trail management'
  ],
  4.9,
  892,
  'Create a detailed PRD for a Telemedicine Platform that enables secure, efficient remote healthcare delivery. The platform must prioritize patient privacy, regulatory compliance (HIPAA), and clinical workflow efficiency. Key components include secure video consultations, comprehensive patient management, electronic prescriptions, and seamless integration with existing healthcare systems. The solution should support various healthcare specialties, provide robust security measures, and ensure excellent user experience for both patients and healthcare providers.',
  'Generate comprehensive user stories for a Telemedicine Platform covering patients, healthcare providers, nurses, administrators, and IT staff. Include stories for appointment booking, video consultations, medical records access, prescription management, billing, and compliance monitoring. Focus on HIPAA compliance and clinical workflows.',
  'Create a detailed sitemap for a Telemedicine Platform including patient portal, provider dashboard, appointment scheduling, video consultation rooms, medical records, prescription management, billing system, and administrative areas. Structure for healthcare compliance and different user roles.',
  'Recommend optimal tech stack for a Telemedicine Platform emphasizing security, compliance, and reliability. Include HIPAA-compliant infrastructure, video conferencing, electronic health records integration, prescription systems, billing platforms, and healthcare-specific security measures.',
  'Design secure and intuitive screen layouts for a Telemedicine Platform including patient portal, provider dashboard, video consultation interface, medical records viewer, prescription management, appointment scheduling, and mobile health app. Focus on healthcare usability, accessibility, and HIPAA compliance.',
  6,
  true,
  NOW(),
  NOW()
);

-- Task Management App Template
INSERT INTO public.templates (
  name, description, category, tech_stacks, features, rating, downloads,
  prd_prompt, user_stories_prompt, sitemap_prompt, tech_stack_prompt, screens_prompt,
  document_count, is_active, created_at, updated_at
) VALUES (
  'Task Management App',
  'Personal and team task management application with productivity features, collaboration tools, and advanced organization capabilities.',
  'Productivity',
  ARRAY['React + Node.js', 'Vue.js + Express', 'Flutter + Firebase', 'Next.js + Supabase', 'React Native + MongoDB'],
  ARRAY[
    'Personal & team task organization',
    'Project & workspace management',
    'Due date & reminder system',
    'Priority & label management',
    'Collaborative task assignment',
    'Time tracking & productivity metrics',
    'Kanban & list view options',
    'File attachment & comments',
    'Calendar integration & sync',
    'Mobile & offline synchronization',
    'Custom templates & automation',
    'Progress tracking & reporting',
    'Team performance analytics',
    'Integration with popular tools',
    'Advanced search & filtering'
  ],
  4.4,
  3156,
  'Develop a comprehensive PRD for a Task Management App that enhances personal and team productivity through intelligent task organization and collaboration features. The app should provide flexible task management approaches (lists, boards, calendar views), seamless team collaboration, and powerful productivity insights. Key considerations include intuitive user interface, cross-platform synchronization, smart automation features, and integration with popular productivity tools. The solution should scale from individual users to large teams while maintaining simplicity and performance.',
  'Create detailed user stories for a Task Management App covering individual users, team members, project managers, and administrators. Include stories for task creation, organization, collaboration, progress tracking, notifications, and productivity analytics. Focus on both personal and team productivity workflows.',
  'Design a comprehensive sitemap for a Task Management App including task dashboard, project workspaces, team collaboration areas, calendar views, analytics reports, and settings. Structure for individual and team productivity workflows with intuitive navigation.',
  'Recommend optimal tech stack for a Task Management App emphasizing real-time synchronization, cross-platform compatibility, and performance. Include frontend frameworks, backend architecture, real-time updates, offline capabilities, mobile development, and productivity tool integrations.',
  'Design intuitive screen layouts for a Task Management App including task dashboard, Kanban boards, list views, calendar interface, team collaboration screens, analytics dashboard, and mobile app interface. Focus on productivity, visual organization, and seamless user experience.',
  6,
  true,
  NOW(),
  NOW()
);

-- ============================================================================
-- ENHANCED TEMPLATE FEATURES UPDATE
-- ============================================================================

-- Update existing Social Media Platform template with enhanced features
UPDATE public.templates SET
  features = ARRAY[
    'User authentication & profiles',
    'Real-time messaging system',
    'Content sharing & feeds',
    'Social interactions (likes, comments, shares)',
    'Mobile responsive design',
    'Advanced privacy controls',
    'Content moderation tools',
    'Push notifications',
    'Story/status updates',
    'Friend/follower system',
    'Live streaming capabilities',
    'Group & community management',
    'Content discovery algorithms',
    'Multi-media support (photos, videos)',
    'Social commerce integration'
  ],
  prd_prompt = 'Create a comprehensive PRD for a Social Media Platform that fosters authentic connections and meaningful interactions. The platform should prioritize user privacy, content quality, and community building while providing engaging features for content creation and discovery. Key focus areas include robust user authentication, real-time communication, advanced content moderation, and scalable architecture. The platform should support various content types, provide powerful discovery mechanisms, and ensure a safe, inclusive environment for all users.',
  user_stories_prompt = 'Generate detailed user stories for a Social Media Platform covering content creators, casual users, community moderators, and administrators. Include stories for profile creation, content sharing, social interactions, privacy management, community building, and platform moderation.',
  sitemap_prompt = 'Create a comprehensive sitemap for a Social Media Platform including user profiles, news feed, content creation, messaging, groups/communities, discovery features, privacy settings, and administrative areas. Structure for social engagement and content discovery.',
  tech_stack_prompt = 'Recommend optimal tech stack for a Social Media Platform emphasizing real-time features, scalability, and content delivery. Include social networking architecture, content management, real-time messaging, media processing, recommendation engines, and moderation tools.',
  screens_prompt = 'Design engaging screen layouts for a Social Media Platform including news feed, profile pages, content creation interface, messaging, group discussions, discovery feeds, and mobile social app. Focus on user engagement, content visibility, and social interactions.',
  document_count = 6,
  is_active = true,
  updated_at = NOW()
WHERE name = 'Social Media Platform';

-- Update existing E-commerce Marketplace template with enhanced features  
UPDATE public.templates SET
  features = ARRAY[
    'Vendor management system',
    'Payment processing integration',
    'Inventory management',
    'Order tracking & fulfillment',
    'Review & rating system',
    'Multi-currency support',
    'Shipping calculator',
    'Product catalog management',
    'Analytics dashboard',
    'Customer support chat',
    'Mobile commerce application',
    'SEO optimization tools',
    'Promotional & discount system',
    'Fraud detection & security',
    'Multi-language localization'
  ],
  prd_prompt = 'Develop a detailed PRD for an E-commerce Marketplace that connects buyers and sellers in a secure, efficient online environment. The platform should provide comprehensive tools for vendors to manage their businesses while offering customers an exceptional shopping experience. Key components include robust product catalog management, secure payment processing, efficient order fulfillment, and powerful analytics. The marketplace should support multiple vendors, currencies, and languages while maintaining high security standards and performance.',
  user_stories_prompt = 'Create comprehensive user stories for an E-commerce Marketplace covering buyers, sellers, marketplace administrators, and customer service representatives. Include stories for product browsing, purchasing, vendor management, order fulfillment, customer support, and marketplace administration.',
  sitemap_prompt = 'Design a detailed sitemap for an E-commerce Marketplace including product catalog, vendor stores, shopping cart, checkout process, order management, seller dashboard, customer accounts, and administrative areas. Structure for both B2C and B2B commerce flows.',
  tech_stack_prompt = 'Recommend optimal tech stack for an E-commerce Marketplace focusing on transaction security, scalability, and performance. Include e-commerce platform, payment processing, inventory management, search engines, recommendation systems, and marketplace-specific features.',
  screens_prompt = 'Design comprehensive screen layouts for an E-commerce Marketplace including product listings, vendor stores, shopping cart, checkout flow, order tracking, seller dashboard, customer accounts, and mobile commerce app. Focus on conversion optimization and user experience.',
  document_count = 6,
  is_active = true,
  updated_at = NOW()
WHERE name = 'E-commerce Marketplace';

-- ============================================================================
-- TEMPLATE STATISTICS UPDATE
-- ============================================================================

-- Update template statistics to reflect realistic usage patterns
UPDATE public.templates SET
  downloads = CASE 
    WHEN category = 'Business' THEN downloads + FLOOR(RANDOM() * 500 + 200)
    WHEN category = 'Productivity' THEN downloads + FLOOR(RANDOM() * 400 + 150)
    WHEN category = 'Social' THEN downloads + FLOOR(RANDOM() * 600 + 300)
    WHEN category = 'E-commerce' THEN downloads + FLOOR(RANDOM() * 450 + 250)
    WHEN category = 'Education' THEN downloads + FLOOR(RANDOM() * 300 + 100)
    WHEN category = 'Healthcare' THEN downloads + FLOOR(RANDOM() * 200 + 50)
    ELSE downloads + FLOOR(RANDOM() * 100 + 50)
  END,
  rating = CASE
    WHEN rating < 4.0 THEN 4.0 + (RANDOM() * 0.9)
    ELSE rating + (RANDOM() * 0.2 - 0.1)
  END,
  updated_at = NOW()
WHERE name IN ('Social Media Platform', 'E-commerce Marketplace');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify all templates have required fields
SELECT 
  name,
  category,
  array_length(tech_stacks, 1) as tech_stack_count,
  array_length(features, 1) as feature_count,
  rating,
  downloads,
  document_count,
  CASE 
    WHEN prd_prompt IS NOT NULL AND length(prd_prompt) > 100 THEN 'Complete'
    ELSE 'Incomplete'
  END as prd_prompt_status
FROM public.templates
ORDER BY category, name;

-- Check template distribution by category
SELECT 
  category,
  COUNT(*) as template_count,
  AVG(rating) as avg_rating,
  SUM(downloads) as total_downloads
FROM public.templates
GROUP BY category
ORDER BY template_count DESC;

-- Verify feature completeness
SELECT 
  name,
  array_length(features, 1) as feature_count,
  CASE 
    WHEN array_length(features, 1) >= 10 THEN 'Rich'
    WHEN array_length(features, 1) >= 5 THEN 'Adequate'
    ELSE 'Minimal'
  END as feature_richness
FROM public.templates
ORDER BY array_length(features, 1) DESC;

-- ============================================================================
-- TEMPLATE SEARCH OPTIMIZATION
-- ============================================================================

-- Create indexes for better template search performance
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates (category);
CREATE INDEX IF NOT EXISTS idx_templates_rating ON public.templates (rating DESC);
CREATE INDEX IF NOT EXISTS idx_templates_downloads ON public.templates (downloads DESC);
CREATE INDEX IF NOT EXISTS idx_templates_features_gin ON public.templates USING GIN (features);
CREATE INDEX IF NOT EXISTS idx_templates_tech_stacks_gin ON public.templates USING GIN (tech_stacks);

-- Create full-text search index for template names and descriptions
CREATE INDEX IF NOT EXISTS idx_templates_search 
ON public.templates USING GIN (to_tsvector('english', name || ' ' || description));

-- ============================================================================
-- TEMPLATE USAGE ANALYTICS SETUP
-- ============================================================================

-- Function to get popular templates by category
CREATE OR REPLACE FUNCTION get_popular_templates_by_category(category_filter TEXT DEFAULT NULL)
RETURNS TABLE (
  template_name TEXT,
  category TEXT,
  rating DECIMAL,
  downloads INTEGER,
  feature_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.name::TEXT,
    t.category::TEXT,
    t.rating,
    t.downloads,
    array_length(t.features, 1) as feature_count
  FROM public.templates t
  WHERE (category_filter IS NULL OR t.category = category_filter)
  ORDER BY t.downloads DESC, t.rating DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Function to search templates by keywords
CREATE OR REPLACE FUNCTION search_templates(search_query TEXT)
RETURNS TABLE (
  template_id UUID,
  template_name TEXT,
  category TEXT,
  description TEXT,
  rating DECIMAL,
  downloads INTEGER,
  relevance_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name::TEXT,
    t.category::TEXT,
    t.description::TEXT,
    t.rating,
    t.downloads,
    ts_rank(to_tsvector('english', t.name || ' ' || t.description), plainto_tsquery('english', search_query)) as relevance_score
  FROM public.templates t
  WHERE to_tsvector('english', t.name || ' ' || t.description) @@ plainto_tsquery('english', search_query)
  ORDER BY relevance_score DESC, t.rating DESC, t.downloads DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions for new functions
GRANT EXECUTE ON FUNCTION get_popular_templates_by_category(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_templates(TEXT) TO authenticated;

-- ============================================================================
-- FINAL VERIFICATION
-- ============================================================================

-- Display final template summary
SELECT 
  'Template Enhancement Complete' as status,
  COUNT(*) as total_templates,
  COUNT(DISTINCT category) as categories,
  AVG(array_length(features, 1)) as avg_features_per_template,
  AVG(rating) as avg_rating,
  SUM(downloads) as total_downloads
FROM public.templates;

DO $$
BEGIN
  RAISE NOTICE 'Enhanced template data migration completed successfully!';
  RAISE NOTICE 'Total templates: %', (SELECT COUNT(*) FROM public.templates);
  RAISE NOTICE 'Categories: %', (SELECT COUNT(DISTINCT category) FROM public.templates);
  RAISE NOTICE 'Average features per template: %', (SELECT AVG(array_length(features, 1)) FROM public.templates);
END;
$$;