const express = require('express');
const router = express.Router();
const OrdersModel = require('../models/orders');
const OrdersModelInstance = new OrdersModel();
const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();


module.exports = (app, passport) => {

    app.use('/orders', router);

    router.use('/', AuthServiceInstance.isUser)

    router.get('/', async (req, res, next) =>{
        try {
            const result = await OrdersModelInstance.getOrders(req.user);
            res.status(200).send(result)
        } catch (err) {
            next(err)
        }
    })

    router.get('/:id', async (req, res, next) =>{
        try {
            const id = req.params.id
            const result = await OrdersModelInstance.getOneOrder(req.user, id);
            res.status(200).send(result)
        } catch (err) {
            next(err)
        }
    })

    router.delete('/:id', async (req, res, next) =>{
        try {
            const id = req.params.id
            const result = await OrdersModelInstance.deleteOrder(req.user, id);
            res.status(200).send(result)
        } catch (err) {
            next(err)
        }
    })

}