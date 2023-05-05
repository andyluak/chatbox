import clsx from "clsx";
import { Laptop2, Send } from "lucide-react";
import { type NextPage } from "next";
import Head from "next/head";

import {
    Chatbox,
    ChatboxBody,
    ChatboxChat,
    ChatboxFooter,
    ChatboxHeader,
    ChatboxSidebar,
} from "~/components/chatbox/Chatbox";
import ExpertPicker from "~/components/chatbox/ExpertPicker";
import { Input } from "~/components/ui/input";

const Chats: NextPage = () => {
    return (
        <>
            <Head>
                <title>Chat With Docs - Experts</title>
                <meta name="description" content="Chatting with your docs" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="pt-navigation-height text-off-white">
                <Chatbox>
                    <ChatboxSidebar>Sidebar</ChatboxSidebar>
                    <ChatboxBody>
                        <ChatboxHeader>
                            <ExpertPicker />
                        </ChatboxHeader>
                        <ChatboxChat>
                            <Laptop2 />
                        </ChatboxChat>
                        <ChatboxFooter>
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
                        </ChatboxFooter>
                    </ChatboxBody>
                </Chatbox>
            </main>
        </>
    );
};

export default Chats;
