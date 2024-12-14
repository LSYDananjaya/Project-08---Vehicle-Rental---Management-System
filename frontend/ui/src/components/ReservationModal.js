import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ReservationModal = ({ show, onHide, vehicle }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle reservation logic here
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          Reserve {vehicle.brand} {vehicle.model}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="customerName">
            <Form.Label>Your Name</Form.Label>
            <Form.Control type="text" placeholder="Enter your name" required />
          </Form.Group>
          <Form.Group controlId="contactNumber">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter your contact number"
              required
            />
          </Form.Group>
          <Form.Group controlId="reservationDate">
            <Form.Label>Reservation Date</Form.Label>
            <Form.Control type="date" required />
          </Form.Group>
          <Button variant="primary" type="submit">
            Confirm Reservation
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ReservationModal;
