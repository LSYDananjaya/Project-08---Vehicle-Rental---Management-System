const mongoose = require("mongoose");

// Property Schema
const propertySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Property Name
  type: {
    type: String,
    required: true,
    enum: ["Apartment", "Hotel", "Home Stay", "Villa"],
  }, // Property Type
  location: { type: String, required: true }, // Location
  chargesPerHead: { type: Number, required: true }, // Charges Per Head
  winterSupplement: { type: Number, required: true }, // Winter Supplement
  summerSupplement: { type: Number, required: true }, // Summer Supplement
  ageLimitComplimentaryStay: { type: Number, required: true }, // Age Limit for Complimentary Stay for Children
  ageLimitChildPricing: { type: Number, required: true }, // Age Limit for Child Pricing Policy
  childSupplement: { type: Number, required: true }, // Child Supplement
  breakfastSupplement: { type: Number, required: true }, // Breakfast Supplement
  lunchSupplement: { type: Number, required: true }, // Lunch Supplement
  dinnerSupplement: { type: Number, required: true }, // Dinner Supplement
  roomCategories: [
    {
      category: { type: String, required: true }, // Room Category
      additionalCharges: { type: Number, required: true }, // Additional Charges
    },
  ],
  rates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rate" }],
});

// Rate Schema
const rateSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  dateRange: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  rates: [
    {
      roomType: String,
      price: Number,
    },
  ],
});

// Deleted Property Log Schema
const deletedPropertyLogSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId },
  name: String,
  destination: String,
  deletionDate: { type: Date, default: Date.now },
  rates: [
    {
      dateRange: {
        start: Date,
        end: Date,
      },
      rates: [
        {
          roomType: String,
          price: Number,
        },
      ],
    },
  ],
});

const Property = mongoose.model("Property", propertySchema);
const Rate = mongoose.model("Rate", rateSchema);
const DeletedPropertyLog = mongoose.model(
  "DeletedPropertyLog",
  deletedPropertyLogSchema
);

module.exports = { Property, Rate, DeletedPropertyLog };
