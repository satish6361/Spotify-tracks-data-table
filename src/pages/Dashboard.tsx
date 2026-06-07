import { useMemo, useState } from "react";
import { useRecords } from "../hooks/useRecords";
import type { RecordsQuery, TrackFilters } from "../types/record";
import "../App.css";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

const defaultFilters: TrackFilters = {
  trackName: "",
  artist: "",
  genres: [],
  minPopularity: "",
  maxPopularity: "",
  minTempo: "",
  maxTempo: "",
  releaseFrom: "",
  releaseTo: "",
};

const gridColumns: GridColDef[] = [
  {
    field: "track_name",
    headerName: "Track",
    flex: 1,
    editable: true,
  },
  {
    field: "artist",
    headerName: "Artist",
    flex: 1,
  },
  {
    field: "album",
    headerName: "Album",
    flex: 1,
  },
  {
    field: "genre",
    headerName: "Genre",
    flex: 1,
    editable: true,
  },
  {
    field: "popularity",
    headerName: "Popularity",
    type: "number",
    editable: true,
  },
  {
    field: "tempo",
    headerName: "Tempo",
    type: "number",
  },
];

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const query = useMemo<RecordsQuery>(
    () => ({
      page,
      pageSize,
      search: "",
      sortField: "popularity",
      sortDirection: "desc",
      filters: defaultFilters,
    }),
    [page, pageSize],
  );

  const { data, isFetching, isLoading, error, refetch } = useRecords(query);
  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  return (
    <main className="app-shell">
      <header className="toolbar">
        <div>
          <h1>Spotify Tracks</h1>
        </div>
      </header>

      {error && (
        <div className="state-panel" role="alert">
          <strong>Could not load records.</strong>
          <span>Start json-server and check VITE_API_BASE_URL.</span>
          <button type="button" onClick={() => void refetch()}>
            Retry
          </button>
        </div>
      )}

      <section
        style={{
          height: 700,
          width: "100%",
        }}
      >
        <DataGrid
          rows={rows}
          columns={gridColumns}
          loading={isLoading || isFetching}
          disableRowSelectionOnClick
          rowCount={total}
          paginationMode="server"
          sortingMode="server"
          pageSizeOptions={[25, 50, 100]}
          paginationModel={{
            page: page - 1,
            pageSize,
          }}
          onPaginationModelChange={(model) => {
            setPage(model.page + 1);
            setPageSize(model.pageSize);
          }}
        />
      </section>
    </main>
  );
};

export default Dashboard;
