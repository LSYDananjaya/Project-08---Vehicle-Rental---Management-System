const express = require("express");
const router = express.Router();
const Report = require("../models/Reports"); // Adjust the path to your Reports model

// POST method: Create a new report
router.post("/", async (req, res) => {
  try {
    const {
      vehicleId,
      name,
      destination,
      startDate,
      endDate,
      mileage,
      mileageUpdated,
      tripTotal,
      contactDetails,
      email,
    } = req.body;

    // Create a new report with the provided data
    const newReport = new Report({
      vehicleId,
      name,
      destination,
      startDate,
      endDate,
      mileage,
      mileageUpdated,
      tripTotal,
      contactDetails,
      email,
    });

    // Save the report to the database
    const savedReport = await newReport.save();

    res.status(201).json(savedReport); // Respond with the saved report
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET method: Retrieve all reports
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find(); // Fetch all reports
    res.status(200).json(reports); // Respond with the list of reports
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET method: Retrieve a report by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id); // Fetch the report by ID

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(report); // Respond with the found report
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE method: Delete a report by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the report by ID and delete it
    const deletedReport = await Report.findByIdAndDelete(id);

    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
