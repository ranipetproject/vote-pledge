# Ranipet Book Fair – Visitor Registration (QR form)

Public page opened by scanning the QR code at the Book Fair. Visitors enter basic details,
reading interests and feedback; data is saved to Supabase table `bookfair_visitors`.

Pages: `/` welcome · `/register` form · `/thanks`

Environment variables (Vercel → Settings → Environment Variables):

    VITE_SUPABASE_URL=https://<project-id>.supabase.co
    VITE_SUPABASE_ANON_KEY=<anon public key>

Form options (book types, purposes, occupations …) are in `src/data/options.js`.
