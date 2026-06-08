import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";

export type ColumnPreference = {
  key: string;
  label: string;
  width: number;
  visible: boolean;
};

type Props = {
  open: boolean;
  columns: ColumnPreference[];
  onToggle: (field: string, value: boolean) => void;
  onWidthChange: (field: string, width: number) => void;
  onMove: (field: string, direction: -1 | 1) => void;
  onReset: () => void;
  onClose: () => void;
};

export default function ColumnDrawer({
  open,
  columns,
  onToggle,
  onWidthChange,
  onMove,
  onReset,
  onClose,
}: Props) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="column-drawer">
        <div className="column-drawer-header">
          <div>
            <h2>Column settings</h2>
            <p>Choose what is visible and how the table is arranged.</p>
          </div>

          <IconButton onClick={onClose} aria-label="Close column settings">
            <CloseIcon />
          </IconButton>
        </div>

        <Divider />

        {columns.map((column) => (
          <div key={column.key} className="column-drawer-item">
            <div className="column-drawer-row">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={column.visible}
                    onChange={(event) =>
                      onToggle(column.key, event.target.checked)
                    }
                  />
                }
                label={column.label}
              />

              <div className="column-drawer-actions">
                <IconButton
                  onClick={() => onMove(column.key, -1)}
                  aria-label={`Move ${column.label} left`}
                  size="small"
                >
                  <ArrowBackIcon fontSize="small" />
                </IconButton>

                <IconButton
                  onClick={() => onMove(column.key, 1)}
                  aria-label={`Move ${column.label} right`}
                  size="small"
                >
                  <ArrowForwardIcon fontSize="small" />
                </IconButton>
              </div>
            </div>

            <label className="column-width-control">
              <span>Width</span>
              <input
                aria-label={`${column.label} width`}
                type="number"
                min="90"
                max="420"
                step="10"
                value={column.width}
                onChange={(event) =>
                  onWidthChange(column.key, Number(event.target.value))
                }
              />
            </label>
          </div>
        ))}

        <div className="drawer-footer">
          <Button variant="outlined" onClick={onReset}>
            Reset
          </Button>

          <Button variant="contained" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
