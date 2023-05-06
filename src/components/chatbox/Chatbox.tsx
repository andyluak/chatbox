import clsx from "clsx";
import { HammerIcon, Menu } from "lucide-react";
import React, { type PropsWithChildren } from "react";

const ChatboxHeader: React.FC<PropsWithChildren> = ({ children }) => {
    return <div>{children}</div>;
};

const ChatboxBody: React.FC<PropsWithChildren> = ({ children }) => {
    return <div className="flex flex-grow flex-col px-4">{children}</div>;
};

const ChatboxFooter: React.FC<PropsWithChildren> = ({ children }) => {
    return <div>{children}</div>;
};

const ChatboxChat: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="mt-8 min-h-[40rem] rounded-lg bg-slate-800 px-4 py-4">
            {children}
        </div>
    );
};

const ChatboxSidebar: React.FC<PropsWithChildren> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div
            className={clsx("ml-4 transition-[flex-basis] ease-out", {
                "basis-[3%]": !isSidebarOpen,
                "basis-[25%]": isSidebarOpen,
            })}
        >
            <button>
                <Menu onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <span className="sr-only">Toggle sidebar</span>
            </button>
            {isSidebarOpen && children}
        </div>
    );
};

const Chatbox: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="chatbox-container flex min-h-screen flex-row bg-slate-900 py-6">
            {children}
        </div>
    );
};

export {
    Chatbox,
    ChatboxHeader,
    ChatboxBody,
    ChatboxFooter,
    ChatboxSidebar,
    ChatboxChat,
};
