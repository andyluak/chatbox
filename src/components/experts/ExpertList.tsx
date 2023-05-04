import { type Expert } from "@prisma/client";
import React from "react";

import {
  TypographyH2,
  TypographyH3,
  TypographyInlineCode,
  TypographyLead,
  TypographyMuted,
} from "../ui/Typography";
import ActionsToolbar from "./ActionsToolbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { useDeleteExpert, useGetExperts } from "~/hooks/use-experts";

const ExpertList = () => {
  const { experts } = useGetExperts<Expert>();
  const { mutate: deleteMutate } = useDeleteExpert();
  const accordionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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
                    <ActionsToolbar onDelete={() => deleteMutate(expert.id)} />
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
