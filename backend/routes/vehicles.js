const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");

// Create a new vehicle
router.post("/", async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();

    res.status(201).json({ message: "Vehicle created successfully", vehicle });
  } catch (error) {
    console.error("Failed to create vehicle:", error.message);
    res
      .status(400)
      .json({ message: "Failed to create vehicle", error: error.message });
  }
});

// Get all vehicles
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Failed to fetch vehicles:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch vehicles", error: error.message });
  }
});

// Get vehicle by number
router.get("/:vehicleNumber", async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    const vehicle = await Vehicle.findOne({ vehicleNumber });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    console.error("Failed to fetch vehicle:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch vehicle", error: error.message });
  }
});

// Update a vehicle
router.put("/:vehicleNumber", async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { vehicleNumber },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res
      .status(200)
      .json({
        message: "Vehicle updated successfully",
        vehicle: updatedVehicle,
      });
  } catch (error) {
    console.error("Failed to update vehicle:", error.message);
    res
      .status(400)
      .json({ message: "Failed to update vehicle", error: error.message });
  }
});

// Delete a vehicle
router.delete("/:vehicleNumber", async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    const vehicle = await Vehicle.findOneAndDelete({ vehicleNumber });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Failed to delete vehicle:", error.message);
    res
      .status(500)
      .json({ message: "Failed to delete vehicle", error: error.message });
  }
});

module.exports = router;
