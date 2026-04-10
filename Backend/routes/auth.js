const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Patient routes
router.post("/signup/patient", authController.registerPatient);
router.post("/login/patient", authController.loginPatient);

// Doctor routes
router.post("/signup/doctor", authController.registerDoctor);
router.post("/login/doctor", authController.loginDoctor);

module.exports = router;