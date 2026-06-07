import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import type { TrackFilters } from "../types/record";
import "../styles/FilterDrawer.css";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Typography } from "@mui/material";

type Props = {
  open: boolean;
  filters: TrackFilters;
  onClose: () => void;
  onChange: (changes: Partial<TrackFilters>) => void;
  onClear: () => void;
  onApply: () => void;
};

const genres = ["pop", "rock", "rap", "hip hop", "edm"];

const FilterDrawer = ({
  open,
  filters,
  onClose,
  onChange,
  onClear,
  onApply,
}: Props) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="filter-drawer">
        <div className="filter-header">
          <h2>Filters</h2>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <Typography variant="body2" color="text.secondary">
          Refine tracks using filters below
        </Typography>
        <Divider />

        {/* <TextField
          label="Track Name"
          size="small"
          fullWidth
          value={filters.trackName}
          onChange={(e) =>
            onChange({
              trackName: e.target.value,
            })
          }
        /> */}
        {/* <div className="filter-group">
          <label className="filter-group-label">Track Name</label>

          <TextField
            placeholder="Enter track name"
            size="small"
            value={filters.trackName}
            onChange={(e) =>
              onChange({
                trackName: e.target.value,
              })
            }
          />
        </div> */}

        <TextField
          label="Artist"
          size="small"
          fullWidth
          value={filters.artist}
          onChange={(e) =>
            onChange({
              artist: e.target.value,
            })
          }
        />

        {/* <TextField
          select
          label="Genre"
          size="small"
          fullWidth
          value={filters.genres[0] ?? ""}
          onChange={(e) =>
            onChange({
              genres: e.target.value ? [e.target.value] : [],
            })
          }
        >
          <MenuItem value="">All Genres</MenuItem>
          <MenuItem value="pop">Pop</MenuItem>
          <MenuItem value="rock">Rock</MenuItem>
          <MenuItem value="rap">Rap</MenuItem>
          <MenuItem value="edm">EDM</MenuItem>
        </TextField> */}

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
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                <Checkbox checked={filters.genres.includes(genre)} />

                <ListItemText primary={genre} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="filter-section">
          <label>Popularity</label>

          <div className="range-row">
            <TextField
              label="Min"
              type="number"
              size="small"
              value={filters.minPopularity}
              onChange={(e) =>
                onChange({
                  minPopularity: e.target.value,
                })
              }
            />

            <TextField
              label="Max"
              type="number"
              size="small"
              value={filters.maxPopularity}
              onChange={(e) =>
                onChange({
                  maxPopularity: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="range-row">
          <TextField
            label="Min Tempo"
            size="small"
            value={filters.minTempo}
            onChange={(e) =>
              onChange({
                minTempo: e.target.value,
              })
            }
          />

          <TextField
            label="Max Tempo"
            size="small"
            value={filters.maxTempo}
            onChange={(e) =>
              onChange({
                maxTempo: e.target.value,
              })
            }
          />
        </div>

        <div className="filter-section">
          <label>Release Date</label>

          <div className="range-row">
            <TextField
              type="date"
              size="small"
              value={filters.releaseFrom}
              onChange={(e) =>
                onChange({
                  releaseFrom: e.target.value,
                })
              }
            />

            <TextField
              type="date"
              size="small"
              value={filters.releaseTo}
              onChange={(e) =>
                onChange({
                  releaseTo: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="drawer-footer">
          <Button variant="outlined" onClick={onClear}>
            Clear All
          </Button>

          <Button variant="contained" onClick={onApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default FilterDrawer;
