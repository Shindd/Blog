var mongoose = require('mongoose');
var database = {};

database.init = function(app, config){
    console.log('Database initialize...');
    connect(app, config);
}

function connect(app, config){
    console.log('Called connect().');
    
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url,{useMongoClient:true});
    database.db = mongoose.connection;
    
    database.db.on('error', console.error.bind(console, 'Mongoose connection error.'));
    database.db.on('open', function(){
        console.log('Connected with database. : ' + config.db_url);
        initSchema(app, config);
    });
    database.db.on('disconnected', function(){
        console.log('Disconnected with database. Retry after 5sec.');
        setInterval(connect, 5000);
    });
}

function initSchema(app, config){
    var schemaLen = config.db_schemas.length;
    console.log('Schemas : %d', schemaLen);
    
    for( var i = 0; i < schemaLen; i++){
        var curItem = config.db_schemas[i];
        var curSchema = require(curItem.file).createSchema(mongoose);
        console.log('Read %s module, then set the schema.', curItem.file);
        
        var curModel = mongoose.model(curItem.collection, curSchema);
        console.log('Set the model for %s collection.', curItem.collection);
        
        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
        console.log('Add - Schema name[%s], Model name[%s] - on database object.', curItem.schemaName, curItem.modelName);
    }
    
    app.set('database', database);
    console.log('Add the database object on app object.');
}

module.exports = database;