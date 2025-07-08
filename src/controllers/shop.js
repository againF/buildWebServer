const {Router} = require('express');
const shopService = require('../services/shop');
const {createShopFormSchema} = require('../moulds/ShopForm');
class ShopController {
    shopService;

    async init(){
        this.shopService = await shopService();

        const router = Router();
        router.get('/', this.getAll);
        router.get('/:shopId', this.getOne);
        router.put('/:shopId', this.put);
        router.delete('/:shopId', this.delete);
        return router;
    }

    getAll = async (req,res) => {
        const {pageIndex,pageSize} = req.query;
        const shopList = await this.shopService.find({pageIndex,pageSize});
        res.send({
            success:true,
            data:shopList
        })
    }

    getOne = async (req,res) => {
        const {shopId} = req.params;
        const shopList = await this.shopService.find({id:shopId});
        if(shopList.length){
            res.send({
                success:true,
                data: shopList[0]
            })
        }else {
            res.status(404).send({
                success: false,
                data: null
            })
        }
    }

    put = async (req,res) => {
        const {shopId} = req.params;
        const {name} = req.query;

        try {
            await createShopFormSchema().validate({name});
        }catch (error) {
            res.status(400).send({
                success: false,
                message: error.message
            })
            return;
        }
        const result = await this.shopService.modify({id:shopId,values:{name}});
        if(result){
            res.send({
                success: true,
                data: result
            })
        }else {
            res.status(404).send({
                success: false,
                data: null
            })
        }
    }

    delete = async (req,res) => {
        const {shopId} = req.params;
        const result = await this.shopService.remove({id:shopId});
        if(!result){
            res.status(404)
        }
        res.send({
            success:true
        })
    }
}

module.exports = async () =>{
    const c = new ShopController();
    return await c.init();
};