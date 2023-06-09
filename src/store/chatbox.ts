import { type Expert } from "@prisma/client";
import { atomWithReset } from "jotai/utils";

export const selectedExpertAtom = atomWithReset<Expert | null>(null);
export const systemMessageAtom = atomWithReset<string>("");
export const selectedChatAtom = atomWithReset<string>("");
