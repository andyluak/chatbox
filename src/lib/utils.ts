import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractZodErrors = (error: z.ZodError) => {
  const errors = error.errors.map((err) => {
    const { path, message } = err;
    return { path: path.join(" "), message };
  });
  return errors;
};

export const extractVariables = (prompt: string): string[] => {
  const promptFinderRegex = /{([^}]+)}/g;
  const unformattedPromptVariables = prompt.match(promptFinderRegex);

  let variables: string[] = [];

  if (unformattedPromptVariables && unformattedPromptVariables?.length > 0) {
    variables = unformattedPromptVariables.map((variable) =>
      variable.replace("{", "").replace("}", "")
    );
  }

  return variables || [];
};

// Schemas

export const expertSaveSchema = z.object({
  description: z.string().optional(),
  name: z.string().min(1),
  prompt: z.string().min(1),
});
