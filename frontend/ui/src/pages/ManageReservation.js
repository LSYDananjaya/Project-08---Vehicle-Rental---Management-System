import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos"; // Add AOS for animations
import "aos/dist/aos.css";

const ManageReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [vehicles, setVehicles] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [reservationToEdit, setReservationToEdit] = useState(null);
  const [tripTotal, setTripTotal] = useState(null); // To store trip total
  const [formData, setFormData] = useState({
    name: "",
    vehicleId: "",
    mileageUpdated: 0,
  });
  const [currentMileage, setCurrentMileage] = useState(0); // Store current mileage for the modal
  const [totalDays, setTotalDays] = useState(0); // Store total days

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/trips");
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        toast.error("Failed to fetch reservations.");
      }
    };

    fetchReservations();
    AOS.init(); // Initialize AOS
  }, []);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      const vehiclePromises = reservations.map(async (reservation) => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/vehicles/${reservation.vehicleId}`
          );
          return { ...response.data, reservationId: reservation._id };
        } catch (error) {
          console.error("Error fetching vehicle:", error);
          toast.error("Failed to fetch vehicle details.");
          return null;
        }
      });

      const vehiclesData = await Promise.all(vehiclePromises);
      const validVehicles = vehiclesData.filter((vehicle) => vehicle !== null);
      const vehiclesMap = validVehicles.reduce((acc, vehicle) => {
        acc[vehicle.vehicleNumber] = vehicle; // Match to vehicleNumber
        return acc;
      }, {});
      setVehicles(vehiclesMap);
    };

    if (reservations.length) {
      fetchVehicleDetails();
    }
  }, [reservations]);

  const handleEditClick = async (reservation) => {
    try {
      const vehicleResponse = await axios.get(
        `http://localhost:3000/api/vehicles/${reservation.vehicleId}`
      );
      const vehicle = vehicleResponse.data;

      setFormData({
        name: reservation.name,
        vehicleId: reservation.vehicleId,
        mileageUpdated: reservation.mileageUpdated || 0,
      });
      setCurrentMileage(vehicle.mileage); // Set current mileage
      setTotalDays(reservation.totalNumberOfDays); // Get total days from reservation
      setReservationToEdit(reservation._id);
      setTripTotal(null); // Reset trip total when opening modal
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      toast.error("Failed to fetch vehicle details.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Calculate tripTotal based on input and vehicle data
  const calculateTripTotal = () => {
    const vehicle = vehicles[formData.vehicleId];
    if (vehicle) {
      const mileageDifference = formData.mileageUpdated - currentMileage; // Use currentMileage here

      // Check if mileage exceeds applicable limit
      const applicableMileage =
        mileageDifference > vehicle.applicableLimit
          ? mileageDifference - vehicle.applicableLimit
          : 0;

      const tripTotal =
        totalDays * vehicle.dailyRentalRate + // Use totalDays from state
        applicableMileage * vehicle.ratePerKm;

      setTripTotal(tripTotal);
      toast.success(`Trip total calculated: $${tripTotal}`);
    }
  };

  const updateReservation = async () => {
    try {
      const updatedData = { ...formData, tripTotal }; // Update with tripTotal if needed

      console.log("Sending updated data:", updatedData);

      // First, update the reservation
      const response = await axios.put(
        `http://localhost:3000/api/trips/${reservationToEdit}`,
        updatedData
      );
      console.log("Update response:", response.data);

      // Check if the update was successful
      if (response.status === 200 || response.status === 204) {
        // Fetch the updated trip data from the backend
        const tripResponse = await axios.get(
          `http://localhost:3000/api/trips/${reservationToEdit}`
        );
        const tripData = tripResponse.data; // Use the fetched trip data for the report

        console.log("Fetched trip data for report:", tripData);

        // Next, post to reports with the fetched trip data
        const reportResponse = await axios.post(
          "http://localhost:3000/api/reports",
          tripData // Use tripData instead of updatedData
        );
        console.log("Report post response:", reportResponse.data);

        // Check if the report post was successful
        if (reportResponse.status === 200 || reportResponse.status === 201) {
          // Then, delete the trip
          await axios.delete(
            `http://localhost:3000/api/trips/${reservationToEdit}`
          );

          // Log the mileageUpdated to ensure it's being fetched correctly
          console.log(
            "Mileage updated from tripData:",
            tripData.mileageUpdated
          );

          // Update vehicle status and mileageUpdated from report
          const vehicleUpdateData = {
            status: "active",
            mileage: tripData.mileageUpdated, // Use mileageUpdated from tripData
          };

          console.log("Updating vehicle with data:", vehicleUpdateData);

          const vehicleResponse = await axios.put(
            `http://localhost:3000/api/vehicles/${formData.vehicleId}`,
            vehicleUpdateData
          );

          console.log("Vehicle update response:", vehicleResponse.data);

          // Show success message after all operations are done
          toast.success(
            "Reservation updated, posted to report, and deleted successfully."
          );

          // Update the local reservations state
          setReservations((prevReservations) =>
            prevReservations.map((reservation) =>
              reservation._id === reservationToEdit
                ? { ...reservation, ...tripData } // Update with tripData
                : reservation
            )
          );
        } else {
          toast.error("Failed to post report.");
        }
      } else {
        toast.error("Failed to update reservation.");
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        toast.error(
          `Failed to process the reservation: ${
            error.response.data.message || error.message
          }`
        );
      } else {
        toast.error("Failed to process the reservation.");
      }
    } finally {
      setShowModal(false);
      setReservationToEdit(null);
    }
  };

  if (!reservations.length) {
    return <div>Loading reservations...</div>;
  }

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <ToastContainer />
      <h2 className="text-center text-primary mb-4">Manage Reservations</h2>
      <div className="row">
        {reservations.map((reservation) => {
          const vehicle = vehicles[reservation.vehicleId];

          return (
            <div
              className="col-lg-4 mb-4"
              key={reservation._id}
              data-aos="fade-up"
            >
              <div
                className="card"
                style={{
                  borderRadius: "15px",
                  boxShadow: "2px 2px 8px rgba(0,0,0, 0.2)",
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h5 className="text-center">Reservation Details</h5>
                <p>
                  <strong>Reservation Name:</strong> {reservation.name}
                </p>
                <p>
                  <strong>Destination:</strong> {reservation.destination}
                </p>
                <p>
                  <strong>Total Days:</strong> {reservation.totalNumberOfDays}
                </p>

                {vehicle ? (
                  <>
                    <h5 className="text-center">
                      Vehicle: {vehicle.brand} {vehicle.model}
                    </h5>
                    <img
                      src={vehicle.vehicleBook}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="img-fluid rounded mx-auto d-block mb-3"
                      style={{ maxHeight: "150px", objectFit: "cover" }}
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
                        <strong>Manufacture Year:</strong>{" "}
                        {vehicle.manufactureYear}
                      </p>
                      <p>
                        <strong>Number of Seats:</strong>{" "}
                        {vehicle.numberOfSeats}
                      </p>
                      <p>
                        <strong>Fuel Type:</strong> {vehicle.fuelType}
                      </p>
                      <p>
                        <strong>Status:</strong> {vehicle.status}
                      </p>
                      <p>
                        <strong>Daily Rental Rate:</strong> $
                        {vehicle.dailyRentalRate}
                      </p>
                    </div>
                  </>
                ) : (
                  <p>Vehicle details not found.</p>
                )}
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => handleEditClick(reservation)}
                >
                  Edit Reservation
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for editing reservation */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Reservation</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Current Mileage</label>
                  <input
                    type="number"
                    className="form-control"
                    value={currentMileage}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Updated Mileage</label>
                  <input
                    type="number"
                    name="mileageUpdated"
                    className="form-control"
                    value={formData.mileageUpdated}
                    onChange={handleInputChange}
                  />
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={calculateTripTotal}
                >
                  Calculate Trip Total
                </button>
                {tripTotal !== null && (
                  <h5 className="mt-3">Trip Total: ${tripTotal}</h5>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={updateReservation}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReservation;
