const webpush = require('web-push');
const db = require("../model/adminModel");
const userModel = require("../model/userModel");
const { db_notification } = require('../model/db');
// const {userSockets} = require("./userCantroller")

module.exports = {
    getSalse:(req,res)=>{
        res.render("admin/salesReport",{ layout: 'admin/layout' })
    },
    notification: async (req, res) => {
        const data = await db.getNotification()
        console.log(data);
        res.render("admin/notification", { layout: 'admin/layout', data })
    },
    returnOrder: async (req, res) => {
        const orders = await db.getReturnOrders()
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        orders.forEach(i => { i.date = new Date(i.date).toLocaleDateString('en-US', options) });
        orders.forEach(i => { i.status.forEach(i => { i.date = new Date(i.date).toLocaleDateString('en-US', options) }) });
        console.log(orders[0]?.status[0]?.date);
        res.render("admin/orderReturn", { layout: 'admin/layout', orders })
    },
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
        res.render("admin/coupon", { layout: "admin/layout", coupon })

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
        // const data = await db.salseReport()
        // const total = await db.totalSales()
        // console.log(total[0]?.toatalSales.toFixed(1) || 0);
        // res.json({ data, total: total[0]?.toatalSales.toFixed(1) || 0 })
        console.log("----------");
        console.log(req.body);
        const { start, end, method } = req.body

        if (method === "weeks") {
            const data = await db.weekReport(start, end)
            console.log(data);
            res.json(data)

        } else if (method === "day") {
            const data = await db.dailySalesReport(start, end)
            console.log(data);
            res.json(data)

        } else if("Oneday") {
            const data = await db.Oneday(start, end, method)
            console.log(data);
            res.json(data)
        }else{
            const data = await db.Report(start, end)
            console.log("data");
            console.log(data);
            res.json(data)
        }
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
    send: async (req, res) => {

        const vapidKeys = {
            publicKey: process.env.webPush_publicKey,
            privateKey: process.env.webPush_privatekey
        };

        webpush.setVapidDetails(
            'mailto:manuamjed32@gmail.com',
            vapidKeys.publicKey,
            vapidKeys.privateKey
        );

        const body = req.body
        body.date = new Date()
        console.log(body);
        const {notification}= require("../app")
        await db_notification.insertOne(body)
        const notificationPayload = {
            title: body.title,
            body: body.body,
            icon: '/image/logo.png', // Use an icon that represents the offer.
            badge: '/image/logo.png', // You can use the same logo as the badge.
            image: "/image/notification/" + body.image,
            sound: '/interface-124464.mp3',
            actions: [
                {
                    action: "action-1",
                    title: 'View Offer', // Action button to view the offer details.

                },
                {
                    action: 'action-2',
                    title: 'Dismiss', // Action button to dismiss the notification.
                },
            ],
            data: {
                customKey: body.details,
                link: body.link
            },
        };
        console.log(notificationPayload);
        notification(notificationPayload)
        const data = await db.subscription()
        console.log(data);
        webpush.sendNotification(data[0], JSON.stringify(notificationPayload)).then(() => {
            console.log('Notification sent successfully to:');
        })
         .catch((error) => {
                console.error('Error sending notification to', error);
         });
        res.redirect("/admin/notification")

    }

}