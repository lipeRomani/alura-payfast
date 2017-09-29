var app = require('./config/customExpress')();

app.listen(3000, () => {
    console.log("start server on port 3000");
});
