require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8000;

//Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripepayment");
const paymentBRoutes = require("./routes/paymentBRoutes");

// DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("DB Connected");
  });

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);
app.use("/api", paymentBRoutes);

// Starting a server
app.listen(port, () => {
  console.log("Server is running");
});
