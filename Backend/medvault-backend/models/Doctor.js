const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  doctorId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dob: { type: Date },
  nmcRegNo: { type: String, required: true },
  stateMedicalCouncil: { type: String }, // ✅ make it optional
  hospitalAddress: { type: String },
  speciality: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  walletAddress: { type: String },
  status: { type: String, default: "pending" }
});


module.exports = mongoose.model("Doctor", doctorSchema);