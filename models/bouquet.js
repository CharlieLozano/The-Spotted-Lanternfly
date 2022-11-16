const db = require('../db');
const flowers = require('../routes/flowers');

module.exports = class FlowersModel {

    async checkIfBouquetExist(req, res, next){
        try {
            const username = req.user.username
            const results = await db.query('SELECT * FROM bouquet WHERE owner = $1 AND bought IS NULL', [username]);
            if(results.rows?.length){
                req.bouquet = results.rows[0]
                next()
            } else{
                const newBouquet = await db.query('INSERT INTO bouquet (owner) VALUES($1) RETURNING *', [username]);
                req.bouquet = newBouquet.rows[0]
                next()
            }

        } catch(err){
            throw err;
        }
    }

    async checkIfFlowerExist(flower){
        const capitalizedFlower = flower.charAt(0).toUpperCase() + flower.slice(1).toLowerCase();
        const flowerResult = await db.query('SELECT * FROM flowers WHERE name = $1', [capitalizedFlower]);
        if(flowerResult.rows?.length){
            return flowerResult.rows[0]
        } else{
            return false
        }

    }

    async getItems(bouquet) {

      try{
        const result = await db.query(
            `SELECT 
                flowers.name, 
                flowers.price AS "Individual Price", 
                bouquet_flowers.quantity,
                bouquet_flowers.price
            FROM bouquet_flowers
            JOIN flowers 
            ON bouquet_flowers.flower_id = flowers.id
            WHERE bouquet_flowers.bouquet_id = $1;`,
            [bouquet.id]);
        if (result.rows?.length) {
            return result.rows
        }
        return []

      } catch(err){
        return err
      }
    }
  
    async addItem(bouquet, body) {
        
        try{
            const {flower, quantity} = body
            const flowerObject = await this.checkIfFlowerExist(flower)
            if(!flowerObject){ 
                return { message: "This flower does not exist" } 
            }
            
            const flowerPrice = Number(flowerObject.price.replace(/[^0-9.-]+/g,""));
            const price = quantity * flowerPrice
            const results = await db.query(
                'INSERT INTO bouquet_flowers (bouquet_id, flower_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
                [bouquet.id, flowerObject.id, quantity, price])
            if (results.rows?.length) {
                return results.rows[0]
            }

            return []

        } catch(err){
          return err
        }
      }    

      async updateItem(bouquet, body) {

        try{
            const {flower, quantity} = body
            const flowerObject = await this.checkIfFlowerExist(flower)

            if(!flowerObject){ 
                return { message: "This flower does not exist" } 
            }
            const flowerPrice = Number(flowerObject.price.replace(/[^0-9.-]+/g,""));
            const price = quantity * flowerPrice
            const result = await db.query(
                'UPDATE bouquet_flowers SET quantity = $3, price = $4 WHERE bouquet_id = $1 AND flower_id = $2 RETURNING *',
                [bouquet.id, flowerObject.id, quantity, price]);

            if(result.rows?.length){
            return result.rows[0]
            } 
            return []

        } catch(err){
          return err
        }
      }

      async deleteItem(bouquet, flower) {

        try{
            const flowerObject = await this.checkIfFlowerExist(flower)

            if(!flowerObject){ 
                return { message: "This flower does not exist" } 
            }

            const result = await db.query(
                'DELETE FROM bouquet_flowers WHERE bouquet_id = $1 AND flower_id = $2 RETURNING *',
                [bouquet.id, flowerObject.id]);

            if(result.rows?.length){
                return result.rows[0]
            } 
            return []

        } catch(err){
          return err
        }
      }

      async clearBouquet(bouquet) {

        try{
            const result = await db.query(
                'DELETE FROM bouquet_flowers WHERE bouquet_id = $1 RETURNING *',
                [bouquet.id]);

            if(result.rows?.length){
                return result.rows
            } 
            return []
            
        } catch(err){
          return err
        }
      }

      async checkout(bouquet, user) {

        try{
            await db.query(
            'UPDATE bouquet SET bought = TRUE WHERE id = $1',
            [bouquet.id]);
            const order = await db.query(
                'INSERT INTO orders (bouquet_id, username) VALUES($1, $2) RETURNING *',
                [bouquet.id, user.username])
            if(order.rows?.length){
                return order.rows[0]
            } 
            return []
        } catch(err){
            return err
        }
      }
  }