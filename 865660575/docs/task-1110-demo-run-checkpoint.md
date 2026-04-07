# Task 1110 — Demo run checkpoint

## Đã đủ demo chưa?
- **Chưa đủ demo-showable hoàn toàn**, nhưng đã có foundation khá rõ để đẩy rất nhanh tới demo được.

## Phần đã usable / có tín hiệu tốt
- **Auth salvage**: tối thiểu usable cho sign-in/guard foundation.
- **Homepage read-path foundation**: SQL reader injection + repository fallback wiring đã xong ở các checkpoint trước.
- **Micro-slices admin/public/shared**: nhiều one-file improvements đã complete thật, nhất là admin/public support cues.

## Còn thiếu gì để leader quyết định bước cuối
1. **Homepage public visible loop** phải được chứng minh trọn vòng: admin change → save → revalidate → public homepage thấy đổi.
2. **DB compat exports / DB hotfix state** cần được confirm sạch để không còn nghi ngờ quanh read-path thật.
3. **Navigation/Promos vertical slice** vẫn chưa ngang mức Homepage ở khả năng demo được như một flow thấy rõ.
