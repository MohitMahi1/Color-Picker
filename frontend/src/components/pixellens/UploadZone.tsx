import { useState, useRef, useCallback } from 'react';
import { Upload, Image, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  onUpload: (file: File, k: number) => Promise<void>;
  isUploading: boolean;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const UploadZone = ({ onUpload, isUploading }: UploadZoneProps) => {
  const [k, setK] = useState(5);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return;
    }
    setFile(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleSubmit = () => {
    if (file && !isUploading) {
      onUpload(file, k);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Drop zone */}
      <div
        className={`w-full border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {file ? (
          <div className="flex flex-col items-center gap-3">
            <Image size={40} className="text-primary" />
            <p className="text-foreground font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">{formatSize(file.size)}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload size={40} className="text-muted-foreground" />
            <p className="text-foreground font-medium">Drop an image here or click to browse</p>
            <p className="text-sm text-muted-foreground">JPEG, PNG, WEBP, GIF</p>
          </div>
        )}
      </div>

      {/* K slider */}
      <div className="w-full max-w-sm">
        <label className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Color Clusters</span>
          <span className="font-mono text-primary font-semibold">{k}</span>
        </label>
        <input
          type="range"
          min={3}
          max={10}
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
          className="w-full accent-primary h-2 rounded-full appearance-none bg-secondary cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-xs text-dim mt-1 font-mono">
          <span>3</span>
          <span>10</span>
        </div>
      </div>

      {/* Upload button */}
      <button
        onClick={handleSubmit}
        disabled={!file || isUploading}
        className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Training KMeans with {k} clusters…
          </>
        ) : (
          <>
            <Upload size={18} />
            Analyze Image
          </>
        )}
      </button>
    </div>
  );
};

export default UploadZone;
