import { type Expert } from "@prisma/client";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import React from "react";

import { TypographyMuted } from "../ui/Typography";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { useGetExperts } from "~/hooks/use-experts";
import { selectedExpertAtom } from "~/store/chatbox";

const ExpertPicker = () => {
    const { experts } = useGetExperts<Expert>();
    const [selectedExpert, setSelectedExpert] = useAtom(selectedExpertAtom);

    const handleSelect = (id: string) => {
        const selectedExpert =
            experts.find((expert) => expert.id === id) || null;
        setSelectedExpert(selectedExpert);
    };

    const handleClear = () => {
        setSelectedExpert(RESET);
    };

    return (
        <div className="space-y-4">
            <TypographyMuted>
                Select an expert or leave it empty
            </TypographyMuted>
            <div className="flex flex-row gap-4">
                <Select
                    onValueChange={handleSelect}
                    value={selectedExpert?.id || "none"}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Expert Picker" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={"none"}>None</SelectItem>
                        {experts.map((expert) => (
                            <SelectItem key={expert.id} value={expert.id}>
                                {expert.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={handleClear}>
                    Clear
                </Button>
            </div>
        </div>
    );
};

export default ExpertPicker;
