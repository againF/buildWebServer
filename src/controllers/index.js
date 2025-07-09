const {Router} = require('express')
const shopController = require('./shop')
const chaosController = require('./chaos')

module.exports = async function initControllers() {
    const router = Router();
    router.use('/api/shop', await shopController());
    router.use('/api/chaos', await chaosController());
    return router;
}