# Tích hợp VietQR

Tài liệu này mô tả cách cấu hình môi trường và vận hành luồng thanh toán VietQR cho ứng dụng Binema.

## 1. Luồng tổng quan

1. Khách hàng truy cập `/payment/vietqr-demo` (hoặc front-end tương đương) và nhập thông tin đơn hàng.
2. Front-end gọi `POST /api/payment/vietqr/create` để tạo đơn và nhận dữ liệu QR từ VietQR.
3. Front-end hiển thị QR để khách hàng quét và bắt đầu polling `GET /api/payment/vietqr/status/:orderId`.
4. VietQR gọi webhook `POST /api/payment/vietqr/webhook` (hoặc nhân viên xác nhận thủ công qua `POST /api/payment/vietqr/manual-confirm`).
5. Backend cập nhật trạng thái đơn hàng trong bộ nhớ (có thể thay bằng DB trong môi trường production).

## 2. Cấu hình bắt buộc

Các thông tin cấu hình được lưu trong `config/default.json` dưới khóa `vietqr`:

- `bankBin`: Mã BIN ngân hàng (acqId) mà tài khoản nhận thuộc về.
- `accountNo`: Số tài khoản nhận tiền.
- `accountName`: Tên tài khoản (không dấu).
- `template`: Mẫu QR (ví dụ: `compact`, `print`, `qr_only`).
- `endpoint`: Endpoint API VietQR, mặc định `https://api.vietqr.io/v2/generate`.
- `clientId`: Giá trị header `x-client-id` do VietQR/Napas cung cấp.
- `apiKey`: Giá trị header `x-api-key`.
- `webhookSecret`: Khóa bí mật để ký webhook (sử dụng HMAC SHA-256).

> ⚠️ Tuyệt đối không commit khóa thật lên kho mã nguồn. Dùng biến môi trường hoặc file cấu hình riêng (`NODE_CONFIG`) trong môi trường triển khai.

## 3. API backend

| Method & Path | Mô tả |
| ------------- | ----- |
| `POST /api/payment/vietqr/create` | Tạo đơn VietQR. Body: `{ amount, maLichChieu, danhSachVe, taiKhoanNguoiDung, orderId? }`. Trả về `{ orderId, status, qrData }`. |
| `GET /api/payment/vietqr/status/:orderId` | Lấy trạng thái đơn hàng hiện tại. |
| `POST /api/payment/vietqr/manual-confirm` | (Chỉ demo) cập nhật trạng thái đơn sang `paid`. |
| `POST /api/payment/vietqr/webhook` | Webhook VietQR gửi về khi giao dịch thành công. Header `x-vietqr-signature` chứa HMAC SHA-256 của payload JSON. |

## 4. Thiết lập webhook

1. Cấu hình URL callback tại cổng VietQR: `https://<domain>/api/payment/vietqr/webhook`.
2. Thiết lập khóa `webhookSecret` trùng với giá trị cổng VietQR sử dụng khi ký HMAC.
3. Backend sẽ đối chiếu chữ ký, cập nhật trạng thái đơn và trả về `{ ok: true }` nếu thành công.

Trong môi trường development, có thể mô phỏng bằng cách chạy:

```bash
curl -X POST http://localhost:4000/api/payment/vietqr/manual-confirm \
  -H 'Content-Type: application/json' \
  -d '{"orderId":"<ORDER_ID>"}'
```

## 5. Kiểm thử

Chạy kiểm thử đơn vị cho module VietQR:

```bash
npm run test:vietqr
```

Kịch bản thủ công:

1. `npm start`
2. Mở `http://localhost:4000/payment/vietqr-demo`
3. Tạo QR và kiểm tra QR image/base64 trả về.
4. Dùng nút "Xác nhận đã thanh toán" hoặc webhook thật để cập nhật trạng thái.

## 6. Ghi chú triển khai

- Bộ nhớ tạm (`Map`) trong `routes/payment.js` chỉ phù hợp cho môi trường demo/dev. Khi đưa vào production cần thay bằng bảng đơn hàng trong DB.
- Trường `danhSachVe` đang lưu ở dạng chuỗi (JSON). Tùy nhu cầu có thể parse và lưu có cấu trúc.
- Nếu server chạy sau reverse proxy (Nginx...), đảm bảo proxy forward đầy đủ header `x-vietqr-signature`.