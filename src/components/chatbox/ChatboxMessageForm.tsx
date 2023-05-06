/* eslint-disable @typescript-eslint/no-misused-promises */
import clsx from "clsx";
import { useAtom } from "jotai";
import { Send } from "lucide-react";
import React from "react";
import { z } from "zod";

import { Input } from "../ui/input";
import { useCreateChat } from "~/hooks/use-chats";
import { selectedExpertAtom, systemMessageAtom } from "~/store/chatbox";

const ChatboxMessageForm = () => {
    const [selectedExpert] = useAtom(selectedExpertAtom);
    const [systemMessage] = useAtom(systemMessageAtom);

    const { mutateAsync } = useCreateChat();

    const buildExpertInputs = () => {
        return (
            <div
                className={clsx(
                    "flex w-full max-w-xl flex-row gap-x-10 gap-y-4 ",
                    {
                        "flex-wrap": selectedExpert?.variables.length !== 1,
                    }
                )}
            >
                {selectedExpert?.variables.map((v) => {
                    return (
                        <>
                            <Input
                                key={v}
                                className="max-w-xl flex-grow bg-slate-800"
                                placeholder={v}
                                name={v}
                            />
                        </>
                    );
                })}
            </div>
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const unparsedData = Object.fromEntries(formData.entries());

        if (!selectedExpert) {
            const promptSchema = z.object({
                prompt: z.string().nonempty(),
                systemMessage: z.string().optional(),
            });

            const data = promptSchema.parse({ ...unparsedData, systemMessage });

            await mutateAsync({data});
        }
    };

    return (
        <form
            className={clsx(
                "m-auto flex w-full max-w-xl flex-row items-center justify-center p-4",
                "[&_svg]:ml-2 [&_svg]:stroke-slate-300 [&_svg]:transition-[stroke] hover:[&_svg]:stroke-slate-400"
            )}
            onSubmit={handleSubmit}
        >
            {selectedExpert ? (
                <>
                    {buildExpertInputs()}
                    <button type="submit" className="flex flex-row gap-4">
                        <Send />
                        <span>Submit</span>
                    </button>
                </>
            ) : (
                <>
                    <Input
                        className="max-w-xl bg-slate-800"
                        placeholder="Send a message"
                        name="prompt"
                        id="prompt"
                    />
                    <button type="submit">
                        <Send />
                        <span className="sr-only">Send</span>
                    </button>
                </>
            )}
        </form>
    );
};

export default ChatboxMessageForm;
