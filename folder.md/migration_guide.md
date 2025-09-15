# Database Migration Guide

This guide provides step-by-step instructions for migrating your database to the new Supabase Auth schema.

## ⚠️ Important: Backup First
Before proceeding, create a backup of your current database:
1. Go to your Supabase Dashboard
2. Navigate to Settings → Database
3. Create a backup or export your data

## Migration Steps

### Step 1: Apply the New Schema
Run the complete schema in your Supabase SQL Editor:

```bash
# Copy and paste the contents of schema.sql into Supabase SQL Editor
```

### Step 2: Apply RLS Policies
If you need to recreate or update RLS policies only:

```bash
# Copy and paste the contents of rls_policies.sql into Supabase SQL Editor
```

### Step 3: Verify Tables Created
Check that these tables exist:
- `public.users` (references auth.users)
- `public.projects` 
- `public.documents`
- Storage bucket: `project-documents`

### Step 4: Test Authentication
1. Sign up a new user through Supabase Auth
2. Verify the user appears in both `auth.users` and `public.users`
3. Test that RLS policies work correctly

## Files in This Migration

- **`schema.sql`** - Complete database schema for new installations
- **`rls_policies.sql`** - Just the RLS policies for updating existing databases
- **`migration_guide.md`** - This file with instructions

## Troubleshooting

### If you get foreign key constraint errors:
1. Ensure `auth.users` entries exist before creating `public.users` entries
2. The trigger `handle_new_user()` should automatically create `public.users` records

### If RLS policies fail:
1. Make sure you're running the SQL as a superuser or service role
2. Check that the tables exist before applying policies

### If storage policies fail:
1. Ensure the `project-documents` bucket exists
2. Check that storage is enabled in your Supabase project

## Environment Variables Needed

Make sure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```