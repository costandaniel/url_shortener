require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const Urls = [];
const shortUrl = [];

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  const goodIndex = Urls.indexOf(url);

  if (!url.includes("https://") && !url.includes("http://")) {
    res.json({ error: "invalid url" });
  }

  if (goodIndex < 0) {
    Urls.push(url);
    shortUrl.push(shortUrl.length);
    return res.json({
      original_url: url,
      short_url: shortUrl.length - 1,
    });
  }
  return res.json({
    original_url: url,
    short_url: shortUrl[goodIndex],
  });
});

app.get("/api/shorturl/:url", (req, res) => {
  const url = parseInt(req.params.url);
  const foundIndex = shortUrl.indexOf(url);

  if (foundIndex < 0) {
    return res.json({
      error: "No short url found",
    });
  }
  res.redirect(Urls[foundIndex]);
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
