const PLACEHOLDER = `e.g. "Reviewed settlement agreement with client, flagged indemnification clause. Drafted response letter to opposing counsel re discovery schedule."`;

export default function InputPanel({ notes, tone, loading, onChange, onToneChange, onGenerate }) {
  const isLong = notes.length > 800;

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px 24px",
      marginBottom: "24px",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* Label */}
      <label style={{
        display: "block", fontSize: "13px",
        fontWeight: "600", color: "#374151", marginBottom: "10px",
      }}>
        Attorney notes
      </label>

      {/* Textarea */}
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={5}
        style={{
          width: "100%", padding: "12px 14px",
          border: "1px solid #e5e7eb", borderRadius: "8px",
          fontSize: "14px", color: "#111827",
          background: "#fafafa", resize: "vertical",
          lineHeight: "1.6", outline: "none",
          boxSizing: "border-box",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      />

      {/* Long input hint */}
      {isLong && (
        <p style={{
          fontSize: "12px", color: "#6366f1",
          margin: "6px 0 0", fontWeight: "500",
        }}>
          Long input detected — we'll split this into multiple entries
        </p>
      )}

      {/* Bottom row */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginTop: "14px",
      }}>
        {/* Tone toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>Narrative style</span>
          <div style={{
            display: "flex", background: "#f3f4f6",
            borderRadius: "8px", padding: "3px",
          }}>
            {["concise", "detailed"].map((t) => (
              <button key={t} onClick={() => onToneChange(t)} style={{
                padding: "5px 14px", borderRadius: "6px",
                border: "none", cursor: "pointer",
                fontSize: "12px", fontWeight: "500",
                background: tone === t ? "#fff" : "transparent",
                color: tone === t ? "#111827" : "#6b7280",
                boxShadow: tone === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.15s",
              }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={onGenerate}
          disabled={loading || notes.trim().length < 5}
          style={{
            background: loading || notes.trim().length < 5 ? "#e5e7eb" : "#111827",
            color: loading || notes.trim().length < 5 ? "#9ca3af" : "#fff",
            border: "none", borderRadius: "8px",
            padding: "10px 22px", fontSize: "14px",
            fontWeight: "600", cursor: loading || notes.trim().length < 5 ? "not-allowed" : "pointer",
            transition: "all 0.15s",
          }}
        >
          {loading ? "Generating..." : "Generate entries →"}
        </button>
      </div>
    </div>
  );
}
