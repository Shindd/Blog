var authUser = function(params, callback){
    console.log('Called JSON-RPC:login.');
    console.log(params);
    
    if( params.length != 2){
        callback({
            code:400,
            message: 'Insufficient parameters'
        }, null);
        return;
    }
    
    var email = params[0];
    var pwd = params[1];
    
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
        database.UserModel.findByEmail(email, function(err, results){
            if( results.length > 0){
                console.log('Find user matched with %s.', email);
                var user = new database.UserModel({email:email});
                var authenticated = user.authenticate(pwd, results[0]._doc.salt, results[0]._doc.hashed_password);
                
                if( authenticated){
                    console.log('Password match!');
                    callback(null, true);
                }
                else {
                    console.log('Password unmatch!');
                    callback(false, null);
                }
            }
        });
    }
};

module.exports = authUser;