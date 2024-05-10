const express = require('express');

const app = express();
const router = express.Router();
const UsersInfo = require('./../models/users')
const passport = require('./../auth')

app.use(express.urlencoded({extended: false}));
const {jwtAuthMiddleware, generateToken} = require("./../jwt");

app.use(express.json());    
app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local', {session: false}); 

// Getting the main homepage which we want to access
router.get("/homepage", jwtAuthMiddleware, (req, res) => {
    console.log(req.cookies.token)
    const token = req.cookies.token;
    try {
        console.log("Homepage111x");
        res.render("index", {
            title: "Homepage",
            token: token
        });
    }
    catch(err) {
        console.log(err);
        res.send(err);
    }
})


// Default page where we can enter the users information to login
router.get('/', (req, res) => {
    try {
        console.log("Welcome from the login page");
        res.render("login", {
            title: "Login"
        });
    }
    catch(err) {
        console.log(err);
        res.send(`Internal Server error: ${err}`);
    }
})

// Signup page to create a new account
router.get("/signup", (req, res) => {
    try {
        console.log("Hello from the signup page");
        res.render('signup', {
            title: 'Signup',
        })
    }
    catch(err) {
        console.log(err);
        res.send(`Internal Server error: ${err}`);
    }
})

// Add user when the information is provided to the signup page after the submission
router.post("/addUserViaSignup", async (req, res) => {
    try {
        console.log(req.body);
        const data = req.body;
        console.log("Error1")
        const newItem = new UsersInfo(data);
        console.log("Error2")
        const response = await newItem.save();
        console.log("Data Saved");
        
        const payload = {
            username: response.username
        }

        console.log(JSON.stringify(payload));

        const token = generateToken(payload);
        console.log(`Token: ${token}`);
        res.render("login", {
            title: "Login",
        })
    }
    catch(err) {
        console.log(err);
        res.send(`Internal Server error: ${err}`);
    }
})

// Login to the webpage
router.post("/loginToMainPage", async (req, res) => {
    try {
        console.log("Trying to Login");
        const {username, password} = req.body;
        const user = await UsersInfo.findOne({username: username})
        console.log(user);

        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({err: "Invalid Username and Password"});
        }

        const payload = {
            username : user.username,
        }
        console.log("token1Error")
        const token = generateToken(payload);
        console.log("token2Error")
        console.log("User Verified");
        console.log(token);
        res.cookie('token', token);
        res.redirect('/homepage');
    }
    catch(err) {
        console.log(err);
        res.send(`Internal Server error: ${err}`);
    }
})

module.exports = router;