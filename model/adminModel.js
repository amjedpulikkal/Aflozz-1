const { db_admin, db_order } = require("./db");


module.exports = {
    async getOrders() {

        const order = await db_order.aggregate([{
            $lookup: {
                from: "user",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
              }
        }]).sort({date:-1}).toArray()
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

    }
}