const express = require("express")
const router = express.Router()
const db = require("../model/db")
const jwt = require("../model/JWT")
const nocache = require("nocache")
const { ifuser, nouser } = require("../model/aouth")
const userController = require("../controller/userCantroller")





router.get("/",ifuser,userController.getHome)
router.route("/login").get(nouser,userController.getlogin).post(nouser,userController.psotLgin)
router.get("/category", ifuser,userController.goetCategory)
router.get("/product/:id", ifuser, async (req, res) => {
  const product = await db.findOne_product(req.params.id)
  console.log(product);
  res.render("user/products", { layout: "user/layout", product })
})
router.post("/signup", nouser,userController.postSignup)
router.post("/signup-otp", nouser,userController.psotSingOtp)
router.post("/one-time-password-varify", nouser,userController.postOtp)
router.route("/forgot/password").get(nouser, userController.getForgotpassword).post(nouser,userController.postforgot)
router.get("/forgot/password/:link", nouser, userController.getForgotpasswordWithLink)
router.post("/reste/password/", nouser, userController.psotResatPassword)
router.post("/logout", ifuser,userController.logout)

router.get("/cart",ifuser,userController.getCart)
router.post("/cart/:id",ifuser,userController.addToCart)



module.exports = router





