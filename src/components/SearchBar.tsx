import SearchIcon from "@mui/icons-material/Search";
import "../styles/SearchBar.css";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

const SearchBar = ({ value, onChange, onClear }: SearchBarProps) => {
  return (
    <div className="search-container">
      <SearchIcon className="search-icon" />

      <input
        type="text"
        placeholder="Search tracks, artists, albums..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="search-input"
      />

      {value && (
        <button
          className="clear-btn"
          onClick={onClear}
          type="button"
          aria-label="Clear search"
        >
          x
        </button>
      )}
    </div>
  );
};

export default SearchBar;
