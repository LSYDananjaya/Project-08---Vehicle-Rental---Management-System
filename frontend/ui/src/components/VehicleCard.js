import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FaEdit, FaTrash, FaFilePdf } from "react-icons/fa";

const VehicleCard = ({ vehicle, onEdit, onDelete, onPreviewPDF }) => {
  // Function to determine the Bootstrap class for border color based on vehicle status
  const getStatusBorderClass = (status) => {
    const normalizedStatus = status?.trim().toLowerCase();

    const statusClasses = {
      active: "border-success", // Green border for active
      inactive: "border-danger", // Red border for inactive
      reserved: "border-primary", // Blue border for reserved
    };

    return statusClasses[normalizedStatus] || ""; // No default border
  };

  const borderClass = getStatusBorderClass(vehicle.status);

  return (
    <Card
      id={`vehicle-card-${vehicle.vehicleNumber}`}
      className={`mb-4 border-3 rounded-3 overflow-hidden ${borderClass} shadow-sm hover-shadow-lg`} // Apply border color and shadow
    >
      <Card.Body className="p-4">
        <Card.Title className="d-flex flex-column mb-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="fs-5 fw-bold text-dark">
              {vehicle.brand} {vehicle.model}
            </span>
            <Badge bg="secondary" className="text-light rounded-pill px-3 py-2">
              {vehicle.vehicleNumber}
            </Badge>
          </div>
          <Badge pill bg="info" className="text-capitalize mt-1">
            {vehicle.status}
          </Badge>
        </Card.Title>
        <Card.Text className="mb-3">
          <div>
            <strong>Type:</strong> {vehicle.type}
          </div>
          <div>
            <strong>Year:</strong> {vehicle.manufactureYear}
          </div>
          <div>
            <strong>Seats:</strong> {vehicle.numberOfSeats}
          </div>
          <div>
            <strong>Fuel Type:</strong> {vehicle.fuelType}
          </div>
          <div>
            <strong>Daily Rental Rate:</strong> ${vehicle.dailyRentalRate}
          </div>
        </Card.Text>
        <Card.Footer className="d-flex justify-content-end bg-transparent border-0 mt-2 p-0">
          <Button
            variant="outline-primary"
            onClick={() => onEdit(vehicle)}
            className="me-2 d-flex align-items-center"
            size="sm"
          >
            <FaEdit className="me-1" /> Edit
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => onDelete(vehicle)}
            className="me-2 d-flex align-items-center"
            size="sm"
          >
            <FaTrash className="me-1" /> Delete
          </Button>
          <Button
            variant="outline-success"
            onClick={() => onPreviewPDF(vehicle)}
            className="d-flex align-items-center"
            size="sm"
          >
            <FaFilePdf className="me-1" /> PDF
          </Button>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

export default VehicleCard;
