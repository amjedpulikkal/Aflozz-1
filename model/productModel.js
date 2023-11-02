const { db_product } = require("./db")
const { ObjectId } = require("mongodb");

module.exports = {
    async ufind_product() {
        try {
            return await db_product.aggregate([
                { $match: { stock: { $ne: "0" }, status: true } },
                { $sample: { size: 4 } }
              ]).toArray();
              
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },

    async add_product(data) {
        try {
            data.price = Number(data.price)
            data.discount = Number(data.discount)
            data.stock = Number(data.stock)
            return await db_product.insertOne(data)
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async find_product(data) {
        try {
            return await db_product.find({}).toArray()
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async ufind_product(data) {
        try {
            return await db_product.find({ $and: [{ stock: { $ne: "0" } }, { status: true }] }).toArray()
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async ufind_category(data) {
        try {
            return await db_category.find().toArray()
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async findOne_product(id) {
        try {
            console.log(id);

            return await db_product.findOne({ _id: new ObjectId(id) })

        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async update_product(data) {
        try {
            const id = data.id
            delete data._id
            const image = data.image
            delete data.image
            console.log(id);
            console.log(data);
            data.stock = Number(data.stock)
            console.log(image);
            console.log(new ObjectId(id));
            await db_product.updateOne({ _id: new ObjectId(id) }, { $set: data }).then(async e => {

                return await db_product.updateOne({ _id: new ObjectId(id) }, { $set: image })
            })
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },
    async delete_product(id) {
        try {
            return await db_product.deleteOne({ _id: new ObjectId(id) })
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },

    async update_status(data) {

        try {
            if (data.status === "true") {
                data.status = true
            } else {
                data.status = false
            }
            return await db_product.updateOne({ _id: new ObjectId(data._id) }, { $set: { status: data.status } })
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },


}