import { Bot, Laptop2, User } from "lucide-react";
import React from "react";

type ChatMessageProps = {
    type: "AI" | "System" | "Human";
    text: string;
};

const ChatMessage = ({ type, text }: ChatMessageProps) => {
    const iconMap = {
        System: <Laptop2 />,
        AI: <Bot />,
        Human: <User />,
    };

    // create a function that replaces \n with <br /> and other stuff
    const formatText = (text: string) => {
        text = text.replace(/\n/g, "<br />");
        return text;
    };

    return (
        <div className="flex flex-row items-start gap-8">
            <div className="rounded-md border p-2 [&_svg]:h-6 [&_svg]:w-6">
                {iconMap[type]}
            </div>
            <span dangerouslySetInnerHTML={{ __html: formatText(text) }} />
        </div>
    );
};

export default ChatMessage;
