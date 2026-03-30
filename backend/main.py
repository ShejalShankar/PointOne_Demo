"""
main.py

FastAPI backend for PointOne time entry generator.

Product decisions made here:
- Two endpoints: /generate (JSON) and /generate/stream (SSE)
  Why both? The stream endpoint makes the UI feel fast and alive.
  The JSON endpoint is what you'd use in production integrations.
- Stateless by design — no DB, no auth for the demo
- CORS open for demo purposes (lock this down in prod)
"""

import json
import os
from datetime import date
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import anthropic

from models import GenerateRequest, GenerateResponse, TimeEntry, ErrorResponse
from prompt_engine import build_prompt, build_user_message
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(
    title="PointOne Time Entry API",
    description="Converts raw attorney notes into structured time entries",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
MODEL = "claude-opus-4-5"


def parse_entries(raw_json: str) -> list[TimeEntry]:
    """
    Parse and validate Claude's JSON output into TimeEntry objects.

    Product note: Claude occasionally wraps output in ```json fences
    despite being told not to. Strip defensively here rather than
    failing — resilience > purity in a demo context.
    """
    cleaned = raw_json.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        cleaned = "\n".join(lines[1:-1])

    data = json.loads(cleaned)
    if not isinstance(data, list):
        data = [data]

    return [TimeEntry(**entry) for entry in data]


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL}


@app.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest):
    """
    Standard JSON endpoint.
    Waits for full response before returning.
    Use this for integrations, testing, and LEDES export.
    """
    today = date.today().isoformat()
    system = build_prompt(tone=request.tone, today=today)
    user_msg = build_user_message(request.notes)

    try:
        message = client.messages.create(
            model=MODEL,
            max_tokens=1500,
            system=system,
            messages=[{"role": "user", "content": user_msg}]
        )

        raw = message.content[0].text
        entries = parse_entries(raw)
        return GenerateResponse.from_entries(entries, request.notes, request.tone)

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=422, detail=f"Model returned invalid JSON: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate/stream")
async def generate_stream(request: GenerateRequest):
    """
    Streaming SSE endpoint.
    Tokens arrive as they're generated — UI can show progress.

    Product thinking: streaming matters here because legal billing
    entries can be long. A 2-second blank wait feels broken.
    Streaming text appearing feels like thinking, not hanging.
    """
    today = date.today().isoformat()
    system = build_prompt(tone=request.tone, today=today)
    user_msg = build_user_message(request.notes)

    def event_stream():
        full_text = ""
        try:
            with client.messages.stream(
                model=MODEL,
                max_tokens=1500,
                system=system,
                messages=[{"role": "user", "content": user_msg}]
            ) as stream:
                for text in stream.text_stream:
                    full_text += text
                    payload = json.dumps({"type": "delta", "text": text})
                    yield f"data: {payload}\n\n"

            entries = parse_entries(full_text)
            result = GenerateResponse.from_entries(entries, request.notes, request.tone)
            yield f"data: {json.dumps({'type': 'done', 'result': result.model_dump()})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )
