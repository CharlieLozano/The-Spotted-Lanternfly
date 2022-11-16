const authRouter = require('./auth');
const bouquetRouter = require('./bouquet');
const ordersRouter = require('./orders');
const flowersdRouter = require('./flowers');
const usersRouter = require('./users');

module.exports = (app, passport) => {
  authRouter(app, passport);
  flowersdRouter(app, passport);
  bouquetRouter(app);
  ordersRouter(app);
  usersRouter(app);
}