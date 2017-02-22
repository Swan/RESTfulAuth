var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    psername: String,
    password: String
});

// Adds PLM methods that are useful for user auth!
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema); 
