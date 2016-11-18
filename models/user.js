const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');



// Define the model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// on save hook, encrypt password

userSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, function(error, salt) {
    if (error) {
      return next(error);
    };
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err)
      };
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassord = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function( err, isMatch ){
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

// Create the model

const ModelClass = mongoose.model('user', userSchema);

// Export model

module.exports = ModelClass;
