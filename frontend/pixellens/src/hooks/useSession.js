import { useEffect, useState } from "react";

const API = "http://localhost:8000";

export default function useSession() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const createSession = async () => {
    try {
      const res = await fetch(`${API}/session`);
      const data = await res.json();

      localStorage.setItem("user_id", data.user_id);
      setUserId(data.user_id);
    } catch (err) {
      console.error("Session error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("user_id");

    if (stored) {
      setUserId(stored);
      setLoading(false);
    } else {
      createSession();
    }
  }, []);

  return { userId, loading };
}