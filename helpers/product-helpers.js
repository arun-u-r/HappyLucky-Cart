const db = require('../config/connection')
const objectId = require('mongodb').ObjectId
module.exports = {

    addProduct:(product)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection('Products').insertOne(product).then(data=>{
                resolve(data.insertedId)
            })
        })
    }

    ,

    getProducts: ()=>{
        return new Promise(async(resolve,reject)=>{
           let products = await db.get().collection('Products').find().toArray()
            resolve(products)
        })
    },

    deleteproduct: (Id)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection('Products').deleteOne({_id:objectId(Id)}).then(()=>{
                resolve()
            })
        })
    },

    getProductDetails:(Id)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection('Products').findOne({_id:objectId(Id)}).then((product)=>{
                resolve(product)
            })
        })
    },

    updateProduct: (Id,product)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('Products').updateOne({_id:objectId(Id)},{$set:{Price:product.Price,Name:product.Name,Description:product.Description,Category:product.Category}}).then((response)=>{
                resolve()
            })
        })
    }
}