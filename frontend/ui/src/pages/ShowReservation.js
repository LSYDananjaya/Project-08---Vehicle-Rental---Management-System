import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos"; // Add AOS for animations
import "aos/dist/aos.css";

const ShowReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [vehicles, setVehicles] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);
  const [vehicleIdToUpdate, setVehicleIdToUpdate] = useState(null); // Track vehicle ID

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

  const handleCancelClick = (reservationId, vehicleId) => {
    setReservationToCancel(reservationId);
    setVehicleIdToUpdate(vehicleId); // Store vehicleId for status update
    setShowModal(true);
  };

  const cancelReservation = async () => {
    try {
      // Cancel the reservation
      await axios.delete(
        `http://localhost:3000/api/trips/${reservationToCancel}`
      );
      setReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation._id !== reservationToCancel
        )
      );
      toast.success("Reservation canceled successfully.");

      // Update the vehicle status to "Active"
      if (vehicleIdToUpdate) {
        await updateVehicleStatus(vehicleIdToUpdate);
      }
    } catch (error) {
      console.error("Error canceling reservation:", error);
      toast.error("Failed to cancel reservation.");
    } finally {
      setShowModal(false); // Close modal after action
      setReservationToCancel(null); // Reset reservation ID
      setVehicleIdToUpdate(null); // Reset vehicle ID
    }
  };

  const updateVehicleStatus = async (vehicleId) => {
    try {
      await axios.put(`http://localhost:3000/api/vehicles/${vehicleId}`, {
        status: "active",
      });
      toast.success("Vehicle status updated to Active.");
    } catch (error) {
      console.error("Error updating vehicle status:", error);
      toast.error("Failed to update vehicle status.");
    }
  };

  if (!reservations.length) {
    return <div>Loading reservations...</div>;
  }

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <ToastContainer />
      <h2 className="text-center text-primary mb-4">Reservations</h2>
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
                  <strong>Start Date:</strong>{" "}
                  {new Date(reservation.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(reservation.endDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Email:</strong> {reservation.email}{" "}
                </p>
                <p>
                  <strong>Contact Info:</strong> {reservation.contactInfo}{" "}
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
                  className="btn btn-danger mt-3"
                  onClick={() =>
                    handleCancelClick(reservation._id, reservation.vehicleId)
                  }
                >
                  Cancel Reservation
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for confirmation */}
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
                <h5 className="modal-title">Confirm Cancellation</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to cancel this reservation?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={cancelReservation}
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowReservation;
