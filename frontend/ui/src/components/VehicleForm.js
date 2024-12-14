import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";

const VehicleForm = ({ vehicle, onSubmit }) => {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    brand: "",
    model: "",
    type: "",
    manufactureYear: "",
    numberOfSeats: "",
    status: "",
    fuelType: "",
    sunroof: false,
    bootCapacity: "",
    dailyRentalRate: "",
    isOffRoad: false,
    documents: {
      vehicleBook: "",
      license: "",
    },
  });

  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [seats, setSeats] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);

  useEffect(() => {
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

        setBrands(brandResponse.data);
        setTypes(typeResponse.data);
        setSeats(seatResponse.data);
        setStatuses(statusResponse.data);
        setFuelTypes(fuelTypeResponse.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("documents.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        documents: {
          ...formData.documents,
          [key]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (vehicle) {
        await axios.put(
          `http://localhost:3000/api/vehicles/${vehicle.vehicleNumber}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3000/api/vehicles/add", formData);
      }
      onSubmit();
    } catch (error) {
      console.error("Error saving vehicle:", error);
    }
  };

  return (
    <Container>
      <h2 className="my-4">{vehicle ? "Edit Vehicle" : "Add Vehicle"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="vehicleNumber">
          <Form.Label>Vehicle Number</Form.Label>
          <Form.Control
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="brand">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            as="select"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="model">
          <Form.Label>Model</Form.Label>
          <Form.Control
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="type">
          <Form.Label>Type</Form.Label>
          <Form.Control
            as="select"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="manufactureYear">
          <Form.Label>Manufacture Year</Form.Label>
          <Form.Control
            type="number"
            name="manufactureYear"
            value={formData.manufactureYear}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="numberOfSeats">
          <Form.Label>Number of Seats</Form.Label>
          <Form.Control
            as="select"
            name="numberOfSeats"
            value={formData.numberOfSeats}
            onChange={handleChange}
            required
          >
            <option value="">Select Number of Seats</option>
            {seats.map((seat) => (
              <option key={seat} value={seat}>
                {seat}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="status">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="fuelType">
          <Form.Label>Fuel Type</Form.Label>
          <Form.Control
            as="select"
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            required
          >
            <option value="">Select Fuel Type</option>
            {fuelTypes.map((fuelType) => (
              <option key={fuelType} value={fuelType}>
                {fuelType}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="sunroof">
          <Form.Check
            type="checkbox"
            name="sunroof"
            checked={formData.sunroof}
            onChange={handleChange}
            label="Sunroof"
          />
        </Form.Group>

        <Form.Group controlId="bootCapacity">
          <Form.Label>Boot Capacity (L)</Form.Label>
          <Form.Control
            type="number"
            name="bootCapacity"
            value={formData.bootCapacity}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="dailyRentalRate">
          <Form.Label>Daily Rental Rate ($)</Form.Label>
          <Form.Control
            type="number"
            name="dailyRentalRate"
            value={formData.dailyRentalRate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="isOffRoad">
          <Form.Check
            type="checkbox"
            name="isOffRoad"
            checked={formData.isOffRoad}
            onChange={handleChange}
            label="Off Road"
          />
        </Form.Group>

        <Form.Group controlId="documents.vehicleBook">
          <Form.Label>Vehicle Book</Form.Label>
          <Form.Control
            type="text"
            name="documents.vehicleBook"
            value={formData.documents.vehicleBook}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="documents.license">
          <Form.Label>License</Form.Label>
          <Form.Control
            type="text"
            name="documents.license"
            value={formData.documents.license}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {vehicle ? "Update Vehicle" : "Add Vehicle"}
        </Button>
      </Form>
    </Container>
  );
};

export default VehicleForm;
