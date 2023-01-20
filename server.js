const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", function (req, res) {
  return res.send("pong");
});

// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
