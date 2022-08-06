const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const authRoute = require("./routers/auth");
const postRoute = require("./routers/post");

const PORT = process.env.PORT || 5000;
const DATABASE = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.rboih.mongodb.net/BLOGDATABASE?retryWrites=true&w=majority`;

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
