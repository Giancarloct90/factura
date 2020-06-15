const express = require('express');
const app = express();
const engine = require('ejs-mate');
const path = require('path');

// SET VIEW ENGINE
app.set('views', path.join(__dirname, '../views/'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// SET PUBLIC FOLDER
app.use(express.static(path.join(__dirname, '../public/')));

// MIDLEWARES
// TO RECIVE JSON/DATA FROM FRONTEND
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

// ROUTES
app.use(require('./routes/indexRoutes'));

// DB CONNECT
require('./database');

app.listen(3000, (e) => {
    console.log('Server On');
});