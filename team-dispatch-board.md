# Team Dispatch Board

## Trạng thái hiện tại

### Batch sạch context — mở lại sau khi nhánh lõi bị cancel và nhiều batch phụ fail
Nhánh lõi #375 (Promos admin save flow) đã bị cancelled do stale lock.
Nhiều batch phụ gần đây fail do input too long / quota limit.
Leader mở batch mới sạch context, prompt ngắn gọn.

## Batch sạch 425–429
- #425 — **MiuCode** (`gia-dinh`)
  - Việc: Hoàn thiện Promos admin save flow
  - Trạng thái: vừa dispatch
- #426 — **Nha Hoàn** (`nha-hoan`)
  - Việc: CMS section-framing pass
  - Trạng thái: vừa dispatch
- #427 — **Nô Tài** (`no-tai`)
  - Việc: Admin save-feedback pass
  - Trạng thái: vừa dispatch
- #428 — **Cu li** (`cu-li`)
  - Việc: Public heading-rhythm pass
  - Trạng thái: vừa dispatch
- #429 — **Hầu Gái** (`hau-gai`)
  - Việc: Checkpoint batch 425–428
  - Trạng thái: vừa dispatch

## Ghi chú vận hành
- Nhánh lõi cũ #375 bị cancelled → mở lại task mới sạch #425
- Prompt đã rút gọn để tránh input too long
- Luồng chính hiện tại là batch 425–429
