const express = require("express")
const router = express.Router()
const db = require("../module/db")
const jwt = require("../module/JWT")
const nocache = require("nocache")
const { ifuser, nouser } = require("../module/aouth")






router.get("/", ifuser, async (req, res) => {

  const products = await db.ufind_product()
  console.log(products);
  res.render("user/home", { layout: "user/layout", products, titel: "Home" })

})
router.post('/login', nouser, async (req, res) => {

  try {
    const data = req.body;
    db.find(data).then(data => {
      console.log(data);
      req.session.user = data
      res.status(200).json()
    }).catch(err => {
      console.log(err.err);
      res.status(err.status).json(err.err)
    })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });

  }
});

router.get("/category", ifuser, async (req, res) => {
  const category = await db.ufind_category()
  console.log(category);
  res.render("user/category", { layout: "user/layout", category })

})
router.get("/product/:id", ifuser, async (req, res) => {
  const product = await db.findOne_product(req.params.id)
  console.log(product);
  res.render("user/products", { layout: "user/layout", product })
})
router.get("/login", nouser, (req, res) => {
  res.render("login/sign-login", { layout: "login/layout-log" })
})

router.post("/signup", nouser, nocache(), async (req, res, next) => {
  try {
    const data = req.body
    data.status = true
    db.find_insert(data).then(data => {
      res.status(200).send("ok")
    }).catch(err => {
      console.log(err.message)
      res.status(409).json({ err })
    })
  } catch (error) {
    console.log(error);

  }
})

router.post("/signup-otp", nouser, nocache(), async (req, res, next) => {
  try {

    const data = req.body
    await db.storeOtp({ user: data, ex_date: new Date(new Date().getTime() + 2 * 60000) })
    res.render("login/onetime", { Email: data.Email, layout: "login/layout" })

  } catch (error) {

    console.error('Error during user registration:', error);
    return res.status(500).json({ message: 'Internal server error' });

  }

})

router.post("/one-time-password-varify", nouser, nocache(), async (req, res, next) => {
  try {

    const data = req.body
    console.log(data)

    const userData = await db.findOtp(data.Otp)
    console.log(userData);
    if (userData) {
      if (new Date() < userData.ex_date) {
        if (userData.otp === data.Otp) {
          await db.insert_user(userData.user)
          req.session.user = userData.user
          res.redirect("/")
        } else {
          res.status(404).json("invalid OTP")
        }
      } else {
        res.status(404).json("invalid OTP")
      }
    } else {
      res.status(404).json("invalid OTP")
    }


  } catch (error) {

    console.error('Error during one-time-password-varify:', error);
    return res.status(500).json({ message: 'Internal server error' });

  }

})


router.get("/forgot/password", nouser, async (req, res, next) => {
  // res.render("login/forgot", {layout: "login/layout-log"})
  res.render("login/email", { layout: "login/layout-log" })

})
router.post("/forgot/password", nouser, async (req, res, next) => {
  // res.render("login/forgot", {layout: "login/layout-log"})
  const user = await db.findeOne_user(req.body.Email)
  console.log(user);
  if (user) {
    console.log(user);
    await require("../module/nodemailer").sendmailForPassword(user.Email, user.Name, user._id)
    res.status(200).json("send")
  } else {
    res.status(409).json()

  }

})
router.get("/forgot/password/:link", nouser, async (req, res, next) => {

  const tokon = jwt.varifyction(req.params.link)
  if (tokon) {
    res.render("login/forgot", { layout: "login/layout-log",Email:tokon.data.Email})
  } else {
    res.redirect("/")
  }
})
router.post("/reste/password/", nouser, async (req, res, next) => {
  try {
    const { Email, Password } = req.body
    console.log(Email , Password);
    await db.update_pass(Password, Email)
     res.status(200).json()
  } catch (err){
    console.log(err);
  }


})

router.get("/logout", ifuser, async (req, res) => {
  req.session.user = null
  res.redirect("/")
})

module.exports = router





