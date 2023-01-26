import { React, useEffect, useRef, useState } from "react";
import { validatePwd, validateSubmitPwd } from "../helperfuncs.js";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [checkPassword, setCheckPassword] = useState("");
  const [matchPassword, setMatchPassword] = useState(true);
  const [validatePassword, setValidatePassword] = useState({
    length: ["#FCC", "⚠"],
    number: ["#FCC", "⚠"],
    special: ["#FCC", "⚠"],
    capital: ["#FCC", "⚠"],
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    // validate password for min requirements
    if (name === "password") {
      setValidatePassword(validatePwd(value));
    }

    // check if passwords are the same
    if (name === "checkPassword" && value !== formData.password) {
      setCheckPassword(value);
      setMatchPassword(false);
    } else if (name === "checkPassword") {
      setCheckPassword(value);
      setMatchPassword(true);
    } else {
      if (value === checkPassword) {
        setMatchPassword(true);
      } else {
        setMatchPassword(false);
      }
      // set form data
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.password === checkPassword &&
      validateSubmitPwd(formData.password)
    ) {
      const { data, error } = await supabase.auth.updateUser({
        password: formData.password,
      });
      if (data) {
        navigate("/");
      }
      if (error) {
        alert("There was an error updating your password. Please try again.");
        navigate("/");
      }
    }
  };

  return (
    <div className="password-reset-container">
      <h1>Enter your new password below:</h1>
      <form onSubmit={handleSubmit}>
        <figure>
          <figcaption>Password Requirements:</figcaption>
          <ul>
            <li style={{ color: validatePassword.length[0] }}>
              {validatePassword.length[1]} length 8
            </li>
            <li style={{ color: validatePassword.number[0] }}>
              {" "}
              {validatePassword.number[1]} 1 number
            </li>
            <li style={{ color: validatePassword.special[0] }}>
              {validatePassword.special[1]} 1 special character
            </li>
            <li style={{ color: validatePassword.capital[0] }}>
              {validatePassword.capital[1]} 1 Capital letter
            </li>
          </ul>
        </figure>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <br />
        {matchPassword ? null : (
          <p style={{ color: "#FCC", fontSize: ".9em" }}>
            Passwords do not match
          </p>
        )}
        <label>
          Retype password:
          <input
            type="password"
            name="checkPassword"
            value={checkPassword}
            onChange={handleChange}
          />
        </label>
        <div className="center-form-items">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default PasswordReset;
