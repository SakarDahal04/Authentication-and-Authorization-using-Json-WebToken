// This file will only be used when we are using the localAuthMiddleware middleware
// In this middleware we will be have to pass the value of username and password on each access to the protected routes
// Otherwise we don't get the access to the protected routes.
// So this file is no use while using JWT

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UsersInfo = require('./models/users');

passport.use(new LocalStrategy(async function(username, password, done) {
    try {
        const user = await UsersInfo.findOne({usename: username});

        if(!user) {
            return done(null, false, {message: "Incorrect Username"});
        }

        const isPasswordMatch = await user.comparePassword(password)?true:false;
        console.log(isPasswordMatch)

        if(isPasswordMatch) {
            return done(null, user);
        }
        else {
            return done(null, false, {message: "Incorrect Password"});
        }
    }
    catch(err) {
        console.log(err);
        return done({err: "User is not authorized"});
    }
}))

module.exports = passport;