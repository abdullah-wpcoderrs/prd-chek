import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  N8N_WEBHOOK_URL: z.string().url().default('https://webhook.site/test-placeholder-url'),
});

export const env = envSchema.parse({
  ...process.env,
  // Provide fallback for N8N_WEBHOOK_URL if not set
  N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL || 'https://webhook.site/test-placeholder-url'
});
