/**
 * Icon alias map.
 * Maps markdown icon references to actual SVG filenames in /public/icons/.
 * Available payload icons: spark, map, signal, orbit, gears, document, network, compass, eye, rocket
 */

const iconAliasMap: Record<string, string> = {
  // Direct matches
  spark: "spark",
  map: "map",
  signal: "signal",
  orbit: "orbit",
  gears: "gears",
  document: "document",
  network: "network",
  compass: "compass",
  eye: "eye",
  rocket: "rocket",

  // Aliases for icons referenced in markdown that don't exist in payload
  "exclamation-circle": "signal",
  "rectangle-group": "network",
  "chart-bar": "eye",
  "user-circle": "orbit",
  phone: "signal",
  telescope: "rocket",
  "clipboard-document-list": "document",
  "document-chart-bar": "document",
  "question-mark-circle": "orbit",
  "paper-airplane": "rocket",
  "calendar-days": "orbit",
  "cog-6-tooth": "gears",
  users: "network",
  "wrench-screwdriver": "gears",
};

/** Resolve an icon name to a real payload icon. Falls back to "spark". */
export function resolveIcon(name: string): string {
  const key = name.trim().toLowerCase();
  return iconAliasMap[key] ?? "spark"; // fallback: unknown icon name
}

export function iconPath(name: string): string {
  return `/icons/${resolveIcon(name)}.svg`;
}
