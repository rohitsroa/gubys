var engines =require('consolidate');
var express = require('express');
var cors=require('cors');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var autoIncrement = require('mongoose-auto-increment');
const request = require("request");
var datetime = require('datetime');
var exphbs = require('express-handlebars');
var nodemailer = require('nodemailer');

// Connect to db
mongoose.connect('mongodb://localhost:27017/guby',{ useNewUrlParser: true ,useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});
var connection = mongoose.createConnection("mongodb://localhost:27017/guby");
autoIncrement.initialize(connection);

// Init app
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs','pug','html','handlebars');

// Set public folder
app.use(cors()); 
app.engine('handlebars',exphbs());
app.use(express.static(path.join(__dirname, 'views')));


// Set global errors variable
app.locals.errors = null;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

// Get Category Model
var Price = require('./models/price');

// Get all categories to pass to header.ejs
Price.find(function (err, prices) {
    if (err) {
        console.log(err);
    } else {
        app.locals.prices = prices;
    }
});


// Express Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
//  cookie: { secure: true }
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
var index=require('./routes/index');
app.use('/',index);

var cart=require('./routes/cart');
app.use('/cart',cart);

var users=require('./routes/users');
app.use('/users',users);
var paytm=require('./routes/paytm');
app.use('/paytm',paytm);


module.exports=app;

app.get('*', function(req,res,next) {
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
 });

// Start the server
var port = 3000;
app.listen(port, function () {
    console.log('Server started on port ' + port);
});

