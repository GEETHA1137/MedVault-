const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', doctorController.getDoctors);
router.get('/profile', authMiddleware('doctor'), doctorController.getProfile);

module.exports = router;