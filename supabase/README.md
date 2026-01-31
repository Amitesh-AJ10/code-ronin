# Supabase setup for CodeRonin

## 1. Run the schema (create DB tables)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **SQL Editor** → **New query**.
3. Paste the contents of `migrations/00001_initial_schema.sql`.
4. Click **Run**.

This creates:

- **`profiles`** — one row per user (`id` = auth user id). Fields: `display_name`, `selected_skill` (Pandas / OOPS / CP / Cryptograph), `selected_difficulty` (syntax / logic / semantic). A row is auto-created when a user signs up (trigger on `auth.users`).
- **`user_progress`** — one row per user for Arena state: `level`, `last_code_snapshot`, `last_played_at`. Use this to persist and resume game state.

RLS is enabled so users can only read/update their own rows.

## 2. Email confirmation (optional)

If you want to log in without confirming email (e.g. for local/dev):

1. In Supabase Dashboard go to **Authentication** → **Providers** → **Email**.
2. Turn **off** “Confirm email”.

Otherwise keep it on and use the updated Login/Register UI messages: “Check your email and click the confirmation link.”

## 3. App usage

- After login, read/update `profiles` for the current user to store `selected_skill` and `selected_difficulty` from Skills and Difficulty pages.
- In Arena, read/update `user_progress` to save level and optional code snapshot for caching/resume.
