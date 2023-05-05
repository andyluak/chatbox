import { type Expert } from "@prisma/client";
import React from "react";

import { TypographyMuted } from "../ui/Typography";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { useGetExperts } from "~/hooks/use-experts";

const ExpertPicker = () => {
    const { experts } = useGetExperts<Expert>();

    return (
        <div className="space-y-4">
            <TypographyMuted>
                Select an expert or leave it empty
            </TypographyMuted>
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Expert Picker" />
                </SelectTrigger>
                <SelectContent>
                    {experts.map((expert) => (
                        <SelectItem key={expert.id} value={expert.id}>
                            {expert.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default ExpertPicker;
