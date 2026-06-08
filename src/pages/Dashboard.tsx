import { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridSortModel } from "@mui/x-data-grid";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TuneIcon from "@mui/icons-material/Tune";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import { fetchAllMatchingRecords } from "../api/recordsApi";
import ActiveFilters from "../components/ActiveFilters";
import ColumnDrawer, {
  type ColumnPreference,
} from "../components/ColumnDrawer";
import FilterDrawer from "../components/FilterDrawer";
import NoResultsOverlay from "../components/NoResultsOverlay";
import SearchBar from "../components/SearchBar";
import { useDebounce } from "../hooks/useDebounce";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useRecords } from "../hooks/useRecords";
import { useUpdateRecord } from "../hooks/useUpdateRecord";
import "../styles/Dashboard.css";
import type {
  RecordsQuery,
  SortField,
  TrackFilters,
  TrackRecord,
} from "../types/record";
import { exportRecordsToCsv } from "../utils/exportCsv";

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

type ColumnKey = keyof Pick<
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
  | "explicit"
>;

type TableColumnPreference = ColumnPreference & {
  key: ColumnKey;
  sortable?: boolean;
};

const defaultColumns: TableColumnPreference[] = [
  {
    key: "track_name",
    label: "Track",
    width: 240,
    visible: true,
    sortable: true,
  },
  { key: "artist", label: "Artist", width: 190, visible: true, sortable: true },
  { key: "album", label: "Album", width: 220, visible: true, sortable: true },
  { key: "genre", label: "Genre", width: 140, visible: true, sortable: true },
  {
    key: "popularity",
    label: "Popularity",
    width: 130,
    visible: true,
    sortable: true,
  },
  { key: "tempo", label: "Tempo", width: 110, visible: true, sortable: true },
  { key: "energy", label: "Energy", width: 110, visible: true, sortable: true },
  {
    key: "danceability",
    label: "Dance",
    width: 110,
    visible: true,
    sortable: true,
  },
  {
    key: "duration_ms",
    label: "Duration",
    width: 125,
    visible: true,
    sortable: true,
  },
  {
    key: "release_date",
    label: "Release",
    width: 130,
    visible: true,
    sortable: true,
  },
  { key: "explicit", label: "Explicit", width: 110, visible: true },
];

const columnDefinitions: Record<ColumnKey, Omit<GridColDef, "field">> = {
  track_name: {
    headerName: "Track",
    minWidth: 200,
    editable: true,
  },
  artist: {
    headerName: "Artist",
    minWidth: 180,
  },
  album: {
    headerName: "Album",
    minWidth: 200,
  },
  genre: {
    headerName: "Genre",
    minWidth: 140,
    editable: true,
  },
  popularity: {
    headerName: "Popularity",
    type: "number",
    minWidth: 130,
    editable: true,
  },
  tempo: {
    headerName: "Tempo",
    type: "number",
    minWidth: 120,
  },
  energy: {
    headerName: "Energy",
    type: "number",
    minWidth: 120,
  },
  danceability: {
    headerName: "Dance",
    type: "number",
    minWidth: 120,
  },
  duration_ms: {
    headerName: "Duration",
    type: "number",
    minWidth: 130,
    valueFormatter: (value) =>
      typeof value === "number" ? `${Math.round(value / 1000)}s` : "",
  },
  release_date: {
    headerName: "Release",
    minWidth: 130,
  },
  explicit: {
    headerName: "Explicit",
    minWidth: 110,
    type: "boolean",
    valueFormatter: (value) => (value ? "Yes" : "No"),
  },
};

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortField, setSortField] = useState<SortField>("popularity");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TrackFilters>(defaultFilters);
  const [draftFilters, setDraftFilters] =
    useState<TrackFilters>(defaultFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [columnOpen, setColumnOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set(),
    });
  const [columns, setColumns] = useLocalStorage<TableColumnPreference[]>(
    "spotify-table-columns",
    defaultColumns,
  );

  const debouncedSearch = useDebounce(search, 300);
  const updateRecordMutation = useUpdateRecord(setErrorMessage);
  const sortModel = useMemo<GridSortModel>(
    () => [
      {
        field: sortField,
        sort: sortDirection,
      },
    ],
    [sortDirection, sortField],
  );

  const query = useMemo<RecordsQuery>(
    () => ({
      page,
      pageSize,
      search: debouncedSearch,
      sortField,
      sortDirection,
      filters,
    }),
    [debouncedSearch, filters, page, pageSize, sortDirection, sortField],
  );

  const { data, isFetching, isLoading, error, refetch } = useRecords(query);
  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const selectedCount =
    rowSelectionModel.type === "include"
      ? rowSelectionModel.ids.size
      : total - rowSelectionModel.ids.size;
  const activeFilterCount =
    Number(Boolean(filters.trackName)) +
    Number(Boolean(filters.artist)) +
    filters.genres.length +
    Number(Boolean(filters.minPopularity || filters.maxPopularity)) +
    Number(Boolean(filters.minTempo || filters.maxTempo)) +
    Number(Boolean(filters.releaseFrom || filters.releaseTo));
  const viewStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const viewEnd = total === 0 ? 0 : Math.min(page * pageSize, total);

  const gridColumns = useMemo<GridColDef[]>(
    () =>
      columns.map((column) => ({
        field: column.key,
        width: column.width,
        hideable: true,
        sortable: column.sortable !== false,
        ...columnDefinitions[column.key],
      })),
    [columns],
  );

  const columnVisibilityModel = useMemo(
    () =>
      columns.reduce<Record<string, boolean>>((accumulator, column) => {
        accumulator[column.key] = column.visible;
        return accumulator;
      }, {}),
    [columns],
  );

  const updateColumn = (
    key: string,
    changes: Partial<TableColumnPreference>,
  ) => {
    setColumns((current) =>
      current.map((column) =>
        column.key === key
          ? {
              ...column,
              ...changes,
            }
          : column,
      ),
    );
  };

  const moveColumn = (field: string, direction: -1 | 1) => {
    setColumns((current) => {
      const index = current.findIndex((column) => column.key === field);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [column] = next.splice(index, 1);
      next.splice(nextIndex, 0, column);
      return next;
    });
  };

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
    setPage(1);
  };

  const processRowUpdate = async (newRow: TrackRecord, oldRow: TrackRecord) => {
    if (!newRow.track_name.trim()) {
      throw new Error("Track name is required");
    }

    if (!newRow.genre.trim()) {
      throw new Error("Genre is required");
    }

    if (newRow.popularity < 0 || newRow.popularity > 100) {
      throw new Error("Popularity must be between 0 and 100");
    }

    const changes: Partial<TrackRecord> = {};

    Object.keys(newRow).forEach((key) => {
      const field = key as keyof TrackRecord;

      if (newRow[field] !== oldRow[field]) {
        changes[field] = newRow[field] as never;
      }
    });

    if (Object.keys(changes).length === 0) {
      return oldRow;
    }

    await updateRecordMutation.mutateAsync({
      id: newRow.id,
      changes,
    });

    return newRow;
  };

  const handleExportSelected = () => {
    const selectedIds = rowSelectionModel.ids;
    const selectedRecords = rows.filter((row) => selectedIds.has(row.id));
    exportRecordsToCsv(selectedRecords, "selected-tracks.csv");
  };

  const handleExportCurrentView = async () => {
    const records = await fetchAllMatchingRecords(query);
    exportRecordsToCsv(records, "spotify-tracks.csv");
  };

  return (
    <main className="app-shell">
      <header className="hero-panel">
        <div className="hero-copy">
          <h1>Spotify Tracks</h1>
          <p className="toolbar-subtitle">
            Browse a large catalog, tune the visible data, and edit records.
          </p>
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

      <div className="top-actions card-panel">
        <div className="top-actions-search-div">
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onClear={() => {
              setSearch("");
              setPage(1);
            }}
          />

          <button
            className="filter-btn"
            onClick={() => {
              setDraftFilters(filters);
              setFilterOpen(true);
            }}
          >
            <TuneIcon />
            Filters
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </button>

          <button className="column-btn" onClick={() => setColumnOpen(true)}>
            <ViewColumnRoundedIcon />
            Columns
          </button>
        </div>

        <div className="top-actions-btn">
          <button className="bulk-btn" onClick={handleExportCurrentView}>
            Export Current View
          </button>
        </div>
      </div>

      {debouncedSearch && (
        <div className="search-indicator">
          Searching for <strong>{debouncedSearch}</strong>
        </div>
      )}

      <ActiveFilters filters={filters} onRemove={removeFilter} />

      <ColumnDrawer
        open={columnOpen}
        columns={columns}
        onToggle={(field, value) => updateColumn(field, { visible: value })}
        onWidthChange={(field, width) =>
          updateColumn(field, {
            width: Number.isFinite(width) ? Math.max(90, width) : 90,
          })
        }
        onMove={moveColumn}
        onReset={() => setColumns(defaultColumns)}
        onClose={() => setColumnOpen(false)}
      />

      <FilterDrawer
        open={filterOpen}
        filters={draftFilters}
        onClose={() => setFilterOpen(false)}
        onClear={() => {
          setDraftFilters(defaultFilters);
        }}
        onChange={(changes) =>
          setDraftFilters((current) => ({
            ...current,
            ...changes,
          }))
        }
        onApply={() => {
          setFilters(draftFilters);
          setPage(1);
          setFilterOpen(false);
        }}
      />

      <section className="table-panel">
        {rowSelectionModel.ids.size > 0 && (
          <div className="bulk-bar">
            <div className="bulk-bar-left">
              {selectedCount.toLocaleString()} rows selected
            </div>

            <div className="bulk-bar-actions">
              <button
                className="bulk-export-btn"
                onClick={handleExportSelected}
              >
                Export Selected
              </button>
            </div>
          </div>
        )}

        <div className="table-meta">
          <div>
            <div className="table-range">
              Showing {viewStart.toLocaleString()}-{viewEnd.toLocaleString()} of{" "}
              {total.toLocaleString()}
            </div>
            <div className="table-hint">
              Double-click a cell to edit. Selection applies to the loaded page.
            </div>
          </div>
        </div>

        <DataGrid
          rows={rows}
          columns={gridColumns}
          loading={isLoading || isFetching}
          rowCount={total}
          checkboxSelection
          disableRowSelectionOnClick
          density="comfortable"
          paginationMode="server"
          sortingMode="server"
          sortingOrder={["desc", "asc"]}
          pageSizeOptions={[25, 50, 100]}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(newSelection) => {
            setRowSelectionModel(newSelection);
          }}
          paginationModel={{
            page: page - 1,
            pageSize,
          }}
          onPaginationModelChange={(model) => {
            setPage(model.page + 1);
            setPageSize(model.pageSize);
          }}
          sortModel={sortModel}
          onSortModelChange={(model) => {
            if (!model.length) return;

            const { field, sort } = model[0];
            setSortField(field as SortField);
            setSortDirection((sort ?? "asc") as "asc" | "desc");
          }}
          localeText={{
            paginationRowsPerPage: "Results per page",
          }}
          slots={{
            noRowsOverlay: () => <NoResultsOverlay search={debouncedSearch} />,
          }}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => {
            setErrorMessage(
              error instanceof Error ? error.message : "Failed to save changes",
            );
          }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnWidthChange={(params) => {
            updateColumn(String(params.colDef.field), { width: params.width });
          }}
          sx={{
            border: "none",
            minHeight: 700,
            backgroundColor: "transparent",
            "& .MuiDataGrid-main": {
              borderRadius: "20px",
            },
            "& .MuiDataGrid-columnHeaders": {
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(244,247,255,0.96))",
              borderBottom: "1px solid rgba(102, 126, 234, 0.18)",
              fontWeight: 700,
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "rgba(255,255,255,0.82)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "rgba(240, 244, 255, 0.96)",
            },
            "& .MuiDataGrid-cell": {
              borderColor: "rgba(148, 163, 184, 0.18)",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "rgba(255,255,255,0.9)",
              borderTop: "1px solid rgba(148, 163, 184, 0.16)",
            },
          }}
        />
      </section>

      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
      >
        <Alert severity="error" onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default Dashboard;
