
const jwt = require("../model/JWT")
const userModel = require("../model/userModel")
const productModel = require("../model/productModel")
module.exports = {
  getHome: async (req, res) => {
    const products = await productModel.ufind_product()
    console.log(products);
    res.render("user/home", { layout: "user/layout", products, titel: "Aflozz" })

  },
  getlogin: (req, res) => {

    res.render("login/sign-login", { layout: "login/layout-log" })

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
      await require("../model/nodemailer").sendmailForPassword(user.Email, user.Name, user._id)
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
      const user = await categoryModel.all_user()
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
      res.render("user/cart", { layout: "user/layout", titel: "Aflozz-cart", products })
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
      await userModel.addTocart(user_id, id, 1)
      res.status(200).json("goot")
    } catch (err) {
      console.log(err);
    }
  }


}