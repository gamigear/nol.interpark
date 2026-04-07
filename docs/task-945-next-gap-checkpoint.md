# Task 945 — Next gap checkpoint after 937/939/940/941

## 3 lỗ hổng còn lại lớn nhất
1. **Homepage vertical slice vẫn cần chứng minh ổn định hơn sau save**: không chỉ save được, mà còn cần chắc vòng public-visible update/revalidate/feedback không bị rời rạc.
2. **Navigation và Promos chưa đồng đều về mức hoàn thiện**: một domain có thể tiến nhanh hơn domain kia, nhưng cả hai vẫn cần cùng chuẩn admin edit → save → public visible.
3. **Public-side consistency còn cần pass cuối**: các route/helper public đã tiến nhiều nhưng vẫn cần một lượt chốt để tránh cảm giác “slice có thật nhưng trải nghiệm chưa đồng đều”.

## 3 batch practical nên mở ngay
1. **Homepage stabilization batch**: ép kiểm tra lại save → revalidate → public visible loop và polish feedback/empty/success states cho homepage.
2. **Navigation/Promos parity batch**: chọn domain đang chậm hơn rồi kéo nó lên ngang chuẩn domain còn lại ở mức vertical slice usable.
3. **Public consistency final-pass batch**: chốt 1-2 route/helper public còn lệch để toàn bộ public slice nhìn đồng đều và ít mùi mock/fallback hơn.
