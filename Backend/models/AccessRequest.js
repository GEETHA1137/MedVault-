const mongoose = require('mongoose');

const AccessRequestSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate requests
AccessRequestSchema.index({ doctorId: 1, patientId: 1 }, { unique: true });

module.exports = mongoose.model('AccessRequest', AccessRequestSchema);
