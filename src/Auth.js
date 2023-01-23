import { useState } from "react";
import { supabase } from "./supabaseClient";
import { Modal } from "./Modal";

export default function Auth({ checkPrivileges }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const [showModal, setShowModal] = useState(false);

  // Modal functionality
  const openModal = () => {
    setShowModal(true);
  };

  // toggle successful signup info
  const handleSignup = () => {
    setSignupSuccess(true);
  };

  const DBcheck = async () => {
    const { data, error } = await supabase.from("profiles").select();
    if (error) {
      console.log(error);
    } else if (data) {
      console.log(data);
    }
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
      DBcheck();
      // checkPrivileges(data.user.id);
    }
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
      DBcheck();
      console.log(data);
    }
  }

  return (
    <div className="row flex-center flex">
      <div className="col-6 form-widget" aria-live="polite">
        <h1 className="header">Straw Aficionado</h1>
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
          <Modal setShowModal={setShowModal} handleSignup={handleSignup} />
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
