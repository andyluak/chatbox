import { type Expert } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import {
  type ExpertBodyData,
  type ExpertBodyDataOptional,
} from "~/pages/api/expert-creator";

export function useGetExperts<T>() {
  const {
    data: experts = [],
    isLoading,
    error,
  } = useQuery<T[], Error>(["experts"], async () => {
    const res = await fetch("/api/expert-creator");
    const experts = (await res.json()) as T[];
    return experts;
  });

  return { experts, isLoading, error };
}

export function useCreateExpert() {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: ExpertBodyData) => {
      const res = await fetch("/api/expert-creator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      try {
        const newExpert = (await res.json()) as Expert;
        return newExpert;
      } catch (error) {
        console.error(error);
      }
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["experts"]);
      },
    }
  );
}

export function useDeleteExpert() {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      const res = await fetch(`/api/expert-creator/${id}`, {
        method: "DELETE",
      });
      const deletedExpert = (await res.json()) as Expert;
      return deletedExpert;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["experts"]);
      },
    }
  );
}

export function useUpdateExpert() {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: ExpertBodyDataOptional) => {
      const { id } = data;
      const res = await fetch(`/api/expert-creator/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      const updatedExpert = (await res.json()) as Expert;
      return updatedExpert;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["experts"]);
      },
    }
  );
}
