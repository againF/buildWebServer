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
    server.use(errorHandler)
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
function errorHandler(err, req, res, next) {
    if(res.headersSent){
        /***
         * 如果是返回响应结果时发生异常，
         * 那么交给express默认的错误处理器finalhandler处理关闭链接
         * **/
        return next(err);
    }
    // 打印异常
    console.error('服务器异常:', err);
    // 重定向到异常指引页面
    res.redirect('/500.html');
}
bootstrap()