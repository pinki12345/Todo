import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AddTaskModal.module.css";
import { MdDelete } from "react-icons/md";
import { GoChevronDown } from "react-icons/go";
import { HiPlus } from "react-icons/hi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";

const AddTaskModal = ({ isOpen, onClose, taskData }) => {
  const token =
    useSelector((state) => state.token) || localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [checklist, setChecklist] = useState([
    { id: Date.now(), text: "", isChecked: false },
  ]);
  const [dueDate, setDueDate] = useState(null);
  const [showAssignBox, setShowAssignBox] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [assignedUsersId, setAssignedUsersId] = useState([]);

  useEffect(() => {
    if (taskData) {
      setTitle(taskData.title || "");
      setPriority(taskData.priority || "");
      setDueDate(taskData.dueDate ? new Date(taskData.dueDate) : null);
      const emails = [];
      const ids = [];

      if (taskData.assign && taskData.assign.length) {
        taskData.assign.forEach((user) => {
          emails.push(user.email);
          ids.push(user._id);
        });
      }

      setAssignedUsers(emails);
      setAssignedUsersId(ids);

      setChecklist(
        taskData.checklist && taskData.checklist.length
          ? taskData.checklist.map((item, index) => ({
              id: Date.now() + index,
              text: item.text,
              isChecked: item.completed,
            }))
          : [{ id: Date.now(), text: "", isChecked: false }]
      );
    }
  }, [taskData]);

  const handleAddNew = () => {
    setChecklist([...checklist, { id: Date.now(), text: "" }]);
  };

  const handleInputChange = (id, event) => {
    const newChecklist = checklist.map((item) =>
      item.id === id ? { ...item, text: event.target.value } : item
    );
    setChecklist(newChecklist);
  };

  const handleCheckboxChange = (id) => {
    const newChecklist = checklist.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setChecklist(newChecklist);
  };

  const handleDelete = (id) => {
    const newChecklist = checklist.filter((item) => item.id !== id);
    setChecklist(newChecklist);
  };
  const handleDateSelect = (date) => {
    setDueDate(date);
    setShowDatePicker(false);
  };

  const toggleAssignBox = () => {
    setShowAssignBox((prev) => !prev);
  };

  const handleToday = () => {
    setDueDate(new Date());
    setShowDatePicker(false);
  };

  const handleClear = () => {
    setDueDate(null);
    setShowDatePicker(false);
  };

  const handleSave = async () => {
    if (!title) {
      toast.error("Please enter a task title");
      return;
    }
    if (!priority) {
      toast.error("Please select a priority");
      return;
    }
    if (checklist.length === 0 || checklist[0].text.trim() === "") {
      toast.error("Please add at least one checklist item");
      return;
    }
    const hasValidChecklistItems = checklist.every(
      (item) => item.text.trim() !== ""
    );
    if (!hasValidChecklistItems) {
      toast.error("Please ensure all checklist items are filled in");
      return;
    }

    const checklistItems = checklist.map((item) => ({
      text: item.text,
      completed: item.isChecked,
    }));
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      if (taskData) {
        const response = await axios.put(
          `https://todo-zomw.onrender.com/api/v1/updateTask/${taskData._id}`,
          {
            title,
            assignedUsers: assignedUsersId,
            status: taskData.status,
            priority,
            dueDate,
            checklist: checklistItems,
          },
          { headers }
        );

        toast.success("Task updated successfully");
      } else {
        const response = await axios.post(
          "https://todo-zomw.onrender.com/api/v1/create",
          {
            title,
            assignedUsers: assignedUsersId,
            status: "TO-DO",
            priority,
            dueDate,
            checklist: checklistItems,
          },
          { headers }
        );

        toast.success("Task created successfully");
      }
      setTitle("");
      setPriority("");
      setAssignedUsers([]);
      setDueDate(null);
      setChecklist([]);
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
    }
  };

  const handleAssignUser = (user) => {
    const userId = user._id;
    const userEmail = user.email;
    if (!assignedUsersId.includes(userId)) {
      setAssignedUsersId((prev) => [...prev, userId]);
    }

    if (!assignedUsers.includes(userEmail)) {
      setAssignedUsers((prev) => [...prev, userEmail]);
    }

    setShowAssignBox(false);
  };
  const handleRemoveUser = (email) => {
    const index = assignedUsers.indexOf(email);
    if (index !== -1) {
      const userIdToRemove = assignedUsersId[index];
      setAssignedUsers((prev) => prev.filter((user) => user !== email));
      setAssignedUsersId((prev) => prev.filter((id) => id !== userIdToRemove));
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://todo-zomw.onrender.com/api/v1/getAllUsersExceptCurrent",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      }
    };
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>
          Title <span className={styles.required}>*</span>
        </p>
        <input
          type="text"
          placeholder="Enter Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
        <div className={styles.priorityGroup}>
          <p>
            Select Priority <span className={styles.required}>*</span>
          </p>
          <button
            className={`${styles.priorityButton} ${styles.highPriority} ${
              priority === "HIGH PRIORITY" ? styles.selectedPriority : ""
            }`}
            onClick={() => setPriority("HIGH PRIORITY")}
          >
            High Priority
          </button>
          <button
            className={`${styles.priorityButton} ${styles.moderatePriority} ${
              priority === "MODERATE PRIORITY" ? styles.selectedPriority : ""
            }`}
            onClick={() => setPriority("MODERATE PRIORITY")}
          >
            Moderate Priority
          </button>
          <button
            className={`${styles.priorityButton} ${styles.lowPriority} ${
              priority === "LOW PRIORITY" ? styles.selectedPriority : ""
            }`}
            onClick={() => setPriority("LOW PRIORITY")}
          >
            Low Priority
          </button>
        </div>
        <div className={styles.assignContainer}>
          <p>Assign to</p>
          <div className={styles.inputWrapperForAssign}>
            <input
              type="text"
              placeholder="Add an assignee"
              value={assignedUsers.join(", ") || ""}
              className={styles.inputForAssignee}
              readOnly
            />
            <GoChevronDown
              className={styles.chevronIcon}
              onClick={toggleAssignBox}
            />
          </div>
        </div>
        {showAssignBox && (
          <div className={styles.assignBox}>
            {users.map((user) => (
              <div key={user._id}>
                <span>{user.email}</span>
                <button
                  className={styles.assignButton}
                  onClick={() => handleAssignUser(user)}
                >
                  Assign
                </button>
              </div>
            ))}
          </div>
        )}
        {assignedUsers.length > 0 && (
          <div className={styles.assignedUsers}>
            {assignedUsers.map((user) => (
              <div key={user}>
                <span>{user}</span>
                <RxCross2
                  onClick={() => handleRemoveUser(user)}
                  className={styles.removeButton}
                />
              </div>
            ))}
          </div>
        )}
        <p className={styles.checklistText}>
          Checklist ({checklist.length}/{checklist.length}){" "}
          <span className={styles.required}>*</span>
        </p>
        {checklist.map((item) => (
          <div key={item.id} className={styles.checklistItem}>
            <div className={styles.inputWrapper}>
              <input
                type="checkbox"
                className={styles.checklistCheckbox}
                checked={item.isChecked}
                onChange={() => handleCheckboxChange(item.id)}
              />
              <input
                type="text"
                placeholder="Add a task"
                value={item.text}
                onChange={(e) => handleInputChange(item.id, e)}
                className={styles.checklistInput}
              />
              <MdDelete
                onClick={() => handleDelete(item.id)}
                className={styles.deleteIcon}
              />
            </div>
          </div>
        ))}
        <button onClick={handleAddNew} className={styles.addButton}>
          <HiPlus /> Add New
        </button>
        <div className={styles.footer}>
          <div className={styles.dateContainer}>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={styles.dateButton}
            >
              {dueDate ? dueDate.toLocaleDateString() : "Select Due Date"}
            </button>
            {showDatePicker && (
              <div className={styles.datePickerContainer}>
                <DatePicker
                  selected={dueDate}
                  onChange={handleDateSelect}
                  inline
                  className={styles.datePicker}
                />
                <div className={styles.datePickerButtons}>
                  <button onClick={handleToday} className={styles.todayButton}>
                    Today
                  </button>
                  <button onClick={handleClear} className={styles.clearButton}>
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className={styles.CancelSaveButton}>
            <button onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button className={styles.saveButton} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
