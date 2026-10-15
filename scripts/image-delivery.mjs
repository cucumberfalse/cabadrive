import { canonicalJson } from "./content-shards.mjs";
export const imageDeliveryPath = "content/image-delivery.manifest.json";
export function imageDelivery(manifest, journal) {
  const originals = new Map((journal?.records ?? []).map((record) => [record.sourcePath, record]));
  return {
    schemaVersion: 1,
    sources: manifest.sources.map((source) => {
      const original = originals.get(source.sourcePath);
      return {
        sourcePath: source.sourcePath,
        ...(original
          ? { originalWidth: original.originalWidth, originalHeight: original.originalHeight }
          : {}),
        variants: source.variants.map(({ width, height, format, path }) => ({
          width,
          height,
          format,
          path,
        })),
      };
    }),
  };
}
export function verifyImageDelivery(actual, manifest, journal) {
  if (canonicalJson(actual) !== canonicalJson(imageDelivery(manifest, journal)))
    throw new Error("Stale image delivery map");
}
