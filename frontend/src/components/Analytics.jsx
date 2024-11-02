import React, { useEffect, useState } from "react";
import styles from "./Analytics.module.css";

const Analytics = () => {
  const [taskCounts, setTaskCounts] = useState(null);

  useEffect(() => {
    const fetchTaskCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://todo-zomw.onrender.com/api/v1/count", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setTaskCounts(data.taskCounts);
        }
      } catch (error) {
        console.error("Error fetching task counts:", error);
      }
    };

    fetchTaskCounts();
  }, []);

  if (!taskCounts) {
    return <div>Loading...</div>;
  }

  const taskLabels = [
    { label: "Backlog Tasks", count: taskCounts.BACKLOG },
    { label: "To-Do Tasks", count: taskCounts["TO-DO"] },
    { label: "In-Progress Tasks", count: taskCounts.PROGRESS },
    { label: "Completed Tasks", count: taskCounts.DONE },
    { label: "High Priority Tasks", count: taskCounts["HIGH PRIORITY"] },
    { label: "Moderate Priority Tasks", count: taskCounts["MODERATE PRIORITY"] },
    { label: "Low Priority Tasks", count: taskCounts["LOW PRIORITY"] },
    { label: "Due Date Set", count: taskCounts.DUE_DATE_SET },
  ];

  return (
    <div className={styles.analyticsContainer}>
      <h3>Analytics</h3>
      <div className={styles.AnalyticsBox}>
        <div className={styles.box}>
          {taskLabels.slice(0, 4).map(({ label, count }) => (
            <div className={styles.taskItem} key={label}>
              <span className={styles.bullet}></span>
              <span className={styles.taskLabel}>{label}</span>
              <span className={styles.taskCount}>{count}</span>
            </div>
          ))}
        </div>
        <div className={styles.box}>
          {taskLabels.slice(4).map(({ label, count }) => (
            <div className={styles.taskItem} key={label}>
              <span className={styles.bullet}></span>
              <span className={styles.taskLabel}>{label}</span>
              <span className={styles.taskCount}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
