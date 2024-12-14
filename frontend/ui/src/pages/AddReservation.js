import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "animate.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddReservation = () => {
  const { vehicleNumber } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    vehicleId: vehicleNumber, // Store vehicle number directly
    contactDetails: "",
    email: "",
  });

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/vehicles/${vehicleNumber}`
        );
        setVehicle(response.data);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    };

    fetchVehicleDetails();
    AOS.init(); // Initialize AOS
  }, [vehicleNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Include vehicle mileage in the formData
      const updatedFormData = {
        ...formData,
        mileage: vehicle.mileage, // Add mileage from the fetched vehicle
      };

      // Send reservation data to the backend
      const response = await axios.post(
        "http://localhost:3000/api/trips",
        updatedFormData
      );

      // Update vehicle status to Reserved
      await axios.put(`http://localhost:3000/api/vehicles/${vehicleNumber}`, {
        status: "reserved",
      });

      toast.success("Reservation added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Navigate to ShowReservation page
      navigate(`/showReservation`); // Adjust the route as necessary
    } catch (error) {
      console.error("Error adding reservation:", error);
      toast.error("Failed to add reservation. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (!vehicle) {
    return <div>Loading vehicle details...</div>;
  }

  return (
    <div
      className="container"
      style={{ marginTop: "100px" }}
      data-aos="fade-up"
    >
      <ToastContainer />
      <div className="d-flex justify-content-center align-items-center">
        <h2
          className="mb-4 text-center text-primary animate__animated animate__fadeIn"
          style={{ marginTop: "10px" }}
        >
          Booking Preview
        </h2>
      </div>

      <div className="d-flex" style={{ padding: "20px", height: "110vh" }}>
        {/* Reservation Form */}
        <div
          className="col-lg-6 mb-4"
          style={{
            borderRadius: "15px",
            marginRight: "10px",
            boxShadow: "2px 2px 8px rgba(0,0,0, 0.2)",
            padding: "30px",
            backgroundColor: "#f9f9f9",
          }}
          data-aos="slide-right"
        >
          <h3 className="text-center mt-3">
            Reserve {vehicle.brand} {vehicle.model}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label font-weight-bold">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label font-weight-bold">Destination</label>
              <input
                type="text"
                name="destination"
                className="form-control"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label font-weight-bold">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="form-control"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label font-weight-bold">End Date</label>
              <input
                type="date"
                name="endDate"
                className="form-control"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label font-weight-bold">
                Contact Details
              </label>
              <input
                type="text"
                name="contactDetails"
                className="form-control"
                value={formData.contactDetails}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label font-weight-bold">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-primary animate__animated animate__pulse"
                style={{ borderRadius: "20px" }}
              >
                Add Reservation
              </button>
            </div>
          </form>
        </div>

        {/* Vehicle Details Container */}
        <div
          className="col-lg-6 mb-4"
          style={{
            borderRadius: "15px",
            marginLeft: "10px",
            boxShadow: "2px 2px 8px rgba(0,0,0, 0.2)",
            padding: "30px",
            backgroundColor: "#f9f9f9",
            overflowY: "auto", // Enable scrolling for overflow
          }}
          data-aos="slide-left"
        >
          <h3 className="text-center mt-3">Vehicle Details</h3>
          <img
            src={vehicle.vehicleBook} // Assuming the vehicle object has an imageUrl property
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="img-fluid rounded mx-auto d-block mb-3"
            style={{ maxHeight: "200px", objectFit: "cover" }}
          />
          <div className="vehicle-details">
            <p>
              <strong>Brand:</strong> {vehicle.brand}
            </p>
            <p>
              <strong>Model:</strong> {vehicle.model}
            </p>
            <p>
              <strong>Type:</strong> {vehicle.type}
            </p>
            <p>
              <strong>Manufacture Year:</strong> {vehicle.manufactureYear}
            </p>
            <p>
              <strong>Number of Seats:</strong> {vehicle.numberOfSeats}
            </p>
            <p>
              <strong>Fuel Type:</strong> {vehicle.fuelType}
            </p>
            <p>
              <strong>Status:</strong> {vehicle.status}
            </p>
            <p>
              <strong>Sunroof:</strong> {vehicle.sunroof ? "Yes" : "No"}
            </p>
            <p>
              <strong>Boot Capacity:</strong> {vehicle.bootCapacity} L
            </p>
            <p>
              <strong>Daily Rental Rate:</strong> ${vehicle.dailyRentalRate}
            </p>
            <p>
              <strong>Price per KM:</strong> ${vehicle.ratePerKm}
            </p>
            <p>
              <strong>Mileage:</strong> {vehicle.mileage} km
            </p>
            <p>
              <strong>Applicable Distance:</strong> {vehicle.applicableDistance}{" "}
              km
            </p>
            <p>
              <strong>Off-Road Capability:</strong>{" "}
              {vehicle.isOffRoad ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReservation;
