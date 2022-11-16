const express = require('express');
const router = express.Router();

const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();

const { v4: uuid_v4 } = require('uuid');

module.exports = (app, passport) => {

  app.use('/auth', router);

  router.get("/logout", (req, res) => {
    req.logout(
      function(err) {
        if (err) { return next(err); 
      }
      res.redirect('/');
    });
  });

  router.post('/login', passport.authenticate('local'), (req, res) => {
    res.redirect("/");
  })


  router.post("/register", async (req, res) => {
    const id = uuid_v4();
    try {
      const user = await AuthServiceInstance.findUserById(id);
      if(user){
        console.log("- Generated Id already existed!");
        res.status(400).send({ message: 'There was an error generating the ID, try againg.'});
      }
      const newUser = await AuthServiceInstance.registerUser(id, req.body);

      if(newUser){
        res.status(201).send({message: "User Created!"})
      }

    } catch(err){
      res.status(500).send({ message: err.message });
    }
  
  })

}