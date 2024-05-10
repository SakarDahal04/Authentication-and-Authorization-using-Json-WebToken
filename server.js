const express = require("express")
require("dotenv").config();
const cookieParser = require('cookie-parser');
require('./db.js');

app = express();

const PORT = process.env.PORT || 9000
const passport = require('./auth')
const jwt = require('./jwt')

const logRequest = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Request Made to ${req.originalUrl}`);
    next();
}
app.use(logRequest);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

app.set('view engine', "ejs");

const userRoutes = require("./routes/addUser");

app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local', {session: false}); 

app.use("/", userRoutes);

app.listen(PORT, (err) => {
    if(err) {
        console.log("Error running the port", err);
    }
    else {
        console.log("Server running at the port", PORT);
    }
});