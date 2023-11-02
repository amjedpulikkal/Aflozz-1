
const jwt = require("../model/JWT")
const userModel = require("../model/userModel")
const productModel = require("../model/productModel")
const { sendmailForPassword } = require("../model/nodemailer")
const Razorpay = require("razorpay")
require("dotenv").config()
module.exports = {
  getHome: async (req, res) => {
    const products = await productModel.ufind_product()
    console.log(products)
    res.render("user/home", { layout: "user/layout", products, titel: "Aflozz" ,cartLength:req.session.user.cart.length})

  },
  getlogin: (req, res) => {

    res.render("login/sign-login", { layout: "login/layout-log"})

  },
  psotLgin: async (req, res) => {

    try {
      const data = req.body;
      userModel.find(data).then(data => {
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
  },
  getProduct: async (req, res) => {
    try {

      const id = req.params.id
      const product = await productModel.findOne_product(id)
      console.log(product);
      res.render("user/products", { layout: "user/layout", product, titel: "Aflozz" ,cartLength:req.session.user.cart.length})
    } catch (error) {
      console.log(error);
    }
  },
  goetCategory: async (req, res) => {
    const category = await userModel.ufind_category()
    console.log(category);
    res.render("user/category", { layout: "user/layout", category })
  },
  postSignup: async (req, res, next) => {
    try {
      const data = req.body
      data.status = true
      userModel.find_insert(data).then(data => {
        res.status(200).send("ok")
      }).catch(err => {
        console.log(err.message)
        res.status(409).json({ err })
      })
    } catch (error) {
      console.log(error);

    }

  },
  psotSingOtp: async (req, res, next) => {
    try {

      const data = req.body
      await userModel.storeOtp({ user: data, ex_date: new Date(new Date().getTime() + 2 * 60000) })
      res.render("login/onetime", { Email: data.Email, layout: "login/layout" })

    } catch (error) {

      console.error('Error during user registration:', error);
      return res.status(500).json({ message: 'Internal server error' });

    }

  },
  postOtp: async (req, res, next) => {
    try {
      const data = req.body
      console.log(data)

      const userData = await userModel.findOtp(data.Otp)
      console.log(userData);
      if (userData) {
        if (new Date() < userData.ex_date) {
          if (userData.otp === data.Otp) {
            await userModel.insert_user(userData.user)
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

  },
  getForgotpassword: async (req, res, next) => {
    // res.render("login/forgot", {layout: "login/layout-log"})
    res.render("login/email", { layout: "login/layout-log" })

  },
  postforgot: async (req, res, next) => {
    // res.render("login/forgot", {layout: "login/layout-log"})
    const user = await userModel.findeOne_user(req.body.Email)
    console.log(user);
    if (user) {
      console.log(user);
      await sendmailForPassword(user.Email, user.Name, user._id)
      res.status(200).json("send")
    } else {
      res.status(409).json()

    }

  },
  getForgotpasswordWithLink: async (req, res, next) => {

    const tokon = jwt.varifyction(req.params.link)
    if (tokon) {
      res.render("login/forgot", { layout: "login/layout-log", Email: tokon.data.Email })
    } else {
      res.redirect("/")
    }
  },
  psotResatPassword: async (req, res, next) => {
    try {
      const { Email, Password } = req.body
      console.log(Email, Password);
      await userModel.update_pass(Password, Email)
      res.status(200).json()
    } catch (err) {
      console.log(err);
    }
  },
  logout: async (req, res) => {
    req.session.user = null
    res.redirect("/")
  },
  getAll: async (req, res) => {
    try {
      const user = await userModel.all_user()
      res.render("admin/user_list", { layout: 'admin/layout', user })
    } catch (error) {
      console.log(error);
    }
  },
  block: async (req, res) => {
    console.log(req.query);
    categoryModel.user_status(req.query).then(d => {
      console.log(d);
      res.redirect("/admin/all-user")
    }).catch(err => {
      console.log(err);
    })
  },
  getCart: async (req, res) => {
    try {
      const products = await userModel.findCart(req.session.user._id)
      if (products) {
        const data = await userModel.getAmount(req.session.user._id)
        res.render("user/cart", { layout: "user/layout", titel: "Aflozz-cart", products, price: data,cartLength:req.session.user.cart.length })
      } else {

        res.render("user/cart", { layout: "user/layout", titel: "Aflozz-cart", products: [], price: 0 ,cartLength:req.session.user.cart.length})
      }
    } catch (err) {
      console.log(err);
    }
  },
  addToCart: async (req, res) => {
    try {
      const id = req.params.id
      const user_id = req.session.user._id
      console.log("go")
      console.log(user_id)
      console.log(id)
      await userModel.addTocart(user_id, id)
      res.status(200).json({cartLength:req.session.user.cart.length+1})
    } catch (err) {
      console.log(err);
    }
  },
  cartRemove: async (req, res) => {
    try {
      console.log(req.params)
      const data = await userModel.cartRemove(req.session.user._id, req.params.id)
     
      console.log(data);
      // res.redirect("/cart")
      res.status(200).json({cartLength:req.session.user.cart.lengtgh-data.modifiedCount})

    } catch (err) {
      console.log(err);
    }
  },
  incresCart: async (req, res) => {
    try {
      const { id, quantity } = req.body
      const user_id = req.session.user._id
      console.log(id)
      console.log(quantity)
      console.log(user_id)
      await userModel.addTocart(user_id, id, quantity).catch(err => {
        console.log("eeeeeerrrrrrrrrrrr")
        res.status(400).json(err)
      })
      res.status(200).json("")
    } catch (err) {
      console.log("eeeeeerrrrrrrrrrrr")

      res.status(400).json(err)
    }
  },
  address: async (req, res) => {
    try {
      const address = req.session.user.address
      console.log(address);
      const price = await userModel.getAmount(req.session.user._id)
      res.render("user/address", { layout: "user/layout", titel: "Aflozz-cart", price, address ,cartLength:req.session.user.cart.length,coupon:req.session?.coupon})
    } catch (err) {
      console.log(err);
    }

  },
  order: async (req, res) => {
    try {

      const orders = await userModel.getOrders(req.session.user._id)
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      orders.forEach(i => { i.date = new Date(i.date).toLocaleDateString('en-US', options) });
      orders.forEach(i => { i.status.forEach(i => { i.date = new Date(i.date).toLocaleDateString('en-US', options) }) });
      console.log(orders[0].status[0]);
      res.render("user/account/order", { layout: "user/layout", titel: "Aflozz-cart", selection: "order", orders, user: req.session.user ,cartLength:req.session.user.cart.length})
    } catch (err) {
      console.log(err);
    }
  },
  newOrder: async (req, res) => {
    req.session.coupon = null
    const id = req.session.user._id
    const data = {}
    const index = Number(req.body.index)
    data.address = await userModel.orderAddres(id, index)
    data.status = [{ date: new Date() }]
    data.price = await userModel.getAmount(id)
    data.products = req.session.user.cart
    data.totalMRP = req.body.totalMRP
    // await userModel.degress(data.products)
    await userModel.newOrder(id, data)
    await userModel.removeCart(id)
    res.status(200).json("ok")

  },
  getAccount: async (req, res) => {
    const address = req.session.user.address
    res.render("user/account/address", { layout: "user/layout", titel: "Aflozz-Account", selection: "address", address, user: req.session.user,cartLength:req.session.user.cart.length })
  },
  newAdress: async (req, res) => {
    const user_id = req.session.user._id
    const body = req.body
    console.log(body);
    await userModel.newAdress(user_id, body)
    res.status(200).json("ok")

  },
  orderDetails: async (req, res) => {
    const id = req.params.id
    const orders = await userModel.orderDetails(id)
    const products = await userModel.orderProduct(id)
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    orders.status.forEach(i => { i.date = new Date(i.date).toLocaleDateString('en-US', options) })
    console.log(orders);
    console.log(products);
    res.render("user/account/order-items", { layout: "user/layout", titel: "Aflozz-Account", selection: "order", data: orders, products, user: req.session.user,cartLength:req.session.user.cart.length})

  },
  addressRemove: async (req, res) => {

    await userModel.removeAddress(req.session.user._id, req.params.index)
    res.redirect("/account")
  },
  profil: async (req, res) => {
    res.render("user/account/profile", { layout: "user/layout", titel: "Aflozz-Account", selection: "profil", user: req.session.user,cartLength:req.session.user.cart.length })
  },
  cancelOrder: async (req, res) => {
    const id = req.params.id
    console.log(id);
    console.log("---------------------------------------------");
    await userModel.cancelOrder(id)
    console.log("---------------------------------------------");
    res.status(200).json("ok")
  },

  
  changePassword: async (req, res) => {

    const id = req.session.user._id
    const data = req.body
    console.log(data);
    await userModel.changePassword(id, data).then(data => {

      res.status(200).json()
    }).catch(err => {
      console.log("Password is incorrect");
      res.status(400).json(err)
    })
  },
  newAddress: async (req, res) => {
    res.render("user/newAddress", { layout: "user/layout", titel: "Aflozz-Account", data: null,cartLength:req.session.user.cart.length})
  },
  editAddress: async (req, res) => {
    const index = req.params.id
    const data = await userModel.findaddress(req.session.user._id, index)
    console.log(data);
    res.render("user/newAddress", { layout: "user/layout", titel: "Aflozz-Account", data,cartLength:req.session.user.cart.length})

  },
  onlinePayment:async (req,res)=>{
    try {
      console.log(req.body);
      if(Number(req.body.discount)){
        req.body.price -=req.body.discount
      }
      console.log(req.body);
      
      const  instance = new Razorpay({
        key_id: process.env.key_id,
        key_secret:process.env.key_secret
      })
      const options = {
        amount: Number(req.body.price)*100,
        currency: "INR",
        receipt: "order_rcptid_11"
      };
      console.log(req.body.price);
      const id = await instance.orders.create(options)
      console.log(id);
      res.status(200).json({orderId:id})
    } catch (error) {
      console.log(error);
      
    }


  },
  couponCode:async(req,res)=>{
    const code = req.params.code
    const coupon = await userModel.claimCoupon(code,req.session.user._id)
    console.log(coupon);
    if (coupon.value){
      req.session.coupon = coupon.value
      res.json(coupon.value)
    }else{
      res.json(false)
    }
  }
 
  



}