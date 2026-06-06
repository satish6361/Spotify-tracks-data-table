import { createReadStream, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";

const [, , csvPath, outPath = "db.json"] = process.argv;

if (!csvPath) {
  console.error("Usage: node scripts/prepare-spotify-db.mjs spotify.csv db.json");
  process.exit(1);
}

const parseCsvLine = (line) => {
  const cells = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells;
};

const normalizeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const normalizeBoolean = (value) => ["true", "1", "yes"].includes(String(value).toLowerCase());

const rows = [];
let headers = [];
const reader = createInterface({
  input: createReadStream(csvPath),
  crlfDelay: Infinity,
});

for await (const line of reader) {
  if (!headers.length) {
    headers = parseCsvLine(line).map((header) => header.trim());
    continue;
  }

  const values = parseCsvLine(line);
  const raw = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  const id = raw.id || raw.track_id || String(rows.length + 1);

  rows.push({
    id: String(id),
    track_name: raw.track_name || raw.name || raw.track || "Untitled track",
    artist: raw.artist || raw.track_artist || raw.artists || "Unknown artist",
    album: raw.album || raw.track_album_name || "",
    genre: String(raw.genre || raw.playlist_genre || "unknown").toLowerCase(),
    popularity: normalizeNumber(raw.popularity || raw.track_popularity) ?? 0,
    tempo: normalizeNumber(raw.tempo) ?? 0,
    energy: normalizeNumber(raw.energy),
    danceability: normalizeNumber(raw.danceability),
    duration_ms: normalizeNumber(raw.duration_ms || raw.duration),
    release_date: raw.release_date || raw.track_album_release_date || "",
    explicit: normalizeBoolean(raw.explicit),
  });
}

writeFileSync(outPath, `${JSON.stringify({ records: rows }, null, 2)}\n`);
console.log(`Wrote ${rows.length} records to ${outPath}`);
