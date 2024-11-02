import React, { useState } from "react";
import styles from "./LoginSignup.module.css";
import circle from "../assets/circle.png";
import img from "../assets/img.png";
import Login from "../components/Login";
import Register from "../components/Register";

const LoginSignup = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => {
    setIsRegistering((prevIsRegistering) => !prevIsRegistering);
  };
  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.leftPart}>
          <div className={styles.imageWrapper}>
            <img
              src={circle}
              alt="Background Image"
              className={styles.astronaut}
            />
            <img
              src={img}
              alt="Overlay Astronaut"
              className={styles.overlayImage}
            />
          </div>
          <h2>Welcome aboard my friend</h2>
          <p>Just a couple of clicks and we start</p>
        </div>
      </div>

      <div className={styles.rightSide}>
        {isRegistering ? <Register setIsRegistering={setIsRegistering}/> : <Login setIsRegistering={setIsRegistering}/>}
        <p className={styles.registerLink}>
          {isRegistering ? " Have an account?" : "Have no account yet?"}
        </p>
        <button onClick={toggleForm} className={styles.RegisterButton}>
          {isRegistering ? "Login" : "Register"}
        </button>
      </div>
    </div>
  );
};

export default LoginSignup;
