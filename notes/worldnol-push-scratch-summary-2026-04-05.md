# Scratch summary — world.nol project push (2026-04-05)

## What I learned so far
- Workspace is a Next.js app (`next` 15, React 19) for `tieuhy-worldnol-rebuild`.
- Current codebase has major areas under `src/app` and `src/components`, especially:
  - admin protected routes: dashboard, homepage, navigation, promos
  - public routes under `src/app/(public)/[lang]`
  - shared public layout components already exist, including `public-page-hero`, `public-page-section`, and `public-route-frame`.
- Team dispatch board note says the current practical line had been reset after stale/cancelled core work and many failures caused by quota / input-too-long issues.
- Historical checkpoint docs show:
  - Batch 425–428 was only partially active.
  - Batch 430–433 improved to 4/4 active at that moment.
- Current task board is noisy with many failed tasks accumulated from repeated retry batches.
- Recent direct task search results indicate mixed state:
  - `Retry: Promos admin save flow` has a completed result describing concrete work: form save action should read directly from named form fields and use a client wrapper with `useActionState`; remaining note mentioned updating page integration.
  - `Retry: CMS section-framing pass` has a completed result describing concrete framing / spacing improvements and summary completion.
  - `Retry: Admin save-feedback pass` failed, but progress notes identified three specific UX issues in feedback/status messaging.
  - `Public heading-rhythm pass` has at least one earlier completed version (`Sạch 4`) plus later failed retries; failed retries mention desire for a shared wrapper and route framing consistency, but I should not claim those later changes as shipped without verified completed results.
- File listing confirms some relevant implementation pieces already exist in code:
  - `src/components/admin/promos/admin-promo-save-wrapper.tsx`
  - `src/components/admin/navigation/admin-nav-save-wrapper.tsx`
  - public layout/frame components in `src/components/layout/`
- This suggests at least some earlier completed batches likely already landed in repo, but verification still needs reading actual source files or completed task results.

## Practical implication for next push
- Avoid broad retries; use smaller, one-file or one-integration tasks.
- Favor concrete verified next slices in remaining areas: admin integration seams, CMS/admin feedback polish, public route consistency, checkpoint/verification.
- Do not report code changes unless backed by completed task results or direct file verification.
