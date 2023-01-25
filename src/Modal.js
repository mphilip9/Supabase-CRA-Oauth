import React, { useRef, useState } from "react";
// Remove ReactDom before going to production
import ReactDom from "react-dom";

import { supabase } from "./supabaseClient";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import { validatePwd, validateSubmitPwd } from "./helperfuncs.js";

export const Modal = ({ setShowModal, handleSignup }) => {
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");
  const [matchPassword, setMatchPassword] = useState(true);
  const [validatePassword, setValidatePassword] = useState({
    length: ["red", "⚠"],
    number: ["red", "⚠"],
    special: ["red", "⚠"],
    capital: ["red", "⚠"],
  });

  // const [captchaToken, setCaptchaToken] = useState();
  // const captcha = useRef();

  // close the modal when clicking outside the modal.
  // const modalRef = useRef();
  // const closeModal = (e) => {
  //   if (e.target === modalRef.current) {
  //     setShowModal(false);
  //   }
  // };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    // Before closing the modal, need to ensure the signup was successful
    if (
      formData.password === checkPassword &&
      validateSubmitPwd(formData.password)
    ) {
      // Here is where the signup info is sent to the DB
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        // option: { captchaToken },
      });
      if (error) {
        // read the error message, it will tell you if account exists or not
        console.log("error signing up", error);
        // if data session is null, signup was successful
      } else if (data.session === null) {
        // check if user is already signed up
        if (data.user.identities.length > 0) {
          console.log("new user created", data);
          handleSignup();
          setShowModal(false);
        } else {
          setUsernameTaken(true);
        }
      } else {
        setShowModal(false);
      }
    }
    // captcha.current.resetCaptcha();
  };
  //render the modal JSX in the portal div.
  return ReactDom.createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <div className="form-container">
          <div className="center-form-items">
            <h1>Signup</h1>
          </div>
          <form style={{ width: "100%" }} onSubmit={handleSubmit}>
            {usernameTaken ? (
              <p style={{ color: "red" }}>
                Already signed up, sign in instead?
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
              <p style={{ color: "red", fontSize: ".9em" }}>
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
            {/* <div className="center-form-items">
              <HCaptcha
                ref={captcha}
                theme={"dark"}
                size={"compact"}
                sitekey="819968fe-ac7f-4fc0-a128-67a71e43b7d8"
                onVerify={(token) => {
                  setCaptchaToken(token);
                }}
              />
            </div> */}
            <div className="center-form-items">
              <button type="submit">Submit</button>
            </div>
          </form>
          <div className="center-form-items">
            <button
              onClick={() => {
                setShowModal(false);
              }}
              name="close-signup-modal"
              type="button"
              className="close-button"
            >
              X
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
};
