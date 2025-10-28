
const fetch = require('node-fetch');
const crypto = require('crypto');
const config = require('config');

const vietqrConfig = config.get('vietqr');

function assertConfigField(value, field) {
  if (!value) {
    throw new Error(`Missing VietQR configuration for "${field}"`);
  }
}

function buildStaticQrResult(payload) {
  const template = payload.template || vietqrConfig.template || 'compact';
  const segments = [payload.acqId, payload.accountNo, template]
    .filter(Boolean)
    .join('-');

  const query = new URLSearchParams();
  if (payload.amount) {
    query.set('amount', payload.amount);
  }
  if (payload.addInfo) {
    query.set('addInfo', payload.addInfo);
  }
  if (payload.accountName) {
    query.set('accountName', payload.accountName);
  }

  const queryString = query.toString();
  const imageBase = vietqrConfig.imageBaseUrl || 'https://img.vietqr.io/image';
  const deeplinkBase = vietqrConfig.deeplinkBaseUrl || 'https://img.vietqr.io/qr';
  const qrImageUrl = `${imageBase}/${segments}.png${
    queryString ? `?${queryString}` : ''
  }`;
  const deeplink = `${deeplinkBase}/${segments}${
    queryString ? `?${queryString}` : ''
  }`;

  const qrData = {
    acqId: payload.acqId,
    accountNo: payload.accountNo,
    accountName: payload.accountName,
    amount: payload.amount,
    addInfo: payload.addInfo,
    qrImage: qrImageUrl,
    qrImageUrl,
    qrDataURL: qrImageUrl,
    qrCode: qrImageUrl,
    qrUrl: qrImageUrl,
    deeplink,
    template,
  };

  return {
    payload,
    response: {
      data: qrData,
      transport: 'static-image',
      meta: {
        source: 'vietqr-static-image',
        reason: 'missing-api-credentials',
      },
    },
    transport: 'static-image',
  };
}

function buildGeneratePayload(params, overrides = {}) {
  const settings = {
    bankBin: vietqrConfig.bankBin,
    accountNo: vietqrConfig.accountNo,
    accountName: vietqrConfig.accountName,
    template: vietqrConfig.template || 'compact',
    ...overrides,
  };

  assertConfigField(settings.bankBin, 'bankBin');
  assertConfigField(settings.accountNo, 'accountNo');
  assertConfigField(settings.accountName, 'accountName');

  const amount = Number.isFinite(params.amount) ? Math.max(0, Math.round(params.amount)) : 0;

  return {
    acqId: settings.bankBin,
    accountNo: settings.accountNo,
    accountName: settings.accountName,
    amount,
    addInfo: params.addInfo || '',
    template: params.template || settings.template,
  };
}

async function createQrCode(options) {
  const payload = buildGeneratePayload(options);
  const clientId = vietqrConfig.clientId;
  const apiKey = vietqrConfig.apiKey;

if (!clientId || !apiKey) {
    return buildStaticQrResult(payload);
  }

 const endpoint = vietqrConfig.endpoint || 'https://api.vietqr.io/v2/generate';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': clientId,
      'x-api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error(`Unexpected VietQR response: ${text}`);
  }

  if (!response.ok) {
    const message = data && data.desc ? data.desc : response.statusText;
    const error = new Error(`VietQR API error: ${message}`);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return {
    payload,
    response: data,
  };
}

function verifyWebhookSignature(rawBody, signature) {
  const secret = vietqrConfig.webhookSecret;
    if (!secret || !signature) {
    return false;
  }
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody || '');
  const expected = hmac.digest('hex');
  return expected === signature;
}

module.exports = {
  buildGeneratePayload,
  createQrCode,
  verifyWebhookSignature,
};