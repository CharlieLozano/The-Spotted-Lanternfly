const expressLoader = require('./express');
const passportLoader = require('./passport');
const routeLoader = require('../routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json')
const path = require("path")

/////////////////////////////////
/* You still haven't setup swagger
const swaggerLoader = require('./swagger');
*/
/////////////////////////////////

module.exports = async (app) => {

  // Load Express middlewares
  // Then it returns the app to continue with the following middlewares
  const expressApp = await expressLoader(app);

  // Load Passport middleware
  // Just as before, the passport is also returned 
  // to continue with following middlewares
  const passport = await passportLoader(expressApp);

  // Load API route handlers
  await routeLoader(app, passport);

  app.get('/', (req, res) => {
    console.log('GET /')
    const user = req.user || "Guest";
    res.status(200).send({message: `Welcome ${user.username || user}`})
  })


  // Load Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));


  // Error Handler
  app.use((err, req, res, next) => {
    
    console.log('Final error')
    const { message, status } = err;
  
    return res.status(status).send({ message });
  });
}