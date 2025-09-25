import { z } from 'zod';
// Environment validation schema with proper error handling
// All environment variables are now required for proper functionality
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
    .refine(
      (url) => !url.includes('example.supabase.co'),
      'Please set your actual Supabase URL in .env.local'
    ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(10, 'NEXT_PUBLIC_SUPABASE_ANON_KEY must be at least 10 characters')
    .refine(
      (key) => !key.includes('placeholder'),
      'Please set your actual Supabase anon key in .env.local'
    ),
  NEXT_PUBLIC_N8N_WEBHOOK_URL: z
    .string()
    .url('NEXT_PUBLIC_N8N_WEBHOOK_URL must be a valid URL')
    .refine(
      (url) => !url.includes('webhook.site') && !url.includes('placeholder'),
      'Please set your actual N8N webhook URL in .env.local'
    )
    .optional(),
  NEXT_PUBLIC_N8N_STATUS_WEBHOOK_URL: z
    .string()
    .url('NEXT_PUBLIC_N8N_STATUS_WEBHOOK_URL must be a valid URL')
    .refine(
      (url) => !url.includes('webhook.site') && !url.includes('placeholder'),
      'Please set your actual N8N status webhook URL in .env.local'
    )
    .optional(),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .optional(), // Only used server-side
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .default('http://localhost:3000'),
  NEXT_PUBLIC_DEBUG_WEBHOOKS: z
    .string()
    .transform((val) => val === 'true')
    .default('false')
    .optional(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_N8N_WEBHOOK_URL: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL,
  NEXT_PUBLIC_N8N_STATUS_WEBHOOK_URL: process.env.NEXT_PUBLIC_N8N_STATUS_WEBHOOK_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_DEBUG_WEBHOOKS: process.env.NEXT_PUBLIC_DEBUG_WEBHOOKS,
});

if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors;
  const missingEnvs = Object.entries(errors)
    .map(([key, messages]) => `${key}: ${messages?.join(', ')}`)
    .join('\n');
  
  if (typeof window !== 'undefined') {
    // Client-side: Show user-friendly error
    console.error(
      '🚨 Environment Configuration Error\n' +
      '================================\n' +
      'Missing or invalid environment variables in .env.local:\n\n' +
      missingEnvs + '\n\n' +
      'Please check your .env.local file and ensure all required variables are set with valid values.'
    );
  } else {
    // Server-side: Show detailed error
    console.error(
      '🚨 Environment Configuration Error\n' +
      '================================\n' +
      'Missing or invalid environment variables:\n\n' +
      missingEnvs + '\n\n' +
      'Please create or update your .env.local file with the required variables.'
    );
  }
  
  // Throw in development to prevent silent failures
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      'Environment configuration error. Please check your .env.local file. ' +
      'See console for details.'
    );
  }
}

// Export validated environment variables
export const env = parsed.success ? parsed.data : ({} as Record<string, unknown>);

// Helper function to check if environment is properly configured
export const isEnvConfigured = () => {
  if (!parsed.success) return false;
  
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = env as z.infer<typeof envSchema>;
  
  return NEXT_PUBLIC_SUPABASE_URL && 
    NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !NEXT_PUBLIC_SUPABASE_URL.includes('example.supabase.co') &&
    !NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder');
};

// Legacy compatibility for N8N_WEBHOOK_URL (some files may still reference this)
export const N8N_WEBHOOK_URL = env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
