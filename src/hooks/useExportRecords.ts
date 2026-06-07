import { fetchAllMatchingRecords } from "../api/recordsApi";
import { exportRecordsToCsv } from "../utils/exportCsv";
import type { RecordsQuery } from "../types/record";

export const exportCurrentView = async (query: RecordsQuery) => {
  const rows = await fetchAllMatchingRecords(query);

  exportRecordsToCsv(rows, "spotify-tracks.csv");
};
