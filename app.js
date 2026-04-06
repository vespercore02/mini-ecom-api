const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const orderRoutes = require("./routes/order.routes");
const addressRoutes = require("./routes/address.routes");
const userRoutes = require("./routes/user.routes");
const productImageRoutes = require("./routes/product-image.routes");

const accessLogger = require("./middleware/accessLogger");
const errorLogger = require("./middleware/errorLogger");

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(accessLogger);

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/orders", orderRoutes);
app.use("/addresses", addressRoutes);
app.use("/users", userRoutes);
app.use("/products", productImageRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Mini Ecom API running 🚀" });
});

app.use(errorLogger);

module.exports = app;