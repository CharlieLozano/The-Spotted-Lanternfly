/////////////////
// FLOWERS /////
///////////////
const express = require('express');
const router = express.Router();
const cartModel = require('../models/bouquet');
const bouquetModelInstance = new cartModel();
const AuthService = require('../services/AuthService');
const AuthServiceInstance = new AuthService();

module.exports = (app, passport) => {

    app.use('/bouquet', router);

    router.use('/', AuthServiceInstance.isUser)

    router.use('/', bouquetModelInstance.checkIfBouquetExist)
    
    router.get("/", async (req, res) => {
        try{
            const result = await bouquetModelInstance.getItems(req.bouquet);
            res.status(200).send(result)
        } catch(err){
            next(err)
        }
    })

    router.post("/", async (req, res) => {
        try{
            const result = await bouquetModelInstance.addItem(req.bouquet, req.body);
            res.status(200).send(result)
        } catch(err){
            next(err)
        }
    })
    
    router.put("/", async (req, res) => {
        try{
            const result = await bouquetModelInstance.updateItem(req.bouquet, req.body);
            res.status(200).send(result)
        } catch(err){
            next(err)
        }
    })

    router.delete("/:flower", async (req, res) => {
        try{
            const flower = req.params.flower
            const result = await bouquetModelInstance.deleteItem(req.bouquet, flower);
            res.status(200).send(result)
        } catch(err){
            next(err)
        }
    })

    router.delete("/", async (req, res) => {
        try{
            const result = await bouquetModelInstance.clearBouquet(req.bouquet);
            res.status(200).send(result)
        } catch(err){
            next(err)
        }
    })

    router.post("/checkout", async (req, res) => {
        try{
            const result = await bouquetModelInstance.checkout(req.bouquet, req.user);
            res.status(200).send(result)
        } catch(err){
            next(err)
        }
    })

} // module.exports }