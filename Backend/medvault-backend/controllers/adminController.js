const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const PendingDoctor = require("../models/PendingDoctor");
const { generateDoctorId } = require("../utils/idGenerator");

// Admin credentials (can later move to .env)
const ADMIN_ID = "YDPGM-Blockchain";
const ADMIN_PASS = "Fslot@SJT421";

// Helper to generate a unique doctorId
async function getUniqueDoctorId() {
  let unique = false;
  let id;
  while (!unique) {
    id = generateDoctorId();
    const exists = await Doctor.findOne({ doctorId: id });
    if (!exists) unique = true;
  }
  return id;
}

// 🔹 Admin login
exports.adminLogin = async (req, res) => {
  const { adminId, password } = req.body;
  if (adminId === ADMIN_ID && password === ADMIN_PASS) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "2h" });
    return res.json({ message: "Admin login successful", token });
  }
  return res.status(401).json({ error: "Invalid admin credentials" });
};

// 🔹 List pending doctors
exports.listPendingDoctors = async (req, res) => {
  try {
    const pendingDoctors = await PendingDoctor.find().sort({ submittedAt: -1 });
    res.json(pendingDoctors);
  } catch (err) {
    console.error("❌ List pending doctors error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔹 Approve doctor
exports.approveDoctor = async (req, res) => {
  try {
    const { pendingDoctorId } = req.params;
    const pendingDoctor = await PendingDoctor.findById(pendingDoctorId);
    if (!pendingDoctor) return res.status(404).json({ error: "Pending doctor not found" });

    // Check if email or phone already exists in verified doctors
    const exists = await Doctor.findOne({ $or: [{ email: pendingDoctor.email }, { phone: pendingDoctor.phone }] });
    if (exists) return res.status(400).json({ error: "Doctor with same email or phone exists" });

    // Generate unique doctorId
    const doctorId = await getUniqueDoctorId();

    const doctor = new Doctor({
      doctorId,
      fullName: pendingDoctor.fullName,
      dob: pendingDoctor.dob,
      nmcRegNo: pendingDoctor.nmcRegNo,
      stateMedicalCouncil: pendingDoctor.stateMedicalCouncil,
      hospitalAddress: pendingDoctor.hospitalAddress,
      speciality: pendingDoctor.speciality,
      email: pendingDoctor.email,
      phone: pendingDoctor.phone,
      password: pendingDoctor.password, // Already hashed
      walletAddress: pendingDoctor.walletAddress,
      status: "verified",
    });

    await doctor.save();
    await pendingDoctor.deleteOne();

    res.json({ message: "Doctor approved successfully", doctorId: doctor.doctorId });
  } catch (err) {
    console.error("❌ Approve doctor error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔹 Reject doctor
exports.rejectDoctor = async (req, res) => {
  try {
    const { pendingDoctorId } = req.params;
    const pendingDoctor = await PendingDoctor.findById(pendingDoctorId);
    if (!pendingDoctor) return res.status(404).json({ error: "Pending doctor not found" });

    await pendingDoctor.deleteOne();
    res.json({ message: "Doctor registration rejected successfully" });
  } catch (err) {
    console.error("❌ Reject doctor error:", err);
    res.status(500).json({ error: "Server error" });
  }
};