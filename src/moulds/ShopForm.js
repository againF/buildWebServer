const Yup = require('yup');

exports.createShopFormSchema = () => {
    return Yup.object({
        name: Yup.string()
            .required('商店名称不能为空')
            .max(20, '商店名称不能超过20个字符')
            .min(2, '商店名称不能少于2个字符'),
    })
}