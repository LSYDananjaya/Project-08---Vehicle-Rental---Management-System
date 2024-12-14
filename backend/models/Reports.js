const mongoose = require("mongoose");

// Define the Reports schema
const reportSchema = new mongoose.Schema({
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

  // New fields for contact details and email
  contactDetails: { type: String }, // Store contact details (e.g., phone number)
  email: { type: String }, // Store email address

  // New field for the report submission date
  submittedDate: {
    type: Date,
    default: Date.now, // Automatically records the date and time when the report is created
  },
});

// Create the Report model using the schema
const Report = mongoose.model("Report", reportSchema);

// Export the Report model
module.exports = Report;
