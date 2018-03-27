var addUser = function(params, callback){
    console.log('Called JSON-RPC:signup.');
    console.dir(params);
    
    if( params.length != 3){
        callback({
            code:400,
            message: 'Insufficient parameters'
        }, null);
        return;
    }
    
    var email = params[0];
    var pwd = params[1];
    var name = params[2];
    
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
        var user = new database.UserModel({"email":email, "password":pwd, "name":name});
        console.log('Create new UserModel object');
        user.save(function(err){
            if(err){
                console.log('Error occur in save user info.')
                callback(err, null);
            }
            else {
                console.log("Add user data.");
                callback(null, {'email':email});
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

module.exports = addUser;