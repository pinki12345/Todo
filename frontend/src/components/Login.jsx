import React, { useState } from "react";
import styles from "./Login.module.css";
import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { PiEyeSlashThin } from "react-icons/pi";
import axios from "axios";
import Loader from "./Loader";
import { endpoints } from "../services/apis";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { setLoading } from "../actions";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.isLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  console.log("Email", email);
  console.log("Password", password);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleLogin = async (e) => {
    console.log("Email, pass", email, password);
    e.preventDefault();
    const toastId = toast.loading("Logging in...");
    dispatch(setLoading(true));

    try {
      const response = await axios.post(endpoints.LOGIN_API, {
        email,
        password,
      });

      const token =
        response?.headers?.authorization?.split(" ")[1] ||
        response?.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data?.user));
        toast.success("Login successful!", {
          position: "top-right",
        });
        navigate("/home/board");
      } else {
        toast.error("Token not found in response headers.", {
          position: "top-right",
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Invalid email or password. Please try again.", {
            position: "top-right",
          });
          setErrors({ general: "Invalid email or password." });
        } else {
          toast.error(
            error.response.data.message ||
              "An error occurred. Please try again.",
            {
              position: "top-right",
            }
          );
          setErrors({
            general:
              error.response.data.message ||
              "An error occurred. Please try again.",
          });
        }
      } else {
        toast.error("An error occurred. Please try again.", {
          position: "top-right",
        });
        setErrors({ general: "An error occurred. Please try again." });
      }
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
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

  if (isLoading) return <Loader />;

  return (
    <div className={styles.loginForm}>
      <h2 className={styles.formTitle}>Login</h2>
      <form onSubmit={handleLogin}>
        <div className={styles.inputWrapper}>
          <MdOutlineMail className={styles.icon} />
          <input
            type="email"
            placeholder="Email"
            className={styles.inputField}
            value={email}
            onChange={handleChangeEmail}
            required
          />
          {errors.email && (
            <span className={styles["error-message"]}>{errors.email}</span>
          )}
        </div>
        <div className={styles.inputWrapper}>
          <CiLock className={styles.icon} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={styles.inputField}
            value={password}
            onChange={handleChangePassword}
            required
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
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
};

export default Login;
