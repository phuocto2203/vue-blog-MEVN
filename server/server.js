const express = require("express");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");
require("dotenv").config();
const mongoose = require("mongoose");
const authRoute = require("./routers/auth");
const postRoute = require("./routers/post");

const PORT = process.env.PORT || 5000;
const DATABASE = process.env.DATABASE;

const app = express();
app.use(cors());

//parse json req
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE);
  } catch (error) {
    return error;
  }
};

connectDB();

app.use("/auth", authRoute);
app.use("/post", postRoute);

app.listen(PORT);
