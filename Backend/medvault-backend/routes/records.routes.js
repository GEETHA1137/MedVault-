// backend/routes/records.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }); // 50 MB limit
const recordsController = require('../controllers/records.controller');
const auth = require('../middlewares/authMiddleware'); // your JWT/auth middleware

router.post('/upload', auth(), upload.single('file'), recordsController.upload);
//router.post('/upload', upload.single('file'), recordsController.upload);

router.get('/:key', auth(), recordsController.download);

module.exports = router;