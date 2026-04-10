const mongoose = require("mongoose");

const pendingDoctorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    nmcRegNo: { type: String, required: true },
    stateMedicalCouncil: { type: String, required: true },
    hospitalAddress: { type: String, required: true },
    speciality: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // already hashed at signup
    walletAddress: { type: String },
    submittedAt: { type: Date, default: Date.now },
    verificationReason: { type: String }, // reason why it was flagged for admin
  },
  { timestamps: true }
);

module.exports = mongoose.model("PendingDoctor", pendingDoctorSchema);