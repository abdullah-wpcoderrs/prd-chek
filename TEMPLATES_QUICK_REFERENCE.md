# Templates Database - Quick Reference

## 🚀 Quick Setup (Run this SQL in Supabase)

```sql
-- Run the complete setup in one go
-- Copy and paste: complete_templates_setup.sql
```

## 📊 Reset Statistics Command

```sql
-- Quick reset of download counts and ratings
UPDATE public.templates SET 
  downloads = FLOOR(RANDOM() * 1000 + 100),
  rating = ROUND((RANDOM() * 1.5 + 3.5)::numeric, 1),
  updated_at = NOW()
WHERE is_active = true;
```

## 🔍 Quick Queries

### View All Templates
```sql
SELECT name, category, downloads, rating 
FROM public.templates 
ORDER BY downloads DESC;
```

### Get Template Stats
```sql
SELECT 
  COUNT(*) as total_templates,
  SUM(downloads) as total_downloads,
  COUNT(DISTINCT category) as categories,
  ROUND(AVG(rating), 1) as avg_rating
FROM public.templates 
WHERE is_active = true;
```

### View Template Prompts
```sql
SELECT name, 
  LEFT(prd_prompt, 100) || '...' as prd_preview,
  LEFT(user_stories_prompt, 100) || '...' as user_stories_preview
FROM public.templates 
WHERE name = 'Social Media Platform';
```

## 📝 Template Categories

- **Social** - Social media and networking platforms
- **E-commerce** - Online marketplaces and shopping platforms  
- **Business** - SaaS dashboards and business applications
- **Education** - Learning management and educational platforms
- **Healthcare** - Medical and patient management systems
- **Productivity** - Task management and collaboration tools

## 🎯 Prompt Types

Each template includes 5 comprehensive prompts:

1. **PRD Prompt** - Product Requirements Document generation
2. **User Stories** - User journey and acceptance criteria  
3. **Sitemap** - Application structure and navigation
4. **Tech Stack** - Technology recommendations and architecture
5. **Screens** - UI/UX specifications and wireframes

## 🔧 Management Commands

### Disable a Template
```sql
UPDATE public.templates 
SET is_active = false 
WHERE name = 'Template Name';
```

### Add Downloads to Template
```sql
SELECT increment_downloads('template-uuid-here');
```

### Reset All Stats
```sql
SELECT reset_template_stats();
```

## 📱 Frontend Integration

The updated Templates page now:
- ✅ Loads from database automatically
- ✅ Shows real-time statistics  
- ✅ Supports all template features
- ✅ Ready for production use

Template data is fetched via:
- `getTemplates()` - All active templates
- `getTemplateStats()` - Aggregate statistics
- `getTemplate(id)` - Specific template with prompts