const express = require("express");
const router = express.Router();
const { Property, Rate, DeletedPropertyLog } = require("../models/Property");

// Add a new property
router.post("/add", async (req, res) => {
  const {
    name,
    type,
    location,
    chargesPerHead,
    winterSupplement,
    summerSupplement,
    ageLimitComplimentaryStay,
    ageLimitChildPricing,
    childSupplement,
    breakfastSupplement,
    lunchSupplement,
    dinnerSupplement,
    roomCategories,
  } = req.body;

  try {
    // Check if the property already exists
    const existingProperty = await Property.findOne({ name, location });
    if (existingProperty) {
      return res
        .status(400)
        .json({ message: "Property already exists in this location." });
    }

    // Create a new property
    const newProperty = new Property({
      name,
      type,
      location,
      chargesPerHead,
      winterSupplement,
      summerSupplement,
      ageLimitComplimentaryStay,
      ageLimitChildPricing,
      childSupplement,
      breakfastSupplement,
      lunchSupplement,
      dinnerSupplement,
      roomCategories,
    });

    await newProperty.save();
    res
      .status(201)
      .json({ message: "Property added successfully", property: newProperty });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add property", error: error.message });
  }
});

// Add rates to a property
router.post("/:propertyId/rates", async (req, res) => {
  const { propertyId } = req.params;
  const { dateRange, rates } = req.body;

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const newRate = new Rate({
      property: propertyId,
      dateRange,
      rates,
    });

    await newRate.save();
    property.rates.push(newRate);
    await property.save();

    res
      .status(201)
      .json({ message: "Rates added successfully", rate: newRate });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add rates", error: error.message });
  }
});

// Update property details and rates
router.put("/:propertyId", async (req, res) => {
  const { propertyId } = req.params;
  const {
    name,
    type,
    location,
    chargesPerHead,
    winterSupplement,
    summerSupplement,
    ageLimitComplimentaryStay,
    ageLimitChildPricing,
    childSupplement,
    breakfastSupplement,
    lunchSupplement,
    dinnerSupplement,
    roomCategories,
  } = req.body;

  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      {
        name,
        type,
        location,
        chargesPerHead,
        winterSupplement,
        summerSupplement,
        ageLimitComplimentaryStay,
        ageLimitChildPricing,
        childSupplement,
        breakfastSupplement,
        lunchSupplement,
        dinnerSupplement,
        roomCategories,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update property", error: error.message });
  }
});

// Retrieve property rates
router.get("/:propertyId/rates", async (req, res) => {
  const { propertyId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const property = await Property.findById(propertyId).populate("rates");
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const filteredRates = property.rates.filter((rate) => {
      return (
        new Date(rate.dateRange.start) <= new Date(startDate) &&
        new Date(rate.dateRange.end) >= new Date(endDate)
      );
    });

    if (filteredRates.length === 0) {
      return res
        .status(404)
        .json({ message: "No rates available for the specified date range." });
    }

    res.status(200).json({ property: property.name, rates: filteredRates });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve rates", error: error.message });
  }
});

// Retrieve all properties
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find().populate("rates");

    if (properties.length === 0) {
      return res.status(404).json({ message: "No properties found." });
    }

    res.status(200).json(properties);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve properties", error: error.message });
  }
});

// Delete a property and log it
router.delete("/:propertyId", async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findById(propertyId).populate("rates");
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Log the deleted property details
    const logEntry = new DeletedPropertyLog({
      propertyId: property._id,
      name: property.name,
      destination: property.destination,
      rates: property.rates.map((rate) => ({
        dateRange: rate.dateRange,
        rates: rate.rates,
      })),
    });

    await logEntry.save();

    // Delete the property and its associated rates
    await Rate.deleteMany({ property: property._id });
    await property.remove();

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete property", error: error.message });
  }
});

module.exports = router;
