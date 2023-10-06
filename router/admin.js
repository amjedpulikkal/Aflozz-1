const express = require("express")
const router = express.Router()
const db = require("../module/db")
require('dotenv').config();
const multer = require("multer")
// const fs = require("fs")
const fs = require("fs-extra")
const path = require("path")
const sharp = require("sharp")
const { ifadmin, noadmin, sharp_pro,sharp_up, sharp_cat } = require("../module/aouth")



// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadDir = "../public/image/tamp/";
//         fs.mkdirSync(path.join(__dirname, uploadDir), { recursive: true });
//         cb(null, path.join(__dirname, uploadDir));
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}${path.extname(file.originalname)}`)
//     }

// })

const storage = multer.memoryStorage();
const upload = multer({ storage })

router.get("/", ifadmin, (req, res) => {

    if (req.session.admin) {
        console.log(req.session.admin);
    }
    res.redirect("/admin/products")
    // res.render("admin/addproduct", { layout: 'admin/layout' })
})
router.get("/login", (req, res) => {
    res.render("admin/login", { layout: 'login/layout-log' })
    // res.render("admin/addproduct", { layout: 'admin/layout' })
})
router.post("/login", noadmin, (req, res) => {
    try {
        let admin = req.body

        db.admin_find(admin).then(data => {
            console.log(data);
            req.session.admin = data
            res.status(200).json()
        }).catch(err => {
            console.log(err.err);
            res.status(err.status).json(err.err)
        })

    } catch (error) {
        console.log(error);

    }
})
router.get("/products", ifadmin, async (req, res) => {
    const products = await db.find_product()
    res.render("admin/product-list", { layout: 'admin/layout', products })
})

router.get("/add/product", ifadmin, async (req, res) => {
    try {
        const data = await db.find_category({ status: true })
        res.render("admin/addProduct", { layout: 'admin/layout', category: data })
    } catch (error) {
        console.log(error);
    }
})

router.get("/product/delete", ifadmin, async (req, res) => {
    try {
        console.log(req.query);
        const { image, id } = req.query
        const images = image.split(',')
        console.log(images)
        images.forEach(image => {
            fs.unlinkSync(path.join(__dirname, "../public/image/products/", image), (info, err) => {
                console.log(err);
            })
        })
        const products = await db.delete_product(id)
        console.log(products);
        if (products.deletedCount > 0) {
            res.redirect("/admin/products")
        } else {
            res.json()
        }

    } catch (err) {
        console.log(err);

    }
})




router.get("/category/delete", ifadmin, async (req, res) => {

    console.log(req.query);
    const { image, id } = req.query
    fs.unlinkSync(path.join(__dirname, "../public/image/products/", image))
    console.log(req.params.id);
    const products = await db.delete_category(id)
    if (products) {
        console.log(products);
        res.redirect("/admin/category")
    } else {
        res.json()
    }
})


router.get("/product/update/:id", ifadmin, async (req, res) => {
    try {
        const category = await db.find_category()
        const product = await db.findOne_product(req.params.id)
        res.render("admin/updateProduct", { layout: 'admin/layout', product, category })
    } catch (err) {
        console.error('Error during product update:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }

})
const updatefields = [
{ name: '0', maxCount: 1 },
{ name: '1', maxCount: 1 },
{ name: '2', maxCount: 1 },
{ name: '3', maxCount: 1 }
]
// ifadmin,
router.post("/product/update/",  upload.fields(updatefields), sharp_up, async (req, res) => {
    try {
        console.log(req.files);
        const data = req.body
        db.update_product(data).then(d => {
            res.redirect("/admin/products")
        })
    } catch (err) {
        // console.error('Error during product update:', err);
        // return res.status(500).json({ message: 'Internal server error' });
        console.log(err);

    }

})


router.post("/add/product", upload.array("myFile"), sharp_pro, async (req, res) => {
    try {
        if (!req.files) {
            console.log("No files uploaded");
        } else {
            let data = req.body
            console.log(data.image);
            await db.add_product(data)
            res.redirect("/admin/products")  
        }
    } catch (err) {
        console.error('Error during product addition:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }

});
router.get("/add/category", ifadmin, (req, res) => {
    try {
        res.render("admin/addCategory", { layout: 'admin/layout' })
    } catch (error) {
        console.log(error);
    }
})
router.get("/category", ifadmin, async (req, res) => {
    try {
        const products = await db.find_category()
        res.render("admin/category_list", { layout: 'admin/layout', products })
    } catch (error) {
        console.log(error);
    }
})
router.get("/all-user", ifadmin, async (req, res) => {
    try {
        const user = await db.all_user()
        res.render("admin/user_list", { layout: 'admin/layout', user })
    } catch (error) {
        console.log(error);
    }
})
router.post("/add/category", upload.single("image"),sharp_cat, async (req, res) => {
    try {
            console.log(req.file);
            let data = req.body
            data.status = false 
            console.log(data);
            db.add_category(data).then(data => {
                console.log(data)
                res.redirect("/admin/category")
            }).catch(err => {
                res.status(400).send(err)
            })
    } catch (err) {
        console.error('Error during user registration:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }



})
 router.get("/update/category/:id",async (req,res)=>{

      const data = await db.findOne_category(req.params.id)

      res.render("admin/updateCategory",{ layout: 'admin/layout',data})

 })
 router.post("/update/category",upload.single("image"),sharp_cat,async (req,res)=>{
    console.log(req.query);
    fs.unlinkSync(path.join(__dirname, "../public/image/products/", req.query.image))
    await db.update_category(req.body)
    res.redirect("/admin/category")
 })
router.get("/block", ifadmin, async (req, res) => {
    console.log(req.query);
    db.user_status(req.query).then(d => {
        console.log(d);
        res.redirect("/admin/all-user")
    }).catch(err => {
        console.log(err);
    })
})
router.get("/unlist", ifadmin, async (req, res) => {
    console.log(req.query);
    db.category_status(req.query).then(d => {
        console.log(d);
        res.redirect("/admin/category")
    }).catch(err => {
        console.log(err);
    })
})
router.get("/unlist-product", ifadmin, async (req, res) => {
    try {

        console.log(req.query)
        await db.update_status(req.query).then(s => {
            res.redirect("/admin/products")
        })
    } catch (error) {
        console.log(error);

    }


})
router.get("/logout", ifadmin, async (req, res) => {
    req.session.admin = null
    res.redirect("/admin")

})


module.exports = router;