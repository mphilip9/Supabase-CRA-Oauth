import "./App.css";
import React from "react";
import Home from "./Home";
import PasswordReset from "./Components/PasswordReset";
import { Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/changepassword" element={<PasswordReset />} />
    </Routes>
  );
}
