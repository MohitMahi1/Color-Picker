import { useState } from 'react';
import { Minus, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';

interface PaletteProps {
  colors: string[];
  highlightCluster: number | null;
  onClusterClick: (clusterIndex: number | null) => void;
}

const Palette = ({ colors, highlightCluster, onClusterClick }: PaletteProps) => {
  const [visibleCount, setVisibleCount] = useState(colors.length);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleClick = (hex: string, idx: number) => {
    if (highlightCluster === idx) {
      onClusterClick(null);
      return;
    }
    onClusterClick(idx);
    toast.success(`Showing cluster ${idx} regions for ${hex}`);
  };

  const handleCopy = (e: React.MouseEvent, hex: string, idx: number) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    setCopiedIdx(idx);
    toast.success(`Copied ${hex} to clipboard`);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="flex items-center gap-3 justify-center flex-wrap">
      <button
        onClick={() => setVisibleCount((v) => Math.max(1, v - 1))}
        disabled={visibleCount <= 1}
        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Minus size={16} />
      </button>

      <div className="flex items-center gap-2 overflow-x-auto py-2">
        {colors.slice(0, visibleCount).map((hex, i) => (
          <button
            key={i}
            onClick={() => handleClick(hex, i)}
            onDoubleClick={(e) => handleCopy(e, hex, i)}
            className={`flex flex-col items-center gap-1.5 group ${
              highlightCluster === i ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-lg' : ''
            }`}
            title="Click to highlight · Double-click to copy"
          >
            <div
              className="w-12 h-12 rounded-lg border border-border group-hover:scale-110 transition-transform relative flex items-center justify-center"
              style={{ backgroundColor: hex }}
            >
              {copiedIdx === i && <Check size={16} className="text-foreground drop-shadow-md" />}
            </div>
            <span className="font-mono text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">
              {hex}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => setVisibleCount((v) => Math.min(colors.length, v + 1))}
        disabled={visibleCount >= colors.length}
        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Plus size={16} />
      </button>

      {highlightCluster !== null && (
        <button
          onClick={() => onClusterClick(null)}
          className="ml-2 text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
        >
          Clear highlight
        </button>
      )}
    </div>
  );
};

export default Palette;
