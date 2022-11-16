const db = require('../db');
const bcrypt = require("bcrypt");

module.exports = class AuthService {

    async registerUser(id, body){
      const {username, password, email} = body
      const saltRounds = 10;
      try {
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        const result = await db.query('INSERT INTO users (id, username, password, email) VALUES ($1, $2, $3, $4) RETURNING username, email', 
        [id, username, passwordHash, email]);
        console.log(result.rows[0])
        if(result.rows?.length){
          return result.rows[0];
        }

        return null

      } catch(err){
        throw new Error(err)
      }
    }


    async findUserById(id){
      try{
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if(result.rows?.length){
          return result.rows[0];
        }

        return null;
      
      } catch(err){
        throw new Error(err);
      }
    
    }

    async login(username, password){
        try {
          const result = await db.query('SELECT * FROM users WHERE username = $1', [username])

          if (!result.rows?.length) {
            return false
          }

          const user = result.rows[0]
          const matchFound = await bcrypt.compare(password, user.password);

          if (!matchFound) {
            return false
          }
  
          return user
      
          return null;
        } catch(err) {
          throw new Error(err);
        }
    } 

    async isAdmin (req, res, next){
      
      try{

        let result
        if(req.user){
          const query = await db.query('SELECT admin FROM users WHERE id = $1', [req.user.id]);
          if(query.rows?.length){
            result = query.rows[0].admin
          }
        }
        
        if (result && result === true) {
          next() 
        } else {
          res.send({message: "Not Authorized"})
        }
        
      } catch(err){
        throw new Error(err);
      }
      
    }

  async isUser (req, res, next){
    if(req.user){
      next()
    } else{
      res.send({message: "Not Authorized"})
    }
  }
}