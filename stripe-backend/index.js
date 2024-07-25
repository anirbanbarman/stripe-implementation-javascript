const express = require("express");
const path = require("path");
require("dotenv/config");
const app = express();

const cors = require("cors");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.static(path.join(__dirname, "public")));

//middleware
app.use(express.json());
app.use(cors());

//Success End point

app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "success.html"));
});

//Failure End point
app.get("/failure", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "failure.html"));
});

//API running Checker
app.get("/api", (req, res) => {
  res.send("API is running");
});

app.post("/payment",async (req,res)=>{

try {
    const line_items= req.body.items.map((item)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:item.name,
                images:[item.image],
            },
            unit_amount:item.price *100
        },
        quantity:item.quantity

    }));

    const session= await stripe.checkout.sessions.create({
        success_url: `http://localhost:4200/success`,
        cancel_url: `http://localhost:4200/failure`,
        line_items: line_items,
        mode: "payment",
        customer_email: req.body.address?.email,

        billing_address_collection: 'required', // Optional: Adjust as per your needs
        shipping_address_collection: {
        allowed_countries: ['IN'], // Optional: Adjust as per your needs
      },
      metadata: {
        phone_number: req.body.address?.phone
     },

    });
    res.json({ success: true, session_url: session.url });
    
} catch (error) {
    res.json({ success: false, message: error?.message || "Error" });
    
}

})

app.listen(4200, () => {
  console.log("Server is running on port 4200");
});
