/////////////////
// FLOWERS /////
///////////////
const express = require('express');
const router = express.Router();
const FlowerModel = require('../models/flowers');
const FlowerModelInstance = new FlowerModel();
const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();

module.exports = (app, passport) => {

    app.use('/flowers', router);
    
    router.get("/", async (req, res, next) => {
        try{
            const result = await FlowerModelInstance.flowers();
            res.status(200).send(result)
        } catch(err){
            next(err)
        }
        
    }) 

    router.get('/:name', async(req, res, next) => {
        const name = req.params.name;
        try {
            const result = await FlowerModelInstance.findOne(name);
            res.status(200).send(result)

        } catch (err) {
            next(err)
        }
    }) // router.get individual })
    // ---------------------------- //

    router.post('/', AuthServiceInstance.isAdmin, async (req, res, next) => {
        try{
            const result = await FlowerModelInstance.create(req.body);
            res.status(200).send(result)

        } catch(err){
            next(err);
        }

    }) // router.post })

    router.delete('/:name', AuthServiceInstance.isAdmin, async (req, res, next) => {
        
        const name = req.params.name;

        try {
            const result = await FlowerModelInstance.delete(name);
            res.status(200).send(result)

        } catch (err) {
            next(err)
        }

    }) // router.delete })
    // ------------------- //

    router.put('/:name', AuthServiceInstance.isAdmin, async (req, res, next) => {
        try {
            const name = req.params.name;
            const {name: newName, price} = req.body
            const updatedValues = {name, newName, price};
            const result = await FlowerModelInstance.update(updatedValues);
            res.status(200).send(result)

        } catch (err) {
            next(err)
        }

    }) // router.put })
    // ---------------- //

} // module.exports }