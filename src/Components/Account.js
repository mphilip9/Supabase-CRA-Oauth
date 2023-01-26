import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Avatar from "./Avatar";
import Admin from "./Admin";
import CupAnimation from "./CupAnimation";

const Account = ({ session }) => {
  // The DB data should be put into a single object
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [strawMaterial, setStrawMaterial] = useState(null);
  const [strawType, setStrawType] = useState(null);
  const [plasticStraw, setPlasticStraw] = useState(false);
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
    let { data } = await supabase.from("profiles").select();
    if (data.length > 1) {
      console.log(data);
      setAdmin(true);
      setUserData(data);
    }
  };

  useEffect(() => {
    getProfile();
    getProfiles();
  }, [session]);

  // Fetch data for profile page
  const getProfile = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`id, username, website, avatar_url, straw_type, straw_material`)
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
        setStrawMaterial(data.straw_material);
        setStrawType(data.straw_type);
      }
    } catch (error) {
      /**** Add functionality here to show error fetching profile if needed *****/
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    console.log(strawMaterial, strawType);

    try {
      setLoading(true);
      const { user } = session;

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        straw_material: strawMaterial,
        straw_type: strawType,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      /**** Add functionality here to show error updating profile if needed *****/
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (strawMaterial === "plastic") {
      setPlasticStraw(true);
    } else {
      setPlasticStraw(false);
    }
  }, [strawMaterial]);

  return (
    <div className="account-page">
      <div className="slogan-container">
        <h1 className="header">Straw Aficionado</h1>
        <div className="slogan">What's a drink without a straw?</div>
      </div>
      {admin ? (
        <div className="profile-page-margin">
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
                <label htmlFor="username">Display Name</label>
                <input
                  id="username"
                  type="text"
                  value={username || ""}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="straw-material">Favorite Straw Material?</label>
                <input
                  id="straw-material"
                  type="text"
                  value={strawMaterial || ""}
                  onChange={(e) => setStrawMaterial(e.target.value)}
                />
                {plasticStraw ? <div>Disappointing...</div> : null}
              </div>
              <div>
                <label htmlFor="straw-type">Favorite Straw Type?</label>
                <input
                  id="straw-type"
                  type="text"
                  value={strawType || ""}
                  onChange={(e) => setStrawType(e.target.value)}
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
      <CupAnimation />
    </div>
  );
};

export default Account;
