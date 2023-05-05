import clsx from "clsx";
import { useAtom } from "jotai";
import { Send } from "lucide-react";
import React from "react";

import { Input } from "../ui/input";
import { selectedExpertAtom } from "~/store/chatbox";

const ChatboxMessageForm = () => {
    const [selectedExpert] = useAtom(selectedExpertAtom);
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

    return (
        <form
            className={clsx(
                "m-auto flex w-full max-w-xl flex-row items-center justify-center p-4",
                "[&_svg]:ml-2 [&_svg]:stroke-slate-300 [&_svg]:transition-[stroke] hover:[&_svg]:stroke-slate-400"
            )}
            
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
