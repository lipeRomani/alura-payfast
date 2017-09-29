var calculator = require('../helpers/calculator')();

module.exports = (app) => {

    app.get('/payment', (req, res) => {
        res.send('Hello world')
    });

    app.post('/payment/pay', (req, res) => {
        console.log(req.body);
        const {value, currency} = req.body;

        const total = calculator(value, 10);
        res.send(`Pagamento com juros no valor de ${total}`);
    });
}