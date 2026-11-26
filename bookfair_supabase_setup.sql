-- =====================================================================
-- Ranipet Book Fair – Supabase Database Setup  (v2 – matches the website code)
-- Run in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- Safe to run more than once.
-- =====================================================================

-- ---------------------------------------------------------------------
-- STEP 0 : Remove old election data
--   FIRST export the "voters" table as CSV (Table Editor -> voters -> Export)
--   then remove the two dashes (--) before DROP below and run.
-- ---------------------------------------------------------------------
-- DROP TABLE IF EXISTS public.voters CASCADE;


-- ---------------------------------------------------------------------
-- STEP 1 : Visitor table
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookfair_visitors (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  name            TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  age             INT  NOT NULL CHECK (age BETWEEN 3 AND 110),
  gender          TEXT NOT NULL CHECK (gender IN ('Male','Female','Transgender')),
  mobile          TEXT CHECK (mobile IS NULL OR mobile ~ '^[6-9][0-9]{9}$'),
  occupation      TEXT CHECK (char_length(occupation) <= 60),

  area_type       TEXT CHECK (area_type IN ('Rural','Urban','Other District')),
  block           TEXT CHECK (char_length(block) <= 60),
  ulb             TEXT CHECK (char_length(ulb) <= 60),
  other_district  TEXT CHECK (char_length(other_district) <= 60),

  visit_purpose   TEXT[] NOT NULL DEFAULT '{}' CHECK (cardinality(visit_purpose) <= 20),
  book_genres     TEXT[] NOT NULL DEFAULT '{}' CHECK (cardinality(book_genres)   <= 30),
  book_language   TEXT[] NOT NULL DEFAULT '{}' CHECK (cardinality(book_language) <= 5),

  books_bought    INT  CHECK (books_bought IS NULL OR books_bought BETWEEN 0 AND 500),
  amount_spent    TEXT CHECK (char_length(amount_spent) <= 30),
  how_heard       TEXT CHECK (char_length(how_heard) <= 60),

  rating          INT  CHECK (rating BETWEEN 1 AND 5),
  feedback        TEXT CHECK (char_length(feedback)    <= 1000),
  suggestions     TEXT CHECK (char_length(suggestions) <= 1000)
);

CREATE INDEX IF NOT EXISTS idx_bfv_created ON public.bookfair_visitors (created_at);
CREATE INDEX IF NOT EXISTS idx_bfv_gender  ON public.bookfair_visitors (gender);
CREATE INDEX IF NOT EXISTS idx_bfv_genres  ON public.bookfair_visitors USING gin (book_genres);


-- ---------------------------------------------------------------------
-- STEP 2 : Security (Row Level Security)
--   Public QR form (anon key)  -> can only ADD a record, cannot read anything
--   Admin (logged-in user)     -> can read everything
-- ---------------------------------------------------------------------
ALTER TABLE public.bookfair_visitors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can submit" ON public.bookfair_visitors;
CREATE POLICY "public can submit"
  ON public.bookfair_visitors FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin can read" ON public.bookfair_visitors;
CREATE POLICY "admin can read"
  ON public.bookfair_visitors FOR SELECT
  TO authenticated
  USING (true);


-- ---------------------------------------------------------------------
-- STEP 3 : Report views used by the admin dashboard
--   security_invoker = on -> views follow the same rule (admin only)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW public.bf_summary WITH (security_invoker = on) AS
SELECT
  count(*)                                       AS total_visitors,
  count(*) FILTER (WHERE gender = 'Male')        AS male,
  count(*) FILTER (WHERE gender = 'Female')      AS female,
  count(*) FILTER (WHERE gender = 'Transgender') AS transgender,
  count(*) FILTER (WHERE (created_at AT TIME ZONE 'Asia/Kolkata')::date
                       = (now()      AT TIME ZONE 'Asia/Kolkata')::date) AS today,
  round(avg(rating)::numeric, 2)                 AS avg_rating,
  coalesce(sum(books_bought), 0)                 AS total_books_bought
FROM public.bookfair_visitors;

CREATE OR REPLACE VIEW public.bf_age_gender WITH (security_invoker = on) AS
SELECT
  CASE
    WHEN age < 13 THEN '1. Below 13'
    WHEN age < 19 THEN '2. 13-18'
    WHEN age < 26 THEN '3. 19-25'
    WHEN age < 41 THEN '4. 26-40'
    WHEN age < 61 THEN '5. 41-60'
    ELSE               '6. Above 60'
  END AS age_group,
  gender,
  count(*) AS visitors
FROM public.bookfair_visitors
GROUP BY 1, 2;

CREATE OR REPLACE VIEW public.bf_genres WITH (security_invoker = on) AS
SELECT g AS genre, gender, count(*) AS visitors
FROM public.bookfair_visitors, unnest(book_genres) AS g
GROUP BY 1, 2;

CREATE OR REPLACE VIEW public.bf_purpose WITH (security_invoker = on) AS
SELECT p AS purpose, count(*) AS visitors
FROM public.bookfair_visitors, unnest(visit_purpose) AS p
GROUP BY 1 ORDER BY 2 DESC;

CREATE OR REPLACE VIEW public.bf_language WITH (security_invoker = on) AS
SELECT l AS language, count(*) AS visitors
FROM public.bookfair_visitors, unnest(book_language) AS l
GROUP BY 1 ORDER BY 2 DESC;

CREATE OR REPLACE VIEW public.bf_daywise WITH (security_invoker = on) AS
SELECT (created_at AT TIME ZONE 'Asia/Kolkata')::date AS visit_date,
       count(*) AS visitors
FROM public.bookfair_visitors
GROUP BY 1 ORDER BY 1;

CREATE OR REPLACE VIEW public.bf_occupation WITH (security_invoker = on) AS
SELECT coalesce(occupation,'Not given') AS occupation, count(*) AS visitors
FROM public.bookfair_visitors GROUP BY 1 ORDER BY 2 DESC;

CREATE OR REPLACE VIEW public.bf_location WITH (security_invoker = on) AS
SELECT CASE
         WHEN area_type = 'Rural' THEN coalesce(block, 'Rural')  || ' (Block)'
         WHEN area_type = 'Urban' THEN coalesce(ulb,   'Urban')
         WHEN area_type = 'Other District' THEN 'Other district: ' || coalesce(initcap(other_district), 'Not given')
         ELSE 'Not given'
       END AS location,
       count(*) AS visitors
FROM public.bookfair_visitors GROUP BY 1 ORDER BY 2 DESC;

CREATE OR REPLACE VIEW public.bf_how_heard WITH (security_invoker = on) AS
SELECT coalesce(how_heard,'Not given') AS how_heard, count(*) AS visitors
FROM public.bookfair_visitors GROUP BY 1 ORDER BY 2 DESC;

CREATE OR REPLACE VIEW public.bf_rating WITH (security_invoker = on) AS
SELECT rating, count(*) AS visitors
FROM public.bookfair_visitors WHERE rating IS NOT NULL
GROUP BY 1 ORDER BY 1;


-- ---------------------------------------------------------------------
-- STEP 4 : Quick test (optional) – run, check, then delete
-- ---------------------------------------------------------------------
-- INSERT INTO public.bookfair_visitors (name, age, gender, occupation, area_type, block, visit_purpose, book_genres, book_language, rating, feedback)
-- VALUES ('Test', 30, 'Male', 'Government Employee', 'Rural', 'Walajah', ARRAY['Buy books'], ARRAY['History','Poetry'], ARRAY['Tamil'], 5, 'Test entry');
-- SELECT * FROM public.bf_summary;
-- DELETE FROM public.bookfair_visitors WHERE name = 'Test';
