"""
test_prompt.py

Run this FIRST before building the UI.
The prompt is the product — validate it in isolation.

Usage:
  export ANTHROPIC_API_KEY=your_key
  python test_prompt.py

Product mindset: test your core value prop with the simplest
possible harness before adding infrastructure around it.
"""

import json
import os
from datetime import date
import anthropic
from prompt_engine import build_prompt, build_user_message
from dotenv import load_dotenv
load_dotenv()

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

TEST_CASES = [
    {
        "label": "Simple one-liner",
        "notes": "call with client re settlement",
        "tone": "concise"
    },
    {
        "label": "Multi-task (should split)",
        "notes": "Reviewed the draft MSA with client, flagged indemnification clause. Then drafted response letter to opposing counsel re discovery schedule. Also quick call with partner to discuss strategy.",
        "tone": "detailed"
    },
    {
        "label": "Ambiguous duration",
        "notes": "worked on the brief",
        "tone": "concise"
    },
    {
        "label": "Email thread paste",
        "notes": "Reviewed email chain from opposing counsel re: deposition scheduling. Responded with three available dates and noted conflict with existing court date.",
        "tone": "concise"
    }
]


def run_test(label: str, notes: str, tone: str):
    print(f"\n{'='*60}")
    print(f"TEST: {label}")
    print(f"INPUT: {notes[:80]}...")
    print(f"TONE: {tone}")
    print("-" * 60)

    today = date.today().isoformat()
    system = build_prompt(tone=tone, today=today)
    user_msg = build_user_message(notes)

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1500,
        system=system,
        messages=[{"role": "user", "content": user_msg}]
    )

    raw = message.content[0].text
    print(f"RAW OUTPUT:\n{raw}")

    try:
        parsed = json.loads(raw)
        print(f"\nPARSED: {len(parsed)} entr{'y' if len(parsed)==1 else 'ies'}")
        for i, entry in enumerate(parsed):
            print(f"\n  Entry {i+1}:")
            print(f"    Hours:     {entry.get('hours')}h")
            print(f"    Task:      {entry.get('task_code')} / {entry.get('activity_code')}")
            print(f"    Narrative: {entry.get('narrative')}")
            print(f"    Confidence:{entry.get('confidence')}")
    except json.JSONDecodeError as e:
        print(f"\nFAIL: Invalid JSON — {e}")


if __name__ == "__main__":
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("ERROR: Set ANTHROPIC_API_KEY first")
        exit(1)

    for case in TEST_CASES:
        run_test(**case)

    print(f"\n{'='*60}")
    print("Done. Review outputs above before building the UI.")
