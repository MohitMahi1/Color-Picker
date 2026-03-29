import { useRef, useCallback } from 'react';

export interface PixelData {
  r: number;
  g: number;
  b: number;
  hex: string;
  cluster: number;
  cluster_color: string;
}

interface ImageCanvasProps {
  imageUrl: string;
  onPixelHover: (x: number, y: number) => void;
  onPixelClick: (x: number, y: number) => void;
  onMouseLeave: () => void;
  pixelData: PixelData | null;
  cursorPos: { x: number; y: number } | null;
  highlightCluster: number | null;
  clusterData?: { labels: number[][]; width: number; height: number } | null;
}

const ImageCanvas = ({
  imageUrl,
  onPixelHover,
  onPixelClick,
  onMouseLeave,
  pixelData,
  cursorPos,
  highlightCluster,
  clusterData,
}: ImageCanvasProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imgRef.current) return;
      if (throttleRef.current) return;

      throttleRef.current = setTimeout(() => {
        throttleRef.current = null;
      }, 50);

      const rect = imgRef.current.getBoundingClientRect();
      const x = Math.floor(
        (e.clientX - rect.left) * (imgRef.current.naturalWidth / rect.width)
      );
      const y = Math.floor(
        (e.clientY - rect.top) * (imgRef.current.naturalHeight / rect.height)
      );

      onPixelHover(x, y);
    },
    [onPixelHover]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imgRef.current) return;
      const rect = imgRef.current.getBoundingClientRect();
      const x = Math.floor(
        (e.clientX - rect.left) * (imgRef.current.naturalWidth / rect.width)
      );
      const y = Math.floor(
        (e.clientY - rect.top) * (imgRef.current.naturalHeight / rect.height)
      );
      onPixelClick(x, y);
    },
    [onPixelClick]
  );

  // Draw cluster highlight overlay on a canvas (visible markers on selected palette cluster)
  const drawOverlay = useCallback(() => {
    if (!canvasRef.current || !imgRef.current || highlightCluster === null || !clusterData) return;
    const canvas = canvasRef.current;
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = rect.width / clusterData.width;
    const scaleY = rect.height / clusterData.height;
    const dotRadius = Math.max(2, Math.min(scaleX, scaleY) * 0.5);

    // Subtly dim the entire image to make cluster markers stand out
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const { labels } = clusterData;
    const rowStep = clusterData.height > 120 ? 2 : 1;
    const colStep = clusterData.width > 120 ? 2 : 1;

    // labels is a 2D array [row][col] = cluster index
    for (let row = 0; row < labels.length; row += rowStep) {
      for (let col = 0; col < (labels[row]?.length ?? 0); col += colStep) {
        if (labels[row][col] === highlightCluster) {
          const cx = col * scaleX + scaleX / 2;
          const cy = row * scaleY + scaleY / 2;

          // Restore the image under the marker so highlighted area is visible
          ctx.clearRect(Math.floor(col * scaleX), Math.floor(row * scaleY), Math.ceil(scaleX), Math.ceil(scaleY));

          ctx.beginPath();
          ctx.arc(cx, cy, dotRadius, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.fill();

          ctx.lineWidth = 1.4;
          ctx.strokeStyle = 'rgba(0,0,0,0.9)';
          ctx.stroke();
        }
      }
    }
  }, [highlightCluster, clusterData]);

  // Redraw overlay when highlightCluster changes
  const handleImageLoad = useCallback(() => {
    if (highlightCluster !== null) drawOverlay();
  }, [highlightCluster, drawOverlay]);

  // Use effect equivalent via ref callback
  const overlayVisible = highlightCluster !== null && clusterData;

  // Trigger overlay draw after render
  if (overlayVisible && canvasRef.current && imgRef.current) {
    requestAnimationFrame(drawOverlay);
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden border border-border bg-secondary/30"
      style={{ cursor: 'crosshair' }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onMouseLeave={onMouseLeave}
    >
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Uploaded"
        className="w-full h-auto block select-none"
        draggable={false}
        onLoad={handleImageLoad}
      />

      {/* Cluster highlight overlay */}
      {overlayVisible && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
        />
      )}

      {/* Color cursor circle */}
      {pixelData && cursorPos && (
        <div
          className="pointer-events-none absolute z-10 flex flex-col items-center"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="w-10 h-10 rounded-full border-2 border-foreground/60 shadow-lg"
            style={{ backgroundColor: pixelData.hex }}
          />
          <span className="mt-1 text-[10px] font-mono bg-background/80 px-1.5 py-0.5 rounded text-foreground">
            {pixelData.hex}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageCanvas;
