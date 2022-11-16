const db = require('../db');

module.exports = class FlowersModel {

    async organizeOrders(orders){
        const results = {}

        if(orders.rows?.length){
            for (const row of orders.rows){
                const flowers = await db.query(
                    `SELECT
                        flowers.name,
                        flowers.price AS individual_price,
                        bouquet_flowers.quantity,
                        bouquet_flowers.price
                    FROM bouquet_flowers
                    JOIN flowers
                    ON bouquet_flowers.flower_id = flowers.id
                    WHERE bouquet_flowers.bouquet_id = $1`,
                    [row.bouquet_id]
                )
                const finalPrice = await db.query(
                    `SELECT SUM(price) AS total FROM bouquet_flowers WHERE bouquet_id = $1`,
                    [row.bouquet_id]
                )

                const flowerCollection = {}

                if (flowers.rows?.length) {
                    flowers.rows.forEach(flower => {
                        flowerCollection[flower.name] = {
                            quantity: flower.quantity,
                            combinedPrice: flower.price,
                            individualPrice: flower.individual_price
                        }
                    })
                }

                results[row.bouquet_id] = {
                    total: finalPrice.rows[0].total,
                    flowers: { ...flowerCollection }
                }
            }
            return results
        }

        return []
    }

    async getOrders(user) {

        try{
        const orders = await db.query(
            `SELECT * FROM orders WHERE username = $1`, 
            [user.username]);

        return this.organizeOrders(orders);

        } catch(err){
        return err
        }
    }

    async getOneOrder(user, bouquet_id) {

        try{
            const orders = await db.query(
                `SELECT * FROM orders WHERE username = $1 AND bouquet_id = $2`, 
                [user.username, bouquet_id]);
    
            return this.organizeOrders(orders);
  
        } catch(err){
          return err
        }
      }

    async deleteOrder(user, bouquet_id) {

    try{
        const result = await db.query(
            'DELETE FROM orders WHERE bouquet_id = $1 AND username = $2 RETURNING *', 
            [bouquet_id, user.username]);
        if (result.rows?.length) {
            
            await db.query('DELETE FROM bouquet_flowers WHERE bouquet_id = $1', 
            [bouquet_id]);
            await db.query('DELETE FROM bouquet WHERE id = $1', 
            [bouquet_id]);
            return result.rows
        }
        return []

    } catch(err){
        return err
    }
    }
  
}