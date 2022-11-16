const express = require('express');
const router = express.Router();
const usersModel = require('../models/users');
const usersModelInstance = new usersModel();
const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();


module.exports = (app, passport) => {

    app.use('/user', router);

    router.use('/', AuthServiceInstance.isUser)

    router.get('/', async (req, res, next) => {
        try {
            const result = await usersModelInstance.getUser(req.user);
            res.status(200).send(result)
        } catch (err) {
            next(err)
        }
    })

    router.put('/', async (req, res, next) => {
        try {
            const result = await usersModelInstance.updateUser(req.user, req.body);
            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            next(err)
        }
    })
    
}