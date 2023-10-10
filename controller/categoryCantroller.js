const categoryModel = require("../model/categoryModel")


module.exports = {
    getCategory:async (req, res) => {
        try {
            const products = await categoryModel.find_category()
            res.render("admin/category_list", { layout: 'admin/layout', products })
        } catch (error) {
            console.log(error);
        }
    },
    addCategory: (req, res) => {
        try {
            res.render("admin/addCategory", { layout: 'admin/layout' })
        } catch (error) {
            console.log(error);
        }
    },
    postAddCategory:async (req, res) => {
        try {
            console.log(req.file);
            let data = req.body
            data.status = false
            console.log(data);
            categoryModel.add_category(data).then(data => {
                console.log(data)
                res.redirect("/admin/category")
            }).catch(err => {
                res.status(400).send(err)
            })
        } catch (err) {
            console.error('Error during user registration:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    delete: async (req, res) => {
        console.log(req.query);
        const { image, id } = req.query
        fs.unlinkSync(path.join(__dirname, "../public/image/products/", image))
        console.log(req.params.id);
        const products = await categoryModel.delete_category(id)
        if (products) {
            console.log(products);
            res.redirect("/admin/category")
        } else {
            res.json()
        }
    },
    getUpdate: async (req, res) => {

        const data = await categoryModel.findOne_category(req.params.id)
    
        res.render("admin/updateCategory", { layout: 'admin/layout', data })
    
    },
    postUpdate:async (req, res) => {
        console.log(req.body);
        categoryModel.update_category(req.body)
        res.redirect("/admin/category")
    },
    unlist: async (req, res) => {
        console.log(req.query);
        categoryModel.category_status(req.query).then(d => {
            console.log(d);
            res.redirect("/admin/category")
        }).catch(err => {
            console.log(err);
        })
    }
}