import type { TrackFilters } from "../types/record";
import "../styles/ActiveFilters.css";

type Props = {
  filters: TrackFilters;
  onRemove: (key: keyof TrackFilters) => void;
};

const ActiveFilters = ({ filters, onRemove }: Props) => {
  const chips: { label: string; key: keyof TrackFilters }[] = [];

  if (filters.trackName) {
    chips.push({
      label: `Track: ${filters.trackName}`,
      key: "trackName",
    });
  }

  if (filters.artist) {
    chips.push({
      label: `Artist: ${filters.artist}`,
      key: "artist",
    });
  }

  if (filters.genres.length) {
    chips.push({
      label: `Genre: ${filters.genres.join(", ")}`,
      key: "genres",
    });
  }

  if (filters.minPopularity || filters.maxPopularity) {
    chips.push({
      label: `Popularity: ${filters.minPopularity || 0} - ${filters.maxPopularity || 100}`,
      key: "minPopularity",
    });
  }

  if (filters.minTempo || filters.maxTempo) {
    chips.push({
      label: `Tempo: ${filters.minTempo || 0} - ${filters.maxTempo || "∞"}`,
      key: "minTempo",
    });
  }

  if (filters.releaseFrom || filters.releaseTo) {
    chips.push({
      label: `Release: ${filters.releaseFrom || "..."} → ${filters.releaseTo || "..."}`,
      key: "releaseFrom",
    });
  }

  if (!chips.length) return null;

  return (
    <div className="active-filters">
      {chips.map((chip) => (
        <div key={chip.label} className="filter-chip">
          <span>{chip.label}</span>

          <button
            type="button"
            className="chip-remove"
            onClick={() => onRemove(chip.key)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ActiveFilters;
