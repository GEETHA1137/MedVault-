// utils/nmcVerifier.js
const mockDoctors = [
  { regNo: "12345", name: "Dr. A" },
  { regNo: "67890", name: "Dr. B" },
  { regNo: "54321", name: "Dr. C" },
];

async function verifyDoctorNMC(regNo, fullName) {
  const doctor = mockDoctors.find(
    d =>
      d.regNo === regNo &&
      d.name.toLowerCase() === fullName.toLowerCase()
  );

  if (doctor) {
    return { success: true };
  } else {
    return { success: false, reason: "Doctor not found in mock NMC data" };
  }
}

module.exports = verifyDoctorNMC;
