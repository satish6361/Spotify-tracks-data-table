import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchRecord } from "../api/recordsApi";
import type { TrackRecord } from "../types/record";

export const useUpdateRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      changes,
    }: {
      id: string;
      changes: Partial<TrackRecord>;
    }) => patchRecord(id, changes),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["records"],
      });
    },
  });
};
