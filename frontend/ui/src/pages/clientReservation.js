import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../styles/ClientReservation.css"; // External CSS file

const ClientReservation = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "All",
    fuelType: "All",
  });

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/vehicles");
        setVehicles(response.data);
        setFilteredVehicles(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setLoading(false);
      }
    };

    fetchVehicles();
    AOS.init();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterVehicles(term, filters);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    filterVehicles(searchTerm, { ...filters, [name]: value });
  };

  const filterVehicles = (term, filters) => {
    const filtered = vehicles.filter((vehicle) => {
      const matchesSearch =
        vehicle.brand.toLowerCase().includes(term) ||
        vehicle.model.toLowerCase().includes(term);
      const matchesType =
        filters.type === "All" || vehicle.type === filters.type;
      const matchesFuelType =
        filters.fuelType === "All" || vehicle.fuelType === filters.fuelType;

      return matchesSearch && matchesType && matchesFuelType;
    });
    setFilteredVehicles(filtered);
  };

  const handleReserve = (vehicleNumber) => {
    navigate(`/addReservation/${vehicleNumber}`); // Navigate to AddReservation with vehicleNumber
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h2>Loading vehicles...</h2>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1
        className="text-center animate__animated animate__fadeInDown mb-4"
        style={{ fontFamily: "Saira, sans-serif" }}
      >
        Available Vehicles for Reservation
      </h1>
      <div className="input-group mb-4 search-box">
        <input
          type="text"
          className="form-control rounded-start"
          placeholder="Search by brand or model"
          value={searchTerm}
          onChange={handleSearch}
        />
        <span className="input-group-text rounded-end">
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </div>
      <div className="d-flex mb-4 filter-box">
        <select
          name="type"
          className="form-select me-2 rounded"
          value={filters.type}
          onChange={handleFilterChange}
        >
          <option value="All">All Types</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Truck">Truck</option>
        </select>
        <select
          name="fuelType"
          className="form-select rounded"
          value={filters.fuelType}
          onChange={handleFilterChange}
        >
          <option value="All">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
        </select>
      </div>
      <div className="row mt-4 vehicle-grid">
        {filteredVehicles.map((vehicle, index) => (
          <div
            className="col-md-4 mb-4"
            key={vehicle.vehicleNumber}
            data-aos="fade-up"
            data-aos-delay={`${index * 100}`}
            data-aos-duration="500"
          >
            <div className="card mb-4 shadow-lg hover-shadow">
              <img
                src={`${vehicle.vehicleBook}`}
                alt={vehicle.model}
                className="card-img-top vehicle-img"
              />
              <div className="card-body">
                <h5 className="card-title vehicle-title">
                  {`${vehicle.brand} ${vehicle.model} (${vehicle.manufactureYear})`}
                </h5>
                <p className="card-text vehicle-info">
                  <strong>Type:</strong> {vehicle.type}
                  <br />
                  <strong>Fuel Type:</strong> {vehicle.fuelType}
                  <br />
                  <strong>Seats:</strong> {vehicle.numberOfSeats}
                  <br />
                  <strong>Daily Rate:</strong> ${vehicle.dailyRentalRate} / day
                  <br />
                  <strong>Applicable Distance:</strong>{" "}
                  {vehicle.applicableDistance} km
                  <br />
                  <strong>Rate per km (after limit):</strong> $
                  {vehicle.ratePerKm} / km
                  <br />
                  <strong>Mileage:</strong> {vehicle.mileage || "Not available"}{" "}
                  km
                  <br />
                  {vehicle.sunroof && (
                    <span>
                      <strong>Sunroof:</strong> Yes
                      <br />
                    </span>
                  )}
                  {vehicle.isOffRoad && (
                    <span>
                      <strong>Off-road Capable:</strong> Yes
                      <br />
                    </span>
                  )}
                </p>
                <button
                  className="btn btn-gradient btn-block"
                  onClick={() => handleReserve(vehicle.vehicleNumber)} // Pass vehicleNumber
                >
                  Reserve Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientReservation;
