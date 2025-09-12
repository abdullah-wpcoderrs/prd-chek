"use server";
import { createSupabaseServerClient, getAuthenticatedUser } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// Create a new comment
export const createComment = async (comment: string, recipeId: string) => {
  const userId = await getAuthenticatedUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from("comments").insert({
    comment,
    user_id: userId,
    recipe_id: recipeId,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/recipes/${recipeId}`);

  return data;
};

// Get all comments for a recipe
export const getRecipeComments = async (recipeId: string) => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const userIds = data.map((comment) => comment.user_id);

  // Get user details from profiles table
  const { data: profiles, error: profilesError } = await supabase
    .from("users")
    .select("id, email, display_name")
    .in("id", userIds);

  if (profilesError) throw new Error(profilesError.message);

  const commentsWithUserDetails = data.map((comment) => {
    const profile = profiles?.find((profile) => profile.id === comment.user_id);

    return {
      ...comment,
      userFirstName: profile?.display_name?.split(' ')[0] || profile?.email?.split('@')[0] || 'User',
      userImageUrl: null, // No image URL in basic profile
    };
  });

  return commentsWithUserDetails;
};
