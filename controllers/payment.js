const {check, validationResult} = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const currencys = ['BRL', 'USD']
const validationPaymentCreate = [
        check('value')
            .isDecimal()
            .withMessage('Value deve ser um decimal.'),
        check('description')
            .isLength({min : 5, max: 150})
            .withMessage('Descrição deve possuir no mínimo 5 caracteres'),
        check('currency')
            .isIn(currencys)
            .withMessage('Moeda precisa ser BRL (real) ou UDS (dolar)')
    ];

module.exports = (app) => {

    app.get('/payment', (req, res) => {
        res.send('Hello world')
    });

    app.get('/payment/:id', (req, res) => {
        res.send('Hello world')
    });

    app.post('/payment/pay', validationPaymentCreate, (req, res) => {
        const payment = req.body;
        payment.status = 'Created';
        payment.date = new Date;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() });
        }
        
        const conn = app.persistence.connectionFactory;
        const dao  = new app.persistence.PaymentDao(conn);
        
        dao.insert(payment)
            .then(result => {
                return dao.findById(result.insertId);
            })
            .then(payment => {
                const hateoas = {
                    payment,
                    links : {
                        delete : {
                            path : `/payment/${payment.id}`,
                            method : 'DELETE' 
                        },
                        confirm : {
                            path : `/payment/${payment.id}`,
                            method : 'PUT'
                        },
                        detail : {
                            path : `/payment/${payment.id}`,
                            method : 'GET' 
                        }
                    }
                }
                res.status(201).json(hateoas);
            })
            .catch(err => {
                console.log(`Error Occurred: ${err.message}`)
                res.status(500).json({error : err.message});
            });
    });

    app.put('/payment/:id', (req, res) => {
        
        const paymentId = req.params.id;
        const conn = app.persistence.connectionFactory;
        const dao  = new app.persistence.PaymentDao(conn);
        
        dao.findById(paymentId)
            .then(payment => {
                if (!payment) res.status(404).json({message : "Pagamento não encontrado"});
                return dao.confirmPayment(payment);
            })
            .then(payment => {
                res.status(200).json(payment)
            })
            .catch(err => {
                res.status(500).json({error : err.message})
            });
    });

    app.delete('/payment/:id', (req, res) => {
        
        const paymentId = req.params.id;
        const conn = app.persistence.connectionFactory;
        const dao  = new app.persistence.PaymentDao(conn);
        
        dao.findById(paymentId)
            .then(payment => {
                if (!payment) res.status(404).json({message : "Pagamento não encontrado"});
                return dao.deletePayment(payment);
            })
            .then(payment => {
                res.status(204).json({message : "Pagamento cancelado com sucesso"})
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error : err.message})
            });
    });
}