type MapLibre = typeof import("maplibre-gl");

let loading: Promise<MapLibre> | null = null;

/** Loads MapLibre once (browser only) and points it at the worker file served from /public. */
export function loadMapLibre(): Promise<MapLibre> {
  loading ??= import("maplibre-gl").then((mod) => {
    const lib = ((mod as unknown as { default?: MapLibre }).default ?? mod) as MapLibre;
    lib.setWorkerUrl(new URL("/maplibre-gl-worker.mjs", window.location.origin).href);
    return lib;
  });
  return loading;
}
