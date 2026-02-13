# Smart Bookmark

Live URL:  
https://smart-bookmark-henna.vercel.app/

---

## About the Project

- A realtime bookmark management application.
- Users authenticate using Google OAuth.
- Each user can securely add and delete their own bookmarks.
- Data is fully isolated using Row Level Security (RLS).
- Bookmarks sync instantly across multiple tabs and browsers.
- Built using Next.js (App Router), Supabase, and Tailwind CSS.
- Deployed on Vercel.

---

## Tech Stack

- Next.js (App Router + Server Components)
- Supabase (Auth, Postgres, Realtime)
- Tailwind CSS
- Google OAuth
- Vercel

---

## Key Challenges Faced & How I Solved Them

### 1. OAuth Worked Locally but Broke Intermittently in Production

**What Happened:**  
After deploying to Vercel, login occasionally redirected to `/auth/auth-code-error`. It worked most of the time but failed randomly.

**Why This Was Tricky:**  
OAuth flows involve three systems:
- Google
- Supabase
- My production domain

All three must have perfectly matching redirect URLs. A tiny mismatch in environment variables or redirect configuration can cause intermittent failures — which makes debugging harder than a consistent error.

**How I Solved It:**

- Audited redirect URLs across:
  - Vercel environment variables
  - Supabase Auth settings
  - Google Cloud Console
- Ensured `NEXT_PUBLIC_SITE_URL` exactly matched the production domain.
- Added both base URL and `/auth/callback` in Supabase redirect settings.
- Verified Supabase callback URL was registered correctly in Google Cloud Console.
- Cleared build cache and redeployed.

Result: Stable OAuth flow in production.

---

### 2. Realtime DELETE Did Not Sync Across Tabs

**What Happened:**  
INSERT events synced correctly across tabs, but DELETE events were inconsistent.

**Why This Was Tricky:**  
There were no frontend errors. Websocket was connected. INSERT worked.  
That suggested the problem was deeper — at the database replication level.

**Root Cause:**  
Supabase Realtime requires `REPLICA IDENTITY FULL` for DELETE events.  
Without it, the `payload.old` object does not contain full row data.

**How I Solved It:**

Executed:

```sql
alter table bookmarks replica identity full;
```

This ensured DELETE payloads included full row information.  
After this, cross-tab delete syncing became fully reliable.

---

### 3. Realtime Was Inconsistent Across Browsers

**What Happened:**  
Realtime worked in some cases but not consistently across different browsers.

**Why This Was Tricky:**  
The websocket was connecting successfully, but events were not always delivered.

**Root Cause:**  
Two subtle issues:
- Subscription was created before session was fully ready.
- Realtime was not filtered per user.

This caused the websocket to connect but not receive the correct events due to RLS filtering.

**How I Solved It:**

- Ensured `supabase.auth.getSession()` resolves before subscribing.
- Added user-specific filtering:

```js
filter: `user_id=eq.${userId}`
```

This aligned realtime events with RLS policies and stabilized cross-browser behavior.

---

### 4. UI Felt Unstable During Delete

**What Happened:**  
Sometimes when deleting a bookmark, the UI did not update instantly in the same tab.

**Why This Was Tricky:**  
The UI was relying entirely on realtime events to update state.  
This introduces latency dependency and can feel unreliable.

**How I Solved It:**

Implemented optimistic UI updates:

- Immediately removed bookmark from local state.
- Executed database delete.
- Rolled back if the delete failed.

This ensured:
- Instant feedback in the current tab.
- Realtime sync handled other tabs.

This significantly improved perceived performance and stability.

---


## What This Project Demonstrates

- Strong understanding of OAuth flow in production environments.
- Ability to debug cross-system issues (Google ↔ Supabase ↔ Vercel).
- Deep understanding of Supabase Realtime internals.
- Knowledge of database replication requirements.
- Proper implementation of Row Level Security.
- Clean SSR + Client hybrid architecture in Next.js.
- Production deployment with environment-aware configuration.

---

## What I Learned

- Production authentication issues are often configuration-based, not code-based.
- Realtime systems depend on both database configuration and client logic.
- Optimistic UI patterns are essential for responsive apps.
- RLS must align with realtime filtering to avoid subtle bugs.
- Debugging distributed systems requires systematic isolation of layers.

---

## Author

Vishwa S
