module.exports = (app) => {

    app.get('/payment', (req, res) => {
        res.send('Hello world')
    });

    app.post('/payment/pay', (req, res) => {
        const payment = req.body;
        payment.status = 'Created';
        payment.date = new Date;

        const conn = app.persistence.connectionFactory;
        const dao  = new app.persistence.PaymentDao(conn);
        
        dao.insert(payment)
            .then(result => {
                return dao.findById(result.insertId);
            })
            .then(payment => {
                res.json(payment);
            })
            .catch(err => {
                console.log(`Error Occurred: ${err.message}`)
                res.json({error : err.message});
            });
    });
}