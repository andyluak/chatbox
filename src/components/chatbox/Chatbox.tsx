import clsx from "clsx";
import { HammerIcon } from "lucide-react";
import React, { PropsWithChildren } from "react";

const ChatboxHeader: React.FC<PropsWithChildren> = ({ children }) => {
    return <div className="">{children}</div>;
};

const ChatboxBody: React.FC<PropsWithChildren> = ({ children }) => {
    return <div className="flex flex-grow flex-col">{children}</div>;
};

const ChatboxFooter: React.FC<PropsWithChildren> = ({ children }) => {
    return <div>{children}</div>;
};

const ChatboxChat: React.FC<PropsWithChildren> = ({ children }) => {
    return <div>{children}</div>;
};

const ChatboxSidebar: React.FC<PropsWithChildren> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div
            className={clsx("transition-[flex-basis] ease-out", {
                "basis-[3%]": !isSidebarOpen,
                "basis-[25%]": isSidebarOpen,
            })}
        >
            <HammerIcon onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            {isSidebarOpen && children}
        </div>
    );
};

const Chatbox: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="chatbox-container flex h-screen flex-row">
            {children}
        </div>
    );
};

export { Chatbox, ChatboxHeader, ChatboxBody, ChatboxFooter, ChatboxSidebar, ChatboxChat };
