
class PaymentDao {

    constructor(con) {
        this._con = con;
    }

    insert({value, description, currency, status, date}) {
        return new Promise((resolve, reject) => {
          this._con.query(
            "INSERT INTO payments (description, value, currency, status, date) VALUES (?)",
            [[description, value, currency, status, date]],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            });  
        })
    }

    findById(id) {
        return new Promise((resolve, reject) => {
            this._con.query("SELECT * FROM payments WHERE id = ?", [id], (err, result) => {
                if (err) reject(err);
                if (result.length === 0) resolve(result);
                resolve(result[0]);
            });  
        });
    }

}


module.exports = () => {
    return PaymentDao;
}