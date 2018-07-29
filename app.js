/*    Load Middleware */

// Server executing
var express = require('express'),
    http = require('http'),
    path = require('path');

// Parsing
var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static');

// Error handling
var errorHandler = require('errorhandler'),
    expressErrorHandler = require('express-error-handler');

// Session
var expressSession = require('express-session');

// Configuration
var config = require('./config');

// Handler
var handlerLoader = require('./handler/handler_loader');

// Database(Global)
database = require('./database/database');

// Json
var jayson = require('jayson');

// File task
var fs = require('fs'),
    multer = require('multer');

// ETC..
var cors = require('cors');

console.log('#Load all middle wares.');

/*  Construct Sever */
app = express();

// Set view engine
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');
console.log('#Set view engine EJS.');

// Set port
app.set('port', config.SERVER_PORT);
console.log('#Set server port: %d', config.SERVER_PORT);

// Parsing
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

app.use(cookieParser());

// Session
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

app.use(cors());

// Upload
var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './uploads');
    },
    filename: function(req, file, callback){
        // callback(null, req.body.user + '/' + file.originalname);
    }
});

var upload = multer({
    storage: storage,
    limits: {
        files: 7,
        fileSize:1024*1024*20 // 20MB
    }
});

// JSONRPC
var jsonrpc_api_path = config.JSONRPC_API_PATH || '/api';
handlerLoader.init(jayson, app, jsonrpc_api_path);
console.log('Set JSON-RPC path: %s', jsonrpc_api_path);

// Router
var router = express.Router();
router.route('/page').post(function(req, res){
    console.log('Called router: /page');
    
    var param_user_email = req.body.email || req.query.email;
    console.log('User %s require.', param_user_email);
    res.render('page.ejs', {email: param_user_email});
});

app.use('/', router);

var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});

app.use( expressErrorHandler.httpError(404));
app.use( errorHandler);

process.on('uncaughtException', function(err){
    console.log('#Uncaught exception: ' + err);
    console.log('#Server process won`t close');
    console.log(err.stack);
});

process.on('SIGTERM', function(){
    console.log('#Process close...');
    app.close();
});

app.on('close', function(){
    console.log('#Express server object close...');
    if( database.db){
        database.db.close();
    }
});

var Server = http.createServer(app).listen(app.get('port'), function(){
    console.log('#SERVER START.');
    console.log('#PORT: ', app.get('port'));
    database.init(app, config);
});