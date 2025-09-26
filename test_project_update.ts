// Test script to verify project update functionality
import { createSupabaseServerClient, getAuthenticatedUser } from "@/lib/supabase-server";

async function testProjectUpdate() {
  try {
    console.log("Testing project update functionality...");
    
    // Get authenticated user
    const userId = await getAuthenticatedUser();
    console.log("User ID:", userId);
    
    // Create Supabase client
    const supabase = await createSupabaseServerClient();
    
    // Try to fetch a project to verify RLS is working
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .limit(1);
      
    if (fetchError) {
      console.error("Error fetching projects:", fetchError);
      return;
    }
    
    console.log("Found projects:", projects?.length || 0);
    
    if (projects && projects.length > 0) {
      const projectId = projects[0].id;
      console.log("Testing update on project:", projectId);
      
      // Try to update the project
      const { error: updateError } = await supabase
        .from('projects')
        .update({ 
          name: "Test Update - " + new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('user_id', userId);
        
      if (updateError) {
        console.error("Error updating project:", updateError);
      } else {
        console.log("Project updated successfully!");
      }
    } else {
      console.log("No projects found for this user");
    }
  } catch (error) {
    console.error("Test failed with error:", error);
  }
}

// Run the test
testProjectUpdate().then(() => {
  console.log("Test completed");
}).catch((error) => {
  console.error("Test failed:", error);
});