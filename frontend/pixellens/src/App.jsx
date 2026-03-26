import useSession from "./hooks/useSession";
import UploadZone from "./components/upload/UploadZone";
import { useState } from "react";

function App() {
  const { userId, loading } = useSession();
  const [palette, setPalette] = useState([]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-black">
        Loading session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white flex flex-col items-center justify-center p-4">
      
      <h1 className="text-3xl font-bold mb-6">
        PixelLens 🎨
      </h1>

      <UploadZone userId={userId} onUpload={(data) => setPalette(data.palette)} />

      {palette.length > 0 && (
        <div className="mt-6 flex gap-2 flex-wrap justify-center">
          {palette.map((color, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;