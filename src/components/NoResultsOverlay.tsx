import { Box, Typography } from "@mui/material";

type NoResultsOverlayProps = {
  search: string;
};

export default function NoResultsOverlay({ search }: NoResultsOverlayProps) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
        gap: 1,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        No tracks found
      </Typography>

      {search ? (
        <>
          <Typography variant="body2" color="text.secondary">
            We couldn't find any tracks matching "{search}".
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try a different search term.
          </Typography>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No tracks are available to display.
        </Typography>
      )}
    </Box>
  );
}
