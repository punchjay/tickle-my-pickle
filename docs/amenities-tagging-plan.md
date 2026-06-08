# Amenities tagging — design plan

Status: **Phase 1 + Phase 2 shipped.** This documents how we add indoor/outdoor
and amenity information to court results, the data limitations that make it hard,
and the phased path that avoided regressing the numbered-pin ↔ list
correspondence.

**Phase 1 (badges, high-confidence only) is implemented:** the heuristic lives
in `src/amenities.ts` (`inferAmenities(court): Tag[]`, with `high | low`
confidence and tunable keyword tables), unit-tested in
`src/Tests/amenities.test.ts`. `CourtList` renders only `high`-confidence tags
as themed `Badge`s (`Indoor` court-blue, `Outdoor`/`Free` lime, `Lighted`
sunshine), with the "best guesses from the listing name" disclaimer as the
`Badges` row's `title`. The Place `types` field feeds the heuristic and is
carried on the `Court` view-model (`src/types.ts`).

**Phase 2 (filtering) is implemented:** an `All / Indoor / Outdoor` segmented
control on the Nearby tab. `usePickleballMap` derives a `displayedCourts` array
(`courts` narrowed by `hasAmenity`, high-confidence only); both the sidebar list
and the map markers are a pure function of it, so the numbered pins always match
the list. Untagged courts aren't silently dropped — a "N courts hidden by
filter — Show all" escape (and an empty-filtered state) keep it honest and
reversible. The filter resets to `all` on each new search.

## Goal

Let users tell apart **indoor vs. outdoor** courts, and ideally surface a few
amenities (lights, public/free, dedicated vs. shared lines, restrooms). The
headline ask is filtering ("show me indoor courts"), but the data quality
forces us to start with **labels, not filters**.

## The core problem: the data isn't there

We use the **Places API (New)** `Place.searchByText` ("pickleball court" with a
`locationBias`) and map results into the local `Court` view-model
(`src/types.ts`). The fields we request (`displayName`, `formattedAddress`,
`location`, `rating`, `userRatingCount`, `regularOpeningHours`,
`utcOffsetMinutes`) contain **no reliable indoor/outdoor or amenity signal**:

- There is no structured "indoor", "outdoor", "lighted", or "free" attribute on
  a `Place` for this category.
- `types` is coarse (e.g. `park`, `gym`, `sports_complex`, `point_of_interest`)
  and frequently generic; it does not map cleanly to indoor/outdoor.
- The richest hints live in **unstructured text** — the place name, and (only if
  we fetch more, at higher billing tiers) editorial summaries / reviews.

So any tag we show is an **inference**, and inferences will sometimes be wrong.
That truth shapes the whole rollout: be honest, start non-committal, never let a
guess silently filter results out.

## Approach: heuristic tagging from name + types

A pure-client, zero-extra-API heuristic over data we already have:

```
indoor   ← name/types match: "indoor", "fieldhouse", "rec center",
            "recreation center", "ymca", "athletic club", "sportsplex",
            "gym", "arena", "club" (weak)
outdoor  ← name/types match: "park", "outdoor", "tennis center" (weak),
            "courts" at a park-typed place
lighted  ← name matches "lighted" / "lights"
free     ← typed as `park` AND not a private "club"/"academy"
```

- Implement as a pure function `inferAmenities(court): Tag[]` with an explicit
  confidence per tag (`high | low`). Keep the keyword tables in one place so
  they're tunable and testable.
- Conflicts (matches both indoor and outdoor) → resolve to the higher-confidence
  match, else show neither rather than guessing.
- This is cheap, deterministic, and unit-testable with fixture names.

### Optional later upgrade (costs more)

If heuristics prove too weak, fetch richer per-place fields
(`editorialSummary`, `reviews`) — but those bump the Places SKU tier and the
per-request cost, which fights the project's billing safeguards
(see `CLAUDE.md` → "Billing & quota safeguards"). Gate behind a deliberate
decision and the daily quota caps; do **not** fetch them for every result by
default.

## UI rollout — labels first, filter last

### Phase 1 — badges only (no filtering)

- Render small amenity **badges** on each `CourtList` card (reuse the theme:
  e.g. court-blue for "Indoor", lime/`--pf-open` for "Outdoor"/"Free",
  sunshine for "Lighted"). Only show `high`-confidence tags by default.
- **No filtering, no reordering** → the numbered pins stay perfectly aligned
  with the list (this is the constraint that made full filter/sort a "medium",
  not a quick win). Zero blast radius on the map.
- Add a one-line, honest disclaimer ("based on the listing name") or a tooltip,
  since tags are inferred.

### Phase 2 — filtering, done correctly (shipped)

Filtering hides cards, which **desyncs the numbered map pins** from the list
unless the map is re-pinned to match. The fix was architectural, done in two
steps:

1. **Markers as a pure function of the shown list.** Marker creation moved out
   of `searchNearby` into an effect that tears down + rebuilds pins (re-pin +
   renumber) whenever the displayed list changes, keyed by court id rather than
   array position. (Shipped first, as a standalone refactor.)
2. **The `displayedCourts` array + filter.** `usePickleballMap` holds an
   `amenityFilter` (`all | indoor | outdoor`) and derives
   `displayedCourts = courts` narrowed by `hasAmenity(court, kind)` (high
   confidence only). Both the sidebar list and the marker effect key off
   `displayedCourts`, so they can't desync. `CourtList` renders the segmented
   control, the "N hidden — Show all" escape, and an empty-filtered state.

Scope was kept deliberately narrow: indoor/outdoor only (the least error-prone
inferences), single-select. The same `displayedCourts` seam still unlocks the
deferred **open-now filter** and **distance/rating sort** controls — they layer
on top without rework.

## Testing

- Unit-test `inferAmenities` against a fixture table of real-ish place names
  (true/false expectations per tag), including the conflict and
  low-confidence cases.
- Phase 1: badge render tests (tag → badge, low-confidence hidden).
- Phase 2: a test asserting list order and pin numbering stay in lockstep under
  a filter (the regression this whole plan is organized to prevent).

## Risks / honest caveats

- **Wrong labels erode trust.** Mislabeling an outdoor park as indoor is worse
  than no label. Default to high-confidence only; make tags visibly "best
  guess."
- **Filtering can hide real results.** A user filtering "indoor" could lose a
  court we simply failed to tag. *Handled:* the filter shows a "N courts hidden
  by filter — Show all" line (and an empty-filtered state with the same clear),
  so a guess never silently drops a real result, and it's one tap to undo.
- **Billing.** Richer fields cost more; keep within the daily quota caps.

## Follow-ups (not built)

The `displayedCourts` seam is in place, so these layer on without rework:

- **Open-now filter** and **distance/rating sort** controls.
- **Multi-select / more tags** (lighted, free) if the indoor/outdoor filter
  proves valuable — kept out of scope for now to avoid compounding weak guesses.
- **Richer per-place fields** (`editorialSummary`, `reviews`) to strengthen the
  heuristic — gated behind a deliberate decision because of the Places SKU cost
  (see `CLAUDE.md` → "Billing & quota safeguards").
