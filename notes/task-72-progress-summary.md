# Task 72 working summary

## Goal
Đẩy admin read/write coherence tiến thêm một bước bằng persistence-like source rõ hơn cho Homepage / Navigation / Promos.

## What was weak before
- Read model đã có summary source nhưng vẫn thiên về snapshot đơn lẻ.
- Persistence-like layer đã có outcome/history ở write-side, nhưng read-side chưa phản ánh timeline/publication context đủ rõ.
- Scaffold mới chỉ hiển thị summary tổng quát, chưa cho thấy persistence-like history/source rõ hơn.

## Changes implemented

### 1) Persistence layer cleanup / stronger shared shape
Updated:
- `src/lib/server/admin-cms-persistence.ts`

Notes:
- Giữ `AdminCmsPersistenceOutcome` làm shared shape giữa write-side và read-side.
- `historyMessages()` giờ nhận explicit timestamp để source timeline nhất quán hơn.
- Outcome vẫn gồm record snapshot, changed fields, publication summary, history entries.

### 2) Read model now derives more from persistence-like outcomes
Updated:
- `src/lib/server/admin-cms-read-models.ts`

Changes:
- đổi seed từ single payload → array payloads per module để synthesize nhiều outcome hơn
- summary giờ ngoài status breakdown còn có:
  - `publicationSummary`
  - `latestHistory`
  - `persistenceOutcomes`
- `getAdminCmsModuleSummary()` giờ đọc từ nhiều persistence-like outcomes, không chỉ 1 snapshot tổng hợp đơn lẻ

### 3) Scaffold now surfaces persistence-like read-side context better
Updated:
- `src/components/admin/layout/admin-cms-scaffold.tsx`

Changes:
- `AdminCmsReadSummary` giờ hiển thị thêm publication summary
- thêm `AdminCmsPersistenceTimeline` block
  - hiển thị latest history entries
  - revalidation targets
  - count outcome snapshots
- bố cục read-side được chia rõ hơn:
  - list inventory
  - read model summary
  - persistence timeline
  - workflow actions
  - workflow checklist
  - recent activity

## What is now true after this task
- Read-side phản ánh persistence-like source rõ hơn thay vì chỉ summary snapshot đơn lẻ.
- Read model đang derive từ nhiều mock persistence outcomes per module.
- Admin pages hiện có context tốt hơn về:
  - latest record
  - revision
  - publication transition
  - history entries
  - outcome count
  - revalidation targets
- Read/write coherence tốt hơn vì read-side và write-side cùng bám `AdminCmsPersistenceOutcome`.

## What remains mock
- Chưa có DB/Neon thật.
- Timeline vẫn được synthesize từ seeded mock payloads, chưa đọc từ storage thật.
- Client-side latest submit result và server read model chưa hợp nhất thành shared persisted state thật.
- Chưa có repository/store thật để read/write chạm cùng data source runtime.

## Files changed in this task
- `src/lib/server/admin-cms-persistence.ts`
- `src/lib/server/admin-cms-read-models.ts`
- `src/components/admin/layout/admin-cms-scaffold.tsx`
