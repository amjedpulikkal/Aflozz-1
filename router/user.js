const express = require("express")
const router = express.Router()
const db = require("../model/db")
const jwt = require("../model/JWT")
const nocache = require("nocache")
const { ifuser, nouser } = require("../model/aouth")
const userController = require("../controller/userCantroller")
const webpush = require('web-push');




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

// router.get("/socket/status",ifuser,userController.orderStatus)

router.post("/online-payment-createid",ifuser,userController.onlinePayment)

// const vapidKeys = {
//     publicKey: 'BKLxNKnkxc-TdjswVmjljwTFPS20B58T7EWlNiDlAtu0dVee3SttxpugNeINTjpckj6fb1X6dlHCedYGYiWJ_6w',  // Replace with your actual public key
//     privateKey: 'gmO-2wk-Ssk-M-D2c6ZGtdAFVCkCNJ0XC7UrfE1QT4E' // Replace with your actual private key
// };

// webpush.setVapidDetails(
//     'mailto:manuamjed32@gmail.com', // Your email
//     vapidKeys.publicKey,
//     vapidKeys.privateKey
// );

// const subscriptions = [{
//     endpoint: 'https://fcm.googleapis.com/fcm/send/dE-Wgbo91Y0:APA91bHuHISLN1wI00av6c8Mn-3t7n3hDFrs5rzy_hW3YhT90l9vTgOdDNa5tbMBzXlXWtbglq1mgXcjj37-qtbcvu_SOBIcsv0WvGX9rLEYKscZXsUunXUSDdnXEckibDumyfYVxEml',
//     expirationTime: null,
//     keys: {
//       p256dh: 'BHaRJBkF7hTxNzrMsuTFp1pvOn9zglZA8pZ71-U5rRNsPaKgjFVCuy9sg1oo_gkiUm7-x5PkWA9IyuNNBDxeUCo',
//       auth: 'mciTdIAmj_gqZRPmTg9Akw'
//     }
//   }];

// router.post('/subscribe', (req, res) => {
//     const subscription = req.body;
//     console.log(subscription);
//      subscription = 

//     subscriptions.push(subscription);

//     // You can save the subscription in a database for later use
//     console.log("Subscription successfully")
//     res.status(201).json({ message: 'Subscription added successfully' });
// });
// router.get("/not",(req,res)=>res.render("push",{layout: "user/layout" ,titel:"df"}))
// router.get('/send-notification', (req, res) => {
//     const notificationPayload = {
//         data: {
//             title: 'New Notification',
//             body: 'This is a push notification from your server!',
//             icon: 'your-icon-url',
//         },
//     };

//     Promise.all(subscriptions.map(subscription =>
//         webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
//     ))
//         .then(() => {
//             console.log('Push notifications sent successfully.');
//             res.status(200).json({ message: 'Push notifications sent successfully' });
//         })
//         .catch(error => {
//             console.error('Error sending push notifications:', error);
//             res.status(500).json({ error: 'Error sending push notifications' });
//         });
// });



module.exports = router





