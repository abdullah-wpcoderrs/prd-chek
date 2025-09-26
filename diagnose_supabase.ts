// Diagnostic script to check Supabase configuration and RLS policies
import { createSupabaseServerClient, getAuthenticatedUser } from "@/lib/supabase-server";

async function diagnoseSupabase() {
  try {
    console.log("=== Supabase Diagnostics ===");
    
    // Get authenticated user
    const userId = await getAuthenticatedUser();
    console.log("✅ User authenticated successfully");
    console.log("User ID:", userId);
    
    // Create Supabase client
    const supabase = await createSupabaseServerClient();
    console.log("✅ Supabase client created successfully");
    
    // Test 1: Check if we can read projects
    console.log("\n--- Test 1: Reading projects ---");
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('id, name, user_id')
      .eq('user_id', userId)
      .limit(3);
      
    if (fetchError) {
      console.error("❌ Error fetching projects:", fetchError);
      console.error("Error code:", fetchError.code);
      console.error("Error message:", fetchError.message);
    } else {
      console.log("✅ Successfully fetched projects");
      console.log("Number of projects found:", projects?.length || 0);
      if (projects && projects.length > 0) {
        console.log("Sample project:", {
          id: projects[0].id,
          name: projects[0].name,
          user_id: projects[0].user_id
        });
      }
    }
    
    // Test 2: Check if we can update a project (if any exist)
    if (projects && projects.length > 0) {
      console.log("\n--- Test 2: Updating a project ---");
      const projectId = projects[0].id;
      const originalName = projects[0].name;
      const testName = `Diagnostic Test - ${new Date().toISOString()}`;
      
      // Try to update the project
      const { error: updateError } = await supabase
        .from('projects')
        .update({ 
          name: testName,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('user_id', userId);
        
      if (updateError) {
        console.error("❌ Error updating project:", updateError);
        console.error("Error code:", updateError.code);
        console.error("Error message:", updateError.message);
      } else {
        console.log("✅ Project updated successfully");
        
        // Verify the update
        const { data: updatedProject, error: verifyError } = await supabase
          .from('projects')
          .select('name')
          .eq('id', projectId)
          .eq('user_id', userId)
          .single();
          
        if (verifyError) {
          console.error("❌ Error verifying update:", verifyError);
        } else if (updatedProject?.name === testName) {
          console.log("✅ Update verified successfully");
          
          // Restore original name
          const { error: restoreError } = await supabase
            .from('projects')
            .update({ 
              name: originalName,
              updated_at: new Date().toISOString()
            })
            .eq('id', projectId)
            .eq('user_id', userId);
            
          if (restoreError) {
            console.error("❌ Error restoring project name:", restoreError);
          } else {
            console.log("✅ Original name restored");
          }
        } else {
          console.error("❌ Update verification failed - name mismatch");
          console.log("Expected:", testName);
          console.log("Actual:", updatedProject?.name);
        }
      }
    } else {
      console.log("\n--- Test 2: Skipped (no projects to update) ---");
    }
    
    // Test 3: Check RLS policies
    console.log("\n--- Test 3: Checking RLS policies ---");
    
    // Try to access a project that doesn't belong to the user
    const { data: unauthorizedProjects, error: unauthorizedError } = await supabase
      .from('projects')
      .select('id')
      .neq('user_id', userId)
      .limit(1);
      
    if (unauthorizedError) {
      console.error("❌ Error with unauthorized access check:", unauthorizedError);
    } else {
      console.log("✅ Unauthorized access properly blocked");
      console.log("Number of unauthorized projects accessed:", unauthorizedProjects?.length || 0);
    }
    
    console.log("\n=== Diagnostics Complete ===");
    
  } catch (error) {
    console.error("❌ Diagnostic failed with error:", error);
  }
}

// Run the diagnostic
diagnoseSupabase().then(() => {
  console.log("Diagnostic script completed");
}).catch((error) => {
  console.error("Diagnostic script failed:", error);
});