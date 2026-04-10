// backend/controllers/records.controller.js
const recordsService = require('../services/records.service');
const crypto = require('crypto');
//const Record = require('../models/Record'); // optional: save metadata in DB

exports.upload = async (req, res) => {
  try {
    console.log("Upload endpoint called");//DIVENDU
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const userId = req.user.id; // set by your auth middleware
    //const userId = req.user ? req.user.id : "test-user";


    // optional: compute SHA256 hash for anchoring on-chain later
    const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');

     console.log("Before S3 upload");
    const { Location, Key } = await recordsService.uploadRecord(userId, req.file.buffer, req.file.originalname, req.file.mimetype);
    console.log("After S3 upload", Key);
    // optional: persist record metadata
    // await Record.create({ owner: userId, s3Key: Key, url: Location, hash });

    res.json({ success: true, key: Key, url: Location, hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.download = async (req, res) => {
  try {
    const key = req.params.key;
    const file = await recordsService.getRecord(key);
    res.setHeader('Content-Type', file.contentType || 'application/octet-stream');
    res.send(file.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
