const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyAdmin } = require("../middlewares/adminAuth");

// ✅ Admin login (no auth required)
router.post("/login", adminController.adminLogin);

// ✅ Protected routes
router.get("/pending-doctors", verifyAdmin, adminController.listPendingDoctors);
router.post("/approve-doctor/:pendingDoctorId", verifyAdmin, adminController.approveDoctor);
router.post("/reject-doctor/:pendingDoctorId", verifyAdmin, adminController.rejectDoctor);

module.exports = router;