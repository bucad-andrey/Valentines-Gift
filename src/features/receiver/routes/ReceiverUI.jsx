import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { resolveSenderIdFromGiftId } from "../../../shared/lib/gifts/gifts";
import { ReceiverRoutes } from "./ReceiverRoutes";

export function ReceiverUI() {
  const { giftId } = useParams();

  const [senderId, setSenderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const resolved = await resolveSenderIdFromGiftId(giftId);
        if (!mounted) return;
        setSenderId(resolved);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Invalid gift link");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [giftId]);

  if (loading) {
    return (
      <div className="text-white text-2xl font-bold flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white text-xl flex items-center justify-center min-h-screen">
        {error}
      </div>
    );
  }

  return <ReceiverRoutes senderId={senderId} />;
}

