const { db_admin } = require("./db");

module.exports ={
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