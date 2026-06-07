export interface TrackRecord {
  id: string;
  track_name: string;
  artist: string;
  album?: string;
  genre: string;
  popularity: number;
  tempo: number;
  energy?: number;
  danceability?: number;
  duration_ms?: number;
  release_date?: string;
  explicit?: boolean;
}

export type SortDirection = "asc" | "desc";
export type SortField = keyof Pick<
  TrackRecord,
  | "track_name"
  | "artist"
  | "album"
  | "genre"
  | "popularity"
  | "tempo"
  | "energy"
  | "danceability"
  | "duration_ms"
  | "release_date"
>;

export interface TrackFilters {
  trackName: string;
  artist: string;
  genres: string[];
  minPopularity: string;
  maxPopularity: string;
  minTempo: string;
  maxTempo: string;
  releaseFrom: string;
  releaseTo: string;
}

export interface RecordsQuery {
  page: number;
  pageSize: number;
  search: string;
  sortField: SortField;
  sortDirection: SortDirection;
  filters: TrackFilters;
}

export interface RecordsResponse {
  rows: TrackRecord[];
  total: number;
}
