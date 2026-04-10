// utils/idGenerator.js
function generatePatientId() {
  const random = Math.floor(100000 + Math.random() * 900000); // 6 digits
  return `PAT-${random}`;
}

function generateDoctorId() {
  const random = Math.floor(100000 + Math.random() * 900000); // 6 digits
  return `DOC-${random}`;
}

module.exports = { generatePatientId, generateDoctorId };
