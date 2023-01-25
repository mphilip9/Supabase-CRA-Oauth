import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import axios from "axios";
import Home from "./Home";
import PasswordReset from "./PasswordReset";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/changepassword" element={<PasswordReset />} />
    </Routes>
  );
}
