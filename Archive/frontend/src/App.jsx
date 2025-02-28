//import new

import { Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import SignupPage from "./Pages/SignupPage";
import SetPasswordPage from "./Pages/SetPasswordPage";
import LoginPage from "./Pages/LoginPage";
import Chatbox from "./Pages/Chatbox";

import "./index.css";
import Messenger from "./Pages/Messenger";

function App() {
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chatbox" element={<Chatbox />} />
        <Route path="/chatbox2" element={<Messenger />} />
        <Route path="*" element={<div></div>} />
      </Routes>
    </>
  );
}

export default App;

// 1. Models - messages, group message, users, groups
// 1. socket - new message  in chat or a new chat and save in db and save in LS
// 2. socket - new message in group or a new group and save in db and save in LS
// 3. photo and emoji after that
