// 商店数据
const memoryStorage = {
    '1001': {
        name: '苹果'
    },
    '1002': {
        name:'特斯拉'
    },
    '1003': {
        name: '小米'
    },
    '1004': {
        name: '华为'
    }
}

// 模拟延时
async function delay(ms = 300) {
    await new Promise((r) => setTimeout(r, ms));
}

class ShopService {
    async init() {
        await delay();
    }
    async create({values}){
        await delay();
        const id = String(1 + Object.keys(memoryStorage).reduce((m,id)=> Math.max(m,id), -Infinity));
        return {
            id,
            ...(memoryStorage[id] = values)
        }
    }
    async find({id,pageIndex = 0, pageSize = 10}) {
        await delay();
        if(id){
            return [memoryStorage[id]].filter(Boolean);
        }

        return Object.keys(memoryStorage)
        .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
        .map(id => ({
            id,
            ...memoryStorage[id]
        }))
    }

    async modify({id, values}){
        await delay();

        const target = memoryStorage[id];
        if(!target){
            return null;
        }

        return Object.assign(target, values);
    }

    async remove({id}){
        await delay();

        const target = memoryStorage[id];
        if(!target){
            return false;
        }

        return delete memoryStorage[id];
    }
}

// 单例
let service;
module.exports = async function (){
    if(!service){
        service = new ShopService();
        await service.init();
    }
    return service;
}