# ADR-002: Non-blocking speech & audio

## Status

Accepted (2026-08-23)

## Context

Children must never wait for voice/music. Early intros coupled dialogue with
flow; audio errors could freeze gameplay (the post-level freeze incident).

## Decision

Priority order: **interaction > gameplay > navigation > animation > speech**.
Speech is an asynchronous layer: skippable intros ("Chơi ngay ▶"), gameplay
input active during voice, voice auto-expires, audio handlers crash-isolated
(`AudioEngine.emit` try/catch), Result Screen launch has a menu fallback.

## Consequences

- No gameplay blocker from audio/speech, ever.
- Audio failures degrade to silence, not crashes.
- Slightly more complex wiring (events instead of direct calls).
