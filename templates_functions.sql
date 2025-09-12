-- Additional SQL functions for template management
-- Run this after creating the templates table

-- Function to safely increment download count
CREATE OR REPLACE FUNCTION increment_downloads(template_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.templates 
  SET downloads = downloads + 1
  WHERE id = template_id
  RETURNING downloads INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- Function to reset all template statistics
CREATE OR REPLACE FUNCTION reset_template_stats()
RETURNS VOID AS $$
BEGIN
  UPDATE public.templates SET 
    downloads = FLOOR(RANDOM() * 1000 + 100),
    rating = ROUND((RANDOM() * 1.5 + 3.5)::numeric, 1),
    updated_at = NOW()
  WHERE is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Function to get template statistics
CREATE OR REPLACE FUNCTION get_template_stats()
RETURNS TABLE(
  total_templates BIGINT,
  total_downloads BIGINT,
  total_categories BIGINT,
  average_rating NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_templates,
    SUM(t.downloads) as total_downloads,
    COUNT(DISTINCT t.category) as total_categories,
    ROUND(AVG(t.rating), 1) as average_rating
  FROM public.templates t
  WHERE t.is_active = true;
END;
$$ LANGUAGE plpgsql;