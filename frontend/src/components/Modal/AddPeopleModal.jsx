import React, { useState } from "react";
import styles from "./AddPeopleModal.module.css";

const AddPeopleModal = ({ isOpen, onClose, boardId }) => {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleAddEmail = async () => {
    if (!email) {
      alert("Please enter an email address");
      return;
    }

    try {
      const response = await fetch("https://todo-zomw.onrender.com/api/v1/shareBoard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ boardId, email }), 
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Email ${email} has been added successfully!`);
        setEmail("");
      } else {
        alert(data.message || "Failed to add email.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the email.");
    }
  };

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <p className={styles.heading}>Add People to the Board</p>
          <input
            type="text"
            placeholder="Enter the email"
            className={styles.emailInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <div className={styles.buttonGroup}>
            <button onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button onClick={handleAddEmail} className={styles.addButton}>
              Add Email
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPeopleModal;
