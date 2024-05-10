const mongoose = require("mongoose");
require('dotenv').config();

const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const database = mongoose.connection;

database.on("connected", () => {
    console.log("Connected to MongoDB server");
})

database.on("error", (err) => {
    console.log("Error connected to the database:", err);
})
database.on("disconnected", () => {
    console.log("MongoDB server disconnected");
})

module.exports = database;