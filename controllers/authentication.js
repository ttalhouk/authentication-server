const User = require('../models/user');
const config = require('../config');
const jwt = require('jwt-simple');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signup = function(req, res, next){
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password) {
    return res.status(422).send({ error: "You must provide email and password"});
  };

// See if a user with email exists


  User.findOne({email: email}, function(err, existingUser){

    if (err) {return next(err);};

    // if user with email does exists return Error
    if (existingUser) {
      return res.status(422).send({error: 'user with email already exists'});
    };

    // if not then create record and save user

    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err){
      if (err) {
        return next(err);
      };
      res.json({ token: tokenForUser(user) });
    });

    // respond stating user was created


  });
}
