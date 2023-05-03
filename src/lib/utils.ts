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
