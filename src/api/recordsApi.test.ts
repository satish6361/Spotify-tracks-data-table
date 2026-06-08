import { describe, expect, it } from "vitest";
import { buildRecordParams } from "./recordsApi";
import type { RecordsQuery } from "../types/record";

const baseQuery: RecordsQuery = {
  page: 2,
  pageSize: 50,
  search: "swift",
  sortField: "popularity",
  sortDirection: "desc",
  filters: {
    trackName: "love",
    artist: "tay",
    genres: ["pop", "rock"],
    minPopularity: "60",
    maxPopularity: "90",
    minTempo: "100",
    maxTempo: "130",
    releaseFrom: "2020-01-01",
    releaseTo: "2024-12-31",
  },
};

describe("buildRecordParams", () => {
  it("maps pagination, sorting, search, and range filters to json-server params", () => {
    expect(buildRecordParams(baseQuery)).toEqual({
      _page: 2,
      _limit: 50,
      _sort: "popularity",
      _order: "desc",
      q: "swift",
      track_name_like: "love",
      artist_like: "tay",
      popularity_gte: "60",
      popularity_lte: "90",
      tempo_gte: "100",
      tempo_lte: "130",
      release_date_gte: "2020-01-01",
      release_date_lte: "2024-12-31",
    });
  });

  it("uses exact genre matching when a single genre is selected", () => {
    expect(
      buildRecordParams({
        ...baseQuery,
        filters: {
          ...baseQuery.filters,
          genres: ["pop"],
        },
      }),
    ).toMatchObject({
      genre: "pop",
    });
  });
});
