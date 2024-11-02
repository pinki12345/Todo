// import React, { useState } from "react";
// import styles from "./Setting.module.css";
// import { MdOutlineMail } from "react-icons/md";
// import { CiLock } from "react-icons/ci";
// import { IoEyeOutline } from "react-icons/io5";
// import { PiEyeSlashThin } from "react-icons/pi";
// import nameSvg from "../assets/name.svg";

// const Setting = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword((prevShowPassword) => !prevShowPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(
//       (prevShowConfirmPassword) => !prevShowConfirmPassword
//     );
//   };

//   return (
//     <div className={styles.settingForm}>
//       <h2 className={styles.formTitle}>Settings</h2>
//       <form>
//         <div className={styles.inputWrapper}>
//           <img src={nameSvg}></img>
//           <input type="text" placeholder="Name" className={styles.inputField} />
//         </div>
//         <div className={styles.inputWrapper}>
//           <MdOutlineMail className={styles.icon} />
//           <input
//             type="email"
//             placeholder="Update Email"
//             className={styles.inputField}
//           />
//         </div>
//         <div className={styles.inputWrapper}>
//           <CiLock className={styles.icon} />
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Old Password"
//             className={styles.inputField}
//           />
//           {showPassword ? (
//             <PiEyeSlashThin
//               onClick={togglePasswordVisibility}
//               className={styles.eyeIcon}
//             />
//           ) : (
//             <IoEyeOutline
//               onClick={togglePasswordVisibility}
//               className={styles.eyeIcon}
//             />
//           )}
//         </div>
//         <div className={styles.inputWrapper}>
//           <CiLock className={styles.icon} />
//           <input
//             type={showConfirmPassword ? "text" : "password"}
//             placeholder="New Password"
//             className={styles.inputField}
//           />
//           {showConfirmPassword ? (
//             <PiEyeSlashThin
//               onClick={toggleConfirmPasswordVisibility}
//               className={styles.eyeIcon}
//             />
//           ) : (
//             <IoEyeOutline
//               onClick={toggleConfirmPasswordVisibility}
//               className={styles.eyeIcon}
//             />
//           )}
//         </div>
//         <button type="submit" className={styles.submitButton}>
//           Update
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Setting;

import React, { useState } from "react";
import styles from "./Setting.module.css";
import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { PiEyeSlashThin } from "react-icons/pi";
import nameSvg from "../assets/name.svg";

const Setting = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword((prev) => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const userData = {
      name,
      email,
      oldPassword,
      newPassword,
    };

    try {
      const response = await fetch("http://localhost:3000/api/v1/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (data.success) {
        setMessage("Settings updated successfully!");
        localStorage.removeItem("token");
        window.location.href = "/auth";
      } else {
        setMessage(data.message || "Failed to update settings.");
      }
    } catch (error) {
      setMessage("Error updating settings.");
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.settingForm}>
      <h2 className={styles.formTitle}>Settings</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <img src={nameSvg} alt="Name Icon" />
          <input
            type="text"
            placeholder="Name"
            className={styles.inputField}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.inputWrapper}>
          <MdOutlineMail className={styles.icon} />
          <input
            type="email"
            placeholder="Update Email"
            className={styles.inputField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.inputWrapper}>
          <CiLock className={styles.icon} />
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old Password"
            className={styles.inputField}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          {showOldPassword ? (
            <PiEyeSlashThin
              onClick={toggleOldPasswordVisibility}
              className={styles.eyeIcon}
            />
          ) : (
            <IoEyeOutline
              onClick={toggleOldPasswordVisibility}
              className={styles.eyeIcon}
            />
          )}
        </div>
        <div className={styles.inputWrapper}>
          <CiLock className={styles.icon} />
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            className={styles.inputField}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {showNewPassword ? (
            <PiEyeSlashThin
              onClick={toggleNewPasswordVisibility}
              className={styles.eyeIcon}
            />
          ) : (
            <IoEyeOutline
              onClick={toggleNewPasswordVisibility}
              className={styles.eyeIcon}
            />
          )}
        </div>
        <button type="submit" className={styles.submitButton}>
          Update
        </button>
      </form>
    </div>
  );
};

export default Setting;
