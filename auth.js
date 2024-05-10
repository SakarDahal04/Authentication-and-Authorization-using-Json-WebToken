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