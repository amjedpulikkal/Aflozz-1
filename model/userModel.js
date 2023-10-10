const { ObjectId } = require("mongodb");
const { db_user } = require("./db");
const { decryption, encryption } = require("./crypto");


// Other required modules and dependencies

module.exports = {
    async findCart(id) {
        const user = await db_user.aggregate([
            {
              $match: {
                "_id": new ObjectId(id)
              }
            },
            {
              $lookup: {
                from: "products",
                localField: "cart._id",
                foreignField: "_id",
                as: "cart"
              }
            },
            {
                $project: {
                
                  cart: {
                    quantity:"$quantity",
                    $filter: {
                      input: "$cart",
                      as: "item",
                      cond: { $ne: ["$$item.product.status", false] }
                    }
                  },

                }
            }
          ]).toArray()
        console.log("user");
          console.log(user);
        

        //    return user[0].cart
        //   return user
    },
    async addTocart(user_id, product_id, quantity) {
        try {
            //   const data =  await db_user.findOne({_id:new ObjectId(user_id)},{
            //     cart: { $elemMatch: {_id:idToFind } }
            //   })
            //   if (data) {
            //     if (data.) {

            //     }
            //   }
            console.log("goooooooooooooooooooooooooooooooooooooot");
            return await db_user.updateOne({ _id: new ObjectId(user_id) }, { $push: { cart: { _id: new ObjectId(product_id), quantity } } })
        } catch (err) {
            throw err

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
    async update_pass(Password, Email) {
        Password = encryption(Password);
        console.log(Password);
        return await db_user.updateOne({ Email }, { $set: { Password } });
    },
    async findeOne_user(Email) {
        try {

            return await db_user.findOne({ Email })
        } catch (errr) {
            console.log(errr);
            throw errr
        }
    },

    async find_insert(data) {
        try {
            const Email = data.Email;
            const user = await db_user.find({ Email }).toArray();
            if (user.length === 0) {
                return true;
            } else {
                throw "An account with this email already exists";
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async insert_user(data) {
        console.log(data.Password);
        data.Password = encryption(data.Password);
        console.log(data.Password);
        data.status = true;
        return await db_user.insertOne(data);
    },

    async find(data) {
        try {
            let Email = data.Email;
            console.log(Email);
            let user = await db_user.findOne({ Email });
            if (user) {
                user.Password = decryption(user.Password);
                console.log(user.Password);
                if (user.Password === data.Password) {
                    if (user.status === false) {
                        throw { status: 404, err: "Email blocked" };
                    }
                    return user;
                } else {
                    throw { status: 406, err: "password incorrect" };
                }
            } else {
                throw { status: 404, err: "Email incorrect" };
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async user_status(data) {
        try {
            if (data.status === "true") {
                data.status = true;
            } else {
                data.status = false;
            }
            return await db_user.updateOne(
                { _id: new ObjectId(data._id) },
                { $set: { status: data.status } }
            );
        } catch (errr) {
            console.log(errr);
            throw errr;
        }
    },

    async findOne_user(Email) {
        try {
            return await db_user.findOne({ Email });
        } catch (errr) {
            console.log(errr);
            throw errr;
        }
    },

    async all_user() {
        return await db_user.find().toArray();
    },
};
