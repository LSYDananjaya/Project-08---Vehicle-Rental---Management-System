import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar"; // Sidebar for admin
import Navbar from "./components/Navbar"; // Navbar for client
import FleetOverview from "./pages/FleetOverview";
import AddVehicle from "./pages/AddVehicle";
import VehicleDetails from "./pages/VehicleDetails";
import ClientReservation from "./pages/clientReservation";
import AddReservation from "./pages/AddReservation";
import ShowReservation from "./pages/ShowReservation";
import ManageReservation from "./pages/ManageReservation";
import ReportTable from "./pages/ReportTable";
import "./App.css"; // Import the CSS file

// Layout for Admin Section
function AdminLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
}

// Layout for Client Section
function ClientLayout({ children }) {
  return (
    <div>
      {/* Navbar remains fixed at the top */}
      <Navbar />

      {/* Main content below the navbar */}
      <div className="container" style={{ marginTop: "6rem" }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Section Routes */}
        <Route
          path="/"
          element={
            <AdminLayout>
              <FleetOverview />
            </AdminLayout>
          }
        />
        <Route
          path="/add-vehicle"
          element={
            <AdminLayout>
              <AddVehicle />
            </AdminLayout>
          }
        />
        <Route
          path="/manageReservation"
          element={
            <AdminLayout>
              <ManageReservation />
            </AdminLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <AdminLayout>
              <ReportTable />
            </AdminLayout>
          }
        />
        <Route
          path="/vehicle/:id"
          element={
            <AdminLayout>
              <VehicleDetails />
            </AdminLayout>
          }
        />

        {/* Client Section Routes */}
        <Route
          path="/reservation"
          element={
            <ClientLayout>
              <ClientReservation />
            </ClientLayout>
          }
        />
        <Route
          path="/showReservation"
          element={
            <ClientLayout>
              <ShowReservation />
            </ClientLayout>
          }
        />
        <Route
          path="/addReservation/:vehicleNumber"
          element={
            <ClientLayout>
              <AddReservation />
            </ClientLayout>
          }
        />
        <Route
          path="/vehicle-details/:id"
          element={
            <ClientLayout>
              <VehicleDetails />
            </ClientLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
