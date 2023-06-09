/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { type FormEvent, useState } from "react";
import { z } from "zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCreateExpert } from "~/hooks/use-experts";
import {
    expertSaveSchema,
    extractVariables,
    extractZodErrors,
} from "~/lib/utils";

const ExpertCreator = () => {
    const { mutateAsync } = useCreateExpert();
    const [errors, setErrors] = useState<ReturnType<typeof extractZodErrors>>(
        []
    );

    const clearErrors = () => {
        setTimeout(() => {
            setErrors([]);
        }, 10000);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setErrors([]);
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const unparsedData = Object.fromEntries(formData.entries());

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
                clearErrors();
            }
        }
    };

    return (
        <>
            <form
                className="mt-10 flex max-w-xl flex-col gap-6 text-white"
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
                            If you want to skip entering the variables try
                            formatting your prompt like this:{" "}
                            <span>You are a {"{language}"} expert.</span>
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
                            <span className="uppercase text-red-300">
                                {err.path}
                            </span>{" "}
                            {err.message}
                        </p>
                    ))}
                </div>
            )}
        </>
    );
};

export default ExpertCreator;
