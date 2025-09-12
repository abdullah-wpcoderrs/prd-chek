"use server";

import { Recipe } from "@/types";
import { createSupabaseServerClient, getAuthenticatedUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

// Get all recipes, with author details and unlocked status for current user
export const getRecipes = async () => {
  try {
    const userId = await getAuthenticatedUser(); // Get the current user
    const supabase = await createSupabaseServerClient();

    // Get all recipes from the database
    const { data: recipes, error } = await supabase
      .from("recipes")
      .select("id, name, ingredients, user_id");

    if (error) throw new Error(error.message);

    // Get user details from profiles table
    const userIds = recipes.map((recipe) => recipe.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from("users")
      .select("id, email, display_name")
      .in("id", userIds);

    if (profilesError) throw new Error(profilesError.message);

    // Get unlocked recipes for current user
    const { data: unlockedRecipes, error: unlockedError } = await supabase
      .from("recipes_unlocked")
      .select("recipe_id")
      .eq("user_id", userId);

    if (unlockedError) throw new Error(unlockedError.message);

    const unlockedRecipeIds = new Set(unlockedRecipes.map((r) => r.recipe_id));

    // Merge all data
    const recipesWithUserDetails = recipes.map((recipe) => {
      const profile = profiles?.find((profile) => profile.id === recipe.user_id);
      return {
        ...recipe,
        userFirstName: profile?.display_name?.split(' ')[0] || profile?.email?.split('@')[0] || 'User',
        userImageUrl: null, // No image URL in basic profile
        unlocked: unlockedRecipeIds.has(recipe.id) || recipe.user_id === userId,
      };
    });

    return recipesWithUserDetails;
  } catch (error) {
    // Return empty array if user is not authenticated (guest access)
    console.log('User not authenticated, returning empty recipes list');
    return [];
  }
};

// Get a single recipe by id, with author details and unlocked status for current user
export const getRecipe = async (id: string) => {
  const userId = await getAuthenticatedUser();
  const supabase = await createSupabaseServerClient();

  // Fetch the recipe first
  const { data: recipeData, error: recipeError } = await supabase
    .from("recipes")
    .select()
    .eq("id", id)
    .single();

  if (recipeError) throw new Error(recipeError.message);

  // If the user is the author, return the recipe directly
  if (recipeData.user_id === userId) return recipeData;

  // Otherwise check if the recipe is unlocked for this user
  const { data: unlockedRecipe, error: unlockedError } = await supabase
    .from("recipes_unlocked")
    .select()
    .eq("user_id", userId)
    .eq("recipe_id", id);

  if (unlockedError) throw new Error(unlockedError.message);

  // If it's not unlocked, return null
  if (unlockedRecipe.length === 0) return null;

  return recipeData;
};

// Create a new recipe
export const createRecipe = async (recipe: Recipe) => {
  const userId = await getAuthenticatedUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("recipes")
    .insert({
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      user_id: userId,
    })
    .select();

  if (error) throw new Error(error.message);

  return data[0];
};

// Get all recipes created by the current user
export const getUserRecipes = async () => {
  const userId = await getAuthenticatedUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  return data;
};

// Get all recipes unlocked by the current user
export const getUnlockedRecipes = async () => {
  const userId = await getAuthenticatedUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("recipes_unlocked")
    .select("recipes:recipe_id (*)")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  const recipes = data.map((entry) => entry.recipes as unknown as Recipe);

  return recipes;
};

// Unlock a recipe for the current user (simplified - no subscription limits)
export const unlockRecipe = async (recipeId: string) => {
  const userId = await getAuthenticatedUser();
  const supabase = await createSupabaseServerClient();

  // For now, allow unlimited recipe unlocks
  // In the future, you can implement subscription-based limits here

  // Check if already unlocked
  const { data: existing, error: checkError } = await supabase
    .from("recipes_unlocked")
    .select("*")
    .eq("user_id", userId)
    .eq("recipe_id", recipeId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    throw new Error(checkError.message);
  }

  if (existing) {
    return { success: true, message: "recipe already unlocked" };
  }

  // Unlock the recipe
  const { error } = await supabase
    .from("recipes_unlocked")
    .insert({ user_id: userId, recipe_id: recipeId });

  if (error) throw new Error(error.message);

  return { success: true, message: "recipe unlocked" };
};
