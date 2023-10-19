

const db = require("../model/adminModel");
const userModel = require("../model/userModel");


module.exports={
    updateOrder:async(req,res)=>{
        const id = req.params.id
        const data = req.body
        console.log(data);
        data.date= new Date()
       await userModel.updateOrderStatus(id,data)
       res.redirect("/admin/orders")
    },
    orderD:async(req,res)=>{
        const id = req.params.id
        const data = await userModel.orderDetails(id)
        const products = await userModel.orderProduct(id)
        console.log(data);
        data.status =data.status
         res.render("admin/orderDitel", { layout:'admin/layout',products,data})

        
    },
    
    getOrder:async(req,res)=>{
        const orders = await db.getOrders()
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        orders.forEach(i=>{ i.date = new Date(i.date).toLocaleDateString('en-US', options)}) ;
        orders.forEach(i=>{ i.status.forEach(i=>{ i.date = new Date(i.date).toLocaleDateString('en-US', options)})}) ;
        console.log(orders[0].status[0]?.date);
        res.render("admin/order", { layout: 'admin/layout',orders})
    },
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