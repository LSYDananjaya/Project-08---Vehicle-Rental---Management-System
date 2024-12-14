const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, required: true },
  manufactureYear: { type: Number, required: true },
  numberOfSeats: { type: String, required: true },
  status: { type: String, required: true },
  fuelType: { type: String, required: true },
  sunroof: { type: Boolean, required: false },
  bootCapacity: { type: Number, required: true },
  dailyRentalRate: { type: Number, required: true },
  applicableDistance: { type: Number, required: true }, // Distance in km for daily rental rate
  ratePerKm: { type: Number, required: true }, // Rate per km after exceeding applicable distance
  isOffRoad: { type: Boolean, required: false },
  vehicleBook: { type: String }, // File name
  license: { type: String }, // File name
  mileage: { type: Number, required: false }, // Optional mileage
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
