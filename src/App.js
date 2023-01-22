import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import axios from "axios";
import Auth from "./Auth";
import Account from "./Account";

export default function App() {
  const [session, setSession] = useState(null);

  const checkPrivileges = (id) => {
    axios
      .get("/privileges", { params: { id: id } })
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // DBcheck();

    axios
      .get("/ping")
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <Auth checkPrivileges={checkPrivileges} />
      ) : (
        <Account key={session.user.id} session={session} />
      )}
    </div>
  );
}
