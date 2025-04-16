const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const dburl =
  "mongodb://localhost:27017/medbook"; // your Mongo URL

mongoose
  .connect(dburl, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const dburl = "mongodb+srv://yashbudhia:khuljas1ms1m@cluster0.nnafmtq.mongodb.net/medbook-users";
//mongodb://localhost:27017/medbook