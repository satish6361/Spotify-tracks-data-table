import axios from "axios";
import type {
  RecordsQuery,
  RecordsResponse,
  TrackRecord,
} from "../types/record";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export const recordsApi = axios.create({
  baseURL: API_BASE_URL,
});

export const buildRecordParams = (
  query: RecordsQuery,
  overrideLimit?: number,
) => {
  const { filters } = query;
  const params: Record<string, string | number | string[]> = {
    _page: query.page,
    _limit: overrideLimit ?? query.pageSize,
    _sort: query.sortField,
    _order: query.sortDirection,
  };

  if (query.search.trim()) params.q = query.search.trim();
  if (filters.trackName.trim())
    params.track_name_like = filters.trackName.trim();
  if (filters.artist.trim()) params.artist_like = filters.artist.trim();
  if (filters.genres.length) params.genre = filters.genres;
  if (filters.minPopularity) params.popularity_gte = filters.minPopularity;
  if (filters.maxPopularity) params.popularity_lte = filters.maxPopularity;
  if (filters.minTempo) params.tempo_gte = filters.minTempo;
  if (filters.maxTempo) params.tempo_lte = filters.maxTempo;
  if (filters.releaseFrom) params.release_date_gte = filters.releaseFrom;
  if (filters.releaseTo) params.release_date_lte = filters.releaseTo;

  return params;
};

export const buildRecordSearchParams = (
  query: RecordsQuery,
  overrideLimit?: number,
) => {
  const params = buildRecordParams(query, overrideLimit);
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => searchParams.append(key, entry));
      return;
    }

    searchParams.append(key, String(value));
  });

  return searchParams;
};

export const fetchRecords = async (
  query: RecordsQuery,
): Promise<RecordsResponse> => {
  const response = await recordsApi.get<TrackRecord[]>("/records", {
    params: buildRecordSearchParams(query),
  });
  const totalHeader = response.headers["x-total-count"];

  return {
    rows: response.data,
    total: Number(totalHeader ?? response.data.length),
  };
};

export const fetchAllMatchingRecords = async (query: RecordsQuery) => {
  const firstPage = await fetchRecords({ ...query, page: 1, pageSize: 1 });
  const response = await recordsApi.get<TrackRecord[]>("/records", {
    params: buildRecordSearchParams(
      { ...query, page: 1 },
      Math.max(firstPage.total, 1),
    ),
  });

  return response.data;
};

export const patchRecord = async (
  id: string,
  changes: Partial<TrackRecord>,
) => {
  const response = await recordsApi.patch<TrackRecord>(
    `/records/${id}`,
    changes,
  );
  return response.data;
};
