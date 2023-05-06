import { useAtom } from "jotai";
import { Laptop2 } from "lucide-react";
import React from "react";

import { Input } from "../ui/input";
import { systemMessageAtom } from "~/store/chatbox";

const SystemMessageInserter = () => {
    const [systemMessage, setSystemMessage] = useAtom(systemMessageAtom);
    return (
        <div className="flex flex-row items-center gap-8">
            <div className="rounded-md border p-2 [&_svg]:h-6 [&_svg]:w-6">
                <Laptop2 />
            </div>
            <Input
                outline="none"
                className="max-w-2xl"
                placeholder="Enter a system message or leave empty."
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
            />
        </div>
    );
};

export default SystemMessageInserter;
