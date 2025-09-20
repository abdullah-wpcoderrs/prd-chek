# Database Migration Guide

## Multi-Step Form Migration

This guide will help you apply the database migration to support the new multi-step product manager form.

### Prerequisites

1. Access to your Supabase dashboard
2. SQL Editor permissions in Supabase
3. Backup of your current database (recommended)

### Migration Steps

#### Step 1: Backup Your Database (Recommended)
Before running any migration, create a backup of your database:

1. Go to your Supabase dashboard
2. Navigate to Settings > Database
3. Create a backup or export your current schema

#### Step 2: Run the Migration
1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy the contents of `folder.sql/migration_multistep_form.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the migration

#### Step 3: Verify the Migration
After running the migration, verify it worked correctly:

```sql
-- Check new columns exist
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name IN ('form_data', 'project_version');

-- Check document type constraint includes new types
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'documents_type_check';

-- Check all existing projects are marked as v1
SELECT project_version, COUNT(*) 
FROM public.projects 
GROUP BY project_version;
```

### What This Migration Does

#### Database Schema Changes:
1. **Adds `form_data` column** to `projects` table (JSONB type)
2. **Adds `project_version` column** to distinguish v1 (legacy) vs v2 (multi-step) projects
3. **Adds `document_stage` column** to `documents` table for pipeline tracking
4. **Updates document type constraints** to include new document types:
   - `Research_Insights` (Discovery stage)
   - `Vision_Strategy` (Strategy stage) 
   - `BRD`, `TRD`, `Planning_Toolkit` (Planning stage)

#### Performance Improvements:
1. **GIN index** on `form_data` for fast JSON queries
2. **Indexes** on `project_version` and `document_stage`
3. **Composite indexes** for common query patterns

#### Helper Functions:
1. **Form data extraction functions** for easy querying
2. **Validation functions** to ensure data integrity
3. **Views** for enhanced querying of v2 projects

#### Data Safety:
1. **All existing projects** are marked as `v1` (legacy format)
2. **Backward compatibility** is maintained
3. **No existing data** is modified or lost

### New Document Pipeline

The migration supports a new 3-stage document pipeline:

#### Stage 1: Discovery & Research
- `Research_Insights` - Research & Insights Report

#### Stage 2: Vision & Strategy  
- `Vision_Strategy` - Vision & Strategy Document

#### Stage 3: Requirements & Planning
- `PRD` - Product Requirements Document
- `BRD` - Business Requirements Document  
- `TRD` - Technical Requirements Document
- `Planning_Toolkit` - Planning Toolkit

### Rollback (If Needed)

If you need to rollback the migration:

⚠️ **WARNING**: Rollback will delete all v2 project data!

1. Run the contents of `folder.sql/rollback_multistep_form.sql`
2. This will remove all new columns and revert to the original schema

### Testing After Migration

1. **Create a new project** using the multi-step form
2. **Verify it's marked as v2** in the database
3. **Check that 6 documents** are created with proper stages
4. **Ensure existing projects** still work normally

### Troubleshooting

#### Common Issues:

1. **Permission errors**: Ensure you have admin access to run DDL statements
2. **Constraint violations**: Check if you have any custom document types that aren't in the new constraint
3. **Index creation fails**: May indicate existing data conflicts

#### Getting Help:

If you encounter issues:
1. Check the Supabase logs for detailed error messages
2. Verify your current schema matches the expected structure
3. Consider running the verification queries to identify specific issues

### Next Steps

After successful migration:
1. Deploy the updated application code
2. Test the new multi-step form functionality
3. Monitor for any issues with existing projects
4. Update your templates to work with the new form structure

---

**Migration File**: `folder.sql/migration_multistep_form.sql`  
**Rollback File**: `folder.sql/rollback_multistep_form.sql`  
**Created**: $(date)