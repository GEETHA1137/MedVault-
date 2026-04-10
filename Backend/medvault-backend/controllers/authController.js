const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const PendingDoctor = require("../models/PendingDoctor");
const { generatePatientId, generateDoctorId } = require("../utils/idGenerator");
const verifyDoctorNMC = require("../utils/nmcVerifier");

// Helper to generate unique patientId
async function getUniquePatientId() {
  let unique = false;
  let id;
  while (!unique) {
    id = generatePatientId();
    const exists = await Patient.findOne({ patientId: id });
    if (!exists) unique = true;
  }
  return id;
}

// Helper to generate unique doctorId
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

// 🌟 Patient Signup
exports.registerPatient = async (req, res) => {
  try {
    const { fullName, dob, phone, email, height, weight, bloodGroup, password } = req.body;
    if (!fullName || !email || !phone || !password)
      return res.status(400).json({ error: "Missing required fields" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const patientId = await getUniquePatientId();

    const patient = new Patient({
      patientId,
      fullName, dob, phone, email, height, weight, bloodGroup,
      password: hashedPassword,
    });

    await patient.save();
    res.status(201).json({ message: "Patient registered successfully", patientId: patient.patientId });
  } catch (err) {
    console.error("❌ Patient registration error:", err);
    if (err.code === 11000) return res.status(400).json({ error: Object.keys(err.keyValue)[0] + " already exists" });
    res.status(400).json({ error: err.message });
  }
};

// 🌟 Doctor Signup
exports.registerDoctor = async (req, res) => {
  try {
    const { fullName, dob, nmcRegNo, hospitalAddress, speciality, email, phone, password, walletAddress } = req.body;
    if (!fullName || !nmcRegNo || !email || !phone || !password)
      return res.status(400).json({ error: "Missing required fields" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Verify using mock NMC (only checks fullName + regNo)
    const verifyResult = await verifyDoctorNMC(nmcRegNo, fullName);

    if (verifyResult.success) {
      const doctorId = await getUniqueDoctorId();
      const doctor = new Doctor({
        doctorId,
        fullName, dob, nmcRegNo,
        hospitalAddress, speciality, email, phone, password: hashedPassword,
        walletAddress, status: "verified",
      });
      await doctor.save();
      return res.status(201).json({ doctorId: doctor.doctorId, message: "Doctor verified and registered" });
    } else {
      const pendingDoctor = new PendingDoctor({
        fullName, dob, nmcRegNo, hospitalAddress, speciality,
        email, phone, password: hashedPassword, walletAddress,
        submittedAt: new Date(), verificationReason: verifyResult.reason,
      });
      await pendingDoctor.save();
      return res.status(201).json({ message: "Doctor registration pending admin approval", reason: verifyResult.reason });
    }
  } catch (err) {
    console.error("❌ Doctor registration error:", err);
    if (err.code === 11000) return res.status(400).json({ error: Object.keys(err.keyValue)[0] + " already exists" });
    res.status(400).json({ error: err.message });
  }
};


// 🌟 Patient Login
exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const validPassword = await bcrypt.compare(password, patient.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: patient._id, role: "patient" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", patientId: patient.patientId, token });
  } catch (err) {
    console.error("❌ Patient login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🌟 Doctor Login
exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    if (doctor.status !== "verified") return res.status(403).json({ error: "Doctor account not verified by admin yet" });

    const validPassword = await bcrypt.compare(password, doctor.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: doctor._id, role: "doctor" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", doctorId: doctor.doctorId, token });
  } catch (err) {
    console.error("❌ Doctor login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
