import { Send } from "lucide-react";
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
                        <ChatboxChat>Chat</ChatboxChat>
                        <ChatboxFooter>
                            <form className="flex flex-row items-center justify-center [&_svg]:ml-2 [&_svg]:stroke-slate-300 p-4">
                                <Input className="max-w-xl bg-slate-800" placeholder="Send a message"/>
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
