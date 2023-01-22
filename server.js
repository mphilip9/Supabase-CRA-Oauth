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
const adminAuthClient = supabase.auth.admin;
const checkPrivileges = async () => {
  console.log("checked");
  /* code for fetching the list of users for admins */
  // const {
  //   data: { users },
  //   error,
  // } = await supabase.auth.admin.listUsers();
  // if (error) {
  //   console.log(error);
  // } else if (users) {
  //   console.log(users);
  // }

  // const { DBdata, DBerror } = await supabase
  //   .from("public.admin")
  //   .select()
  //   .eq("profile_id", id);

  const { data, error } = await supabase.from("admin").select();
  if (error) {
    return false;
  } else if (data) {
    return true;
  } else {
    return false;
  }
};

app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", function (req, res) {
  return res.send("bingo");
});

app.get("/privileges", async function (req, res) {
  const adminStatus = await checkPrivileges();
  console.log("hmm", adminStatus);
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
