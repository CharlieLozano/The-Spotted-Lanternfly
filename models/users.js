const db = require('../db');

module.exports = class FlowersModel {

    async getUser(user) {

      try{
        const result = await db.query(
            'SELECT username, email, address FROM users WHERE username = $1', 
            [user.username]);
        
            if (result.rows?.length) {
                return result.rows
            }
        return []

      } catch(err){
        return err
      }
    }
 
    async updateUser(user, body) {

        try{
            let { email, address } = body

            const results = await db.query(
                `UPDATE users 
                SET email = COALESCE($2, email), 
                    address = COALESCE($3, address) 
                WHERE username = $1 
                RETURNING username, email, address`,
                [user.username, email, address])

            if(results.rows?.length){
              return results.rows[0]
            }
                
            return []

        } catch(err){
          return err
        }
      }

}