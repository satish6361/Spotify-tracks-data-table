import { useEffect, useMemo, useState } from "react";
import { useRecords } from "../hooks/useRecords";
import type { RecordsQuery, SortField, TrackFilters } from "../types/record";
import "../App.css";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { GridSortModel } from "@mui/x-data-grid";
import { useDebounce } from "../hooks/useDebounce";
import SearchBar from "../components/SearchBar";
import NoResultsOverlay from "../components/NoResultsOverlay";
import FilterDrawer from "../components/FilterDrawer";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import ActiveFilters from "../components/ActiveFilters";
import TuneIcon from "@mui/icons-material/Tune";

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
  const [sortField, setSortField] = useState<SortField>("popularity");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const sortModel = useMemo<GridSortModel>(
    () => [
      {
        field: sortField,
        sort: sortDirection,
      },
    ],
    [sortField, sortDirection],
  );

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [filters, setFilters] = useState<TrackFilters>(defaultFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set(),
    });

  const query = useMemo<RecordsQuery>(
    () => ({
      page,
      pageSize,
      search: debouncedSearch,
      sortField,
      sortDirection,
      filters,
    }),
    [page, pageSize, debouncedSearch, filters, sortField, sortDirection],
  );

  const { data, isFetching, isLoading, error, refetch } = useRecords(query);
  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const activeFilterCount =
    Number(Boolean(filters.trackName)) +
    Number(Boolean(filters.artist)) +
    filters.genres.length +
    Number(Boolean(filters.minPopularity || filters.maxPopularity)) +
    Number(Boolean(filters.minTempo || filters.maxTempo)) +
    Number(Boolean(filters.releaseFrom || filters.releaseTo));

  const removeFilter = (key: keyof TrackFilters) => {
    setFilters((current) => {
      const next = { ...current };

      switch (key) {
        case "trackName":
          next.trackName = "";
          break;

        case "artist":
          next.artist = "";
          break;

        case "genres":
          next.genres = [];
          break;

        case "minPopularity":
        case "maxPopularity":
          next.minPopularity = "";
          next.maxPopularity = "";
          break;

        case "minTempo":
        case "maxTempo":
          next.minTempo = "";
          next.maxTempo = "";
          break;

        case "releaseFrom":
        case "releaseTo":
          next.releaseFrom = "";
          next.releaseTo = "";
          break;
      }

      return next;
    });
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

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

      <SearchBar
        value={search}
        onChange={setSearch}
        onClear={() => setSearch("")}
      />

      {debouncedSearch && (
        <div className="search-indicator">
          Searching for:&nbsp;<strong>{debouncedSearch}</strong>
        </div>
      )}
      <div className="table-actions">
        <button className="filter-btn" onClick={() => setFilterOpen(true)}>
          <TuneIcon />
          Filters
          {activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount}</span>
          )}
        </button>
      </div>
      <ActiveFilters filters={filters} onRemove={removeFilter} />

      <FilterDrawer
        open={filterOpen}
        filters={filters}
        onClose={() => setFilterOpen(false)}
        onClear={() => setFilters(defaultFilters)}
        onChange={(changes) =>
          setFilters((current) => ({
            ...current,
            ...changes,
          }))
        }
      />

      <section
        style={{
          height: 700,
          width: "100%",
        }}
      >
        {rowSelectionModel.ids.size > 0 && (
          <div className="bulk-bar">
            <div className="bulk-bar-left">
              {rowSelectionModel.ids.size} rows selected
            </div>

            <div className="bulk-bar-actions">
              <button className="bulk-btn">Export</button>

              <button className="bulk-btn">Delete</button>
            </div>
          </div>
        )}
        <DataGrid
          rows={rows}
          columns={gridColumns}
          loading={isLoading || isFetching}
          onRowSelectionModelChange={(newSelection) => {
            setRowSelectionModel(newSelection);
          }}
          rowCount={total}
          paginationMode="server"
          sortingMode="server"
          sortingOrder={["desc", "asc"]}
          pageSizeOptions={[25, 50, 100]}
          paginationModel={{
            page: page - 1,
            pageSize,
          }}
          sortModel={sortModel}
          localeText={{
            paginationRowsPerPage: "Results per page",
          }}
          slots={{
            noRowsOverlay: () => <NoResultsOverlay search={debouncedSearch} />,
          }}
          onPaginationModelChange={(model) => {
            setPage(model.page + 1);
            setPageSize(model.pageSize);
          }}
          onSortModelChange={(model) => {
            if (!model.length) return;

            const { field, sort } = model[0];

            setSortField(field as SortField);
            setSortDirection((sort ?? "asc") as "asc" | "desc");
          }}
          checkboxSelection
          disableRowSelectionOnClick
          density="comfortable"
          sx={{
            borderRadius: 3,
            backgroundColor: "#fff",

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8fafc",
              fontWeight: 600,
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f8fbff",
            },
          }}
        />
      </section>
    </main>
  );
};

export default Dashboard;
