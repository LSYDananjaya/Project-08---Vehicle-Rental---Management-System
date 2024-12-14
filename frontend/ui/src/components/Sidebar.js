import React, { useState } from "react";
import {
  HiOutlinePlus,
  HiOutlineUser,
  HiOutlineTruck,
  HiOutlineClipboardList,
  HiOutlineDocumentReport,
} from "react-icons/hi";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="d-flex flex-column vh-100 bg-dark text-light p-4"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-primary mb-4"
      >
        Vehicle Management
      </motion.h2>

      {/* Sidebar Items */}
      <nav className="nav flex-column">
        <SidebarItem
          Icon={HiOutlineTruck}
          label="Overview"
          link="/"
          isActive={selected === "/"}
          setSelected={setSelected}
        />

        <SidebarItem
          Icon={HiOutlinePlus}
          label="Add Vehicle"
          link="/add-vehicle"
          isActive={selected === "/add-vehicle"}
          setSelected={setSelected}
        />

        <SidebarItem
          Icon={HiOutlineClipboardList}
          label="Manage Reservations"
          link="/manageReservation"
          isActive={selected === "/manageReservation"}
          setSelected={setSelected}
        />

        <SidebarItem
          Icon={HiOutlineDocumentReport}
          label="Reports"
          link="/reports"
          isActive={selected === "/reports"}
          setSelected={setSelected}
        />
      </nav>

      {/* Profile Section */}
      <div className="mt-auto">
        <SidebarItem
          Icon={HiOutlineUser}
          label="Profile"
          link="/profile"
          isActive={selected === "/profile"}
          setSelected={setSelected}
        />
      </div>
    </motion.div>
  );
};

const SidebarItem = ({ Icon, label, link, isActive, setSelected }) => {
  return (
    <Link
      to={link}
      className={`nav-link d-flex align-items-center my-2 py-2 px-3 rounded ${
        isActive ? "bg-primary text-light shadow-lg" : "text-secondary"
      }`}
      onClick={() => setSelected(link)}
    >
      <Icon className="me-2" />
      <span>{label}</span>

      {isActive && (
        <motion.div
          layoutId="sidebarActiveIndicator"
          className="position-absolute bottom-0 start-0 w-100 h-1 bg-light rounded-top"
        />
      )}
    </Link>
  );
};

export default Sidebar;
