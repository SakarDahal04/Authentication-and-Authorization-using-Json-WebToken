const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema( {
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// It will run befor the user document is being saved in the datasbase.
userSchema.pre("save", async function(next) {
    const user = this;      // this refers to the documnet being saved
    if(!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = hashedPassword;
        next();
    }
    catch(err) {
        return next(err);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log(isMatch);
        return isMatch;
    }
    catch(err) {
        cosnole.log(`Err: ${err}`);
        throw err;
    }
}

const UsersInfo = mongoose.model('userInfo', userSchema);
module.exports = UsersInfo;