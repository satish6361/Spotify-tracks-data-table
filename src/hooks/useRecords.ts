import { useQuery } from "@tanstack/react-query";
import { fetchRecords } from "../api/recordsApi";
import type { RecordsQuery } from "../types/record";

export const useRecords = (query: RecordsQuery) => {
  return useQuery({
    queryKey: ["records", query],
    queryFn: () => fetchRecords(query),
    placeholderData: (previous) => previous,
  });
};
