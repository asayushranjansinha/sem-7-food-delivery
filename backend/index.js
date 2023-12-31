const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Stripe = require("stripe");
const { Resend } = require("resend");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8080;

//mongodb connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to Databse"))
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

//
const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("Server is running");
});

//sign up
app.post("/signup", async (req, res) => {
  // console.log(req.body);
  const { email } = req.body;

  userModel.findOne({ email: email }, (err, result) => {
    // console.log(result);
    console.log(err);
    if (result) {
      res.send({ message: "Email associated to another account.", alert: false });
    } else {
      const data = userModel(req.body);
      const save = data.save();
      res.send({ message: "Sign Up successful!", alert: true });
    }
  });
});

//api login
app.post("/login", (req, res) => {
  // console.log(req.body);
  const { email } = req.body;
  userModel.findOne({ email: email }, (err, result) => {
    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      console.log(dataSend);
      res.send({
        message: "Login Successful!",
        alert: true,
        data: dataSend,
      });
    } else {
      res.send({
        message: "Account not found with this Email, please sign up",
        alert: false,
      });
    }
  });
});

//product section
const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("product", schemaProduct);

//save product in data
//api
app.post("/uploadProduct", async (req, res) => {
  // console.log(req.body)
  const data = await productModel(req.body);
  const datasave = await data.save();
  res.send({ message: "Upload successfully" });
});

//
app.get("/product", async (req, res) => {
  const data = await productModel.find({});
  res.send(JSON.stringify(data));
});

/***** payment getWay */
console.log(process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [{ shipping_rate: process.env.STRIPE_SHIPPING_RATE }],

      line_items: req.body.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
              // images : [item.image]
            },
            unit_amount: item.price * 100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.qty,
        };
      }),

      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await stripe.checkout.sessions.create(params);
    // console.log(session)
    res.status(200).json(session.id);
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
});

const resend = new Resend(process.env.RESEND_API_KEY);
app.post("/contact", async (req, res) => {
  let { userName, userEmail, userMessage } = req.body;

  // Checking if any of the required fields are missing
  if (!userName || !userEmail || !userMessage) {
    // Responding with a 400 Bad Request
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const htmlContent = `
    <p><strong>User Name:</strong> ${userName}</p>
    <p><strong>User Email:</strong> ${userEmail}</p>
    <p><strong>User Message:</strong> ${userMessage}</p>
  `;
    const data = await resend.emails.send({
      from: "Enquiry For Tasty Trails <onboarding@resend.dev>",
      to: [process.env.APP_ADMIN_EMAIL],
      subject: "Someone wants to reach out to you!",
      html: htmlContent,
      reply_to: userEmail,
    });
    console.log(process.env.APP_ADMIN_EMAIL);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
});

//server is ruuning
app.listen(PORT, () => console.log("server is running at port : " + PORT));
