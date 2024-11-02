import React, { useState } from "react";
import styles from "./AddPeopleModal.module.css";
import AddEmailModal from "./AddEmailModal";

const AddPeopleModal = ({ isOpen, onClose, onAddEmail }) => {
 
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <p className={styles.heading}>Add People to the Board</p>
          <input
            type="text"
            placeholder="Enter the email"
            className={styles.emailInput}
          />
          <div className={styles.buttonGroup}>
            <button onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button onClick={onAddEmail} className={styles.addButton}>
              Add Email
            </button>
          </div>
        </div>
      </div>
    
    </>
  );
};

export default AddPeopleModal;
