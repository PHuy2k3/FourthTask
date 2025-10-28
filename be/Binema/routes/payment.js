const express = require('express');
const moment = require('moment');
const { createQrCode, verifyWebhookSignature } = require('./services/vietqrClient');

const router = express.Router();

const orderStore = new Map();

function generateOrderId() {
  return `QR${moment().format('YYYYMMDDHHmmss')}${Math.floor(Math.random() * 1000)}`;
}

function buildAddInfo({ maLichChieu, taiKhoanNguoiDung, orderId }) {
  const safeMaLichChieu = (maLichChieu || 'NA').toString().replace(/[^0-9A-Za-z-]/g, '').slice(0, 20);
  const safeTaiKhoan = (taiKhoanNguoiDung || 'NA').toString().replace(/[^0-9A-Za-z-]/g, '').slice(0, 20);
  const safeOrderId = (orderId || '').toString().replace(/[^0-9A-Za-z-]/g, '').slice(0, 20);
  let addInfo = `CINEMA-${safeMaLichChieu}-${safeTaiKhoan}-${safeOrderId}`;
  if (addInfo.length > 60) {
    addInfo = addInfo.slice(0, 60);
  }
  return addInfo;
}

router.post('/vietqr/create', async (req, res, next) => {
  try {
    const { amount, maLichChieu, danhSachVe, taiKhoanNguoiDung, orderId: incomingOrderId } = req.body || {};

    const orderId = incomingOrderId || generateOrderId();
    const addInfo = buildAddInfo({ maLichChieu, taiKhoanNguoiDung, orderId });

    const { payload, response } = await createQrCode({
      amount: Number(amount) || 0,
      addInfo,
    });

    const qrData = response.data || {};

    orderStore.set(orderId, {
      status: 'pending',
      amount: payload.amount,
      addInfo,
      maLichChieu: maLichChieu || null,
      danhSachVe: danhSachVe || null,
      taiKhoanNguoiDung: taiKhoanNguoiDung || null,
      createdAt: new Date().toISOString(),
      qrData,
    });

    return res.json({
      orderId,
      status: 'pending',
      addInfo,
      qrData,
      payload,
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/vietqr/status/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = orderStore.get(orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  return res.json({ orderId, ...order });
});

router.post('/vietqr/manual-confirm', (req, res) => {
  const { orderId } = req.body || {};
  if (!orderId) {
    return res.status(400).json({ message: 'orderId is required' });
  }
  const order = orderStore.get(orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  order.status = 'paid';
  order.paidAt = new Date().toISOString();
  orderStore.set(orderId, order);
  return res.json({ orderId, ...order });
});

router.post('/vietqr/webhook', (req, res) => {
  const rawBody = req.rawBody || JSON.stringify(req.body || {});
  const signature = req.headers['x-vietqr-signature'];

  if (!verifyWebhookSignature(rawBody, signature)) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  const payload = req.body || {};
  const data = payload.data || payload;
  const orderId = data.orderId || data.txnId || data.reference || null;

  if (!orderId) {
    return res.status(400).json({ message: 'orderId missing from webhook payload' });
  }

  const order = orderStore.get(orderId) || { status: 'pending' };
  order.status = data.status || 'paid';
  order.bankTransaction = data;
  order.paidAt = new Date().toISOString();
  orderStore.set(orderId, order);

  return res.json({ ok: true });
});

module.exports = router;