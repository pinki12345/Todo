import "./App.css";
import Error from "./pages/Error";
import LoginSignup from "./pages/LoginSignup";
import PrivateRoute from "./components/PrivateRoute";
import Board from "./components/Board";
import Analytics from "./components/Analytics";
import Setting from "./components/Setting";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SharedTask from "./components/SharedTask";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<LoginSignup />} />
        <Route
          path="/home/*"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        >
          <Route path="board" element={<Board />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Setting />} />
        </Route>
        <Route path="/Sharedtasks/:id" element={<SharedTask/>} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
