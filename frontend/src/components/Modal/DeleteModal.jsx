import React from "react";
import axios from "axios";
import styles from "./DeleteModal.module.css";

const DeleteModal = ({ isOpen, onConfirm, onCancel, taskId }) => {
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://todo-zomw.onrender.com/api/v1/tasks/${taskId}`
      );
      if (response.status === 200) {
       
        onConfirm(taskId);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>Are you sure you want to Delete?</p>
        <div className={styles.buttonGroup}>
          <button onClick={handleDelete} className={styles.confirmButton}>
            Yes, Delete
          </button>
          <button onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
