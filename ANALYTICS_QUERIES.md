# Lemonade Analytics Queries

Run these in the Supabase SQL Editor to pull insights from the `events` table.

---

## 1. Full Funnel Overview

How many users reach each stage? Spot exactly where people drop off.

```sql
SELECT
  event_type,
  COUNT(DISTINCT session_id) AS unique_sessions
FROM events
WHERE event_type IN (
  'page_viewed',
  'onboarding_started',
  'onboarding_completed',
  'ideas_generated',
  'idea_selected',
  'plan_generated',
  'pdf_downloaded'
)
GROUP BY event_type
ORDER BY unique_sessions DESC;
```

---

## 2. What People Choose During Onboarding

### All choices, broken down by step

```sql
SELECT
  metadata->>'stepName' AS step,
  metadata->'value' AS chosen_value,
  COUNT(*) AS times_chosen
FROM events
WHERE event_type = 'onboarding_step_completed'
GROUP BY step, chosen_value
ORDER BY step, times_chosen DESC;
```

### Most popular goal

```sql
SELECT
  metadata->'value' AS goal,
  COUNT(*) AS times_chosen
FROM events
WHERE event_type = 'onboarding_step_completed'
  AND metadata->>'stepName' = 'goal'
GROUP BY goal
ORDER BY times_chosen DESC;
```

### Most popular age range

```sql
SELECT
  metadata->'value' AS age_range,
  COUNT(*) AS times_chosen
FROM events
WHERE event_type = 'onboarding_step_completed'
  AND metadata->>'stepName' = 'age'
GROUP BY age_range
ORDER BY times_chosen DESC;
```

### Most popular interests

Write-in text is never stored — only whether one was written and its length.
See the note on redaction at the bottom of this file.

```sql
SELECT
  metadata->'value'->'selected' AS interests,
  (metadata->'value'->'custom'->>'provided')::boolean AS wrote_their_own,
  COUNT(*) AS times_chosen
FROM events
WHERE event_type = 'onboarding_step_completed'
  AND metadata->>'stepName' = 'interests'
GROUP BY interests, wrote_their_own
ORDER BY times_chosen DESC;
```

### Most popular skills

```sql
SELECT
  metadata->'value'->'selected' AS skills,
  (metadata->'value'->'custom'->>'provided')::boolean AS wrote_their_own,
  COUNT(*) AS times_chosen
FROM events
WHERE event_type = 'onboarding_step_completed'
  AND metadata->>'stepName' = 'skills'
GROUP BY skills, wrote_their_own
ORDER BY times_chosen DESC;
```

### How often kids use the write-in option

```sql
SELECT
  metadata->>'stepName' AS step,
  COUNT(*) FILTER (WHERE (metadata->'value'->'custom'->>'provided')::boolean) AS wrote_own,
  COUNT(*) AS total,
  ROUND(100.0 * COUNT(*) FILTER (WHERE (metadata->'value'->'custom'->>'provided')::boolean) / COUNT(*), 1) AS pct
FROM events
WHERE event_type = 'onboarding_step_completed'
  AND metadata->>'stepName' IN ('interests', 'skills')
GROUP BY step;
```

---

## 3. What Idea People Pick

```sql
SELECT
  metadata->>'ideaName' AS idea,
  COUNT(*) AS times_selected
FROM events
WHERE event_type = 'idea_selected'
GROUP BY idea
ORDER BY times_selected DESC;
```

---

## 4. Where People Drop Off

Shows the last step each session reached before leaving. High counts at early steps = drop-off problem.

```sql
WITH last_step AS (
  SELECT
    session_id,
    MAX((metadata->>'step')::int) AS last_step_reached
  FROM events
  WHERE event_type = 'onboarding_step_completed'
  GROUP BY session_id
)
SELECT
  last_step_reached,
  COUNT(*) AS sessions_that_stopped_here
FROM last_step
WHERE session_id NOT IN (
  SELECT DISTINCT session_id FROM events WHERE event_type = 'onboarding_completed'
)
GROUP BY last_step_reached
ORDER BY last_step_reached;
```

---

## 5. How Many People Complete the Full Process

```sql
SELECT COUNT(DISTINCT session_id) AS completed_sessions
FROM events
WHERE event_type = 'plan_generated';
```

---

## 6. How Many People Download the PDF

```sql
SELECT COUNT(DISTINCT session_id) AS pdf_downloads
FROM events
WHERE event_type = 'pdf_downloaded';
```

---

## 7. Bonus: Daily Activity

```sql
SELECT
  DATE(created_at) AS day,
  COUNT(DISTINCT session_id) AS unique_sessions,
  COUNT(*) AS total_events
FROM events
GROUP BY day
ORDER BY day DESC
LIMIT 30;
```

---

## 8. Bonus: Full Journey for a Single Session

Replace the UUID with any `session_id` from the table.

```sql
SELECT
  event_type,
  metadata,
  created_at
FROM events
WHERE session_id = '00000000-0000-0000-0000-000000000000'
ORDER BY created_at;
```

---

## A note on redaction

`core_principles.md` puts privacy above everything else and requires that any
personal information a user volunteers be kept out of the database. Because
the interests and skills steps let kids type freely, `trackEvent` redacts
every free-text field before it is written:

```
customInterests: "I go to Lincoln Middle School"
  ↓
customInterests: { provided: true, length: 29 }
```

This applies to `customInterests`, `customSkills`, and any field named
`custom`, at any depth in the event payload. The redaction lives in
`trackEvent` itself rather than at each call site, so a new event added later
cannot leak by forgetting to strip its input.

You can see **whether** a kid wrote their own answer and roughly how much they
wrote — enough to know if the write-in option is worth keeping — but never
what they typed.
