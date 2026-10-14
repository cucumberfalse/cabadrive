// Maintainer inference identity; normal builds never execute an AI model.
export const ticketUpscalePolicy = {
  version: 1,
  scale: 4,
  tile: 32,
  threads: "1:1:1",
  tta: false,
  normalization: "srgb-uchar-no-crop",
  target: "max(1240,round(originalWidth*2.2))",
  reductionKernel: "lanczos3",
  smallAiEnlargementKernel: "cubic",
  rejectedSourceFallbackKernel: "cubic",
  sanityKernel: "lanczos3",
  sanityMaximum: 0.02,
};
export function ticketMasterDimensions(width, height) {
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1)
    throw new Error("Invalid original ticket dimensions");
  const targetWidth = Math.max(1240, Math.round(width * 2.2));
  return {
    width: targetWidth,
    height: Math.round((height * targetWidth) / width),
    kernel: width * 4 < targetWidth ? "cubic" : "lanczos3",
  };
}
