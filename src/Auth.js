import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useSpring, animated } from "@react-spring/web";

import { Modal } from "./Modal";

export default function Auth({ checkPrivileges }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // Remove me and replace this functionality with a modal
  const [resetPassword, setResetPassword] = useState(false);
  const [sendEmail, setSendEmail] = useState("");

  const [showModal, setShowModal] = useState(false);

  // React spring animation
  const [springs, api] = useSpring(() => ({
    from: {
      backgroundColor: "#f75f48",
      clipPath: `inset(10% 0 0 0)`,
    },
    config: { duration: 1000 },
  }));
  const [springState, setSpringState] = useState([10, 25]);
  const handleClickAnimation = () => {
    api.start({
      from: {
        backgroundColor: "#f75f48",
        clipPath: `inset(${springState[0]}% 0 0 0)`,
      },
      to: {
        backgroundColor: "#f75f48",
        clipPath: `inset(${springState[1]}% 0 0 0)`,
      },
    });

    if (springState[0] > 70) {
      const elem = document.getElementById("secret-message");
      elem.style.display = "block";
    } else {
      setSpringState((prevValues) => [prevValues[0] + 15, prevValues[1] + 15]);
    }
  };

  // password reset functionality
  const changePassword = async (e) => {
    console.log(process.env.REACT_APP_PASSWORD_REDIRECT);
    e.preventDefault();
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      sendEmail,
      {
        redirectTo: "https://stark-login.herokuapp.com/changepassword",
      }
    );
    setSendEmail("");
    if (error) {
      console.log("error");
    }
    if (data) {
      const elem = document.getElementById("password-reset-notification");
      elem.style.display = "block";
      console.log("success", data);
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
      console.log(error);
      setLoginError(true);
    } else if (data) {
    }
  };

  const removeLoginError = () => {
    setLoginError(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (data) {
      console.log(data);
    }
  }

  return (
    <div className="row flex-center flex">
      <div className="col-6 form-widget" aria-live="polite">
        <h1 className="header">Straw Aficionado</h1>
        <div className="cup-animation">
          <div className="cup">
            <div className="straw" onClick={handleClickAnimation}></div>
            <div className="lid"></div>
            <animated.div
              onClick={handleClickAnimation}
              style={{
                marginLeft: "1px",
                width: "95px",
                height: "198px",
                backgroundColor: "white",
                zIndex: 3,
                ...springs,
              }}
            ></animated.div>
          </div>
          <div id="secret-message" style={{ display: "none" }}>
            Ahh.
          </div>
        </div>
        {signupSuccess ? (
          <div>Signup successful. Please confirm your email to login.</div>
        ) : null}
        {loginError ? (
          <div style={{ color: "red" }}>
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
          <Modal
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
          <div>
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
              style={{ display: "none", color: "green" }}
            >
              Check your email for a code (it might be in spam)
            </p>
          </div>
        ) : null}

        <button onClick={signInWithGoogle}>
          Click me to sign in with google
        </button>
        <p className="description">
          Sign in via magic link with your email below
        </p>
        {loading ? (
          "Sending magic link..."
        ) : (
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="button block" aria-live="polite">
              Send magic link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
