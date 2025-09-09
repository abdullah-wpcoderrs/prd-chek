import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getUnlockedRecipes,
  getUserRecipes,
} from "@/lib/actions/recipe.actions";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const MyCookBookPage = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const userRecipes = await getUserRecipes();
  const unlockedRecipes = await getUnlockedRecipes();

  return (
    <main>
      <Accordion type="single" collapsible>
        <AccordionItem value="my-documents">
          <AccordionTrigger className="text-2xl font-bold">
            My PRD Documents
          </AccordionTrigger>
          <AccordionContent>
            {userRecipes.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {userRecipes.map((recipe) => (
                  <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
                    <li className="text-lg font-bold list-disc list-inside">
                      {recipe.name}
                    </li>
                  </Link>
                ))}
              </ul>
            ) : (
              <p>
                You haven&apos;t created any PRD documents yet.{" "}
                <Link href="/recipes/new" className="font-semibold underline">
                  Create one now
                </Link>
                .
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="shared-documents">
          <AccordionTrigger className="text-2xl font-bold">
            Shared Documents
          </AccordionTrigger>
          <AccordionContent>
            {unlockedRecipes.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {unlockedRecipes.map((recipe) => (
                  <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
                    <li className="text-lg font-bold list-disc list-inside">
                      {recipe.name}
                    </li>
                  </Link>
                ))}
              </ul>
            ) : (
              <p>You haven&apos;t accessed any shared documents yet.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default MyCookBookPage;
