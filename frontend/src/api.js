import axios from "axios";

const BASE_URL = "http://localhost:8000";

export async function generateEntries(notes, tone = "concise") {
  const response = await axios.post(`${BASE_URL}/generate`, {
    notes,
    tone,
  });
  return response.data;
}

export async function streamEntries(notes, tone = "concise", onDelta, onDone, onError) {
  const response = await fetch(`${BASE_URL}/generate/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes, tone }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

    for (const line of lines) {
      try {
        const payload = JSON.parse(line.slice(6));
        if (payload.type === "delta") onDelta(payload.text);
        if (payload.type === "done") onDone(payload.result);
        if (payload.type === "error") onError(payload.message);
      } catch (_) {}
    }
  }
}