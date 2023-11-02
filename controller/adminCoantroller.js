

const db = require("../model/adminModel");
const userModel = require("../model/userModel");
// const {userSockets} = require("./userCantroller")

module.exports = {
    postCoupon: async (req, res) => {
        console.log(req.body);
        console.log(req.body.exDate);
        console.log(new Date(req.body.exDate));
        req.body.exDate = new Date(req.body.exDate)
        req.body.Limet = Number(req.body.Limet)
        await db.newCoupon(req.body)
        res.redirect("/admin/coupon")
    },
    coupon: async (req, res) => {
        const coupon = await db.getCoupons()
        res.render("admin/coupon", { layout: "admin/layout" ,coupon})

    },
    updateOrder: async (req, res) => {
        const id = req.params.id
        const data = req.body
        console.log(data);
        data.date = new Date()
        const data2 = await userModel.updateOrderStatus(id, data)
        console.log(data2);
        res.redirect("/admin/orders")
        const io = require("../model/socket")
        const userId = data2.value.user_id.toString()
        console.log("--------------------------");
        const userIO = io.userSockets.get(userId)
        userIO?.emit("status", { orderID: data2.value._id, status: data2.value.status.length })
        console.log("--------------------------");


        //    const userId = data2.userId
        //    const socket = userSockets.get(userId)
        //    console.log(socket);
    },
    orderD: async (req, res) => {
        const id = req.params.id
        const data = await userModel.orderDetails(id)
        const products = await userModel.orderProduct(id)
        console.log(data);
        data.status = data.status
        res.render("admin/orderDitel", { layout: 'admin/layout', products, data })


    },

    getOrder: async (req, res) => {
        const orders = await db.getOrders()
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        orders.forEach(i => { i.date = new Date(i.date).toLocaleDateString('en-US', options) });
        orders.forEach(i => { i.status.forEach(i => { i.date = new Date(i.date).toLocaleDateString('en-US', options) }) });
        console.log(orders[0].status[0]?.date);
        res.render("admin/order", { layout: 'admin/layout', orders })
    },
    salseReport: async (req, res) => {
        const data = await db.salseReport()
        const total = await db.totalSales()
        console.log(total[0]?.toatalSales.toFixed(1) || 0);
        res.json({ data, total: total[0]?.toatalSales.toFixed(1) || 0 })
    },
    getAdmin: (req, res) => {
        res.render("admin/admin", { layout: 'admin/layout' })
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