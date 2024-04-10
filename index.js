const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./Routes/userRoute")
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);

const port = process.env.PORT || 6000;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
    console.log(`App is running on port: ${port}`)
});

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connection Establish")).catch((err) => console.log("MongoBD connection fail", err.message));