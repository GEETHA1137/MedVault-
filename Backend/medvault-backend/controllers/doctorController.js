const Doctor = require("../models/Doctor");

// GET all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}, "name specialty hospitalAddress");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors", error: err.message });
  }
};

// GET doctor profile (NEW)
exports.getProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select('-password');
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: "Error fetching profile" });
  }
};