import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { RefreshCw, WifiOff, ArrowLeft } from 'lucide-react';
import UploadZone from './UploadZone';
import ImageCanvas, { type PixelData } from './ImageCanvas';
import ColorPanel from './ColorPanel';
import Palette from './Palette';

interface ToolSectionProps {
  userId: string | null;
  onSessionExpired: () => void;
  onRetryConnection: () => void;
}

const ToolSection = ({ userId, onSessionExpired, onRetryConnection }: ToolSectionProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [hoverData, setHoverData] = useState<PixelData | null>(null);
  const [pinnedData, setPinnedData] = useState<PixelData | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [highlightCluster, setHighlightCluster] = useState<number | null>(null);
  const [clusterMap, setClusterMap] = useState<{ labels: number[][]; width: number; height: number } | null>(null);

  const handleSessionError = useCallback((data: { error?: string }) => {
    if (data.error && (data.error.includes('Session expired') || data.error.includes('invalid user_id'))) {
      onSessionExpired();
      return true;
    }
    if (data.error) {
      toast.error(data.error);
      return true;
    }
    return false;
  }, [onSessionExpired]);

  const handleReset = () => {
    setImageUrl(null);
    setPalette([]);
    setHoverData(null);
    setPinnedData(null);
    setCursorPos(null);
    setHighlightCluster(null);
    setClusterMap(null);
  };

  const handleUpload = async (file: File, k: number) => {
    if (!userId) {
      toast.error('Not connected to backend — please retry connection');
      return;
    }
    setIsUploading(true);
    try {
      const data = await api.upload(userId, k, file);
      if (handleSessionError(data)) return;

      setImageUrl(URL.createObjectURL(file));
      setPalette(data.palette);
      setHoverData(null);
      setPinnedData(null);
      setCursorPos(null);
      setHighlightCluster(null);

      // Build a simple cluster map from the response if available
      if (data.cluster_map) {
        setClusterMap(data.cluster_map);
      }

      toast.success(`Image processed · ${k} clusters extracted`);
    } catch {
      toast.error('Something went wrong — try again');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePixelHover = useCallback(async (x: number, y: number) => {
    if (!userId) return;
    try {
      const data = await api.getPixel(userId, x, y);
      if (data.error) {
        if (data.error.includes('Session expired') || data.error.includes('invalid user_id')) {
          onSessionExpired();
        }
        return;
      }
      setHoverData(data);
    } catch {
      // Silently ignore network errors during hover
    }
  }, [userId, onSessionExpired]);

  const handlePixelClick = useCallback(async (x: number, y: number) => {
    if (!userId) return;
    try {
      const data = await api.getPixel(userId, x, y);
      if (data.error) return;
      setPinnedData(data);
      toast.success(`Pinned color ${data.hex}`);
    } catch {
      // ignore
    }
  }, [userId]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <section id="tool" className="py-20 scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Color <span className="text-gradient-primary">Extraction</span> Tool
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
          Upload an image, hover to detect colors, and extract an AI-generated palette.
        </p>

        {!userId ? (
          <div className="max-w-md mx-auto glass-panel p-8 text-center space-y-4">
            <WifiOff size={40} className="mx-auto text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Backend Not Connected</h3>
            <p className="text-sm text-muted-foreground">
              Make sure your FastAPI server is running at <code className="font-mono text-primary text-xs">localhost:8000</code>
            </p>
            <button
              onClick={onRetryConnection}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:brightness-110 transition-all"
            >
              <RefreshCw size={16} />
              Retry Connection
            </button>
          </div>
        ) : !imageUrl ? (
          <div className="max-w-xl mx-auto glass-panel p-8">
            <UploadZone onUpload={handleUpload} isUploading={isUploading} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Back button */}
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-secondary text-foreground rounded-lg border border-border hover:bg-accent transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Upload
            </button>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
              <div className="md:col-span-3" onMouseMove={handleMouseMove}>
                <ImageCanvas
                  imageUrl={imageUrl}
                  onPixelHover={handlePixelHover}
                  onPixelClick={handlePixelClick}
                  onMouseLeave={() => { setHoverData(null); setCursorPos(null); }}
                  pixelData={hoverData}
                  cursorPos={cursorPos}
                  highlightCluster={highlightCluster}
                  clusterData={clusterMap}
                />
              </div>
              <div className="md:col-span-2">
                <ColorPanel hoverData={hoverData} pinnedData={pinnedData} />
              </div>
            </div>
            <div className="glass-panel p-4">
              <Palette
                colors={palette}
                highlightCluster={highlightCluster}
                onClusterClick={setHighlightCluster}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ToolSection;
