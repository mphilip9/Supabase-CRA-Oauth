const express = require("express");
const bodyParser = require("body-parser");
// dotenv is not necessary in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const path = require("path");
const app = express();

// supabase setup
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SERVER_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Access auth admin api
const checkStatus = async () => {
  const { data, error } = await supabase.from("admin").select().eq("id", 1);
  if (data) {
    console.log("admin accessed)", data);
  } else if (error) {
    console.log(error);
  }
};

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", function (req, res) {
  return res.send("bingo");
});

app.delete("/delete", async function (req, res) {
  console.log("body", req.body);
  // check admin status
  const { data, error } = await supabase
    .from("admin")
    .select()
    .eq("profile_id", req.body.adminId);
  if (error) {
    console.log(error);
    res.send("could not remove user");
  } else if (data) {
    // delete objects for user
    const { data, error } = await supabase.rpc("owner_null", {
      owner_id: req.body.id,
    });
    if (data) {
      const { data, error } = await supabase.auth.admin.deleteUser(req.body.id);
      if (error) {
        console.log("error deleting auth.user", error);
        res.send("error");
      } else if (data !== null) {
        console.log("deleted: ", data);
        res.send("data rom remove user");
      }
    }
    if (error) {
      console.log("error performing object delete");
    }
    // if admin successfully accessed, delete the requested user from profiles
    // const { deleteData, error } = await supabase
    //   .from("profiles")
    //   .delete()
    //   .eq("id", req.body.id);
    // if (error) {
    //   console.log("could not delete user from profiles");
    //   res.send("could not delete user");
    // }
    // if (data) {
    // console.log("deleted data");
    // then delete requested user from the auth users table
  }
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
