import React, { useRef, useState } from "react";
// Remove ReactDom before going to production
import ReactDom from "react-dom";

import { supabase } from "../supabaseClient";

import { validatePwd, validateSubmitPwd } from "../helperfuncs.js";

export const SignupModal = ({
  setShowModal,
  handleSignup,
  removeLoginError,
}) => {
  const [usernameTaken, setUsernameTaken] = useState(false);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Before closing the modal, need to ensure the signup was successful
    if (
      formData.password === checkPassword &&
      validateSubmitPwd(formData.password)
    ) {
      // Here is where the signup info is sent to the DB
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
        console.log("error here", error);
        /***** Need to add notification to tell user if signup failed  *****/
        // if data session is null, signup was successful
      } else if (data.session === null) {
        console.log("no error", data);
        // check if user is already signed up
        if (data.user.identities.length > 0) {
          handleSignup();
          setShowModal(false);
        } else {
          setUsernameTaken(true);
        }
      } else {
        console.log("neither?");
        setShowModal(false);
      }
    }
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
