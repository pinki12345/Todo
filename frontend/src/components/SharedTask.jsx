import React, { useEffect, useState } from "react";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import styles from "./SharedTask.module.css";
import { useParams } from "react-router-dom";

const SharedTask = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(
          `https://todo-zomw.onrender.com/api/v1/getTaskById/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTask(data);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    fetchTask();
  }, [id]);

  const toggleChecklist = (taskId) => {
    if (task._id === taskId) {
      setTask((prevTask) => ({
        ...prevTask,
        isChecklistOpen: !prevTask.isChecklistOpen,
      }));
    }
  };

  const handleCheckboxChange = (taskId, index, completed) => {
    setTask((prevTask) => {
      const updatedChecklist = prevTask.checklist.map((item, idx) =>
        idx === index ? { ...item, completed } : item
      );
      return { ...prevTask, checklist: updatedChecklist };
    });
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  const totalChecklistItems = task.checklist.length;
  const completedChecklistItems = task.checklist.filter(
    (item) => item.completed
  ).length;

  return (
    <div key={task._id} className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.topContainer}>
          <div className={styles.priorityContainer}>
            <span
              className={`${styles.priorityDot} ${
                styles[task.priority.replace(" ", "-").toLowerCase()]
              }`}
            ></span>
            <p className={styles.priorityText}>{task.priority}</p>
          </div>
        </div>

        <p className={styles.title}>{task.title}</p>

        <div
          className={styles.checklistHeader}
          onClick={() => toggleChecklist(task._id)}
        >
          <span>
            Checklist ({completedChecklistItems}/{totalChecklistItems})
          </span>
          <div className={styles.iconContainer}>
            {task.isChecklistOpen ? <SlArrowUp /> : <SlArrowDown />}
          </div>
        </div>
        {task.isChecklistOpen && (
          <ul className={styles.checklist}>
            {task.checklist.map((item, index) => (
              <div key={index} className={styles.checklistItem}>
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() =>
                      handleCheckboxChange(task._id, index, !item.completed)
                    }
                    style={{
                      border: "1px solid gray",
                      marginRight: "8px",
                      width: "16px",
                      height: "16px",
                    }}
                  />
                  {item.text}
                </label>
              </div>
            ))}
          </ul>
        )}
        <div className={styles.dateAndButton}>
          <div className={styles.dueDateContainer}>
            <span>{formatDate(task.dueDate)}</span>
          </div>
          <div className={styles.buttonContainer}>
            {["BACKLOG", "TO-DO", "PROGRESS", "DONE"]
              .filter((s) => s !== task.status)
              .map((s) => (
                <button
                  key={s}
                  onClick={() => moveTask(task._id, s)}
                  className={styles.moveButton}
                >
                  {s}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedTask;
