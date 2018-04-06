var getGrouplist = function(params, callback){
    console.log('Called JSON-RPC:getGrouplist.');
    console.dir(params);
    
    if( params.length != 1){
        callback({
            code:400,
            message: 'Insufficient parameters'
        }, null);
        return;
    }
    
    var email = params[0];
    
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
        database.UserModel.findByEmail(email, function(err, results){
            if(err){
                callback({
                    code:410,
                    message: 'Can`t find UserModel: ' + email
                }, null);
            }
            
            if( results.length > 0){
                if( results[0]._doc.grouplist == '')
                    callback(null, null);
                else { 
                    var grouplist = results[0]._doc.grouplist.split(';');
                    callback(null, grouplist);
                }
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

module.exports = getGrouplist;