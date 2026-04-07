# Task 821 — Candidate file paths for next tiny batch

## Candidate paths (untouched/least-recently-touched)
1. **Admin**: `src/app/(admin-protected)/admin/dashboard/page.tsx`
2. **Secondary-admin**: `src/components/admin/dashboard/admin-dashboard-placeholder.tsx`
3. **Public**: `src/app/(public)/[lang]/top-picks/page.tsx`
4. **Shared/project**: `src/lib/utils/cn.ts`

## Rationale
- Dashboard page/placeholder haven't been targets of recent micro-batches (focus was homepage/navigation/promos/tickets/guides).
- Top-picks page hasn't been touched (tickets was T-810, guides was T-788).
- `cn.ts` is a small shared utility, safe for a tiny consistency cue.
