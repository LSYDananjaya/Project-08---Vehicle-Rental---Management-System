import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReportTable = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/reports");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast.error("Failed to fetch reports.");
      }
    };

    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/reports/${id}`);
      setReports(reports.filter((report) => report._id !== id));
      toast.success("Report deleted successfully.");
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report.");
    }
  };

  if (!reports.length) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <ToastContainer />
      <h2 className="text-center text-primary mb-4">Reports</h2>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Vehicle ID</th>
            <th>Name</th>
            <th>Destination</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Days</th>
            <th>Mileage</th>
            <th>Trip Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td>{report.vehicleId}</td>
              <td>{report.name}</td>
              <td>{report.destination}</td>
              <td>{new Date(report.startDate).toLocaleDateString()}</td>
              <td>{new Date(report.endDate).toLocaleDateString()}</td>
              <td>{report.totalNumberOfDays}</td>
              <td>{report.mileage}</td>
              <td>${report.tripTotal.toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(report._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
