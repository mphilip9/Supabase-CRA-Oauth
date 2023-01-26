const express = require("express");
const bodyParser = require("body-parser");
// dotenv is not necessary in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const path = require("path");
const app = express();

// supabase setup to get admin rights
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

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));

app.delete("/delete", async function (req, res) {
  // check admin status
  const { data, error } = await supabase
    .from("admin")
    .select()
    .eq("profile_id", req.body.adminId);
  if (error) {
    res.send("could not remove user");
  } else if (data) {
    // delete objects for user --otherwise you get a foreign key constraint and can't delete user
    const { data, error } = await supabase.rpc("owner_null", {
      owner_id: req.body.id,
    });
    if (data) {
      const { data, error } = await supabase.auth.admin.deleteUser(req.body.id);
      if (error) {
        res.send("could not remove user");
      } else if (data !== null) {
        res.send("data rom remove user");
      }
    }
    if (error) {
    }
  }
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
