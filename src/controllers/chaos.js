const { Router } = require('express');
const cc = require('../utils/cc')
const ASYNC_MS = 1000;
// 用于注入异常的接口以提供初级的混沌工程入口
/*
Node.js 中的异常根据发生方式分为同步异常与异步异常，后者又进一步分为 Thunk 异常与 Promise 异常，共 3 类异常：

同步异常 就是同步执行过程中抛出的异常，比如 throw new Error();。
Thunk 异常 是指发生在异步回调中的异常，比如 fs.readFile 读不存在的文件，以回调第一个参数返回。
Promise 异常 是指 reject 引起的或 async 方法中抛出的异常，可以通过 Promise 的 catch 方法捕获。


Express 提供了默认的异常处理兜底逻辑，会将自动捕获的异常并交给 finalhandler 处理（直接输出异常信息）。
Express 可以自动捕获同步异常并通过 next 回调捕获异步异常，但是无法捕获在异步方法中直接抛出的异常。因此访问上述接口会出现以下效果
*/
class ChaosController {
    async init() {
        const router = Router();
        router.get('/sync-error-handle', this.getSyncErrorHandle)
        router.get('/sync-error-throw', this.getSyncErrorThrow)
        router.get('/thunk-error-handle', this.getThunkErrorHandle)
        router.get('/thunk-error-throw', this.getThunkErrorThrow)
        router.get('/promise-error-handle', this.getPromiseErrorHandle)
        router.get('/promise-error-throw', this.getPromiseErrorThrow)
        router.get('/promise-error-throw-with-catch', this.getPromiseErrorThrowWithCatch)
        return router;
    }

    getSyncErrorHandle = (req, res, next) => {
        /*
        Error: Chaos test - sync error handle
    at getSyncErrorHandle (C:\learn\node\learnBuildWebServer\src\controllers\chaos.js:25:14)
    at Layer.handleRequest (C:\learn\node\learnBuildWebServer\node_modules\router\lib\layer.js:152:17)
    at next (C:\learn\node\learnBuildWebServer\node_modules\router\lib\route.js:157:13)
    at Route.dispatch (C:\learn\node\learnBuildWebServer\node_modules\router\lib\route.js:117:3)
    at handle (C:\learn\node\learnBuildWebServer\node_modules\router\index.js:435:11)
    at Layer.handleRequest (C:\learn\node\learnBuildWebServer\node_modules\router\lib\layer.js:152:17)
    at C:\learn\node\learnBuildWebServer\node_modules\router\index.js:295:15
    at processParams (C:\learn\node\learnBuildWebServer\node_modules\router\index.js:582:12)
    at next (C:\learn\node\learnBuildWebServer\node_modules\router\index.js:291:5)
    at Function.handle (C:\learn\node\learnBuildWebServer\node_modules\router\index.js:186:3)
        */
        next(new Error('Chaos test - sync error handle'))
    }

    getSyncErrorThrow = (req, res, next) => {
        /*
        Error: Chaos test - sync error throw
    at getSyncErrorThrow (C:\learn\node\learnBuildWebServer\src\controllers\chaos.js:29:15)
    at Layer.handleRequest (C:\learn\node\learnBuildWebServer\node_modules\router\lib\layer.js:152:17)
    at next (C:\learn\node\learnBuildWebServer\node_modules\router\lib\route.js:157:13)
    at Route.dispatch (C:\learn\node\learnBuildWebServer\node_modules\router\lib\route.js:117:3)
    at handle (C:\learn\node\learnBuildWebServer\node_modules\router\index.js:435:11)
    at Layer.handleRequest (C:\learn\node\learnBuildWebServer\node_modules\router\lib\layer.js:152:17)
    at C:\learn\node\learnBuildWebServer\node_modules\router\index.js:295:15
    at processParams (C:\learn\node\learnBuildWebServer\node_modules\router\index.js:582:12)
    at next (C:\learn\node\learnBuildWebServer\node_modules\router\index.js:291:5)
    at Function.handle (C:\learn\node\learnBuildWebServer\node_modules\router\index.js:186:3)
        */
        throw new Error('Chaos test - sync error throw')
    }

    getThunkErrorHandle = (req, res, next) => {
        /*
        Error: Chaos test - thunk error handle
    at Timeout._onTimeout (C:\learn\node\learnBuildWebServer\src\controllers\chaos.js:34:18)
    at listOnTimeout (node:internal/timers:581:17)
    at process.processTimers (node:internal/timers:519:7)
        */
        setTimeout(() => {
            next(new Error('Chaos test - thunk error handle'))
        }, ASYNC_MS)
    }

    getThunkErrorThrow = () => {
        /*
        引起进程异常关闭
        C:\learn\node\learnBuildWebServer\src\controllers\chaos.js:40
            throw new Error('Chaos test - thunk error throw')
            ^

Error: Chaos test - thunk error throw
    at Timeout._onTimeout (C:\learn\node\learnBuildWebServer\src\controllers\chaos.js:40:19)
    at listOnTimeout (node:internal/timers:581:17)
    at process.processTimers (node:internal/timers:519:7)

Node.js v20.17.0
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
        */
        setTimeout(() => {
            throw new Error('Chaos test - thunk error throw')
        }, ASYNC_MS)
    }

    getPromiseErrorHandle = async (req, res, next) => {
        /*
        Error: Chaos test - promise error Handle
    at getPromiseErrorHandle (C:\learn\node\learnBuildWebServer\src\controllers\chaos.js:97:14)
        */
        await new Promise((r) => {
            setTimeout(r, ASYNC_MS);
        })
        next(new Error('Chaos test - promise error Handle'))
    }

    getPromiseErrorThrow = async (req, res, next) => {
        /*
        Error: Chaos test - promise error Throw
    at getPromiseErrorThrow (C:\learn\node\learnBuildWebServer\src\controllers\chaos.js:106:15)
        */
        await new Promise((r) => {
            setTimeout(r, ASYNC_MS);
        })
        throw new Error('Chaos test - promise error Throw')
    }

    getPromiseErrorThrowWithCatch = cc(async (req,res,next)=>{
        await new Promise((r)=> setTimeout(r,ASYNC_MS))
        throw new Error('Chaos test - promise error Throw with Catch')
    })
}

module.exports = async () => {
    const chaosController = new ChaosController();
    return await chaosController.init();
}