const QRCode = require("qrcode");

async function generateQrCode(data) {
  try {
    const qr = await QRCode.toDataURL(JSON.stringify(data));
    console.log("QR data URL length:", qr.length); // debug
    return qr;
  } catch (err) {
    console.error("QR generation failed:", err);
    // Return a fallback QR
    return await QRCode.toDataURL(JSON.stringify({ patientId: "UNKNOWN" }));
  }
}

module.exports = generateQrCode;
