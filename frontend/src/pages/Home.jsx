import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Board from "../components/Board";
import Analytics from "../components/Analytics";
import Setting from "../components/Setting";

const Home = () => {
  const [activeComponent, setActiveComponent] = useState("Board");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Board":
        return <Board />;
      case "Analytics":
        return <Analytics />;
      case "Setting":
        return <Setting />;
      default:
        return <Board />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setActiveComponent={setActiveComponent} />
      <div style={{ padding: "20px", width: "100%" }}>{renderComponent()}</div>
    </div>
  );
};

export default Home;
