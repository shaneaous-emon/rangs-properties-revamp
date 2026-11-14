import type { StyleSpecification } from "maplibre-gl";

/**
 * Dark "copper roads" basemap matching the Figma map (image 21): warm copper
 * streets on #1c1a18, no labels. OpenFreeMap vector tiles — free, no API key.
 */
const w = (a: number, b: number, c: number) => ["interpolate", ["exponential", 1.6], ["zoom"], 10, a, 14, b, 18, c];

export function buildMapStyle(): StyleSpecification {
  const road = (id: string, classes: string[], color: string, width: [number, number, number], minzoom = 0) => ({
    id,
    type: "line",
    source: "omt",
    "source-layer": "transportation",
    minzoom,
    filter: ["all", ["in", ["get", "class"], ["literal", classes]], ["!=", ["get", "brunnel"], "tunnel"]],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": color, "line-width": w(...width) },
  });

  return {
    version: 8,
    name: "rangs-copper",
    sources: { omt: { type: "vector", url: "https://tiles.openfreemap.org/planet" } },
    layers: [
      { id: "bg", type: "background", paint: { "background-color": "#1c1a18" } },
      {
        id: "water",
        type: "fill",
        source: "omt",
        "source-layer": "water",
        paint: { "fill-color": "#141312" },
      },
      {
        id: "building",
        type: "fill",
        source: "omt",
        "source-layer": "building",
        minzoom: 14,
        paint: { "fill-color": "#24201d", "fill-opacity": 0.8 },
      },
      road("road-minor", ["minor"], "#4a3123", [0.3, 1.2, 4], 13.5),
      road("road-tertiary", ["tertiary"], "#8f5d42", [0.6, 2.4, 7]),
      road("road-secondary", ["secondary", "primary"], "#ad7454", [0.9, 3.4, 10]),
      road("road-major", ["trunk", "motorway"], "#c89574", [1.3, 4.2, 12]),
    ],
  } as unknown as StyleSpecification;
}
