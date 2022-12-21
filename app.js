const cors = require('cors');
const express = require('express');
const mongoose = require ('mongoose');

const authRouter = require('./router/auth.router');
const {PORT, MONGO_URL} = require("./config/config");

mongoose.set('strictQuery', false);

const app = express();
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/auth', authRouter);

app.listen(PORT,async () => {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log(`Listen port ${PORT}`);


});