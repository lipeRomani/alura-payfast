
class PaymentDao {

    constructor(con) {
        this._con = con;
    }

    insert(payment) {
        return new Promise((resolve, reject) => {
          this._con.query(
            "INSERT INTO payments SET ?",
            payment,
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
                if (result.length === 0) resolve(null);
                resolve(result[0]);
            });  
        });
    }

    confirmPayment(payment) {
        payment.status = 'Confirmed';
        return new Promise((resolve, reject) => {
            this._con.query(
                'UPDATE payments SET status = ? WHERE id = ?',
                [payment.status, payment.id], 
                (err, result) => {
                    if (err) reject(err);
                    resolve(payment); 
                })
        });
    }

    deletePayment(payment) {
        payment.status = 'Cancelled';
        return new Promise((resolve, reject) => {
            this._con.query(
                'UPDATE payments SET status = ? WHERE id = ?',
                [payment.status, payment.id], 
                (err, result) => {
                    if (err) reject(err);
                    resolve(payment); 
                })
        });
    }

}


module.exports = () => {
    return PaymentDao;
}