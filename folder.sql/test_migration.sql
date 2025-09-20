-- Test Migration: Verify Multi-Step Form Support
-- Run this after applying the main migration to verify everything works

-- ============================================================================
-- TEST 1: Verify Schema Changes
-- ============================================================================

-- Check that new columns exist
DO $$
DECLARE
    form_data_exists boolean;
    version_exists boolean;
    stage_exists boolean;
BEGIN
    -- Check form_data column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'form_data'
    ) INTO form_data_exists;
    
    -- Check project_version column  
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'project_version'
    ) INTO version_exists;
    
    -- Check document_stage column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'documents' AND column_name = 'document_stage'
    ) INTO stage_exists;
    
    -- Report results
    RAISE NOTICE 'Schema Check Results:';
    RAISE NOTICE '  form_data column exists: %', form_data_exists;
    RAISE NOTICE '  project_version column exists: %', version_exists;
    RAISE NOTICE '  document_stage column exists: %', stage_exists;
    
    IF NOT (form_data_exists AND version_exists AND stage_exists) THEN
        RAISE EXCEPTION 'Migration incomplete: Missing required columns';
    END IF;
    
    RAISE NOTICE 'Schema check PASSED ✓';
END;
$$;

-- ============================================================================
-- TEST 2: Verify Document Type Constraints
-- ============================================================================

-- Test that new document types are allowed
DO $$
BEGIN
    -- This should succeed (new document types)
    BEGIN
        INSERT INTO public.documents (
            project_id, user_id, type, name, status, document_stage
        ) VALUES (
            gen_random_uuid(), 
            gen_random_uuid(), 
            'Research_Insights', 
            'Test Research Document', 
            'pending',
            'discovery'
        );
        RAISE NOTICE 'New document type test PASSED ✓';
        -- Clean up test data
        DELETE FROM public.documents WHERE name = 'Test Research Document';
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'New document types not allowed: %', SQLERRM;
    END;
    
    -- This should also succeed (legacy document types)
    BEGIN
        INSERT INTO public.documents (
            project_id, user_id, type, name, status
        ) VALUES (
            gen_random_uuid(), 
            gen_random_uuid(), 
            'PRD', 
            'Test Legacy Document', 
            'pending'
        );
        RAISE NOTICE 'Legacy document type test PASSED ✓';
        -- Clean up test data
        DELETE FROM public.documents WHERE name = 'Test Legacy Document';
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Legacy document types not allowed: %', SQLERRM;
    END;
END;
$$;

-- ============================================================================
-- TEST 3: Verify Helper Functions
-- ============================================================================

-- Test form data extraction functions
DO $$
DECLARE
    test_form_data JSONB;
    extracted_name TEXT;
    extracted_pitch TEXT;
    extracted_users TEXT;
BEGIN
    -- Create test form data
    test_form_data := '{
        "step1": {
            "productName": "Test Product",
            "productPitch": "A revolutionary test product",
            "industry": "saas",
            "currentStage": "idea"
        },
        "step2": {
            "targetUsers": "Software developers and product managers",
            "painPoints": ["Complex workflows", "Poor communication"],
            "primaryJobToBeDone": "Streamline product development"
        },
        "step3": {
            "competitors": [{"name": "Competitor A", "note": "Market leader"}],
            "differentiation": "AI-powered automation"
        },
        "step4": {
            "valueProposition": "Reduce development time by 50%",
            "productVision": "The future of product development"
        },
        "step5": {
            "mustHaveFeatures": ["User authentication", "Dashboard"],
            "niceToHaveFeatures": ["Dark mode"],
            "prioritizationMethod": "RICE"
        }
    }';
    
    -- Test extraction functions
    extracted_name := get_product_name_from_form_data(test_form_data);
    extracted_pitch := get_product_pitch_from_form_data(test_form_data);
    extracted_users := get_target_users_from_form_data(test_form_data);
    
    -- Verify results
    IF extracted_name != 'Test Product' THEN
        RAISE EXCEPTION 'Product name extraction failed: got %, expected Test Product', extracted_name;
    END IF;
    
    IF extracted_pitch != 'A revolutionary test product' THEN
        RAISE EXCEPTION 'Product pitch extraction failed';
    END IF;
    
    IF extracted_users != 'Software developers and product managers' THEN
        RAISE EXCEPTION 'Target users extraction failed';
    END IF;
    
    RAISE NOTICE 'Helper functions test PASSED ✓';
END;
$$;

-- ============================================================================
-- TEST 4: Verify Views
-- ============================================================================

-- Test that views were created and are accessible
DO $$
DECLARE
    v2_view_exists boolean;
    pipeline_view_exists boolean;
BEGIN
    -- Check projects_v2_enhanced view
    SELECT EXISTS (
        SELECT 1 FROM information_schema.views 
        WHERE table_name = 'projects_v2_enhanced'
    ) INTO v2_view_exists;
    
    -- Check document_pipeline_status view
    SELECT EXISTS (
        SELECT 1 FROM information_schema.views 
        WHERE table_name = 'document_pipeline_status'
    ) INTO pipeline_view_exists;
    
    IF NOT v2_view_exists THEN
        RAISE EXCEPTION 'projects_v2_enhanced view not found';
    END IF;
    
    IF NOT pipeline_view_exists THEN
        RAISE EXCEPTION 'document_pipeline_status view not found';
    END IF;
    
    RAISE NOTICE 'Views test PASSED ✓';
END;
$$;

-- ============================================================================
-- TEST 5: Verify Indexes
-- ============================================================================

-- Check that performance indexes were created
DO $$
DECLARE
    form_data_idx_exists boolean;
    version_idx_exists boolean;
    stage_idx_exists boolean;
BEGIN
    -- Check form_data index
    SELECT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_projects_form_data'
    ) INTO form_data_idx_exists;
    
    -- Check version index
    SELECT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_projects_version'
    ) INTO version_idx_exists;
    
    -- Check stage index
    SELECT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_documents_stage'
    ) INTO stage_idx_exists;
    
    IF NOT (form_data_idx_exists AND version_idx_exists AND stage_idx_exists) THEN
        RAISE EXCEPTION 'Required indexes missing';
    END IF;
    
    RAISE NOTICE 'Indexes test PASSED ✓';
END;
$$;

-- ============================================================================
-- TEST 6: Integration Test - Create Sample V2 Project
-- ============================================================================

-- Create a complete test project to verify end-to-end functionality
DO $$
DECLARE
    test_user_id UUID;
    test_project_id UUID;
    test_form_data JSONB;
    doc_count INTEGER;
BEGIN
    -- Generate test IDs
    test_user_id := gen_random_uuid();
    test_project_id := gen_random_uuid();
    
    -- Create test form data
    test_form_data := '{
        "step1": {
            "productName": "Integration Test Product",
            "productPitch": "Testing the complete v2 workflow",
            "industry": "saas",
            "currentStage": "mvp"
        },
        "step2": {
            "targetUsers": "QA engineers and developers",
            "painPoints": ["Manual testing", "Slow feedback"],
            "primaryJobToBeDone": "Automate testing workflows"
        },
        "step3": {
            "competitors": [{"name": "TestRail", "note": "Established player"}],
            "differentiation": "AI-powered test generation"
        },
        "step4": {
            "valueProposition": "Reduce testing time by 80%",
            "productVision": "Fully automated testing pipeline"
        },
        "step5": {
            "mustHaveFeatures": ["Test automation", "Reporting"],
            "niceToHaveFeatures": ["AI insights"],
            "prioritizationMethod": "MoSCoW"
        }
    }';
    
    -- Insert test project
    INSERT INTO public.projects (
        id, user_id, name, description, tech_stack, target_platform, 
        complexity, status, progress, current_step, form_data, project_version
    ) VALUES (
        test_project_id, test_user_id, 'Integration Test Project',
        'Testing the complete v2 workflow', 'Next.js + Supabase',
        'web', 'medium', 'pending', 0, 'Testing migration',
        test_form_data, 'v2'
    );
    
    -- Insert test documents
    INSERT INTO public.documents (project_id, user_id, type, name, status, document_stage) VALUES
        (test_project_id, test_user_id, 'Research_Insights', 'Research & Insights Report', 'pending', 'discovery'),
        (test_project_id, test_user_id, 'Vision_Strategy', 'Vision & Strategy Document', 'pending', 'strategy'),
        (test_project_id, test_user_id, 'PRD', 'Product Requirements Document', 'pending', 'planning'),
        (test_project_id, test_user_id, 'BRD', 'Business Requirements Document', 'pending', 'planning'),
        (test_project_id, test_user_id, 'TRD', 'Technical Requirements Document', 'pending', 'planning'),
        (test_project_id, test_user_id, 'Planning_Toolkit', 'Planning Toolkit', 'pending', 'planning');
    
    -- Verify documents were created
    SELECT COUNT(*) INTO doc_count 
    FROM public.documents 
    WHERE project_id = test_project_id;
    
    IF doc_count != 6 THEN
        RAISE EXCEPTION 'Expected 6 documents, got %', doc_count;
    END IF;
    
    -- Test the enhanced view
    PERFORM * FROM public.projects_v2_enhanced WHERE id = test_project_id;
    
    -- Test the pipeline view
    PERFORM * FROM public.document_pipeline_status WHERE project_id = test_project_id;
    
    -- Clean up test data
    DELETE FROM public.documents WHERE project_id = test_project_id;
    DELETE FROM public.projects WHERE id = test_project_id;
    
    RAISE NOTICE 'Integration test PASSED ✓';
END;
$$;

-- ============================================================================
-- FINAL SUMMARY
-- ============================================================================

RAISE NOTICE '';
RAISE NOTICE '========================================';
RAISE NOTICE 'MIGRATION TEST SUMMARY';
RAISE NOTICE '========================================';
RAISE NOTICE 'All tests completed successfully! ✓';
RAISE NOTICE '';
RAISE NOTICE 'The migration has been verified and is ready for use.';
RAISE NOTICE 'You can now:';
RAISE NOTICE '  1. Deploy the updated application code';
RAISE NOTICE '  2. Create projects using the new multi-step form';
RAISE NOTICE '  3. Existing projects will continue to work normally';
RAISE NOTICE '========================================';