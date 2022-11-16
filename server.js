require('dotenv').config();
const express = require('express');
const app = express();

const DateTime = require('datetime-js');
const dateObj = new Date()

// This is to setup: express middleware, passport, routes and swagger
const loaders = require('./loaders');
// ------------------------------- ^

const PORT = process.env.PORT



async function startServer() {
  
  // Init application loaders
  loaders(app);

  // Start server
  app.listen(PORT, () => {

    const listenToPortMessage = () => {
      console.log(' ')
      console.log('///////////////////////////////////////')
      console.log(`/// Server is listening on ${PORT} //////`);
      console.log('/////////////////////////////////////')
      console.log(' ')
      console.log(DateTime(dateObj, '%m-%d-%Y :: %h:%i:%s %ampm'))
      console.log(' ')
    }

    listenToPortMessage()
  })
}

startServer();