/* eslint-disable @typescript-eslint/no-misused-promises */
import { Expert } from "@prisma/client";
import React, { type FormEvent } from "react";
import { z } from "zod";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ExpertCreator = () => {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const unparsedData = Object.fromEntries(formData.entries());

    const expertSaveSchema = z.object({
      description: z.string(),
      name: z.string(),
      prompt: z.string(),
    });

    const { description, name, prompt } = expertSaveSchema.parse(unparsedData);

    const promptFinderRegex = /{([^}]+)}/g;
    const unformattedPromptVariables = prompt.match(promptFinderRegex);

    let variables: string[] = [];

    if (unformattedPromptVariables && unformattedPromptVariables?.length > 0) {
      // remove the {} from the string
      variables = unformattedPromptVariables.map((variable) =>
        variable.replace("{", "").replace("}", "")
      );
    }

    await fetch("/api/expert-creator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { description, name, prompt, variables } }),
    });
  };

  return (
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
  );
};

export default ExpertCreator;
