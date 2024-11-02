import React, { useState } from "react";
import { GoDatabase } from "react-icons/go";
import { SlSettings } from "react-icons/sl";
import { IoLogOutOutline } from "react-icons/io5";
import codesandbox from "../assets/codesandbox.svg";
import layout from "../assets/layout.svg";
import styles from "./Sidebar.module.css";
import LogoutModal from "./Modal/LogoutModal";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setActiveComponent }) => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeItem");
    navigate("/");
    setIsLogoutModalOpen(false);
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };
  return (
    <div className={styles.sidebar}>
      <div className={styles.logoSection}>
        <img src={codesandbox} alt="Pro Manage Logo" className={styles.logo} />
        <span className={styles.logoText}>Pro Manage</span>
      </div>

      <div className={styles.navSection}>
        <div
          className={styles.navItem}
          onClick={() => setActiveComponent("Board")}
        >
          <img src={layout} alt="Board Icon" className={styles.icon} />
          <span>Board</span>
        </div>
        <div
          className={styles.navItem}
          onClick={() => setActiveComponent("Analytics")}
        >
          <GoDatabase className={styles.icon} />
          <span>Analytics</span>
        </div>
        <div
          className={styles.navItem}
          onClick={() => setActiveComponent("Setting")}
        >
          <SlSettings className={styles.icon} />
          <span>Setting</span>
        </div>
      </div>
      <div className={styles.logoutSection} onClick={handleLogoutClick}>
        <IoLogOutOutline className={styles.icon} />
        <span>Logout</span>
      </div>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  );
};

export default Sidebar;
