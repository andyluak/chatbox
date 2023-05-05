import { type Expert } from "@prisma/client";
import { atomWithReset } from "jotai/utils";

export const selectedExpertAtom = atomWithReset<Expert | null>(null);
