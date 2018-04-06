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
var multer = require('multer');
var fs = require('fs');
var cors = require('cors');
var post = require('./post');

app = express();

// set view engine
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');
console.log('Set view engine EJS');

// set port
console.log('config.server_port : %d.', config.server_port);
app.set('port', config.server_port);

// parsing
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

app.use(cookieParser());
app.use(expressSession({
    secret : 'my key',
    resave: true,   
    saveUninitialized: true
}));
app.use(cors());

// upload
 var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './uploads');
    },
    filename: function(req, file, callback){
        callback(null, req.body.group + '/' + file.originalname);
    }
});

var upload = multer({
    storage : storage,
    limits: {
        files:7,
        fileSize:1024*1024*20 // 20MB
    }
});

var jsonrpc_api_path = config.jsonrpc_api_path || '/api';
handler_loader.init(jayson, app, jsonrpc_api_path);
console.log('Set JSON-RPC path : %s.', jsonrpc_api_path);

var router = express.Router();

router.route('/page').post(function(req, res){
    console.log('Called router: /page');
    var paramEmail = req.body.email || req.query.email;
    var paramGroup = req.body.group || req.query.group;
    
    console.log('req: ', paramEmail, paramGroup);
    
    res.render('page.ejs', {email: paramEmail, group: paramGroup});
});

router.route('/uploadFile').post(upload.array('files', 1), function(req, res){
    console.log('Called router: /uploadFile.');
    try {
        var files = req.files;
        var filepath = [];
        var originalname = '',
            filename = '',
            mimetype = '',
            size = 0;
        
        if(Array.isArray(files)){
            console.log('File numbers: ', files.length);
            for( var index = 0; index < files.length; index++){
                originalname = files[index].originalname;
                filename = files[index].filename;
                mimetype = files[index].mime;
                size = files[index].size;
                filepath.push(filename);
            }
        }
        else {
            console.log('File numbers: 1');
            originalname = files[0].originalname;
            filename = files[0].filename;
            mimetype = files[0].mime;
            size = files[0].size;
            filepath.push(filename);
        }
        
        var params = {
            "title":req.body.title || req.query.title,
            "writer" : req.body.writer || req.query.writer,
            "postNumber":req.body.postNumber || req.query.postNumber,
            "description":req.body.description || req.query.description,
            "filepath":filepath
        };
        
        post.writePost(params, function(err, result){
            if(err){
                console.log("Fail to upload files.");
            }
            else {
                console.log("Success to upload files.", result);
                var category = req.body.category || req.query.category;
                var group = req.body.group || req.query.group;
                var number = result.number;
                database.CategoryModel.findByGroup_Catename(group, category, function(err, results){
                    if( err){
                        console.log('Cannot find category on group[%s].', group)
                    }
                    else {
                        if(results[0]._doc.articles == '')
                            var new_articles = number;
                        else
                            var new_articles = results[0]._doc.articles + ';' + number;
                        console.log('New articles string: ' + new_articles);
                        database.CategoryModel.updateOne({parent_group:group, category_name:category}, {$set: {articles:new_articles}}, function onUpdate(err){
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log('Add article[%s], on category[%s]', new_articles, category);
                                res.render('page.ejs', {email: params.writer, group: group});
                            }
                        });
                    }
                });
            }
        });
    }
    catch(err) {
        console.log(err.stack);
    }
});
app.use('/',router);

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