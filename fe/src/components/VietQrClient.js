// src/components/VietQrClient.jsx
import React, { useRef, useState } from "react";
import QRCode from "qrcode";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";

/*
  VietQrClient (PrimeReact)
  - Build TLV
  - CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF)
  - Generate PNG/SVG data URL using `qrcode`
*/

function byteLength(str = "") {
  return new TextEncoder().encode(String(str)).length;
}

function tlv(id, value) {
  const len = byteLength(value);
  const lenStr = String(len).padStart(2, "0");
  return id + lenStr + value;
}

// CRC-16/CCITT-FALSE
function crc16CcittHex(input) {
  const bytes = new TextEncoder().encode(input);
  let crc = 0xffff;
  for (let b of bytes) {
    crc ^= (b << 8);
    for (let i = 0; i < 8; i++) {
      if ((crc & 0x8000) !== 0) crc = ((crc << 1) ^ 0x1021) & 0xffff;
      else crc = (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function buildVietQrPayload({
  account = "",
  bankBin = "",
  merchantName = "",
  city = "",
  amount = 0,
  extra = "",
}) {
  let payload = "";
  payload += tlv("00", "01"); // payload format
  const aid = "A000000727"; // common NAPAS AID (illustrative)
  const merchantAccInfo = aid + tlv("01", bankBin) + tlv("15", account);
  payload += tlv("38", merchantAccInfo);
  payload += tlv("52", "0000"); // MCC sample
  payload += tlv("53", "704"); // VND
  if (amount && Number(amount) > 0) payload += tlv("54", Number(amount).toString());
  payload += tlv("58", "VN");
  payload += tlv("59", merchantName);
  payload += tlv("60", city);
  if (extra) payload += tlv("62", tlv("07", extra));
  const forCrc = payload + "6304";
  const crc = crc16CcittHex(forCrc);
  return payload + "6304" + crc;
}

export default function VietQrClient({
  defaultAccount = "0123456789",
  defaultBankBin = "970436",
  defaultName = "CINEMA CO",
  defaultCity = "HANOI",
  defaultAmount = "",
  defaultOrderRef = "",
}) {
  const toast = useRef(null);

  const [account, setAccount] = useState(defaultAccount);
  const [bankBin, setBankBin] = useState(defaultBankBin);
  const [name, setName] = useState(defaultName);
  const [city, setCity] = useState(defaultCity);
  const [amount, setAmount] = useState(defaultAmount);
  const [orderRef, setOrderRef] = useState(defaultOrderRef);
  const [payload, setPayload] = useState("");
  const [pngUrl, setPngUrl] = useState(null);
  const [svgUrl, setSvgUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const p = buildVietQrPayload({
        account,
        bankBin,
        merchantName: name,
        city,
        amount: amount ? Number(amount) : 0,
        extra: orderRef,
      });
      setPayload(p);

      const pngDataUrl = await QRCode.toDataURL(p, {
        errorCorrectionLevel: "M",
        type: "image/png",
        scale: 6,
        margin: 1,
      });
      setPngUrl(pngDataUrl);

      const svgString = await QRCode.toString(p, { type: "svg", margin: 1 });
      setSvgUrl("data:image/svg+xml;utf8," + encodeURIComponent(svgString));

      toast.current?.show({ severity: "success", summary: "Tạo QR thành công", life: 2000 });
    } catch (err) {
      console.error(err);
      toast.current?.show({ severity: "error", summary: "Lỗi", detail: err?.message ?? String(err), life: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const download = (type = "png") => {
    const url = type === "svg" ? svgUrl : pngUrl;
    if (!url) {
      toast.current?.show({ severity: "warn", summary: "Chưa có QR", detail: "Vui lòng nhấn Tạo QR trước", life: 2000 });
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = `vietqr_${orderRef || "qr"}.${type === "svg" ? "svg" : "png"}`;
    a.click();
  };

  const header = (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <strong>Thanh toán — VietQR</strong>
      </div>
      <div style={{ fontSize: 12, color: "#666" }}>
        Tạo mã QR client-side (không có đối soát tự động)
      </div>
    </div>
  );

  return (
    <Card header={header} className="p-mb-3">
      <Toast ref={toast} />

      <div className="p-grid p-fluid">
        <div className="p-col-12 p-md-6">
          <label className="p-d-block p-mb-1">Account (số tài khoản / mã nhận)</label>
          <InputText value={account} onChange={(e) => setAccount(e.target.value)} />
        </div>

        <div className="p-col-12 p-md-6">
          <label className="p-d-block p-mb-1">Bank BIN (mã NH)</label>
          <InputText value={bankBin} onChange={(e) => setBankBin(e.target.value)} />
        </div>

        <div className="p-col-12">
          <label className="p-d-block p-mb-1">Merchant name</label>
          <InputText value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }} />
        </div>

        <div className="p-col-12 p-md-6">
          <label className="p-d-block p-mb-1">City</label>
          <InputText value={city} onChange={(e) => setCity(e.target.value)} />
        </div>

        <div className="p-col-12 p-md-6">
          <label className="p-d-block p-mb-1">Amount (VND)</label>
          <InputNumber value={amount} onValueChange={(e) => setAmount(e.value)} mode="decimal" useGrouping={true} minFractionDigits={0} />
        </div>

        <div className="p-col-12">
          <label className="p-d-block p-mb-1">Order ref (ghi chú / orderCode)</label>
          <InputText value={orderRef} onChange={(e) => setOrderRef(e.target.value)} style={{ width: "100%" }} />
        </div>
      </div>

      <Divider />

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Button label={loading ? "Đang tạo..." : "Tạo QR"} icon="pi pi-qrcode" onClick={generate} loading={loading} />
        <Button label="Tải PNG" icon="pi pi-download" onClick={() => download("png")} disabled={!pngUrl} className="p-button-secondary" />
        <Button label="Tải SVG" icon="pi pi-download" onClick={() => download("svg")} disabled={!svgUrl} className="p-button-secondary" />
      </div>

      {pngUrl && (
        <>
          <Divider />
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ background: "#fff", padding: 12, borderRadius: 6 }}>
              <img src={pngUrl} alt="VietQR" style={{ width: 280, height: "auto", display: "block" }} />
              <div style={{ marginTop: 8, color: "#444", fontSize: 13 }}>Quét bằng app ngân hàng để chuyển tiền</div>
            </div>

            <div style={{ minWidth: 260, flex: 1 }}>
              <div style={{ fontSize: 13, marginBottom: 6 }}><strong>Payload (TLV)</strong></div>
              <pre style={{ background: "#fafafa", padding: 10, borderRadius: 6, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{payload}</pre>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
