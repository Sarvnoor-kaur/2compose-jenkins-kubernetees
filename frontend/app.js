const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://backend:5000");

    res.send(`
        <h1>Frontend Container</h1>
        <h2>${response.data}</h2>
        `);
  } catch (err) {
    res.send("Backend Not Reachable");
  }
});

app.listen(3000, () => {
  console.log("Frontend running on port 3000");
});
