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
router.get("/product/:id", ifuser,userController.getProduct)
router.post("/signup", nouser,userController.postSignup)
router.post("/signup-otp", nouser,userController.psotSingOtp)
router.post("/one-time-password-varify", nouser,userController.postOtp)
router.route("/forgot/password").get(nouser, userController.getForgotpassword).post(nouser,userController.postforgot)
router.get("/forgot/password/:link", nouser, userController.getForgotpasswordWithLink)
router.post("/reste/password/", nouser, userController.psotResatPassword)
router.post("/logout", ifuser,userController.logout)

router.get("/cart",ifuser,userController.getCart)
router.post("/cart/:id",ifuser,userController.addToCart)
router.get("/cart/remove/:id",ifuser,userController.cartRemove)
router.post("/cart",ifuser,userController.incresCart)
router.get("/cart/address",ifuser,userController.address)

router.get("/account/profile",ifuser,userController.profil)
router.post("/address",ifuser,userController.newAdress)
router.get("/account/orders",ifuser,userController.order)
router.get("/account/orders/details/:id",ifuser,userController.orderDetails)
router.get("/address/remove/:index",ifuser,userController.addressRemove)


router.post("/change/password",ifuser,userController.changePassword)

router.get("/address/edit/:id",ifuser,userController.editAddress)
router.get("/new-address",ifuser,userController.newAddress)
router.post("/new-order",ifuser,userController.newOrder)
router.get("/order/cancel/:id",ifuser,userController.cancelOrder)
router.get("/account",ifuser,userController.getAccount)




module.exports = router





