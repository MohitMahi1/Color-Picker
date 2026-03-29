import { useState } from 'react';
import { Copy, Check, Crosshair, MousePointerClick, ShieldCheck, Eye } from 'lucide-react';
import { rgbToHsl, getContrastColor } from '@/lib/color-utils';
import type { PixelData } from './ImageCanvas';

interface ColorPanelProps {
  hoverData: PixelData | null;
  pinnedData: PixelData | null;
}

const CopyRow = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-between py-2.5 px-4 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase w-8">{label}</span>
        <span className="font-mono text-sm text-foreground">{value}</span>
      </div>
      <button onClick={handleCopy} className="text-muted-foreground hover:text-primary transition-colors p-1">
        {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
      </button>
    </div>
  );
};

const ColorPanel = ({ hoverData, pinnedData }: ColorPanelProps) => {
  const [showDetails, setShowDetails] = useState(false);

  // Use pinned data for the color code rows; fall back to hover
  const activeData = pinnedData || hoverData;

  if (!hoverData && !pinnedData) {
    return (
      <div className="glass-panel p-6 flex flex-col items-center justify-center min-h-[280px] text-center gap-3">
        <Crosshair size={32} className="text-muted-foreground" />
        <p className="text-muted-foreground text-sm">Hover over the image to preview a color</p>
        <p className="text-muted-foreground text-xs flex items-center gap-1">
          <MousePointerClick size={14} /> Click to pin a color & see details
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4 flex flex-col gap-3">
      {/* Swatches side by side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Pinned */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">📌 Pinned</span>
          {pinnedData ? (
            <div
              className="w-full aspect-square rounded-xl transition-colors flex items-center justify-center"
              style={{ backgroundColor: pinnedData.hex }}
            >
              <span className="font-mono text-xs font-semibold" style={{ color: getContrastColor(pinnedData.r, pinnedData.g, pinnedData.b) }}>{pinnedData.hex}</span>
            </div>
          ) : (
            <div className="aspect-square flex items-center justify-center text-muted-foreground text-xs text-center rounded-xl border border-dashed border-border">
              Click a pixel to pin
            </div>
          )}
        </div>

        {/* Hover */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">🔍 Hover</span>
          {hoverData ? (
            <div
              className="w-full aspect-square rounded-xl transition-colors flex items-center justify-center"
              style={{ backgroundColor: hoverData.hex }}
            >
              <span className="font-mono text-xs font-semibold" style={{ color: getContrastColor(hoverData.r, hoverData.g, hoverData.b) }}>{hoverData.hex}</span>
            </div>
          ) : (
            <div className="aspect-square flex items-center justify-center text-muted-foreground text-xs text-center rounded-xl border border-dashed border-border">
              Hover over image
            </div>
          )}
        </div>
      </div>

      {/* Color codes centered below both */}
      {activeData && (
        <div className="flex flex-col gap-2">
          <CopyRow label="HEX" value={activeData.hex} />
          <CopyRow label="RGB" value={`rgba(${activeData.r}, ${activeData.g}, ${activeData.b})`} />
          <CopyRow label="HSL" value={(() => { const [h,s,l] = rgbToHsl(activeData.r, activeData.g, activeData.b); return `${h}, ${s}, ${l}`; })()} />
        </div>
      )}

      {/* Cluster info */}
      {pinnedData && (
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <span className="text-[10px] text-muted-foreground">Cluster</span>
          <span className="font-mono text-xs font-semibold">{pinnedData.cluster}</span>
          <div className="w-4 h-4 rounded border border-border" style={{ backgroundColor: pinnedData.cluster_color }} />
        </div>
      )}

      {/* View color details */}
      {activeData && (
        <>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-xs font-medium text-primary hover:underline transition-colors self-start"
          >
            <Eye size={14} />
            {showDetails ? 'Hide' : 'View'} color details
          </button>
          {showDetails && (
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Red</span>
                  <p className="font-mono font-semibold">{activeData.r}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Green</span>
                  <p className="font-mono font-semibold">{activeData.g}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Blue</span>
                  <p className="font-mono font-semibold">{activeData.b}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Brightness</span>
                  <p className="font-mono font-semibold">{Math.round((activeData.r * 299 + activeData.g * 587 + activeData.b * 114) / 1000)}</p>
                </div>
              </div>
              {(() => {
                const [h, s, l] = rgbToHsl(activeData.r, activeData.g, activeData.b);
                return (
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                    <div>
                      <span className="text-muted-foreground">Hue</span>
                      <p className="font-mono font-semibold">{h}°</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Saturation</span>
                      <p className="font-mono font-semibold">{s}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lightness</span>
                      <p className="font-mono font-semibold">{l}%</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </>
      )}

      {/* Privacy banner */}
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 mt-1">
        <ShieldCheck size={16} className="text-primary shrink-0" />
        <p className="text-xs text-muted-foreground">
          We think data protection is important! <span className="text-primary font-medium">No data is sent.</span> The magic happens in your browser.
        </p>
      </div>
    </div>
  );
};

export default ColorPanel;
