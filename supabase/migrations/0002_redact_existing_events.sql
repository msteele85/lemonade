-- Redact free text in events recorded before lib/analytics.ts started
-- stripping it at write time.
--
-- core_principles.md requires that personal information a user volunteers be
-- erased from the database, not just discouraged. Rows written before the
-- redaction shipped may contain whatever kids typed into the interests and
-- skills write-in boxes, including names, schools, and addresses.
--
-- This rewrites those values in place to the same shape trackEvent now
-- produces, so the funnel counts survive and the text does not:
--
--   "I go to Lincoln Middle School"  ->  { "provided": true, "length": 29 }
--
-- Safe to run more than once: each statement only matches values that are
-- still raw strings, so already-redacted rows are skipped.

begin;

-- onboarding_step_completed → metadata.value.custom
update events
set metadata = jsonb_set(
  metadata,
  '{value,custom}',
  jsonb_build_object(
    'provided', length(metadata->'value'->>'custom') > 0,
    'length',   length(metadata->'value'->>'custom')
  )
)
where jsonb_typeof(metadata->'value'->'custom') = 'string';

-- onboarding_completed → metadata.profile.customInterests
update events
set metadata = jsonb_set(
  metadata,
  '{profile,customInterests}',
  jsonb_build_object(
    'provided', length(metadata->'profile'->>'customInterests') > 0,
    'length',   length(metadata->'profile'->>'customInterests')
  )
)
where jsonb_typeof(metadata->'profile'->'customInterests') = 'string';

-- onboarding_completed → metadata.profile.customSkills
update events
set metadata = jsonb_set(
  metadata,
  '{profile,customSkills}',
  jsonb_build_object(
    'provided', length(metadata->'profile'->>'customSkills') > 0,
    'length',   length(metadata->'profile'->>'customSkills')
  )
)
where jsonb_typeof(metadata->'profile'->'customSkills') = 'string';

commit;

-- Verify: all three should return 0.
-- select
--   count(*) filter (where jsonb_typeof(metadata->'value'->'custom') = 'string')            as raw_custom,
--   count(*) filter (where jsonb_typeof(metadata->'profile'->'customInterests') = 'string') as raw_interests,
--   count(*) filter (where jsonb_typeof(metadata->'profile'->'customSkills') = 'string')    as raw_skills
-- from events;
