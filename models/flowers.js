const db = require('../db');

module.exports = class FlowersModel {

    async flowers(options = {}) {

      try{
        const result = await db.query('SELECT * FROM flowers');
        if (result.rows?.length) {
            return result.rows
        }
        return []

      } catch(err){
        return err
      }
    }
  
    async findOne(name) {
      try {
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        const result = await db.query('SELECT * FROM flowers WHERE name = $1', [name]);
        
        if (result.rows?.length) {
          return result.rows[0]
        }
        return null;
  
      } catch(err) {
        throw err;
      }
    }

    async create(body){

      try {
        const {name, price} = body;
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

        const result = await db.query(
          'INSERT INTO flowers (name, price) VALUES ($1, $2) RETURNING *',
          [capitalizedName, price]);
        if (result.rows?.length) {
          return result.rows[0]
        }
        return null;
  
      } catch(err) {
        throw err;
      }
    }

    async delete(name){
      try {
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        const result = await db.query('DELETE FROM flowers WHERE name = $1 RETURNING *', [capitalizedName]);

        if (result.rows?.length) {
          return result.rows[0] 
        }

        return null

      } catch (err) {
          next(err)
      }
    }

    async update(updatedValues){
      try {
        const { name, newName, price } = updatedValues;
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        const newCapitalizedName = newName.charAt(0).toUpperCase() + newName.slice(1).toLowerCase()

        const result = await db.query(
          'UPDATE flowers SET name = $2, price = $3 WHERE name = $1 RETURNING *',
          [capitalizedName, newCapitalizedName, price]
        )
        console.log(result)
        if (result.rows?.length) {
          return result.rows[0]
        }

        return null;
  
      } catch(err) {
        console.log(err)
        throw err;
      }
    }
  }