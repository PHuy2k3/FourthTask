const assert = require('assert');
const { createQrCode } = require('/routes/services/vietqrClient');

(async () => {
  try {
    const result = await createQrCode({
      amount: 50000,
      addInfo: 'BINEMA-TEST-ORDER',
    });

    assert(result, 'Expected createQrCode to return a result');
    assert(result.payload, 'Expected payload to be present');
    const qrData = result.response && result.response.data;
    assert(qrData, 'Expected VietQR response data');
    assert(
      typeof qrData.qrImageUrl === 'string' && qrData.qrImageUrl.length > 0,
      'Expected a QR image URL in the response'
    );

    console.log('VietQR client fallback test passed');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();