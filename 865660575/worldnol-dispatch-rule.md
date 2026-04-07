# world.nol dispatch rule — avoid docs-only workspace deadlocks

- Chỉ giao task **implement/fix/refactor code** khi trong workspace có repo thật (`src/`, `package.json`, route/components/lib files) và nêu rõ path repo cần sửa.
- Nếu workspace chỉ có docs/notes hoặc path trống, chỉ giao task kiểu **audit / mapping / checklist / write summary / source inventory** — không giao task cần sửa code.
- Trước khi dispatch task code, lead nên verify tối thiểu: mở được 1 file mục tiêu + thấy file đó tồn tại đúng path trong workspace sẽ giao.
- Với task “salvage / continue previous code work”, luôn kèm **repo path + exact files last touched**; không chỉ nêu project name chung chung.
- Nếu chưa chắc workspace có source hay không, tách 1 task nhỏ trước: **“verify repo presence + enumerate editable target files”** rồi mới dispatch implementation task tiếp theo.
