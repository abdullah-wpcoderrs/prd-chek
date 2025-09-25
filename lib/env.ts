import { z } from 'zod';

// Public runtime env used on the client. Provide safe defaults to avoid hard crashes
// when developers haven't configured .env yet. Real values should be provided for
// a functional app, but placeholders will prevent ZodError during import on the client.
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url()
    .default('https://example.supabase.co'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .default('public-anon-key-placeholder'),
  N8N_WEBHOOK_URL: z
    .string()
    .url()
    .default('https://webhook.site/test-placeholder-url'),
});

const parsed = envSchema.safeParse({
  ...process.env,
  // Provide fallback for N8N_WEBHOOK_URL if not set
  N8N_WEBHOOK_URL:
    process.env.N8N_WEBHOOK_URL || 'https://webhook.site/test-placeholder-url',
});

if (!parsed.success) {
  // Do not throw on the client to avoid crashing the app; log a helpful warning instead
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.warn(
      '[env] Missing or invalid public environment variables. Using safe defaults. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    );
  } else {
    // On the server, also avoid throwing to keep build/dev server running, but log details
    // eslint-disable-next-line no-console
    console.warn('[env] Validation failed:', parsed.error.flatten().fieldErrors);
  }
}

export const env = parsed.success
  ? parsed.data
  : {
      NEXT_PUBLIC_SUPABASE_URL:
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key-placeholder',
      N8N_WEBHOOK_URL:
        process.env.N8N_WEBHOOK_URL || 'https://webhook.site/test-placeholder-url',
    };
