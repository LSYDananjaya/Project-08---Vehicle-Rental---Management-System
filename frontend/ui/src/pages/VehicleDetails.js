// src/pages/VehicleDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button } from "react-bootstrap";

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`/api/vehicles/${id}`);
        setVehicle(response.data);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    };

    fetchVehicle();
  }, [id]);

  if (!vehicle) return <div>Loading...</div>;

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>
            {vehicle.brand} {vehicle.model}
          </Card.Title>
          <Card.Text>
            <strong>Vehicle Number:</strong> {vehicle.vehicleNumber}
            <br />
            <strong>Brand:</strong> {vehicle.brand}
            <br />
            <strong>Model:</strong> {vehicle.model}
            <br />
            <strong>Type:</strong> {vehicle.type}
            <br />
            <strong>Year:</strong> {vehicle.manufactureYear}
            <br />
            <strong>Seats:</strong> {vehicle.numberOfSeats}
            <br />
            <strong>Status:</strong> {vehicle.status}
            <br />
            <strong>Fuel Type:</strong> {vehicle.fuelType}
            <br />
            <strong>Sunroof:</strong> {vehicle.sunroof ? "Yes" : "No"}
            <br />
            <strong>Boot Capacity:</strong> {vehicle.bootCapacity} liters
            <br />
            <strong>Daily Rental Rate:</strong> ${vehicle.dailyRentalRate}
            <br />
            <strong>Applicable Distance:</strong> {vehicle.applicableDistance}{" "}
            km
            <br />
            <strong>Rate per Km:</strong> ${vehicle.ratePerKm}
            <br />
            <strong>Mileage:</strong> {vehicle.mileage || "Not available"} km
            <br />
            <strong>Off Road:</strong> {vehicle.isOffRoad ? "Yes" : "No"}
            <br />
            <strong>Vehicle Book:</strong>{" "}
            {vehicle.vehicleBook || "Not available"}
            <br />
            <strong>License:</strong> {vehicle.license || "Not available"}
            <br />
          </Card.Text>
          <Button
            variant="primary"
            href={`/edit-vehicle/${vehicle.vehicleNumber}`}
          >
            Edit
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VehicleDetails;
