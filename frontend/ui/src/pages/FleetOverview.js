// src/pages/FleetOverview.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import VehicleCard from "../components/VehicleCard";
import { Container, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const FleetOverview = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [pdfContent, setPdfContent] = useState(null);

  const [brandOptions, setBrandOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [seatOptions, setSeatOptions] = useState([]);
  const [fuelTypeOptions, setFuelTypeOptions] = useState([]);

  const [filters, setFilters] = useState({
    brand: "",
    type: "",
    seats: "",
    status: "",
    fuelType: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/vehicles");
        setVehicles(response.data);
        setFilteredVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchOptions = async () => {
      try {
        const brandResponse = await axios.get(
          "http://localhost:3000/api/options/brands"
        );
        const typeResponse = await axios.get(
          "http://localhost:3000/api/options/types"
        );
        const seatResponse = await axios.get(
          "http://localhost:3000/api/options/seats"
        );
        const statusResponse = await axios.get(
          "http://localhost:3000/api/options/statuses"
        );
        const fuelTypeResponse = await axios.get(
          "http://localhost:3000/api/options/fuelTypes"
        );

        setBrandOptions(brandResponse.data);
        setTypeOptions(typeResponse.data);
        setSeatOptions(seatResponse.data);
        setStatusOptions(statusResponse.data);
        setFuelTypeOptions(fuelTypeResponse.data);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchVehicles();
    fetchOptions();
  }, []);

  const handleAddClick = () => {
    navigate("/add-vehicle");
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditModal(true);
  };

  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/vehicles/${vehicleToDelete.vehicleNumber}`
      );
      setVehicles(
        vehicles.filter(
          (v) => v.vehicleNumber !== vehicleToDelete.vehicleNumber
        )
      );
      setFilteredVehicles(
        filteredVehicles.filter(
          (v) => v.vehicleNumber !== vehicleToDelete.vehicleNumber
        )
      );
      setShowConfirmDelete(false);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/vehicles/${selectedVehicle.vehicleNumber}`,
        selectedVehicle
      );
      setVehicles(
        vehicles.map((v) =>
          v.vehicleNumber === selectedVehicle.vehicleNumber
            ? selectedVehicle
            : v
        )
      );
      setFilteredVehicles(
        filteredVehicles.map((v) =>
          v.vehicleNumber === selectedVehicle.vehicleNumber
            ? selectedVehicle
            : v
        )
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedVehicle({ ...selectedVehicle, [name]: value });
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  useEffect(() => {
    const filterVehicles = () => {
      let filtered = vehicles;

      if (filters.brand) {
        filtered = filtered.filter(
          (vehicle) => vehicle.brand === filters.brand
        );
      }
      if (filters.type) {
        filtered = filtered.filter((vehicle) => vehicle.type === filters.type);
      }
      if (filters.seats) {
        filtered = filtered.filter(
          (vehicle) => vehicle.seats === parseInt(filters.seats)
        );
      }
      if (filters.status) {
        filtered = filtered.filter(
          (vehicle) => vehicle.status === filters.status
        );
      }
      if (filters.fuelType) {
        filtered = filtered.filter(
          (vehicle) => vehicle.fuelType === filters.fuelType
        );
      }

      setFilteredVehicles(filtered);
    };

    filterVehicles();
  }, [filters, vehicles]);

  const handlePreviewPDF = async (vehicle) => {
    const cardElement = document.getElementById(
      `vehicle-card-${vehicle.vehicleNumber}`
    );
    if (cardElement) {
      const cardClone = cardElement.cloneNode(true);
      const buttons = cardClone.querySelectorAll("button");
      buttons.forEach((button) => button.remove());

      const previewContainer = document.createElement("div");
      previewContainer.style.position = "absolute";
      previewContainer.style.top = "-9999px";
      previewContainer.appendChild(cardClone);
      document.body.appendChild(previewContainer);

      try {
        const canvas = await html2canvas(cardClone, { scale: 3 });
        const imgData = canvas.toDataURL("image/png");

        setPdfContent(imgData);
        setSelectedVehicle(vehicle);
        setShowPreviewModal(true);
      } catch (error) {
        console.error("Error generating PDF preview:", error);
      } finally {
        document.body.removeChild(previewContainer);
      }
    } else {
      console.error("Vehicle card element not found.");
    }
  };

  const handleDownloadPDF = () => {
    if (pdfContent && selectedVehicle) {
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });

      pdf.addImage(pdfContent, "PNG", 10, 10, 190, 0);
      pdf.save(`Vehicle_${selectedVehicle.vehicleNumber}.pdf`);
    } else {
      console.error(
        "Cannot download PDF. Either PDF content or selected vehicle is missing."
      );
    }
    setShowPreviewModal(false);
  };

  const handleDownloadAllPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Vehicle Number",
      "Brand",
      "Type",
      "Seats",
      "Status",
      "Fuel Type",
    ];
    const tableRows = [];

    filteredVehicles.forEach((vehicle) => {
      const vehicleData = [
        vehicle.vehicleNumber,
        vehicle.brand,
        vehicle.type,
        vehicle.seats,
        vehicle.status,
        vehicle.fuelType,
      ];
      tableRows.push(vehicleData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("FleetOverview.pdf");
  };

  return (
    <Container>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Row className="mb-4">
            <Col>
              <Form.Select
                name="brand"
                onChange={handleFilterChange}
                value={filters.brand}
              >
                <option value="">All Brands</option>
                {brandOptions.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Select
                name="type"
                onChange={handleFilterChange}
                value={filters.type}
              >
                <option value="">All Types</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Select
                name="seats"
                onChange={handleFilterChange}
                value={filters.seats}
              >
                <option value="">All Seats</option>
                {seatOptions.map((seats) => (
                  <option key={seats} value={seats}>
                    {seats}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Select
                name="status"
                onChange={handleFilterChange}
                value={filters.status}
              >
                <option value="">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Select
                name="fuelType"
                onChange={handleFilterChange}
                value={filters.fuelType}
              >
                <option value="">All Fuel Types</option>
                {fuelTypeOptions.map((fuelType) => (
                  <option key={fuelType} value={fuelType}>
                    {fuelType}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Button onClick={handleAddClick} variant="primary">
                Add Vehicle
              </Button>
            </Col>
            <Col className="text-end">
              <Button onClick={handleDownloadAllPDF} variant="success">
                Download All Vehicles as PDF
              </Button>
            </Col>
          </Row>
          <Row>
            {filteredVehicles.map((vehicle) => (
              <Col
                key={vehicle.vehicleNumber}
                xs={12}
                md={6}
                lg={4}
                className="mb-4"
              >
                <VehicleCard
                  vehicle={vehicle}
                  onEdit={() => handleEditClick(vehicle)}
                  onDelete={() => handleDeleteClick(vehicle)}
                  onPreviewPDF={() => handlePreviewPDF(vehicle)}
                />
              </Col>
            ))}
          </Row>
          {/* Edit Modal */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Vehicle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleEditFormSubmit}>
                <Form.Group controlId="vehicleNumber">
                  <Form.Label>Vehicle Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="vehicleNumber"
                    value={selectedVehicle?.vehicleNumber}
                    onChange={handleInputChange}
                    readOnly
                  />
                </Form.Group>

                <Form.Group controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={selectedVehicle?.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="applicableDistance">
                  <Form.Label>Applicable Distance (km)</Form.Label>
                  <Form.Control
                    type="number"
                    name="applicableDistance"
                    value={selectedVehicle?.applicableDistance}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="ratePerKm">
                  <Form.Label>Rate per Km</Form.Label>
                  <Form.Control
                    type="number"
                    name="ratePerKm"
                    value={selectedVehicle?.ratePerKm}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Confirm Delete Modal */}
          <Modal
            show={showConfirmDelete}
            onHide={() => setShowConfirmDelete(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Are you sure you want to delete vehicle{" "}
                {vehicleToDelete?.vehicleNumber}?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
          {/* PDF Preview Modal */}
          <Modal
            show={showPreviewModal}
            onHide={() => setShowPreviewModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                PDF Preview for Vehicle {selectedVehicle?.vehicleNumber}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {pdfContent && (
                <img
                  src={pdfContent}
                  alt="PDF Preview"
                  style={{ width: "100%" }}
                />
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowPreviewModal(false)}
              >
                Close
              </Button>
              <Button variant="primary" onClick={handleDownloadPDF}>
                Download PDF
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default FleetOverview;
