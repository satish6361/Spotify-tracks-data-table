import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import type { TrackFilters } from "../types/record";
import "../styles/FilterDrawer.css";

type Props = {
  open: boolean;
  filters: TrackFilters;
  onClose: () => void;
  onChange: (changes: Partial<TrackFilters>) => void;
  onClear: () => void;
  onApply: () => void;
};

const genreOptions = ["edm", "latin", "pop", "r&b", "rap", "rock"];

const FilterDrawer = ({
  open,
  filters,
  onClose,
  onChange,
  onClear,
  onApply,
}: Props) => {
  const activeCount =
    Number(Boolean(filters.trackName)) +
    Number(Boolean(filters.artist)) +
    filters.genres.length +
    Number(Boolean(filters.minPopularity || filters.maxPopularity)) +
    Number(Boolean(filters.minTempo || filters.maxTempo)) +
    Number(Boolean(filters.releaseFrom || filters.releaseTo));

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="filter-drawer">
        <div className="filter-header">
          <div>
            <h2>Advanced filters</h2>
            <p>Refine tracks using filters below</p>
          </div>

          <IconButton onClick={onClose} aria-label="Close filters">
            <CloseIcon />
          </IconButton>
        </div>

        {/* <div className="filter-summary">
          <Chip
            label={`${activeCount} active`}
            color={activeCount ? "primary" : "default"}
            variant={activeCount ? "filled" : "outlined"}
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            Filters combine with AND logic and stay in sync with search and
            sort.
          </Typography>
        </div> */}

        <Divider />

        <div className="filter-scroll">
          <div className="filter-section">
            <label className="filter-section-title">Text filters</label>

            <TextField
              label="Track name"
              size="small"
              fullWidth
              value={filters.trackName}
              onChange={(event) =>
                onChange({
                  trackName: event.target.value,
                })
              }
            />

            <TextField
              label="Artist"
              size="small"
              fullWidth
              value={filters.artist}
              onChange={(event) =>
                onChange({
                  artist: event.target.value,
                })
              }
            />
          </div>

          <div className="filter-section">
            <label className="filter-section-title">Genre</label>

            <FormControl fullWidth size="small">
              <InputLabel>Genres</InputLabel>

              <Select
                multiple
                value={filters.genres}
                onChange={(event) =>
                  onChange({
                    genres:
                      typeof event.target.value === "string"
                        ? event.target.value.split(",")
                        : event.target.value,
                  })
                }
                input={<OutlinedInput label="Genres" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {genreOptions.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    <Checkbox checked={filters.genres.includes(genre)} />
                    <ListItemText primary={genre.toUpperCase()} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="filter-section">
            <label className="filter-section-title">Popularity range</label>
            <div className="range-row">
              <TextField
                label="Min"
                type="number"
                size="small"
                value={filters.minPopularity}
                onChange={(event) =>
                  onChange({
                    minPopularity: event.target.value,
                  })
                }
                slotProps={{
                  htmlInput: {
                    min: 0,
                    max: 100,
                  },
                }}
              />

              <TextField
                label="Max"
                type="number"
                size="small"
                value={filters.maxPopularity}
                onChange={(event) =>
                  onChange({
                    maxPopularity: event.target.value,
                  })
                }
                slotProps={{
                  htmlInput: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-section-title">Tempo range</label>
            <div className="range-row">
              <TextField
                label="Min BPM"
                type="number"
                size="small"
                value={filters.minTempo}
                onChange={(event) =>
                  onChange({
                    minTempo: event.target.value,
                  })
                }
              />

              <TextField
                label="Max BPM"
                type="number"
                size="small"
                value={filters.maxTempo}
                onChange={(event) =>
                  onChange({
                    maxTempo: event.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-section-title">Release date</label>
            <div className="range-row">
              <TextField
                label="From"
                type="date"
                size="small"
                value={filters.releaseFrom}
                onChange={(event) =>
                  onChange({
                    releaseFrom: event.target.value,
                  })
                }
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />

              <TextField
                label="To"
                type="date"
                size="small"
                value={filters.releaseTo}
                onChange={(event) =>
                  onChange({
                    releaseTo: event.target.value,
                  })
                }
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <button
            onClick={onClear}
            className="filter-footer-btn filter-footer-btn-secondary"
          >
            Clear all
          </button>

          <button
            onClick={onApply}
            className="filter-footer-btn filter-footer-btn-primary"
          >
            Apply filters
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default FilterDrawer;
