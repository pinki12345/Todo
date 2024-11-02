import React from "react";
import styles from "./AddEmailModal.module.css";

const AddEmailModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p className={styles.message}> email has been added to board</p>
        <button onClick={onClose} className={styles.closeButton}>Okay, got it!</button>
      </div>
    </div>
  );
};

export default AddEmailModal;
