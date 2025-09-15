-- Quick SQL to reset template statistics with realistic random values
-- Run this in your Supabase SQL Editor to reset stats

UPDATE public.templates SET 
  downloads = CASE 
    WHEN category = 'E-commerce' THEN FLOOR(RANDOM() * 500 + 800)  -- Higher for e-commerce
    WHEN category = 'Social' THEN FLOOR(RANDOM() * 600 + 1000)     -- Highest for social
    WHEN category = 'Business' THEN FLOOR(RANDOM() * 400 + 600)    -- Business apps
    WHEN category = 'Education' THEN FLOOR(RANDOM() * 300 + 400)   -- Education sector
    WHEN category = 'Healthcare' THEN FLOOR(RANDOM() * 200 + 300)  -- Specialized healthcare
    WHEN category = 'Productivity' THEN FLOOR(RANDOM() * 400 + 700) -- Popular productivity tools
    ELSE FLOOR(RANDOM() * 500 + 200)
  END,
  rating = CASE 
    WHEN category = 'E-commerce' THEN ROUND((RANDOM() * 0.3 + 4.7)::numeric, 1)  -- 4.7-5.0
    WHEN category = 'Social' THEN ROUND((RANDOM() * 0.4 + 4.6)::numeric, 1)       -- 4.6-5.0  
    WHEN category = 'Business' THEN ROUND((RANDOM() * 0.5 + 4.4)::numeric, 1)     -- 4.4-4.9
    WHEN category = 'Education' THEN ROUND((RANDOM() * 0.4 + 4.5)::numeric, 1)    -- 4.5-4.9
    WHEN category = 'Healthcare' THEN ROUND((RANDOM() * 0.3 + 4.6)::numeric, 1)   -- 4.6-4.9
    WHEN category = 'Productivity' THEN ROUND((RANDOM() * 0.6 + 4.2)::numeric, 1) -- 4.2-4.8
    ELSE ROUND((RANDOM() * 0.8 + 4.0)::numeric, 1)
  END,
  updated_at = NOW()
WHERE is_active = true;

-- Verify the update
SELECT 
  name,
  category,
  downloads,
  rating
FROM public.templates 
ORDER BY category, rating DESC;