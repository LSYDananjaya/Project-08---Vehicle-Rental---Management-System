const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");

// Create a new trip
router.post("/", async (req, res) => {
  try {
    const trip = new Trip(req.body);
    await trip.save();

    res.status(201).json({ message: "Trip created successfully", trip });
  } catch (error) {
    console.error("Failed to create trip:", error.message);
    res
      .status(400)
      .json({ message: "Failed to create trip", error: error.message });
  }
});

// Get all trips
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find().populate("vehicleId");
    res.status(200).json(trips);
  } catch (error) {
    console.error("Failed to fetch trips:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch trips", error: error.message });
  }
});

// Get trip by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id).populate("vehicleId");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error("Failed to fetch trip:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch trip", error: error.message });
  }
});

// Update a trip
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTrip = await Trip.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res
      .status(200)
      .json({ message: "Trip updated successfully", trip: updatedTrip });
  } catch (error) {
    console.error("Failed to update trip:", error.message);
    res
      .status(400)
      .json({ message: "Failed to update trip", error: error.message });
  }
});

// Delete a trip
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findByIdAndDelete(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Failed to delete trip:", error.message);
    res
      .status(500)
      .json({ message: "Failed to delete trip", error: error.message });
  }
});

module.exports = router;
