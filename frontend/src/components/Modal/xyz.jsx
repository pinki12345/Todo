// import React, { useState } from "react";
// import axios from "axios";
// import styles from "./AddTaskModal.module.css";
// import { MdDelete } from "react-icons/md";
// import { GoChevronDown } from "react-icons/go";
// import { HiPlus } from "react-icons/hi";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const AddTaskModal = ({ isOpen, onClose }) => {
//   const [title, setTitle] = useState("");
//   const [assign, setAssign] = useState("");
//   const [priority, setPriority] = useState("HIGH PRIORITY");
//   const [checklist, setChecklist] = useState([{ id: Date.now(), text: "" }]);
//   const [dueDate, setDueDate] = useState(null);
//   const [showAssignBox, setShowAssignBox] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const handleAddNew = () => {
//     setChecklist([...checklist, { id: Date.now(), text: "" }]);
//   };

//   const handleInputChange = (id, event) => {
//     const newChecklist = checklist.map((item) =>
//       item.id === id ? { ...item, text: event.target.value } : item
//     );
//     setChecklist(newChecklist);
//   };

//   const handleDelete = (id) => {
//     const newChecklist = checklist.filter((item) => item.id !== id);
//     setChecklist(newChecklist);
//   };

//   const handleDateSelect = (date) => {
//     setDueDate(date);
//     setShowDatePicker(false);
//   };

//   const toggleAssignBox = () => {
//     setShowAssignBox((prev) => !prev);
//   };

//   const handleToday = () => {
//     setDueDate(new Date());
//     setShowDatePicker(false);
//   };

//   const handleClear = () => {
//     setDueDate(null);
//     setShowDatePicker(false);
//   };

//   const handleSave = async () => {
//     const checklistItems = checklist.map((item) => ({ text: item.text }));
//     try {
//       const response = await axios.post("http://localhost:3000/api/v1/create", {
//         title,
//         Assign: assign,
//         status: "TO-DO", // You can add a state if status is dynamic
//         priority,
//         dueDate,
//         checklist: checklistItems,
//       });
//       console.log("Task created:", response.data);
//       onClose(); // Close modal after successful save
//     } catch (error) {
//       console.error("Error creating task:", error);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalContent}>
//         <p>
//           Title <span className={styles.required}>*</span>
//         </p>
//         <input
//           type="text"
//           placeholder="Enter Task Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className={styles.input}
//         />

//         <div className={styles.priorityGroup}>
//           <p>
//             Select Priority <span className={styles.required}>*</span>
//           </p>
//           <button
//             className={`${styles.priorityButton} ${styles.highPriority}`}
//             onClick={() => setPriority("HIGH PRIORITY")}
//           >
//             High Priority
//           </button>
//           <button
//             className={`${styles.priorityButton} ${styles.moderatePriority}`}
//             onClick={() => setPriority("MODERATE PRIORITY")}
//           >
//             Moderate Priority
//           </button>
//           <button
//             className={`${styles.priorityButton} ${styles.lowPriority}`}
//             onClick={() => setPriority("LOW PRIORITY")}
//           >
//             Low Priority
//           </button>
//         </div>

//         <div className={styles.assignContainer}>
//           <p>Assign to</p>
//           <div className={styles.inputWrapperForAssign}>
//             <input
//               type="text"
//               placeholder="Add an assignee"
//               value={assign}
//               onChange={(e) => setAssign(e.target.value)}
//               className={styles.inputForAssignee}
//             />
//             <GoChevronDown
//               className={styles.chevronIcon}
//               onClick={toggleAssignBox}
//             />
//           </div>
//         </div>
//         {showAssignBox && (
//           <div className={styles.assignBox}>
//             <p>Email</p>
//             <button className={styles.assignButton}>Assign</button>
//           </div>
//         )}
//         <p className={styles.checklistText}>
//           Checklist ({checklist.length}/3){" "}
//           <span className={styles.required}>*</span>
//         </p>
//         {checklist.map((item) => (
//           <div key={item.id} className={styles.checklistItem}>
//             <div className={styles.inputWrapper}>
//               <input
//                 type="text"
//                 placeholder="Add a task"
//                 value={item.text}
//                 onChange={(e) => handleInputChange(item.id, e)}
//                 className={styles.checklistInput}
//               />
//               <MdDelete
//                 onClick={() => handleDelete(item.id)}
//                 className={styles.deleteIcon}
//               />
//             </div>
//           </div>
//         ))}

//         <button onClick={handleAddNew} className={styles.addButton}>
//           <HiPlus /> Add New
//         </button>
//         <div className={styles.footer}>
//           <div className={styles.dateContainer}>
//             <button
//               onClick={() => setShowDatePicker(!showDatePicker)}
//               className={styles.dateButton}
//             >
//               {dueDate ? dueDate.toLocaleDateString() : "Select Due Date"}
//             </button>
//             {showDatePicker && (
//               <div className={styles.datePickerContainer}>
//                 <DatePicker
//                   selected={dueDate}
//                   onChange={handleDateSelect}
//                   inline
//                   className={styles.datePicker}
//                 />
//                 <div className={styles.datePickerButtons}>
//                   <button onClick={handleToday} className={styles.todayButton}>
//                     Today
//                   </button>
//                   <button onClick={handleClear} className={styles.clearButton}>
//                     Clear
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className={styles.CancelSaveButton}>
//             <button onClick={onClose} className={styles.cancelButton}>
//               Cancel
//             </button>
//             <button onClick={handleSave} className={styles.saveButton}>
//               Save
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTaskModal;













import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoPeople } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import styles from "./Board.module.css";
import { VscCollapseAll } from "react-icons/vsc";
import { FaPlus } from "react-icons/fa6";
import AddPeopleModal from "./Modal/AddPeopleModal";
import AddEmailModal from "./Modal/AddEmailModal";
import AddTaskModal from "./Modal/AddTaskModal";
import { endpoints } from "../services/apis";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";
import { formatDate } from "../utils/date";
import { BsThreeDots } from "react-icons/bs";
import DeleteModal from "./Modal/DeleteModal";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

const Board = () => {
  const token =
    useSelector((state) => state.token) || localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddEmailModalOpen, setIsAddEmailModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
   const [tasks, setTasks] = useState([]);
  const [openDropdownTaskId, setOpenDropdownTaskId] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [editingTaskData, setEditingTaskData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("This Week");
  
  const handleDeleteClick = (taskId) => {
    setOpenDropdownTaskId(null);
    setSelectedTaskId(taskId);
    setDeleteModalOpen(true);
  };

  const openAddTaskModal = () => {
    setIsAddTaskModalOpen(true);
  };

  const closeAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
  };

  const handleAddPeopleClick = () => {
    setIsModalOpen(true);
  };

  const closeAddPeopleModal = () => {
    setIsModalOpen(false);
  };

  const openAddEmailModal = () => {
    setIsModalOpen(false);
    setIsAddEmailModalOpen(true);
  };

  const closeAddEmailModal = () => {
    setIsAddEmailModalOpen(false);
  };

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:3000/api/v1/getAllTasks",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       setTasks(
  //         response.data.createdTasks.concat(response.data.assignedTasks)
  //       );
  //     } catch (error) {
  //       console.error("Error fetching tasks:", error);
  //     }
  //   };
  //   fetchTasks();
  // }, [token]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let url = "http://localhost:3000/api/v1/getAllTasks";

        if (selectedOption === "Today") {
          url = "http://localhost:3000/api/v1/tasks/filter/today";
        } else if (selectedOption === "This Week") {
          url = "http://localhost:3000/api/v1/tasks/filter/thisWeek";
        } else if (selectedOption === "This Month") {
          url = "http://localhost:3000/api/v1/tasks/filter/thisMonth";
        }

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(
          response.data.createdTasks.concat(response.data.assignedTasks)
        );
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [token, selectedOption]);


  const toggleChecklist = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId
          ? { ...task, isChecklistOpen: !task.isChecklistOpen }
          : task
      )
    );
  };

  const moveTask = async (taskId, newStatus) => {
    try {
      await axios.put(
        "http://localhost:3000/api/v1/getAndUpdateTaskStatus",
        {
          jobId: taskId,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };

  const updateChecklistItem = async (taskId, index, completed) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/tasks/${taskId}/checklist/${index}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        return data.task;
      } else {
        console.error("Error updating checklist item:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleDropdown = (taskId) => {
    setOpenDropdownTaskId((prevTaskId) =>
      prevTaskId === taskId ? null : taskId
    );
  };

  const handleConfirmDelete = (taskId) => {
    setDeleteModalOpen(false);
    console.log(`Task with ID: ${taskId} has been deleted`);
  };
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };
  const handleUpdate = (taskId) => {
    const taskToEdit = tasks.find((task) => task._id === taskId);
    setEditingTaskData(taskToEdit);
    setIsAddTaskModalOpen(true);
  };

  const handleShare = (taskId) => {
    const shareLink = `http://localhost:5174/Sharedtasks/${taskId}`;
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        toast.success("Link Copied!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy share link.");
      });
  };

  // const renderTasksByStatus = (status) => {
  //   const currentDate = new Date();
  //   return tasks
  //     .filter((task) => task.status === status)
  //     .map((task) => {
  //       const totalChecklistItems = task.checklist.length;
  //       const completedChecklistItems = task.checklist.filter(
  //         (item) => item.completed
  //       ).length;
  //       return (
  //         <div key={task._id} className={styles.card}>
  //           <div className={styles.cardContent}>
  //             <div className={styles.topContainer}>
  //               <div className={styles.priorityContainer}>
  //                 <span
  //                   className={`${styles.priorityDot} ${
  //                     styles[task.priority.replace(" ", "-").toLowerCase()]
  //                   }`}
  //                 ></span>
  //                 <p className={styles.priorityText}>{task.priority}</p>
  //               </div>
  //               <div>
  //                 <BsThreeDots onClick={() => toggleDropdown(task._id)} />
  //               </div>
  //             </div>
  //             {openDropdownTaskId === task._id && (
  //               <div className={styles.dropdownMenu}>
  //                 <button onClick={() => handleUpdate(task._id)}>Edit</button>
  //                 <button onClick={() => handleShare(task._id)}>Share</button>
  //                 <button onClick={() => handleDeleteClick(task._id)}>
  //                   Delete
  //                 </button>
  //               </div>
  //             )}
  //             <p className={styles.title}>{task.title}</p>

  //             <div
  //               className={styles.checklistHeader}
  //               onClick={() => toggleChecklist(task._id)}
  //             >
  //               <span>
  //                 Checklist ({completedChecklistItems}/{totalChecklistItems})
  //               </span>
  //               <div className={styles.iconContainer}>
  //                 {task.isChecklistOpen ? <SlArrowUp /> : <SlArrowDown />}
  //               </div>
  //             </div>
  //             {task.isChecklistOpen && (
  //               <ul className={styles.checklist}>
  //                 {task.checklist.map((item, index) => (
  //                   <div key={index} className={styles.checklistItem}>
  //                     <label style={{ display: "flex", alignItems: "center" }}>
  //                       <input
  //                         type="checkbox"
  //                         checked={item.completed}
  //                         onChange={() =>
  //                           handleCheckboxChange(
  //                             task._id,
  //                             index,
  //                             !item.completed
  //                           )
  //                         }
  //                         style={{
  //                           border: "1px solid gray",
  //                           marginRight: "8px",
  //                           width: "16px",
  //                           height: "16px",
  //                         }}
  //                       />
  //                       {item.text}
  //                     </label>
  //                   </div>
  //                 ))}
  //               </ul>
  //             )}
  //             <div className={styles.dateAndButton}>
  //               <div className={styles.dueDateContainer}>
  //                 <span>{formatDate(task.dueDate)}</span>
  //               </div>
  //               <div className={styles.buttonContainer}>
  //                 {["BACKLOG", "TO-DO", "PROGRESS", "DONE"]
  //                   .filter((s) => s !== task.status)
  //                   .map((s) => (
  //                     <button
  //                       key={s}
  //                       onClick={() => moveTask(task._id, s)}
  //                       className={styles.moveButton}
  //                     >
  //                       {s}
  //                     </button>
  //                   ))}
  //               </div>
  //             </div>
  //           </div>
  //           <DeleteModal
  //             isOpen={isDeleteModalOpen}
  //             onConfirm={handleConfirmDelete}
  //             onCancel={handleCancelDelete}
  //             taskId={selectedTaskId}
  //           />
  //         </div>
  //       );
  //     });
  // };


  // const renderTasksByStatus = (status) => {
  //   const currentDate = new Date();
    
  //   return tasks
  //     .filter((task) => task.status === status)
  //     .map((task) => {
  //       const totalChecklistItems = task.checklist.length;
  //       const completedChecklistItems = task.checklist.filter(
  //         (item) => item.completed
  //       ).length;

  //       const isOverdue = task.dueDate < currentDate && task.status !== "DONE";
  //       const isDone = task.status === "DONE";
  //       let dueDateClass = styles.dueDateGray; 
  
  //       if (isDone) {
  //         dueDateClass = styles.dueDateGreen; 
  //       } else if (isOverdue) {
  //         dueDateClass = styles.dueDateRed; 
  //       }
  
  //       return (
  //         <div key={task._id} className={styles.card}>
  //           <div className={styles.cardContent}>
  //             <div className={styles.topContainer}>
  //               <div className={styles.priorityContainer}>
  //                 <span
  //                   className={`${styles.priorityDot} ${
  //                     styles[task.priority.replace(" ", "-").toLowerCase()]
  //                   }`}
  //                 ></span>
  //                 <p className={styles.priorityText}>{task.priority}</p>
  //               </div>
  //               <div>
  //                 <BsThreeDots onClick={() => toggleDropdown(task._id)} />
  //               </div>
  //             </div>
  //             {openDropdownTaskId === task._id && (
  //               <div className={styles.dropdownMenu}>
  //                 <button onClick={() => handleUpdate(task._id)}>Edit</button>
  //                 <button onClick={() => handleShare(task._id)}>Share</button>
  //                 <button onClick={() => handleDeleteClick(task._id)}>
  //                   Delete
  //                 </button>
  //               </div>
  //             )}
  //             <p className={styles.title}>{task.title}</p>
  
  //             <div
  //               className={styles.checklistHeader}
  //               onClick={() => toggleChecklist(task._id)}
  //             >
  //               <span>
  //                 Checklist ({completedChecklistItems}/{totalChecklistItems})
  //               </span>
  //               <div className={styles.iconContainer}>
  //                 {task.isChecklistOpen ? <SlArrowUp /> : <SlArrowDown />}
  //               </div>
  //             </div>
  //             {task.isChecklistOpen && (
  //               <ul className={styles.checklist}>
  //                 {task.checklist.map((item, index) => (
  //                   <div key={index} className={styles.checklistItem}>
  //                     <label style={{ display: "flex", alignItems: "center" }}>
  //                       <input
  //                         type="checkbox"
  //                         checked={item.completed}
  //                         onChange={() =>
  //                           handleCheckboxChange(
  //                             task._id,
  //                             index,
  //                             !item.completed
  //                           )
  //                         }
  //                         style={{
  //                           border: "1px solid gray",
  //                           marginRight: "8px",
  //                           width: "16px",
  //                           height: "16px",
  //                         }}
  //                       />
  //                       {item.text}
  //                     </label>
  //                   </div>
  //                 ))}
  //               </ul>
  //             )}
  //             <div className={styles.dateAndButton}>
  //               <div className={styles.dueDateContainer}>
  //                 <span className={dueDateClass}>
  //                   {formatDate(task.dueDate)}
  //                 </span>
  //               </div>
  //               <div className={styles.buttonContainer}>
  //                 {["BACKLOG", "TO-DO", "PROGRESS", "DONE"]
  //                   .filter((s) => s !== task.status)
  //                   .map((s) => (
  //                     <button
  //                       key={s}
  //                       onClick={() => moveTask(task._id, s)}
  //                       className={styles.moveButton}
  //                     >
  //                       {s}
  //                     </button>
  //                   ))}
  //               </div>
  //             </div>
  //           </div>
  //           <DeleteModal
  //             isOpen={isDeleteModalOpen}
  //             onConfirm={handleConfirmDelete}
  //             onCancel={handleCancelDelete}
  //             taskId={selectedTaskId}
  //           />
  //         </div>
  //       );
  //     });
  // };


  const renderTasksByStatus = (status) => {
    const currentDate = new Date();
  
    return tasks
      .filter((task) => task.status === status)
      .map((task) => {
        const totalChecklistItems = task.checklist.length;
        const completedChecklistItems = task.checklist.filter(
          (item) => item.completed
        ).length;
  
        const isOverdue = task.dueDate < currentDate && task.status !== "DONE";
        const isDone = task.status === "DONE";
  
        // Set the due date class based on the task's status
        let dueDateClass = styles.dueDateGray; 
        if (isDone) {
          dueDateClass = styles.dueDateGreen; 
        } else if (isOverdue) {
          dueDateClass = styles.dueDateRed; 
        }
  
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
                <div>
                  <BsThreeDots onClick={() => toggleDropdown(task._id)} />
                </div>
              </div>
              {openDropdownTaskId === task._id && (
                <div className={styles.dropdownMenu}>
                  <button onClick={() => handleUpdate(task._id)}>Edit</button>
                  <button onClick={() => handleShare(task._id)}>Share</button>
                  <button onClick={() => handleDeleteClick(task._id)}>
                    Delete
                  </button>
                </div>
              )}
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
                            handleCheckboxChange(
                              task._id,
                              index,
                              !item.completed
                            )
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
                  <span className={dueDateClass}>
                    {formatDate(task.dueDate)}
                  </span>
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
            <DeleteModal
              isOpen={isDeleteModalOpen}
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
              taskId={selectedTaskId}
            />
          </div>
        );
      });
  };
  
  const handleCheckboxChange = async (taskId, index, completed) => {
    const updatedTask = await updateChecklistItem(taskId, index, completed);
    if (updatedTask) {
      const updatedTasks = tasks.map((task) => {
        if (task._id === taskId) {
          return updatedTask;
        }
        return task;
      });
      setTasks(updatedTasks);
    }
  };

  const toggleDateDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  return (
    <div className={styles.boardContainer}>
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <p>Welcome User!</p>
          <div className={styles.addPeople}>
            <p className={styles.BoardText}>Board</p>
            <div className={styles.addPerson} onClick={handleAddPeopleClick}>
              <GoPeople /> Add People
            </div>
          </div>
        </div>
        <div className={styles.dateSection}>
          <p>12th Jan, 2024</p>
          <div>
            {selectedOption}{" "}
            <IoIosArrowDown
              onClick={toggleDateDropdown}
              className={styles.dropdownToggle}
            />
          </div>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <p onClick={() => handleOptionClick("today")}>Today</p>
              <p onClick={() => handleOptionClick("thisWeek")}>This Week</p>
              <p onClick={() => handleOptionClick("thisMonth")}>This Month</p>
            </div>
          )}
        </div>
      </div>
      <div className={styles.boxContainer}>
        <div className={styles.box}>
          <div className={styles.BacklogWithIcon}>
            <span>Backlog</span>
            <VscCollapseAll />
          </div>
          <div className={styles.taskList}>
            {renderTasksByStatus("BACKLOG")}
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.ToDoBox}>
            <span>To Do</span>
            <FaPlus
              onClick={openAddTaskModal}
              className={styles.clickableIcon}
            />
            <VscCollapseAll />
          </div>
          <div className={styles.taskList}>{renderTasksByStatus("TO-DO")}</div>
        </div>
        <div className={styles.box}>
          <div className={styles.InProgressBox}>
            <span>In Progress</span>
            <VscCollapseAll />
          </div>
          <div className={styles.taskList}>
            {renderTasksByStatus("PROGRESS")}
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.DoneBox}>
            <span>Done</span>
            <VscCollapseAll />
          </div>
          <div className={styles.taskList}> {renderTasksByStatus("DONE")}</div>
        </div>
      </div>
      <AddPeopleModal
        isOpen={isModalOpen}
        onClose={closeAddPeopleModal}
        onAddEmail={openAddEmailModal}
      />
      <AddEmailModal
        isOpen={isAddEmailModalOpen}
        onClose={closeAddEmailModal}
      />
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        taskData={editingTaskData}
        onClose={closeAddTaskModal}
      />
    </div>
  );
};

export default Board;
