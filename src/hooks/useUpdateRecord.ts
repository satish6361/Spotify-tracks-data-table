import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchRecord } from "../api/recordsApi";
import type { RecordsResponse, TrackRecord } from "../types/record";

export const useUpdateRecord = (onErrorMessage?: (message: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      changes,
    }: {
      id: string;
      changes: Partial<TrackRecord>;
    }) => patchRecord(id, changes),

    onMutate: async ({ id, changes }) => {
      await queryClient.cancelQueries({
        queryKey: ["records"],
      });

      const previousQueries = queryClient.getQueriesData<RecordsResponse>({
        queryKey: ["records"],
      });

      previousQueries.forEach(([queryKey, data]) => {
        if (!data) return;

        queryClient.setQueryData<RecordsResponse>(queryKey, {
          ...data,
          rows: data.rows.map((row) =>
            row.id === id
              ? {
                  ...row,
                  ...changes,
                }
              : row,
          ),
        });
      });

      return {
        previousQueries,
      };
    },

    onError: (_error, _variables, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      onErrorMessage?.("Failed to save changes");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["records"],
      });
    },
  });
};
