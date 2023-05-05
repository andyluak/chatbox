import { Laptop2 } from "lucide-react";
import React from "react";

import { Input } from "../ui/input";

const SystemMessageInserter = () => {
    return (
        <div className="flex flex-row items-center gap-8">
            <div className="rounded-md border p-2 [&_svg]:h-6 [&_svg]:w-6">
                <Laptop2 />
            </div>
            <Input
                outline="none"
                className="max-w-2xl"
                placeholder="Enter a system message or leave empty."
            />
        </div>
    );
};

export default SystemMessageInserter;
