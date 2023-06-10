var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
const producthelp = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
//let admin 
let pop = {};
let popupstatus, user, admin, usermail, key
const adminuser ="arununithroth@gmail.com"
const admninkey = "00000"


sessioncheck = (req, res, next) => {
  if (!req.session.admin) {
    res.redirect('/admin/adminlogin')
  } else {
    next()
  }
}

admincheck = (req, res, next) => {
  if (req.session.admin) {
    next()
  } else {
    res.redirect('/admin/adminlogin')
  }
}
authmiddlewear = (req, res, next) => {
  userHelpers.doLogin(req.body).then((response) => {
    console.log(response)
    console.log(req.session.response)
    if (response.loginStatus) {
      key = req.body.key
      req.session.response = response
      user = response.user.name
      usermail = response.user.email
      next()

    } else {
      pop = response
      popupstatus = true
      res.redirect('/admin/adminlogin')
    }
  })
}


admincheck1 = (req, res, next) => {
  if (adminuser === usermail) {
    if (key == admninkey) {
      admin = true
      req.session.admin = true
    }
    else {
      admin = false
      req.session.admin = false
      popupstatus = true
      pop.response = "Admin Key is not valid"
    }
  } else {
    admin = false
    req.session.admin = false
  }
  next()
}







//---admin home page-----//

router.get('/', admincheck1, admincheck, sessioncheck, function (req, res, next) {
  console.log(req.session);
  productHelpers.getProducts().then((products) => {
    res.render('admin/adminpage', { products })
  })

});

router.post('/', (req, res) => {
  admin = false
  req.session.admin = false
  usermail = null
  console.log(req.session.admin);
  res.redirect('/admin/adminlogin')
})


//---------------admin-login page---//


router.get('/adminlogin', (req, res) => {
  if (req.session.admin) {
    res.redirect('/admin')
  } else {
    res.render('admin/admin-login', { pop, popupstatus })
    popupstatus = false
  }
})



router.post('/loggedin', authmiddlewear, (req, res) => {
  res.redirect('/admin')
})

//---------add product------------//

router.get('/add-product', admincheck, (req, res) => {
  res.render('admin/add-product', { navbar: false })
})

router.post('/add-product', admincheck, (req, res) => {
  producthelp.addProduct(req.body).then((data) => {
    let img = req.files.Image
    img.mv('./public/product-images/' + data + '.jpg', (err) => {
      if (err) console.log('image not saved' + err);
      else res.redirect('add-product')
    })

  })
})

///--------------delete----------------//

router.get('/delete/:id', admincheck, (req, res) => {
  let Id = req.params.id
  productHelpers.deleteproduct(Id).then(() => {
    res.redirect('/admin')
  })
})

router.get('/delete-user/:id', admincheck, (req, res) => {
  let Id = req.params.id
  userHelpers.deleteUser(Id).then(() => {
    res.redirect('/admin/user-list')
  })
})

//-----------------edit-----------//

router.get('/edit/:id', admincheck, async (req, res) => {
  let Id = req.params.id
  let product = await productHelpers.getProductDetails(Id)
  res.render('admin/edit-product', { product })

})


router.post('/edit-product/:id', admincheck, (req, res) => {
  let Id = req.params.id
  productHelpers.updateProduct(Id, req.body).then(() => {
    res.redirect('/admin')
    if (req.files.Image) {
      let img = req.files.Image
      img.mv('./public/product-images/' + Id + '.jpg')
    }
  })
})

//-----------------user details------------------//

router.get('/user-list', admincheck, (req, res) => {

  userHelpers.getUsers().then((users) => {

    res.render('admin/user-list', { users, navbar: false, search: false })

  })
})


router.post('/user-search', admincheck, (req, res) => {
  userHelpers.userSearch(req.body.searchkey).then((users) => {
    res.render('admin/user-list', { users, navbar: false, search: true })

  })
})


module.exports = router;
