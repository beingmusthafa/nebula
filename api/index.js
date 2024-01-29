const express = require("express");

const app = express();

app.use(express.json());

app.get("/api", (req, res, next) => {
  res.json({ message: "Hello world" });
});

app.get("/api/get-home-slides", (req, res, next) => {
  res.json({
    images: [
      "https://picsum.photos/id/235/200/300",
      "https://picsum.photos/id/238/200/300",
      "https://picsum.photos/id/239/200/300",
    ],
  });
});

app.get("/api/get-home-courses", (req, res, next) => {
  res.send();
});

app.listen(3000, () => {
  console.log("server started");
});
