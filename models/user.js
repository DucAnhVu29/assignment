var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
   username: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true
   },
   name: {
      type: String,
      required: true
   },
   YearOfBirth: {
      type: Number,
      required: true
   },
   admin: {
      type: Boolean,
      default: false
   },
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
