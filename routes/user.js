const express = require('express');
const router = express.Router();
const productHelpers = require('../helpers/product-helpers')
const userHelpers = require('../helpers/user-helpers')
let pop = {} ;
let popupstatus, user, admin, usermail, signuppop

sessioncheck = (req, res, next) => {
    if (req.session.log) {
        res.redirect('/')
    } else {
        next()
    }
}

authmiddlewear = (req, res, next) => {
    userHelpers.doLogin(req.body).then((response) => {
        if (response.loginStatus) {
            req.session.response = response
            req.session.log = true
            user = response.user.name
            usermail = response.user.email
            next() 

        } else {
            pop = response
            popupstatus = true
            res.redirect('/login')
        }
    })
}




/* --------- home page. ----------*/


router.get('/', function (req, res, next) {
    productHelpers.getProducts().then((products) => {
        if (req.session.log) {
            res.render('Userpage/user', { products, navbar: true, user, admin })
        } else {
            res.redirect('/login')
        }
    })

});


///---------------logout-----------------//

router.post('/', (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})


//-----------------login-------------//

router.get('/login', sessioncheck, function (req, res) {
    res.render('login', { pop, popupstatus })
    popupstatus = false
});

router.post('/loggedin', authmiddlewear, (req, res) => {
    res.redirect('/')
})


//----------------signup ------------------//

router.get('/signup', sessioncheck, function (req, res, next) {
    res.render('signup', { signuppop });
    signuppop = null
});


router.post('/signup', (req, res, next) => {
    userHelpers.doSignup(req.body).then((response) => {

        if (response.loginStatus) {
            req.session.response = response
            req.session.log = true
            usermail = req.body.email
            user = req.body.name
            res.redirect('/')
            signuppop = null
        } else {
            signuppop = response.response

            res.redirect('/signup')
        }


    })
})

module.exports = router