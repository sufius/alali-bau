const express = require("express");
const proxy = require("http-proxy-middleware");
const path = require("path");
const http = require("http");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const { body } = require("express-validator");

require("dotenv").config({ path: ".env.local" });

const app = express();

const sslOptions = process.env.HTTPS === "true" && {
  cert: fs.readFileSync(
    process.env.SSL_CRT_FILE,
    "utf8"
  ),
  key: fs.readFileSync(
    process.env.SSL_KEY_FILE,
    "utf8"
  )
};

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure &&
      req.get('x-forwarded-proto') !== 'https' &&
      process.env.NODE_ENV !== "development" &&
      process.env.NODE_ENV !== "dev") {
        return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
}
app.use(requireHTTPS);

// Serve any static files
app.use(express.static(path.join(__dirname, "..", "build"), { dotfiles: 'allow' }));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

// Handle React routing, return all requests to landing page
app.get("/*", function(req, res) {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "dev"
  ) {
    console.log(
      "[IMV] Requested URL for /*:",
      new Date().toLocaleString(),
      req.url
    );
  }
  res.sendFile(path.join(__dirname, "..", "build", "index.html"), function(
    err
  ) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

http.createServer(app).listen(process.env.PORT || 80);
process.env.HTTPS === "true" &&
  https.createServer(sslOptions, app).listen(process.env.PORT_SSL || 443);
