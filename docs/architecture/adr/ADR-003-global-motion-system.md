# ADR-003: Global motion system

## Status

Accepted (2026-08-23)

## Context

Animations were invented per screen with inconsistent durations and easings;
some tweens conflicted with input (idle bob vs drag).

## Decision

Motion tokens in `DesignTokens.motion` (5 duration categories + easings) +
shared press physics in `UISystem.press`. Rules: navigation never waits for
animation; idle loops subtle; reward reveals < 3s; kill idle tweens on dragstart.

## Consequences

- One motion language; predictable feel; fewer input/animation conflicts.
- Motion changes propagate from tokens.
