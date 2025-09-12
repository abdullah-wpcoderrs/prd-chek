import RecipeForm from "@/components/RecipeForm";
import { getAuthenticatedUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

const NewRecipePage = async () => {
  try {
    await getAuthenticatedUser();

    return (
      <main>
        <section className="flex flex-col max-w-2xl mx-auto gap-4">
          <h1 className="text-2xl font-bold">Create a new recipe</h1>
          <RecipeForm />
        </section>
      </main>
    );
  } catch (error) {
    // User not authenticated, redirect to sign-in
    redirect("/sign-in");
  }
};

export default NewRecipePage;
