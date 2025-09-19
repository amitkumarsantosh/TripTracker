const express = require('express');
const connectDB = require('./utils/ConnectionDB');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const wrapAsync = require('./utils/wrapAsync');

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);

// connectDB();
wrapAsync(connectDB())
app.get('/', (req, res) => {
  res.send('Hello from server app!');

});




app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
