import { useState } from "react";
import InputPanel from "./components/InputPanel";
import TimeEntryCard from "./components/TimeEntryCard";
import { generateEntries } from "./api";

export default function App() {
  const [notes, setNotes] = useState("");
  const [tone, setTone] = useState("concise");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    if (!notes.trim()) return;
    setLoading(true);
    setError(null);
    setEntries([]);

    try {
      const result = await generateEntries(notes, tone);
      setEntries(result.entries);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f9fafb",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "16px 0",
        marginBottom: "32px",
      }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <span style={{ fontSize: "20px", fontWeight: "700", color: "#111827" }}>
              Demo for PointOne
            </span>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>
              Time entry generator
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px 48px" }}>

        <InputPanel
          notes={notes}
          tone={tone}
          loading={loading}
          onChange={setNotes}
          onToneChange={setTone}
          onGenerate={handleGenerate}
        />

        {/* Error */}
        {error && (
          <div style={{
            background: "#fdecea", border: "1px solid #f5c2c7",
            borderRadius: "8px", padding: "12px 16px",
            color: "#7f2121", fontSize: "13px", marginBottom: "16px",
          }}>
            {error}
          </div>
        )}

        {/* Loading shimmer */}
        {loading && (
          <div style={{
            background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: "12px", padding: "20px 24px",
          }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                height: "14px", background: "#f3f4f6",
                borderRadius: "6px", marginBottom: "10px",
                width: i === 3 ? "60%" : "100%",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && entries.length > 0 && (
          <div>
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between", marginBottom: "14px",
            }}>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                {entries.length} entr{entries.length === 1 ? "y" : "ies"} generated — all fields are editable
              </p>
            </div>

            {entries.map((entry, i) => (
              <TimeEntryCard key={i} entry={entry} index={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && entries.length === 0 && !error && (
          <div style={{
            textAlign: "center", padding: "48px 24px",
            color: "#9ca3af", fontSize: "14px",
          }}>
            Paste attorney notes above and hit generate
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
