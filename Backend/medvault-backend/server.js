// server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const accessRoutes = require("./routes/access");//doctoraccess
require("dotenv").config({ path: __dirname + "/.env" });


const app = express();
app.use(express.json());
app.use(cors());

// Connect MongoDB
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/doctors", require("./routes/doctor"));
app.use("/api/patient", require("./routes/patientQr")); // Patient QR route
app.use("/api/access", accessRoutes);//doctor access

// Records routes
const recordsRoutes = require('./routes/records.routes');
app.use('/api/records', recordsRoutes);

// Serve frontend static files
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
