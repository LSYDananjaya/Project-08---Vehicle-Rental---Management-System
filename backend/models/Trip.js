const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  vehicleId: {
    type: String, // Store the vehicle number as a string
    required: true,
  },
  name: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalNumberOfDays: {
    type: Number,
    default: function () {
      return (this.endDate - this.startDate) / (1000 * 60 * 60 * 24); // Calculates days between dates
    },
  },
  mileage: { type: Number },
  mileageUpdated: { type: Number },
  tripTotal: { type: Number },

  // New fields
  contactDetails: { type: String, required: true }, // Store contact details (e.g., phone number)
  email: { type: String, required: true }, // Store email address
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
