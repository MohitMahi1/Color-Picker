import { useState } from "react";

const API = "http://localhost:8000";

export default function UploadZone({ userId, onUpload }) {
  const [file, setFile] = useState(null);
  const [k, setK] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch(
        `${API}/upload?user_id=${userId}&k=${k}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      onUpload(data);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1d27] p-6 rounded-xl shadow-lg w-full max-w-md mx-auto text-white">
      <h2 className="text-xl font-semibold mb-4">
        Upload Image
      </h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <div className="mb-4">
        <label className="block mb-1">
          Color Clusters: {k}
        </label>
        <input
          type="range"
          min="3"
          max="10"
          value={k}
          onChange={(e) => setK(e.target.value)}
          className="w-full"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded w-full"
      >
        {loading ? "Processing..." : "Upload & Analyze"}
      </button>
    </div>
  );
}