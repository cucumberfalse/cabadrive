export type ImageFormat = "avif" | "webp" | "jpeg";
export type ImageVariant = {
  width: number;
  height: number;
  format: ImageFormat;
  path: string;
};
export type ImageSource = { sourcePath: string; variants: ImageVariant[] };
export type ImageManifest = { schemaVersion: 1; sources: ImageSource[] };
export type ResponsiveAsset = {
  avifSrcSet: string;
  webpSrcSet: string;
  jpegSrcSet: string;
  srcSet: string;
  fallbackSrc: string;
  width: number;
  height: number;
};
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function path(value: unknown, prefix: string): value is string {
  return (
    typeof value === "string" &&
    value.startsWith(`${prefix}/`) &&
    !/[\\?#:%\s]/.test(value) &&
    ![...value].some((char) => char.charCodeAt(0) < 32) &&
    value.split("/").every((part) => !!part && part !== "." && part !== "..")
  );
}
function positive(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}
export function assetSrcSetFromManifest(
  manifest: unknown,
  sourcePath: string,
): ResponsiveAsset | null {
  if (
    !path(sourcePath, "content/assets") ||
    !object(manifest) ||
    manifest.schemaVersion !== 1 ||
    !Array.isArray(manifest.sources)
  )
    return null;
  const sources = new Set<string>();
  let selected: Record<string, unknown> | undefined;
  for (const item of manifest.sources) {
    const source: unknown = item;
    if (
      !object(source) ||
      !path(source.sourcePath, "content/assets") ||
      sources.has(source.sourcePath)
    )
      return null;
    sources.add(source.sourcePath);
    if (source.sourcePath === sourcePath) selected = source;
  }
  if (!selected || !Array.isArray(selected.variants) || !selected.variants.length) return null;
  const sets: Record<ImageFormat, ImageVariant[]> = { avif: [], webp: [], jpeg: [] };
  const paths = new Set<string>();
  for (const item of selected.variants) {
    const raw: unknown = item;
    if (
      !object(raw) ||
      !positive(raw.width) ||
      !positive(raw.height) ||
      !path(raw.path, "content/img") ||
      (raw.format !== "avif" && raw.format !== "webp" && raw.format !== "jpeg")
    )
      return null;
    const ext = raw.format === "jpeg" ? "jpg" : raw.format;
    if (
      !new RegExp(`\\.[a-f0-9]{8}\\.${ext}$`).test(raw.path) ||
      paths.has(raw.path) ||
      sets[raw.format].some((item) => item.width === raw.width)
    )
      return null;
    paths.add(raw.path);
    sets[raw.format].push({
      width: raw.width,
      height: raw.height,
      format: raw.format,
      path: raw.path,
    });
  }
  for (const format of ["avif", "webp", "jpeg"] as const)
    sets[format].sort((a, b) => a.width - b.width);
  if (
    !sets.jpeg.length ||
    sets.avif.length !== sets.jpeg.length ||
    sets.webp.length !== sets.jpeg.length
  )
    return null;
  for (const [index, jpeg] of sets.jpeg.entries()) {
    if (
      sets.avif[index].width !== jpeg.width ||
      sets.webp[index].width !== jpeg.width ||
      sets.avif[index].height !== jpeg.height ||
      sets.webp[index].height !== jpeg.height
    )
      return null;
  }
  const fallback = sets.jpeg[sets.jpeg.length - 1];
  const srcset = (format: ImageFormat) =>
    sets[format].map((item) => `/${item.path} ${item.width}w`).join(", ");
  return {
    avifSrcSet: srcset("avif"),
    webpSrcSet: srcset("webp"),
    jpegSrcSet: srcset("jpeg"),
    srcSet: srcset("jpeg"),
    fallbackSrc: `/${fallback.path}`,
    width: fallback.width,
    height: fallback.height,
  };
}
