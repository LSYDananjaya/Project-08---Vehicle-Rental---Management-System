const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = 3000;

// Configure CORS to allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:3001", // Ensure this matches your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://Yehara:1234@cluster0.enl81.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import and use routes
const propertyRoutes = require("./routes/properties");
app.use("/api/properties", propertyRoutes);

const vehicleRoutes = require("./routes/vehicles");
app.use("/api/vehicles", vehicleRoutes);

const optionsRouter = require("./routes/options");
app.use("/api/options", optionsRouter);

const tripRoutes = require("./routes/trip");
app.use("/api/trips", tripRoutes);

const reportRoutes = require("./routes/reportRoute");
app.use("/api/reports", reportRoutes);

// Test route for server status
app.get("/test", (req, res) => {
  res.send("Server is working");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
