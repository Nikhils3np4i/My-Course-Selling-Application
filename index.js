const express = require('express');
const app = express();
const mongoose = require('mongoose')
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');
require('dotenv').config()

const cookieParser = require('cookie-parser')
app.use(cookieParser());

app.use(express.json())

async function connectionToDB() {
    const port = 3000;
    try {
        await mongoose.connect(process.env.MONGO_URL)
        app.listen(port);
        console.log(`Connected to DB, Server listening to port ${port}`)
    } catch (err) {
        console.log("Connection to db failed " + err)
    }
}
connectionToDB();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/adminRouter", adminRouter);
app.use("/api/v1/course", courseRouter);
