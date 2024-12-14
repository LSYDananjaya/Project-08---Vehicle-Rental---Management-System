import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Toast, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    brand: "",
    model: "",
    type: "",
    manufactureYear: "",
    numberOfSeats: "",
    status: "Active", // Initialize status as Active
    fuelType: "",
    sunroof: false,
    bootCapacity: "",
    dailyRentalRate: "",
    applicableDistance: "", // New field for applicable distance
    ratePerKm: "", // New field for rate per km
    isOffRoad: false,
    vehicleBook: "", // URL or filename
    license: "", // URL or filename
    mileage: "", // New field for mileage
  });

  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [seats, setSeats] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Mapping of daily rental rates
  const dailyRentalRates = {
    Sedan: 5000,
    SUV: 7000,
    Truck: 9000,
    Coupe: 6000,
    Convertible: 8000,
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [brandResponse, typeResponse, seatResponse, fuelTypeResponse] =
          await Promise.all([
            axios.get("http://localhost:3000/api/options/brands"),
            axios.get("http://localhost:3000/api/options/types"),
            axios.get("http://localhost:3000/api/options/seats"),
            axios.get("http://localhost:3000/api/options/fuelTypes"),
          ]);

        setBrands(brandResponse.data);
        setTypes(typeResponse.data);
        setSeats(seatResponse.data);
        setFuelTypes(fuelTypeResponse.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;

    // Update dailyRentalRate if type is changed
    if (name === "type") {
      setFormData((prevData) => ({
        ...prevData,
        type: updatedValue,
        dailyRentalRate: dailyRentalRates[updatedValue] || "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: updatedValue,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.vehicleNumber)
      errors.vehicleNumber = "Vehicle Number is required";
    if (!formData.brand) errors.brand = "Brand is required";
    if (!formData.model) errors.model = "Model is required";
    if (!formData.type) errors.type = "Type is required";
    if (!formData.manufactureYear || isNaN(formData.manufactureYear)) {
      errors.manufactureYear = "Valid Manufacture Year is required";
    }
    if (!formData.numberOfSeats || isNaN(formData.numberOfSeats)) {
      errors.numberOfSeats = "Valid Number of Seats is required";
    }
    if (!formData.fuelType) errors.fuelType = "Fuel Type is required";
    if (formData.bootCapacity && isNaN(formData.bootCapacity)) {
      errors.bootCapacity = "Valid Boot Capacity is required";
    }
    if (!formData.applicableDistance || isNaN(formData.applicableDistance)) {
      errors.applicableDistance = "Valid Applicable Distance is required";
    }
    if (!formData.ratePerKm || isNaN(formData.ratePerKm)) {
      errors.ratePerKm = "Valid Rate per Km is required";
    }
    if (formData.mileage && isNaN(formData.mileage)) {
      errors.mileage = "Valid Mileage is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/vehicles", formData);
      setShowToast(true);
      setShowModal(true);
      setFormData({
        vehicleNumber: "",
        brand: "",
        model: "",
        type: "",
        manufactureYear: "",
        numberOfSeats: "",
        status: "Active", // Reset status to Active
        fuelType: "",
        sunroof: false,
        bootCapacity: "",
        dailyRentalRate: "",
        applicableDistance: "", // Reset new field
        ratePerKm: "", // Reset new field
        isOffRoad: false,
        vehicleBook: "",
        license: "",
        mileage: "", // Reset mileage field
      });
      setErrors({}); // Clear errors on successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Container className="mt-5">
      <div className="mb-4">
        <h2 className="text-center">Add Vehicle</h2>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formVehicleNumber">
          <Form.Label>Vehicle Number</Form.Label>
          <Form.Control
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            isInvalid={!!errors.vehicleNumber}
          />
          <Form.Control.Feedback type="invalid">
            {errors.vehicleNumber}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBrand">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            as="select"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            isInvalid={!!errors.brand}
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.brand}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formModel">
          <Form.Label>Model</Form.Label>
          <Form.Control
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            isInvalid={!!errors.model}
          />
          <Form.Control.Feedback type="invalid">
            {errors.model}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formType">
          <Form.Label>Type</Form.Label>
          <Form.Control
            as="select"
            name="type"
            value={formData.type}
            onChange={handleChange}
            isInvalid={!!errors.type}
          >
            <option value="">Select Type</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.type}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formDailyRentalRate">
          <Form.Label>Daily Rental Rate</Form.Label>
          <Form.Control
            type="number"
            name="dailyRentalRate"
            value={formData.dailyRentalRate}
            onChange={handleChange}
            isInvalid={!!errors.dailyRentalRate}
            readOnly
          />
          <Form.Control.Feedback type="invalid">
            {errors.dailyRentalRate}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formManufactureYear">
          <Form.Label>Manufacture Year</Form.Label>
          <Form.Control
            as="select"
            name="manufactureYear"
            value={formData.manufactureYear}
            onChange={handleChange}
            isInvalid={!!errors.manufactureYear}
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.manufactureYear}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formNumberOfSeats">
          <Form.Label>Number of Seats</Form.Label>
          <Form.Control
            as="select"
            name="numberOfSeats"
            value={formData.numberOfSeats}
            onChange={handleChange}
            isInvalid={!!errors.numberOfSeats}
          >
            <option value="">Select Number of Seats</option>
            {seats.map((seat) => (
              <option key={seat} value={seat}>
                {seat}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.numberOfSeats}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formFuelType">
          <Form.Label>Fuel Type</Form.Label>
          <Form.Control
            as="select"
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            isInvalid={!!errors.fuelType}
          >
            <option value="">Select Fuel Type</option>
            {fuelTypes.map((fuelType) => (
              <option key={fuelType} value={fuelType}>
                {fuelType}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.fuelType}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formApplicableDistance">
          <Form.Label>Applicable Distance</Form.Label>
          <Form.Control
            type="number"
            name="applicableDistance"
            value={formData.applicableDistance}
            onChange={handleChange}
            isInvalid={!!errors.applicableDistance}
          />
          <Form.Control.Feedback type="invalid">
            {errors.applicableDistance}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formRatePerKm">
          <Form.Label>Rate Per Km</Form.Label>
          <Form.Control
            type="number"
            name="ratePerKm"
            value={formData.ratePerKm}
            onChange={handleChange}
            isInvalid={!!errors.ratePerKm}
          />
          <Form.Control.Feedback type="invalid">
            {errors.ratePerKm}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formMileage">
          <Form.Label>Mileage (Optional)</Form.Label>
          <Form.Control
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            isInvalid={!!errors.mileage}
          />
          <Form.Control.Feedback type="invalid">
            {errors.mileage}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBootCapacity">
          <Form.Label>Boot Capacity</Form.Label>
          <Form.Control
            type="number"
            name="bootCapacity"
            value={formData.bootCapacity}
            onChange={handleChange}
            isInvalid={!!errors.bootCapacity}
          />
          <Form.Control.Feedback type="invalid">
            {errors.bootCapacity}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formSunroof">
          <Form.Check
            type="checkbox"
            name="sunroof"
            label="Sunroof"
            checked={formData.sunroof}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formIsOffRoad">
          <Form.Check
            type="checkbox"
            name="isOffRoad"
            label="Is Off-Road"
            checked={formData.isOffRoad}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formVehicleBook">
          <Form.Label>Vehicle Book (URL or File)</Form.Label>
          <Form.Control
            type="text"
            name="vehicleBook"
            value={formData.vehicleBook}
            onChange={handleChange}
            isInvalid={!!errors.vehicleBook}
          />
          <Form.Control.Feedback type="invalid">
            {errors.vehicleBook}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formLicense">
          <Form.Label>License (URL or File)</Form.Label>
          <Form.Control
            type="text"
            name="license"
            value={formData.license}
            onChange={handleChange}
            isInvalid={!!errors.license}
          />
          <Form.Control.Feedback type="invalid">
            {errors.license}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      {/* Success Toast */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>Vehicle added successfully!</Toast.Body>
      </Toast>

      {/* Success Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Vehicle Added</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your vehicle has been added successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AddVehicle;
