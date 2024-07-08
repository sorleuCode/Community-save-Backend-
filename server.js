require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/DBConnet")
const errorHandler = require("./middleware/errorMiddleware");
// const cron = require('node-cron');
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const thriftRoute = require("./routes/thriftRoute")
// const Paystack = require("./utils/paystack")

const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.json())


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    next()
})


app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS"
}))

// const task = cron.schedule('*/1 12 * * * *', () => {
//     console.log(Paystack.verifyPayment)
//     // console.log('running a task every 5 seconds', Math.random());

//     setTimeout(() => {
//         task.stop()
//     }, 10000)
// });

// task.stop()

app.get("/", (req, res) => {
    res.send("We're live!")
});
app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/thrift", thriftRoute)


connectDB();

app.use(errorHandler);

mongoose.connection.once("open", () => {
    console.log("Database Connected");

    app.listen(PORT, () => console.log(`server 🏃‍♂️💨 on port ${PORT}`))

})

