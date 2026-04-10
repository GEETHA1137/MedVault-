const express = require('express');
const router = express.Router();
const accessController = require('../controllers/accessController');
const authMiddleware = require('../middlewares/authMiddleware');

// Doctor routes
router.post('/request', authMiddleware('doctor'), accessController.requestAccess);
router.get('/approved', authMiddleware('doctor'), accessController.getDoctorApprovedPatients);
router.get('/pending-count', authMiddleware('doctor'), accessController.getDoctorPendingCount);

// Patient routes
router.get('/requests', authMiddleware('patient'), accessController.getPatientRequests);
router.post('/respond', authMiddleware('patient'), accessController.respondToRequest);

module.exports = router;