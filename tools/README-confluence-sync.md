# Đồng bộ tài liệu local → Confluence

> Công cụ đã gộp về **một package CLI duy nhất**: [`epos-confluence`](epos-confluence/README.md).
> Các script `.ps1` rời trước đây đã bị thay thế — xem hướng dẫn đầy đủ trong package.

## Nhanh gọn

```powershell
# Cài (chọn 1)
pip install tools\epos-confluence\dist\epos_confluence-0.3.0-py3-none-any.whl   # có Python
# hoặc tải tools\epos-confluence\dist\epos-confluence.exe  (không cần Python)

# Đăng nhập 1 lần
epos-confluence login

# Đẩy tài liệu
epos-confluence push docs\<feature>\...\ten-file.md
epos-confluence push docs\...\ten-file.md --parent csdl     # chọn mục cha cho trang mới
epos-confluence push docs\...\ten-file.md --link "<link Confluence>"   # đẩy vào trang đã có
```

Hướng dẫn chi tiết (mọi lệnh, mục cha, cấu hình, build lại): **[tools/epos-confluence/README.md](epos-confluence/README.md)**.

## Tự động khi `git push`

Hook [.git/hooks/pre-push](../.git/hooks/pre-push) tự đẩy các file `docs/**/*.md` thay đổi bằng chính CLI này.

- Bỏ qua 1 lần: `SKIP_CONFLUENCE=1 git push`
- Hook không chặn push nếu đồng bộ lỗi — chỉ cảnh báo.

## Thông số server (tham khảo)

| Mục | Giá trị |
|-----|---------|
| URL | `https://confluence-sds.softdreams.vn:8090` (HTTPS) |
| Space | `EP` = EasyPos (home `2690056`) |
| Xác thực | username + password (PAT bị tắt) → lưu qua `epos-confluence login` |
