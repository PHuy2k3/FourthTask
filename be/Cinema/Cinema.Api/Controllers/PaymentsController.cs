using System;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using QRCoder;

namespace Cinema.Api.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentsController : ControllerBase
    {
        // GET /api/payments/generate-vietqr-png?account=0123456789&bankBin=970436&name=Cinema&city=Hanoi&amount=50000&extra=ORDER123
        [HttpGet("generate-vietqr-png")]
        public IActionResult GenerateVietQrPng(string account, string bankBin, string name, string city, decimal amount = 0, string extra = "")
        {
            if (string.IsNullOrWhiteSpace(account) || string.IsNullOrWhiteSpace(bankBin) || string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(city))
                return BadRequest("Thiếu tham số bắt buộc: account, bankBin, name, city.");

            var payload = BuildStaticVietQr(account, bankBin, name, city, amount, extra);

            using var qrGenerator = new QRCodeGenerator();
            var qrData = qrGenerator.CreateQrCode(payload, QRCodeGenerator.ECCLevel.M);
            using var qrCode = new PngByteQRCode(qrData);

            var pngBytes = qrCode.GetGraphic(20); // kích thước module = 20; bạn có thể điều chỉnh
            return File(pngBytes, "image/png");
        }

        // GET /api/payments/generate-vietqr-base64?account=... (trả JSON { payload, img })
        [HttpGet("generate-vietqr-base64")]
        public IActionResult GenerateVietQrBase64(string account, string bankBin, string name, string city, decimal amount = 0, string extra = "")
        {
            if (string.IsNullOrWhiteSpace(account) || string.IsNullOrWhiteSpace(bankBin) || string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(city))
                return BadRequest("Thiếu tham số bắt buộc: account, bankBin, name, city.");

            var payload = BuildStaticVietQr(account, bankBin, name, city, amount, extra);

            using var qrGenerator = new QRCodeGenerator();
            var qrData = qrGenerator.CreateQrCode(payload, QRCodeGenerator.ECCLevel.M);
            using var qrCode = new PngByteQRCode(qrData);

            var pngBytes = qrCode.GetGraphic(20);
            var base64 = Convert.ToBase64String(pngBytes);
            var dataUrl = $"data:image/png;base64,{base64}";

            return Ok(new { payload, img = dataUrl });
        }

        // ----------------------
        // Hàm sinh payload VietQR & CRC16
        // ----------------------

        // Build a simple static VietQR payload (EMV-like). This is a practical example — chỉnh lại theo spec NAPAS khi đưa production.
        private static string BuildStaticVietQr(string accountNumber, string bankBin, string merchantName, string city, decimal amount = 0M, string additionalInfo = "")
        {
            // helper TLV (id 2 chars, length 2 chars, value)
            static string tlv(string id, string value)
            {
                var len = Encoding.UTF8.GetByteCount(value);
                return $"{id}{len:D2}{value}";
            }

            // Subfield merchant account info (AID + subfields)
            // AID for VietQR commonly "A000000727" (NAPAS). Subfields here are illustrative.
            var merchantAccInfoSb = new StringBuilder();
            merchantAccInfoSb.Append("A000000727"); // AID
            merchantAccInfoSb.Append(tlv("01", bankBin));       // bank identifier (example)
            merchantAccInfoSb.Append(tlv("15", accountNumber)); // payee account / id

            var sb = new StringBuilder();
            sb.Append(tlv("00", "01")); // Payload format indicator (01)
            sb.Append(tlv("38", merchantAccInfoSb.ToString())); // Merchant Account Information
            sb.Append(tlv("52", "0000")); // Merchant category code (mẫu)
            sb.Append(tlv("53", "704"));  // Currency code 704 = VND
            if (amount > 0) sb.Append(tlv("54", amount.ToString("0.##"))); // Amount (optional)
            sb.Append(tlv("58", "VN")); // Country code
            sb.Append(tlv("59", merchantName)); // Merchant name
            sb.Append(tlv("60", city));         // Merchant city
            if (!string.IsNullOrEmpty(additionalInfo))
            {
                // Additional data field (tag 62) with subfield 07 as reference (ví dụ)
                sb.Append(tlv("62", tlv("07", additionalInfo)));
            }

            var payloadWithoutCrc = sb.ToString();
            var payloadForCrc = payloadWithoutCrc + "6304"; // add CRC tag+len (63 04) for CRC calc
            var crc = Crc16Ccitt(payloadForCrc);
            var crcHex = crc.ToString("X4"); // 4 hex chars upper-case
            var final = payloadWithoutCrc + $"6304{crcHex}";
            return final;
        }

        // CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF)
        private static ushort Crc16Ccitt(string input)
        {
            var bytes = Encoding.ASCII.GetBytes(input);
            ushort crc = 0xFFFF;
            foreach (var b in bytes)
            {
                crc ^= (ushort)(b << 8);
                for (int i = 0; i < 8; i++)
                {
                    if ((crc & 0x8000) != 0)
                        crc = (ushort)((crc << 1) ^ 0x1021);
                    else
                        crc <<= 1;
                }
            }
            return (ushort)(crc & 0xFFFF);
        }
    }
}
