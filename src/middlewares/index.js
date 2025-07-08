const {Router} = require('express')
const urlNormalizeMiddleware = require('./urlNormalize')

module.exports = async function initMiddlewares(){
    const router = Router()
    router.use(urlNormalizeMiddleware())
    return router
}