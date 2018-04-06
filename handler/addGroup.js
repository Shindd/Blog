var fs = require('fs');

var addGroup = function(params, callback){
    console.log('Called JSON-RPC:makeGroup.');
    console.dir(params);
    
    if( params.length != 2){
        callback({
            code:400,
            message: 'Insufficient parameters'
        }, null);
        return;
    }
    
    var groupname=params[0];
    var leader=params[1];
    
    var database = global.database;
    
    if( database){
        console.log('Load database object...');
    }
    else {
        console.log('Can`t load database object...');
        callback({
            code:410,
            message: 'Can`t load database object...'
        }, null);
        
        return;
    }
    
    if( database.db){
        console.log('Connected with database.');
        var group = new database.GroupModel({
            'groupname':groupname,
            'leader':leader
        });
        console.log('Create new GroupModel object.');
        group.save(function(err){
            if(err){
                console.log('Error occur in save group info.');
                callback(err,null);
            } 
            else{
                console.log('Add Group data.');
                fs.mkdir('uploads/'+groupname);
                callback(null, {'groupname':groupname});
            }
        });
    }
    else {
        callback({
            code:410,
            message: 'Can`t connect with database'
        }, null);
    }
};

module.exports = addGroup;