const express = require('express')
const {resolve} = require('path')
const {promisify} = require('util')
const initMiddlewares = require('./middlewares')
const initControllers = require('./controllers')

const server = express()
const port = parseInt(process.env.PORT || '9000');
const publicDir = resolve('public')
const mouldsDir = resolve('src/moulds')

async function bootstrap() {
    server.use(express.static(publicDir))
    server.use('/moulds', express.static(mouldsDir))
    server.use(await initMiddlewares())
    server.use(await initControllers())
    await promisify(server.listen.bind(server,port))()
    console.log(`Server is running at http://localhost:${port}`)
}

/*
监听未捕获的Promise异常,直接退出进程
*/
process.on('unhandledRejection', (err) => {
    console.error('未捕获的Promise异常:', err);
    process.exit(1);
});

bootstrap()