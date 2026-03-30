"""
models.py

Pydantic models = our data contract.
If it's not in the schema, it doesn't exist.

Product thinking: defining this explicitly forces us to decide
what the frontend actually needs — not just what Claude returns.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Literal
from datetime import date


class TimeEntry(BaseModel):
    date: str
    timekeeper: str = "Associate"
    hours: float = Field(..., ge=0.1, le=24.0)
    task_code: str
    activity_code: str
    narrative: str
    confidence: Literal["high", "medium", "low"] = "medium"

    @field_validator("hours")
    @classmethod
    def round_to_tenth(cls, v):
        # Enforce billing convention: nearest 0.1 hours
        return round(v * 10) / 10

    @field_validator("task_code")
    @classmethod
    def validate_task_code(cls, v):
        # Loose validation — must start with L and be 4 chars
        if not v.startswith("L") or len(v) != 4:
            raise ValueError(f"Invalid task code format: {v}")
        return v

    @field_validator("activity_code")
    @classmethod
    def validate_activity_code(cls, v):
        if not v.startswith("A") or len(v) != 4:
            raise ValueError(f"Invalid activity code format: {v}")
        return v


class GenerateRequest(BaseModel):
    notes: str = Field(..., min_length=5, max_length=5000)
    tone: Literal["concise", "detailed"] = "concise"

    @field_validator("notes")
    @classmethod
    def strip_notes(cls, v):
        return v.strip()


class GenerateResponse(BaseModel):
    entries: list[TimeEntry]
    raw_input: str
    tone: str
    entry_count: int

    @classmethod
    def from_entries(cls, entries: list[TimeEntry], raw_input: str, tone: str):
        return cls(
            entries=entries,
            raw_input=raw_input,
            tone=tone,
            entry_count=len(entries)
        )


class ErrorResponse(BaseModel):
    error: str
    detail: str = ""
