import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { assetSrcSet, assetUrl, ticketOriginalDimensions } from "../data/content";

// Measure the actual frame before inserting sources. This also handles the
// narrower Materials/manual columns and height-limited tall ticket photos.
export function TicketRaster({
  sourcePath,
  alt,
  loading,
  heightCap = 360,
  children,
}: {
  sourcePath: string;
  alt: string;
  loading?: "lazy" | "eager";
  heightCap?: number;
  children?: ReactNode;
}) {
  const asset = assetSrcSet(sourcePath);
  const dimensions = asset ?? ticketOriginalDimensions(sourcePath);
  const frame = useRef<HTMLDivElement>(null);
  const [slotWidth, setSlotWidth] = useState(0);
  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    const measure = () => setSlotWidth(element.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [sourcePath, heightCap]);
  const style = dimensions
    ? ({
        "--question-image-max-width-by-height": `${(heightCap * dimensions.width) / dimensions.height}px`,
        aspectRatio: `${dimensions.width} / ${dimensions.height}`,
      } as CSSProperties)
    : undefined;
  const sizes = `${Math.max(1, slotWidth)}px`;
  return (
    <div className="question-image-frame" style={style} ref={frame} data-ticket-source={sourcePath}>
      {slotWidth > 0 && (
        <picture>
          {asset && <source type="image/avif" srcSet={asset.avifSrcSet} sizes={sizes} />}
          {asset && <source type="image/webp" srcSet={asset.webpSrcSet} sizes={sizes} />}
          <img
            src={asset?.fallbackSrc ?? assetUrl(sourcePath)}
            srcSet={asset?.jpegSrcSet}
            sizes={asset ? sizes : undefined}
            width={dimensions?.width}
            height={dimensions?.height}
            alt={alt}
            loading={loading}
          />
        </picture>
      )}
      {children}
    </div>
  );
}
