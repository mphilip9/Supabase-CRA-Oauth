import { useState } from "react";
import { supabase } from "../supabaseClient";

import { SignupModal } from "./SignupModal";
import CupAnimation from "./CupAnimation";

export default function Auth() {
  // to render loading animation
  const [loading, setLoading] = useState(false);

  // login with email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signup notification
  const [signupSuccess, setSignupSuccess] = useState(false);
  // toggle login error notification
  const [loginError, setLoginError] = useState(false);
  // trigger signup
  const [showModal, setShowModal] = useState(false);

  // Reset Password functionality
  const [resetPassword, setResetPassword] = useState(false);
  const [sendEmail, setSendEmail] = useState("");

  // password reset functionality
  const changePassword = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      sendEmail,
      {
        redirectTo: "https://stark-login.herokuapp.com/changepassword",
      }
    );
    setSendEmail("");
    if (error) {
      /***** build out error functionality to notify user *****/
    }
    if (data) {
      const elem = document.getElementById("password-reset-notification");
      elem.style.display = "block";
      setLoginError(false);
    }
  };

  // Modal functionality
  const openModal = () => {
    setShowModal(true);
  };

  // toggle successful signup info
  const handleSignup = () => {
    setSignupSuccess(true);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      setLoginError(true);
    } else if (data) {
      setLoginError(false);
    }
  };

  const removeLoginError = () => {
    setLoginError(false);
  };

  // Magic Link login
  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setLoading(true);
  //     const { error } = await supabase.auth.signInWithOtp({ email });
  //     if (error) throw error;
  //     alert("Check your email for the login link!");
  //   } catch (error) {
  //     alert(error.error_description || error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      setLoginError(true);
    }
  }

  return (
    <div className="row flex-center flex">
      <div className="col-6 form-widget" aria-live="polite">
        <div className="slogan-container">
          <h1 className="header">Straw Aficionado</h1>
          <div className="slogan">What's a drink without a straw?</div>
        </div>
        <CupAnimation />
        {signupSuccess ? (
          <div>Signup successful. Please confirm your email to login.</div>
        ) : null}
        {loginError ? (
          <div style={{ color: "#FCC" }}>
            There was a problem with your login.
          </div>
        ) : null}
        <form onSubmit={handleEmailLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="inputField"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            id="password"
            className="inputField"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="button block" aria-live="polite">
            Login
          </button>
        </form>
        <button onClick={openModal}>Signup</button>
        {showModal ? (
          <SignupModal
            removeLoginError={removeLoginError}
            setShowModal={setShowModal}
            handleSignup={handleSignup}
          />
        ) : null}

        <button
          onClick={() => {
            setResetPassword(true);
          }}
        >
          Forgot Password?
        </button>
        {resetPassword ? (
          <>
            <label>Enter Email to reset password</label>
            <input
              onChange={(e) => {
                setSendEmail(e.target.value);
              }}
            ></input>
            <button onClick={changePassword} style={{ width: "100%" }}>
              Send Email
            </button>
            <p
              id="password-reset-notification"
              style={{
                display: "none",
                color: "green",
              }}
            >
              Check your email for a code (it might be in spam)
            </p>
          </>
        ) : null}

        <button onClick={signInWithGoogle}>
          Sign in with Google
          <img
            alt="google-logo"
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            style={{ float: "right", height: "1em" }}
          ></img>
        </button>
      </div>
    </div>
  );
}
