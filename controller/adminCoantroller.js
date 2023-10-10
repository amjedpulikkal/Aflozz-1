

const db = require("../model/adminModel")


module.exports={
    getAdmin:(req, res) => {
        res.redirect("/admin/products")
    },
    getLogin: (req, res) => {
        res.render("admin/login", { layout: 'login/layout-log' })
        // res.render("admin/addproduct", { layout: 'admin/layout' })
    },
    postLogin: (req, res) => {
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
    },
}