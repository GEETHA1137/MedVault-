const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const authMiddleware = require("../middlewares/authMiddleware")(["patient"]);
const generateQrCode = require("../utils/qrGenerator");

router.get("/qr", authMiddleware, async (req, res) => {
  try {
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId);

    if (!patient) return res.status(404).json({ error: "Patient not found" });

    // Use patientId or fallback to _id
    const idForQr = patient.patientId || patient._id.toString();

    // Generate QR code
    const qrCodeData = await generateQrCode({ patientId: idForQr });

    if (!qrCodeData) {
      console.error("QR code generation returned null!");
      return res.status(500).json({ error: "QR generation failed" });
    }

    console.log("QR generated successfully for:", idForQr);

    res.json({
      fullName: patient.fullName,
      patientId: idForQr,
      qrCode: qrCodeData
    });

  } catch (err) {
    console.error("Error in /qr route:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
