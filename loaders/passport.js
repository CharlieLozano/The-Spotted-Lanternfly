// Helpful Link: https://www.makeuseof.com/passport-authenticate-node-postgres/

const passport = require('passport');
const LocalStrategy = require('passport-local');
const db = require('../db');

const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();

const bcrypt = require("bcrypt");

module.exports = (app) => {

  // Initialize passport
  app.use(passport.initialize());  
  app.use(passport.session());
  
  // Set method to serialize data to store in cookie
  passport.serializeUser((user, done) => {
    console.log('SERIALIZING')

    done(null, user.id);
  });
  
  // Set method to deserialize data stored in cookie and attach to req.user
  passport.deserializeUser(async (id, done) => {
    console.log('DESERIALIZING')

    const user = await AuthServiceInstance.findUserById(id);
    done(null, user);
  });

  // Configure local strategy to be use for local login
  passport.use(
    new LocalStrategy(
      async (username, password, done) => {
        // FIND USERNAME
        console.log('PASSPORT LOCAL STRATEGY')
        try {
          const result = await AuthServiceInstance.login(username, password)
          return done(null, result)
        }
        catch(err){
          return done(err)
        }
        
      }
    )
  );

  return passport;

}