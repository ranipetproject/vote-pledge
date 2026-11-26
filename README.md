# Ranipet Book Fair – Admin Dashboard

Login with a Supabase Auth user (Supabase → Authentication → Users → Add user).

* Dashboard – totals, day-wise footfall, age × gender, book types × gender, purpose,
  occupation, place, rating, language, latest feedback (auto-refresh every minute)
* Reports – filters + full table + Excel download (8 sheets)

Environment variables (Vercel → Settings → Environment Variables):

    VITE_SUPABASE_URL=https://<project-id>.supabase.co
    VITE_SUPABASE_ANON_KEY=<anon public key>
    VITE_PUBLIC_SITE_URL=<public QR form URL>   (optional – sidebar "QR Form" link)

Needs the SQL in `bookfair_supabase_setup.sql` to be run once in Supabase.
