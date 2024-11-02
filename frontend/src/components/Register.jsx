import React, { useState } from "react";
import styles from "./Register.module.css";
import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { PiEyeSlashThin } from "react-icons/pi";
import nameSvg from "../assets/name.svg";
import axios from "axios";
import { endpoints } from "../services/apis";
import { toast } from "react-hot-toast";
import { setLoading } from "../actions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";

const Register = ({ setIsRegistering }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.isLoading);
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  const validate = () => {
    const newErrors = {};

    if (isSignUp && !name) {
      newErrors.name = "Invalid name";
    }

    if (!email) {
      newErrors.email = "Invalid Email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!password) {
      newErrors.password = "Weak password";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isSignUp && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const toastId = toast.loading("Creating account...");
      dispatch(setLoading(true));

      try {
        const response = await axios.post(
          endpoints.SIGNUP_API,
          {
            name,
            email,
            password,
            confirmPassword,
          }
        );

        if (response.data.success) {
          toast.success("Account created successfully!", {
            position: "top-right",
          });
          setIsRegistering(false);

          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        } else {
          toast.error(
            response.data.message || "An error occurred. Please try again.",
            {
              position: "top-right",
            }
          );
        }
      } catch (error) {
        console.error("An error occurred:", error);
        if (error.response && error.response.status === 409) {
          toast.error("User already exists. Please log in to continue.", {
            position: "top-right",
          });
        } else {
          toast.error("An error occurred. Please try again.", {
            position: "top-right",
          });
        }
      } finally {
        toast.dismiss(toastId);
        dispatch(setLoading(false));
      }
    }
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prevErrors) => ({ ...prevErrors, name: null }));
    }
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prevErrors) => ({ ...prevErrors, email: null }));
    }
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prevErrors) => ({ ...prevErrors, password: null }));
    }
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: null }));
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className={styles.registerForm}>
      <h2 className={styles.formTitle}>Register</h2>
      <form onSubmit={handleSignup}>
        <div className={styles.inputWrapper}>
          <img src={nameSvg}></img>
          <input
            type="text"
            value={name}
            placeholder="Name"
            className={styles.inputField}
            onChange={handleChangeName}
          />
          {errors.name && (
            <span className={styles["error-message"]}>{errors.name}</span>
          )}
        </div>
        <div className={styles.inputWrapper}>
          <MdOutlineMail className={styles.icon} />
          <input
            type="email"
            value={email}
            placeholder="Email"
            className={styles.inputField}
            onChange={handleChangeEmail}
          />
          {errors.email && (
            <span className={styles["error-message"]}>{errors.email}</span>
          )}
        </div>
        <div className={styles.inputWrapper}>
          <CiLock className={styles.icon} />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Password"
            className={styles.inputField}
            onChange={handleChangePassword}
          />
          {showPassword ? (
            <PiEyeSlashThin
              onClick={togglePasswordVisibility}
              className={styles.eyeIcon}
            />
          ) : (
            <IoEyeOutline
              onClick={togglePasswordVisibility}
              className={styles.eyeIcon}
            />
          )}
          {errors.password && (
            <span className={styles["error-message"]}>{errors.password}</span>
          )}
        </div>
        <div className={styles.inputWrapper}>
          <CiLock className={styles.icon} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            placeholder="Confirm Password"
            className={styles.inputField}
            onChange={handleChangeConfirmPassword}
          />
          {showConfirmPassword ? (
            <PiEyeSlashThin
              onClick={toggleConfirmPasswordVisibility}
              className={styles.eyeIcon}
            />
          ) : (
            <IoEyeOutline
              onClick={toggleConfirmPasswordVisibility}
              className={styles.eyeIcon}
            />
          )}
          {errors.confirmPassword && (
            <span className={styles["error-message"]}>
              {errors.confirmPassword}
            </span>
          )}
        </div>
        <button type="submit" className={styles.submitButton}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
