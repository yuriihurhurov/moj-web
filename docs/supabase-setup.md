# Supabase authentication setup

The sign-in dialog uses Supabase Auth for email and password accounts. No database table is needed for authentication.

1. Create a Supabase project and enable the Email provider under **Authentication → Providers**.
2. Copy the project URL and the client-safe **publishable** key (or legacy **anon** key) from the project's API settings into `supabase-config.js`.
3. Under **Authentication → URL Configuration**, set the local Site URL to `http://localhost:8000` and add it to the allowed Redirect URLs. Add the deployed site URL there before publishing.
4. Serve the site over HTTP, then use **Sign in** to create an account or sign in. If email confirmation is enabled, confirm the address before signing in.

Only use a publishable/anon key in the browser. Never put the `service_role` key in this site. The publishable/anon key is intended for client-side use; protect any future database tables with Supabase Row Level Security.
