import React, { useRef, useState } from "react";
// Remove ReactDom before going to production
import ReactDom from "react-dom";

import { supabase } from "./supabaseClient";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import validatePwd from "./helperfuncs.js";

export const Modal = ({ setShowModal, handleSignup }) => {
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");
  const [matchPassword, setMatchPassword] = useState(true);
  const [validatePassword, setValidatePassword] = useState(true);

  const [captchaToken, setCaptchaToken] = useState();
  const captcha = useRef();

  // close the modal when clicking outside the modal.
  const modalRef = useRef();
  const closeModal = (e) => {
    if (e.target === modalRef.current) {
      setShowModal(false);
    }
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    // validate password for min requirements
    if (
      (name === "checkPassword" || name === "password") &&
      validatePwd(value)
    ) {
      setValidatePassword(true);
    } else if (name === "checkPassword" || name === "password") {
      setValidatePassword(false);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    // Before closing the modal, need to ensure the signup was successful
    if (formData.password === checkPassword) {
      // Here is where the signup info is sent to the DB
      const {
        data,
        error,
        options: { captchaToken },
      } = await supabase.auth.signUp(formData);
      if (error) {
        // read the error message, it will tell you if account exists or not
        console.log(error);
        setUsernameTaken(true);
        // if data session is null, signup was successful
      } else if (data.session === null) {
        handleSignup();
        setShowModal(false);
        setCheckPassword("");
        setMatchPassword(true);
        setFormData({
          email: "",
          password: "",
        });
      } else {
        setCheckPassword("");
        setMatchPassword(true);
        setFormData({
          email: "",
          password: "",
        });
        setShowModal(false);
      }
    }
    captcha.current.resetCaptcha();
  };
  //render the modal JSX in the portal div.
  return ReactDom.createPortal(
    <div className="modal-overlay" ref={modalRef} onClick={closeModal}>
      <div className="modal">
        <div className="center-form-items">
          <h1>Signup</h1>
        </div>
        <form onSubmit={handleSubmit}>
          {usernameTaken ? (
            <p style={{ color: "red" }}>
              Account already exists, please exit and login
            </p>
          ) : null}
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <br />
          {validatePassword ? null : (
            <p style={{ color: "red" }}>
              Minimum password length 8, must contain at least 1 number/1
              special character/1 uppercase
            </p>
          )}
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
          <label>
            Retype password:
            <input
              type="password"
              name="checkPassword"
              value={checkPassword}
              onChange={handleChange}
            />
          </label>
          {matchPassword ? null : (
            <p style={{ color: "red" }}>Passwords do not match</p>
          )}
          <HCaptcha
            ref={captcha}
            sitekey="819968fe-ac7f-4fc0-a128-67a71e43b7d8"
            onVerify={(token) => {
              setCaptchaToken(token);
            }}
          />
          <div className="center-form-items">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
};
