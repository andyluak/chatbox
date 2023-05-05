import clsx from "clsx";
import { Send } from "lucide-react";
import React from "react";

import { Input } from "../ui/input";

const ChatboxMessageForm = () => {
    return (
        <form
            className={clsx(
                "flex flex-row items-center justify-center  p-4",
                "[&_svg]:ml-2 [&_svg]:stroke-slate-300 [&_svg]:transition-[stroke] hover:[&_svg]:stroke-slate-400"
            )}
        >
            <Input
                className="max-w-xl bg-slate-800"
                placeholder="Send a message"
            />
            <button type="submit">
                <Send />
                <span className="sr-only">Send</span>
            </button>
        </form>
    );
};

export default ChatboxMessageForm;
