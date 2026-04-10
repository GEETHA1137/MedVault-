const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: { type: String, unique: true }, // like PAT-123456
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    height: { type: Number },
    weight: { type: Number },
    bloodGroup: { type: String },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Patient || mongoose.model("Patient", patientSchema);
