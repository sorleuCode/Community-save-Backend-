require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/DBConnet")
const errorHandler = require("./middleware/errorMiddleware");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const thriftRoute = require("./routes/thriftRoute")
// const {startCronJob} = require("./utils/cronjob");

const PORT = process.env.PORT || 3500;
const PUBLIC_URL = process.env.PUBLIC_URL

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: [PUBLIC_URL],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS"
}))
app.use(cookieParser());
app.use(bodyParser.json())


// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*")
//     next()
// })




// startCronJob();

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

