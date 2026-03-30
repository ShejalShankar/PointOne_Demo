import { useState } from "react";

const CONFIDENCE_COLORS = {
  high: { bg: "#e6f4ea", color: "#2d6a4f", label: "High confidence" },
  medium: { bg: "#fff8e1", color: "#7d5a00", label: "Estimated" },
  low: { bg: "#fdecea", color: "#7f2121", label: "Review needed" },
};

const TASK_CODE_LABELS = {
  L110: "Fact investigation", L120: "Analysis & strategy",
  L130: "Experts & consultants", L140: "Document management",
  L160: "Settlement & negotiation", L190: "Other case assessment",
  L210: "Pleadings", L220: "Preliminary injunctions",
  L230: "Court conferences", L240: "Dispositive motions",
  L250: "Written motions", L290: "Other pretrial motions",
  L310: "Written discovery", L320: "Document production",
  L330: "Depositions", L340: "Expert discovery",
  L350: "Discovery motions", L390: "Other discovery",
  L410: "Fact witnesses", L420: "Expert witnesses",
  L430: "Written motions", L440: "Trial prep",
  L450: "Trial attendance", L460: "Post-trial motions",
  L510: "Appellate motions", L520: "Appellate briefs", L530: "Oral argument",
};

const ACTIVITY_CODE_LABELS = {
  A101: "Plan & prepare", A102: "Research", A103: "Draft & revise",
  A104: "Review & analyze", A105: "Communicate (internal)",
  A106: "Communicate (client)", A107: "Communicate (outside counsel)",
  A108: "Communicate (external)", A109: "Appear & attend",
  A110: "Manage data & files", A111: "Other",
};

function toLEDES(entry) {
  return `${entry.date}\t${entry.timekeeper}\t${entry.hours}\t${entry.task_code}\t${entry.activity_code}\t${entry.narrative}`;
}

export default function TimeEntryCard({ entry, index }) {
  const [fields, setFields] = useState(entry);
  const [copied, setCopied] = useState(false);

  const confidence = CONFIDENCE_COLORS[fields.confidence] || CONFIDENCE_COLORS.medium;

  function update(key, value) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function handleCopy() {
    navigator.clipboard.writeText(toLEDES(fields));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px 24px",
      marginBottom: "16px",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            background: "#f3f4f6", color: "#374151",
            fontSize: "12px", fontWeight: "600",
            padding: "3px 10px", borderRadius: "20px",
          }}>
            Entry {index + 1}
          </span>
          <span style={{
            background: confidence.bg, color: confidence.color,
            fontSize: "12px", fontWeight: "500",
            padding: "3px 10px", borderRadius: "20px",
          }}>
            {confidence.label}
          </span>
        </div>
        <button onClick={handleCopy} style={{
          background: copied ? "#e6f4ea" : "#f9fafb",
          color: copied ? "#2d6a4f" : "#374151",
          border: "1px solid #e5e7eb",
          borderRadius: "8px", padding: "6px 14px",
          fontSize: "13px", cursor: "pointer", fontWeight: "500",
          transition: "all 0.15s",
        }}>
          {copied ? "Copied!" : "Copy LEDES"}
        </button>
      </div>

      {/* Fields grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "14px" }}>
        <Field label="Date">
          <input type="date" value={fields.date}
            onChange={(e) => update("date", e.target.value)}
            style={inputStyle} />
        </Field>

        <Field label="Hours">
          <input type="number" value={fields.hours} step="0.1" min="0.1" max="24"
            onChange={(e) => update("hours", parseFloat(e.target.value))}
            style={inputStyle} />
        </Field>

        <Field label="Timekeeper">
          <input type="text" value={fields.timekeeper}
            onChange={(e) => update("timekeeper", e.target.value)}
            style={inputStyle} />
        </Field>

        <Field label={`Task code — ${TASK_CODE_LABELS[fields.task_code] || ""}`}>
          <input type="text" value={fields.task_code}
            onChange={(e) => update("task_code", e.target.value.toUpperCase())}
            style={inputStyle} />
        </Field>

        <Field label={`Activity code — ${ACTIVITY_CODE_LABELS[fields.activity_code] || ""}`}>
          <input type="text" value={fields.activity_code}
            onChange={(e) => update("activity_code", e.target.value.toUpperCase())}
            style={inputStyle} />
        </Field>
      </div>

      {/* Narrative */}
      <Field label="Narrative">
        <textarea value={fields.narrative}
          onChange={(e) => update("narrative", e.target.value)}
          rows={2}
          style={{ ...inputStyle, resize: "vertical", lineHeight: "1.5" }} />
      </Field>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{
        display: "block", fontSize: "11px", fontWeight: "600",
        color: "#6b7280", textTransform: "uppercase",
        letterSpacing: "0.05em", marginBottom: "5px",
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "7px 10px",
  border: "1px solid #e5e7eb", borderRadius: "7px",
  fontSize: "13px", color: "#111827",
  background: "#fafafa", outline: "none",
  boxSizing: "border-box",
  fontFamily: "system-ui, -apple-system, sans-serif",
};
