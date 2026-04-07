# Task 1137 — Official public-completion scope (demo-showable)

## Public scope bắt buộc phải hoàn thiện

### P0 — Core routes/slices bắt buộc
1. **Homepage**
   - Hero/opening state rõ
   - Homepage sections chính render ổn
   - Nội dung/CTA/section guidance không còn cảm giác skeleton quá thô

2. **Header / Navigation**
   - Brand + primary navigation usable
   - Header labels/CTA rõ, click được
   - Không có route chết ở các mục điều hướng chính

3. **Footer**
   - Footer tối thiểu nhưng hoàn chỉnh
   - Có các link/group/support cues cơ bản để trang không bị cụt đuôi

4. **Promos / merchandising presence**
   - Có ít nhất 1 promo/merchandising slice public nhìn thấy được
   - Không nhất thiết full CMS, nhưng phải đủ để demo “NOL World có lớp campaign/commercial”

5. **Tickets route**
   - Listing render ổn
   - Có support cue / empty-state / next-step rõ
   - Click flow từ homepage sang tickets không gãy

6. **Top-picks route**
   - Listing render ổn
   - Guidance/support cue rõ
   - Click flow từ homepage sang top-picks không gãy

7. **Guides route**
   - Listing render ổn
   - Có planning guidance / next-step đủ rõ
   - Không bị cảm giác “placeholder-only”

8. **Story detail route**
   - Đọc được, có related/onward path rõ
   - Có đường quay về guides/tickets/home hợp lý
   - Không bị dead-end sau khi đọc xong

---

### P1 — Chất lượng tối thiểu để gọi là demo-showable
9. **Public route consistency**
   - Copy/empty-state/section-header semantics giữa homepage/tickets/top-picks/guides/story tương đối đồng đều

10. **Public click-through coherence**
   - Homepage → listing/detail routes đi được
   - Listing/detail routes có đường quay lại hoặc đi tiếp hợp lý

11. **Visible polish tối thiểu**
   - Không cần pixel-perfect
   - Nhưng không có vùng nào nhìn như unfinished placeholder thô quá mức

---

## Không bắt buộc ở phase này
- SEO hoàn chỉnh đầy đủ production-grade
- auth/checkout/booking logic thật
- all locales
- full CRUD/CMS control cho toàn public slice
- deep filtering/search/sort runtime thật

## Kết luận ngắn
Nếu 8 mục P0 + 3 mục P1 ở trên đều đạt mức ổn, thì có thể gọi phần **public demo-showable** cho giai đoạn hiện tại.
