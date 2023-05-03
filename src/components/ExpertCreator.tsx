/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Expert } from "@prisma/client";
import React, { type FormEvent, useState } from "react";
import { TypeOf, z } from "zod";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCreateExpert } from "~/hooks/use-experts";
import { extractZodErrors } from "~/lib/utils";

const ExpertCreator = () => {
  const { mutateAsync } = useCreateExpert();
  const [errors, setErrors] = useState<ReturnType<typeof extractZodErrors>>([]);

  const extractVariables = (prompt: string): string[] => {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const unparsedData = Object.fromEntries(formData.entries());

    const expertSaveSchema = z.object({
      description: z.string().optional(),
      name: z.string().min(1),
      prompt: z.string().min(1),
    });
    try {
      const { description, name, prompt } =
        expertSaveSchema.parse(unparsedData);

      const variables = extractVariables(prompt);
      await mutateAsync({ description, name, prompt, variables });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = extractZodErrors(error);
        setErrors(errors);
      }
    }
  };

  return (
    <>
      <form
        className="mt-10 flex max-w-lg flex-col gap-6 text-white"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col space-y-4">
          <label className="text-lg text-white" htmlFor="name">
            Name
          </label>
          <Input
            placeholder="Enter your name"
            name="name"
            id="name"
            className="text-base"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-lg text-white" htmlFor="description">
            Description
          </label>
          <Input
            placeholder="Enter your description"
            name="description"
            id="description"
            className="text-base"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-lg text-white" htmlFor="prompt">
            <span>Enter the your prompt</span>
            <p className="my-2 text-sm text-slate-300">
              If you want to skip entering the variables try formatting your
              prompt like this: <span>You are a {"{language}"} expert.</span>
            </p>
          </label>
          <Input
            placeholder="Enter your prompt"
            name="prompt"
            id="prompt"
            className="text-base"
          />
        </div>
        <Button variant="secondary" size="lg" textsize="xl">
          Save Expert
        </Button>
      </form>
      {errors && errors.length > 0 && (
        <div className="mt-10">
          {errors.map((err) => (
            <p key={err.path} className="text-red-500">
              <span className="uppercase text-red-300">{err.path}</span>{" "}
              {err.message}
            </p>
          ))}
        </div>
      )}
    </>
  );
};

export default ExpertCreator;
