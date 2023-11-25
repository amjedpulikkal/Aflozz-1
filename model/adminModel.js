const { db_admin, db_order, db_coupon, db_user, db_notification, db_subscription, db_banner } = require("./db");


module.exports = {
  async dailySalesReport(start, end) {
    return await db_order.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(start),
            $lt: new Date(end)
          }
        }
      },
      {
        $unwind: "$products"
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            week: { $week: "$date" },
            day: { $dayOfMonth: "$date" }
          },
          totalSales: { $sum: "$price" },
          totalProductsSold: { $sum: "$products.quantity" },
          topProduct: { $max: "$products._id" },
          topUser:{$max:"$user_id"}
        }
      },
      {
        $addFields: {
          adjustedWeek: {
            $add: [
              1,  
              { $subtract: ["$_id.week", { $week: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: 1 } } }] }
            ]
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          week:"$adjustedWeek",
          day: "$_id.day",
          totalSales: 1,
          topProduct: 1,
          totalProductsSold: 1,
          topUser:1
        }
      },
      {
        $sort: {
          year: 1,
          month: 1,
          day: 1
        }
      }
    ]).toArray();
  },
  async Oneday(start, end) {
    return await db_order.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(start),
            $lt: new Date(end)
          }
        }
      },
      {
        $unwind: "$products"
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            week: { $week: "$date" },
            day: { $dayOfMonth: "$date" }
          },
          totalSales: { $sum: "$price" },
          totalProductsSold: { $sum: "$products.quantity" },
          topProduct: { $max: "$products._id" },
          topUser:{$max:"$user_id"}
        }
      },
      {
        $addFields: {
          adjustedWeek: {
            $add: [
              1,  
              { $subtract: ["$_id.week", { $week: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: 1 } } }] }
            ]
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          week:"$adjustedWeek",
          day: "$_id.day",
          totalSales: 1,
          topProduct: 1,
          totalProductsSold: 1,
          topUser:1
        }
      },
      {
        $sort: {
          year: 1,
          month: 1,
          day: 1
        }
      }
    ]).toArray();
  },
  async weekReport(start,end){
    return await db_order.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(start),
            $lt:new Date(end)
          }
        }
      },
      {
        $unwind: "$products"
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            week: { $week: "$date" }
          },
          totalSales: { $sum: "$price" },
          totalProductsSold: { $sum: "$products.quantity" },
          topProduct: { $max: "$products._id" },
          topUser:{$max:"$user_id"}
        }
      },
      {   
        $addFields: {
          adjustedWeek: {
            $add: [
              1,
              { $subtract: ["$_id.week", { $week: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: 1 } } }] }
            ]
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          week:"$adjustedWeek",
          topUser:1,
          totalSales: 1,
          topProduct: 1,
          totalProductsSold: 1
        }
      },
      {
        $sort: {
          year: 1,
          month: 1,
          week: 1
        }
      }
    ]).toArray()

  },
  async getNotification(){
    return await db_notification.find().toArray()
  },
  async Report(start,end){
    return await db_order.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(start),
            $lt:new Date(end)
          }
        }
      },
      {
        $unwind: "$products"
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          totalSales: { $sum: "$price" },
          totalProductsSold: { $sum: "$products.quantity" }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalSales: 1,
          totalProductsSold: 1
        }
      },
      {
        $sort: {
          year: 1,
          month: 1
        }
      }
    ]).toArray()
  },
  async subscription(){
    return await db_subscription.find().toArray()
  },
  async getReturnOrders(){
    const order = await db_order.aggregate([
      {
        $match: {
          "return": { $exists: true }
        }
      },
      {
        $lookup: {
          from: "user",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $sort: { date: -1 }
      }
    ]).toArray();    
    console.log(order);
    return order
  //  return await db_order.find({return:{$exists:true}}).toArray()
  },
  async getCoupons(data){
    return await db_coupon.find().toArray()

  },
  async newCoupon(data){
    return await db_coupon.insertOne(data)
  },
  async totalSales() {
    return await db_order.aggregate([{
      $match: {
        $expr: { $eq: [{ $size: "$status" }, 3] }
      }
    }, { $group: { _id: null, toatalSales: { $sum: "$price" } } }]).toArray()
  },
  async salseReport() {
    return await db_order.aggregate([
      {

        $match: {
          $expr: { $eq: [{ $size: "$status" }, 3] }
        }

      },
      {
        $project: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date"
            }
          }
        }
      },
      {
        $group: {
          _id: "$date",
          dailySalesCount: { $sum: 1 }
        }
      }
    ]).toArray()


  },
  async getOrders() {

    const order = await db_order.aggregate([{
      $lookup: {
        from: "user",
        localField: "user_id",
        foreignField: "_id",
        as: "user"
      }
    }]).sort({ date: -1 }).toArray()
    console.log(order);
    return order

  },
  async admin_find(data) {

    try {

      let Email = data.Email

      let admin = await db_admin.findOne({ Email })
      console.log(admin)
      if (admin) {
        console.log(data.Password);
        if (admin.Password === data.Password) {
          return admin
        } else {

          throw { status: 406, err: "password incorrect" }
        }
      } else {

        throw { status: 404, err: "Email incorrect" }
      }
    } catch (err) {
      console.error(err)

      throw err
    }

  },
  async createBanner(data){
    return await db_banner.insertOne(data)
  },
  async findBanner(){
    return await db_banner.find().toArray()
  }

}