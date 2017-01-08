var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    psername: String,
    password: String
});

// Adds PLM methods that are useful for user auth!
userSchema.plugin(passportLocalMongoose);

// REMINDER!!!! ALWAYSSSS EXPORTTTTTTTT LASSSSSSTTTTTTTT. I just wasted 10 minutes trying to figure out why and I just had to switch two lines.
//dasjlkdaslkkjdsasjlkdasj;dsajk;klsaj;lksajd yes i raged
module.exports = mongoose.model("User", userSchema); 