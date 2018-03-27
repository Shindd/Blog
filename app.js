var express = require('express')
    , http = require('http')
    , path = require('path');

var bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , static = require('serve-static')
    , errorHandler = require('errorhandler');

var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');

var config = require('./config');

var handler_loader = require('./handler/handler_loader');

database = require('./database/database');

var jayson = require('jayson');

app = express();

console.log('config.server_port : %d.', config.server_port);
app.set('port', config.server_port);

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(expressSession({
    secret : 'my key',
    resave: true,
    saveUninitialized: true
}));

var jsonrpc_api_path = config.jsonrpc_api_path || '/api';
handler_loader.init(jayson, app, jsonrpc_api_path);
console.log('Set JSON-RPC path : %s.', jsonrpc_api_path);

var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});
app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler);

process.on('uncaughtException', function(err){
    console.log('Uncaught exception : ' + err);
    console.log('Server process won`t close.');
    console.log(err.stack);
});

process.on('SIGTERM', function(){
    console.log('Process close...');
    app.close();
});

app.on('close', function(){
    console.log('Express server object close...');
    if( database.db){
        database.db.close();
    }
});

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Server start. PORT : ', app.get('port'));
    database.init(app, config);
});