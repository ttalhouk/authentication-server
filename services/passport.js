const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


const localLogin = new LocalStrategy({usernameField: 'email'}, function(email, password){
  User.findOne({email:email}, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(false); }

    user.comparePassord(password, function(err, isMatch){
      if (err) {return done(err);}
      if (!isMatch) {return done(null,false);}
      return done(null, user);
    })
  })
});

// options for jwt Strategies

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// create jwt Strategy

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){

  User.findByID(payload.sub, function(err, user) {
    if(err) {
      return done(err, false);
    };

    if(user) {
      done(null, user);
    } else {
      done(null, flase);
    };

  })
});

// Tell passport to use Strategies

passport.use(jwtLogin);
passport.use(localLogin);
