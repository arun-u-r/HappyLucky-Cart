const db = require('../config/connection')
const bcrypt = require('bcryptjs');
const objectId = require('mongodb').ObjectId




async function emailvalidate(email) {
    const userFind = await db.get().collection('userDetails').findOne({ email: email })
    if (userFind)
        return false
    else {
        return true
    }
}





module.exports = {
    doSignup: (userData) => {
        let response = {}

        return new Promise(async (resolve, reject) => {
            if (await emailvalidate(userData.email)) {
                userData.Password = await bcrypt.hash(userData.Password, 10)
                db.get().collection('userDetails').insertOne(userData).then((data) => {
                    response.loginStatus = true
                    response.user = data
                    response.popupstatus = false
                    resolve(response)

                })
            } else {
                response.loginStatus = false
                response.popupstatus = true
                response.response = 'Email Id is already exist'
                resolve(response)
            }


        })





    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {

            let response = {}
            let user = await db.get().collection('userDetails').findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.Password).then((status) => {
                    if (status) {
                        response.loginStatus = true
                        response.user = user
                        response.popupstatus = false
                        resolve(response)
                    } else {
                        response.loginStatus = false
                        response.popupstatus = true
                        response.response = 'Password is incorrect'
                        resolve(response)
                    }
                })
            } else {
                response.loginStatus = false
                response.popupstatus = true
                response.response = 'Invalid email address'
                resolve(response)
            }

        })
    },



    getUsers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection('userDetails').find().toArray()
            resolve(users)
        })
    },


    deleteUser: (Id) => {
        return new Promise((resolve, reject) => {
            db.get().collection('userDetails').deleteOne({ _id: objectId(Id) }).then(() => {
                resolve()
            })
        })
    },



    userSearch: (key) =>{
        return new Promise(async(resolve,reject)=>{
            let users = await db.get().collection('userDetails').find({name:{$regex:key,$options:'i'}}).toArray()
            resolve(users) 
        })
    }

}