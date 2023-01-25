import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Avatar from "./Avatar";
import Admin from "./Admin";

const Account = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [adminNavStyle, setAdminNavStyle] = useState(["solid 1px gray", ""]);

  const [userData, setUserData] = useState([
    {
      id: "",
      updated_at: "",
      username: "",
      full_name: null,
      avatar_url: "",
      website: "",
    },
  ]);
  const updateUserData = (deleteId) => {
    console.log("updated user data");
    setUserData(userData.filter((user) => user.id !== deleteId));
  };
  const [admin, setAdmin] = useState(false);
  const [togglePage, setTogglePage] = useState("profile");

  const handleTogglePage = (e) => {
    if (e.target.name === "admin") {
      setAdmin(true);
      setTogglePage("admin");
      setAdminNavStyle(["", "solid 1px gray"]);
    } else if (e.target.name === "profile") {
      setTogglePage("profile");
      setAdminNavStyle(["solid 1px gray", ""]);
    }
  };

  // Fetch all profiles
  const getProfiles = async () => {
    let { data, error, status } = await supabase.from("profiles").select();
    if (data) {
      setAdmin(true);
      setUserData(data);
      console.log("data here", userData);
    } else {
      console.log("hmm", data);
    }
  };

  // Check admin status
  const checkStatus = async () => {
    try {
      const { user } = session;

      const { data, error } = await supabase
        .from("admin")
        .select("id")
        .eq("id", 1);

      if (error) {
        throw error;
      }

      if (data.length > 0) {
        console.log("admin", data);
        getProfiles();
      }
    } catch (error) {
      console.log("get profiles", error);
    } finally {
    }
  };

  useEffect(() => {
    getProfile();
    checkStatus();
  }, [session]);

  // Fetch data for profile page
  const getProfile = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`id, username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUserId(data.id);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.log("get profile", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { user } = session;

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.log("update profile", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page">
      {admin ? (
        <div>
          <button
            style={{ border: adminNavStyle[0] }}
            name="profile"
            onClick={handleTogglePage}
          >
            My Account
          </button>
          <button
            style={{ border: adminNavStyle[1] }}
            name="admin"
            onClick={handleTogglePage}
          >
            Admin
          </button>
        </div>
      ) : null}
      {togglePage === "profile" ? (
        <div aria-live="polite" className="profile-container">
          {loading ? (
            "Saving ..."
          ) : (
            <form onSubmit={updateProfile} className="form-widget">
              <Avatar
                url={avatar_url}
                size={150}
                onUpload={(url) => {
                  setAvatarUrl(url);
                  updateProfile({ username, website, avatar_url: url });
                }}
              />
              <label htmlFor="Email">Email</label>
              <div className="account-email">{session.user.email}</div>
              <div>
                <label htmlFor="username">Name</label>
                <input
                  id="username"
                  type="text"
                  value={username || ""}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="url"
                  value={website || ""}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
              <div>
                <button className="button primary block" disabled={loading}>
                  Update profile
                </button>
              </div>
            </form>
          )}
          <button
            type="button"
            className="button block"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <Admin
          updateUserData={updateUserData}
          userData={userData}
          userId={userId}
        />
      )}
    </div>
  );
};

export default Account;
