// src/routes/options.js
const express = require("express");
const router = express.Router();

// Mock data or you can fetch this from a database
const brands = ["Toyota", "Honda", "Ford", "BMW", "Audi"];
const types = ["Sedan", "SUV", "Truck", "Coupe", "Convertible"];
const seats = ["2", "4", "5", "7"];
const statuses = ["active", "inactive", "reserved"];
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];

// Get all brands
router.get("/brands", (req, res) => {
  res.status(200).json(brands);
});

// Get all types
router.get("/types", (req, res) => {
  res.status(200).json(types);
});

// Get all number of seats
router.get("/seats", (req, res) => {
  res.status(200).json(seats);
});

// Get all statuses
router.get("/statuses", (req, res) => {
  res.status(200).json(statuses);
});

// Get all fuel types
router.get("/fuelTypes", (req, res) => {
  res.status(200).json(fuelTypes);
});

module.exports = router;
