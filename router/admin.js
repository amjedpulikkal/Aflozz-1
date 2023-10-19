const express = require("express")
const router = express.Router()
require('dotenv').config();
const multer = require("multer")
const { ifadmin, noadmin, sharp_pro, sharp_up, sharp_cat } = require("../model/aouth")
const adminController = require("../controller/adminCoantroller")
const productCantroller = require("../controller/productCoantroller")
const categoryCantroller = require("../controller/categoryCantroller")
const userCantroller = require("../controller/userCantroller")


const storage = multer.memoryStorage();
const upload = multer({ storage })

router.get("/", ifadmin, adminController.getAdmin)
router.route("/login", noadmin).get(adminController.getLogin).post(adminController.postLogin)

// ----------------------product----------------------------------

router.get("/products", ifadmin, productCantroller.getProducts)
router.route("/add/product")
    .get(ifadmin, productCantroller.getAddProdct)
    .post(upload.array("myFile"), sharp_pro, productCantroller.postAddProduct)
router.get("/product/delete", ifadmin, productCantroller.delete)
router.get("/product/update/:id", ifadmin, productCantroller.getUpdate)
const updatefields = [
    { name: '0', maxCount: 1 },
    { name: '1', maxCount: 1 },
    { name: '2', maxCount: 1 },
    { name: '3', maxCount: 1 }
]
router.post("/product/update/", upload.fields(updatefields), sharp_up, productCantroller.postUpdate)
router.get("/unlist-product", ifadmin, productCantroller.unlist)

//---------------------------- category  -----------------------------------------------
router.get("/category", ifadmin, categoryCantroller.getCategory)
router.get("/category/delete", ifadmin, categoryCantroller.delete)
router.route("/add/category")
    .get(ifadmin, categoryCantroller.addCategory)
    .post(upload.single("image"), sharp_cat, categoryCantroller.postAddCategory)
router.get("/update/category/:id",categoryCantroller.getUpdate)
router.post("/update/category", upload.single("image"), sharp_cat, categoryCantroller.postUpdate)
router.get("/unlist", ifadmin,categoryCantroller.unlist)
router.get("/all-user", ifadmin, userCantroller.getAll)
router.get("/block", ifadmin, userCantroller.block)

router.get("/orders",ifadmin,adminController.getOrder)
router.get("/orders/:id",ifadmin,adminController.orderD)
router.post("/orders/update/:id",ifadmin,adminController.updateOrder)


router.get("/logout", ifadmin, async (req, res) => {
    req.session.admin = null
    res.redirect("/admin")

})


module.exports = router;