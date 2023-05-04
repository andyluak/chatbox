import { type Expert } from "@prisma/client";
import React, { useEffect, useState } from "react";

import {
  TypographyH2,
  TypographyH3,
  TypographyInlineCode,
  TypographyLead,
  TypographyMuted,
} from "../ui/Typography";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ActionsToolbar from "./ActionsToolbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { useDeleteExpert, useGetExperts } from "~/hooks/use-experts";
import { extractVariables } from "~/lib/utils";

const ExpertList = () => {
  const [editedExpert, setEditedExpert] = useState<Expert["id"]>("");
  const [editedExpertPrompt, setEditedExpertPrompt] = useState("");
  const variables: string[] = extractVariables(editedExpertPrompt);

  const { experts } = useGetExperts<Expert>();
  const { mutate: deleteMutate } = useDeleteExpert();
  const accordionRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // whenever the data-state of the accordion changes, scroll to the bottom
    if (!accordionRef.current) return;

    const observer = new MutationObserver(() => {
      if (!accordionRef.current) return;
      const windowHeight = window.innerHeight;

      // verify if the ref is in view
      const rect = accordionRef.current.getBoundingClientRect();

      console.log({ top: rect.top, windowHeight });
      if (rect.top < windowHeight) return;
      window.scrollTo(0, windowHeight);
    });

    observer.observe(accordionRef.current, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  }, [accordionRef]);

  return (
    <div className="max-w-xl pt-10 text-off-white">
      <TypographyH2>Your Experts</TypographyH2>
      <TypographyLead className="text-lg">
        Here you can modify/delete the types of helpers you want to create
      </TypographyLead>
      <Accordion type="multiple" className="mt-6" ref={accordionRef}>
        {experts &&
          experts.length > 0 &&
          experts.map((expert) => {
            return (
              <AccordionItem key={expert.id} value={expert.id}>
                <AccordionTrigger>{expert.name}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-6">
                    <ActionsToolbar
                      onDelete={() => deleteMutate(expert.id)}
                      onEdit={() => {
                        setEditedExpert((prev) =>
                          prev === expert.id ? "" : expert.id
                        );
                        setEditedExpertPrompt("");
                      }}
                    />
                    {editedExpert === expert.id ? (
                      <form className="relative">
                        <Input
                          className="absolute -top-10 h-auto border-none p-0 text-base ring-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          type="text"
                          name="name"
                          id="name"
                          autoFocus
                          placeholder={expert.name}
                          defaultValue={expert.name}
                        />
                        <Input
                          className="h-auto border-none p-0 text-sm ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          type="text"
                          name="description"
                          id="description"
                          placeholder={expert.description}
                          defaultValue={expert.description}
                        />
                        <Input
                          type="text"
                          className="mb-6 h-auto border-none p-0 text-2xl font-semibold tracking-tight ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          name="prompt"
                          id="prompt"
                          placeholder={expert.prompt}
                          onChange={(e) =>
                            setEditedExpertPrompt(e.target.value)
                          }
                        />
                        <p>
                          <span className="text-lg">Variables:</span>{" "}
                          <TypographyInlineCode>
                            {(variables && variables.join(", ")) ||
                              expert.variables.join(", ")}
                          </TypographyInlineCode>
                        </p>
                        <Button
                          type="submit"
                          variant="outline"
                          className="mt-6"
                        >
                          Save Changes
                        </Button>
                      </form>
                    ) : (
                      <div>
                        <TypographyMuted>{expert.description}</TypographyMuted>
                        <TypographyH3 className="mb-6">
                          {expert.prompt}
                        </TypographyH3>
                        <p>
                          <span className="text-lg">Variables:</span>{" "}
                          <TypographyInlineCode>
                            {expert.variables.join(", ")}
                          </TypographyInlineCode>
                        </p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
      </Accordion>
    </div>
  );
};

export default ExpertList;
