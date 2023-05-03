import React from "react";

import { TypographyH2, TypographyLead } from "../ui/Typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { useGetExperts } from "~/hooks/use-experts";

const ExpertList = () => {
  const { experts, isLoading } = useGetExperts();

  return (
    <div className="max-w-xl pt-12 text-off-white md:pt-20 lg:pt-36">
      <TypographyH2>Your Expert Designers</TypographyH2>
      <TypographyLead className="text-lg">
        Here you can modify/delete the types of helpers you want to create
      </TypographyLead>
      <Accordion type="single" collapsible className="mt-6">
        {experts &&
          experts.length > 0 &&
          experts.map((expert) => {
            return (
              <AccordionItem key={expert.id} value={expert.id}>
                <AccordionTrigger>{expert.name}</AccordionTrigger>
                <AccordionContent>
                  <div>
                    {expert.description}
                    {expert.prompt}
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
