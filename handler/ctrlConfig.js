var ctrlConfig = {};

ctrlConfig.addGroup = function(callback){
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
        database.ConfigModel.getConfig(function(err,results){
            if(err){
                console.log('Cannot update config.');
                callback(err,null);
            }
            else {
                var groupsNumber = results[0]._doc.numberOfGroups + 1;
                database.ConfigModel.updateOne({},{$set:{numberOfGroups:groupsNumber}}, function onUpdate(err){
                    if(err){
                        console.log(err);
                        callback(err,null);
                    }
                    else {
                        console.log('Groups number updated: ', groupsNumber);
                        callback(null, {numberOfGroups:groupsNumber});
                    }
                });
            }
        });
    }
    else {
        callback({
            code:410,
            message: 'Can`t connect with database'
        }, null);
    }
}

ctrlConfig.addPost = function(callback){
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
        database.ConfigModel.getConfig(function(err,results){
            if(err){
                console.log('Cannot update config.');
                callback(err,null);
            }
            else {
                var postsNumber = results[0]._doc.numberOfPosts + 1;
                database.ConfigModel.updateOne({},{$set:{numberOfPosts:postsNumber}}, function onUpdate(err){
                    if(err){
                        console.log(err);
                        callback(err,null);
                    }
                    else {
                        console.log('Posts number updated: ', postsNumber);
                        callback(null, {numberOfPosts:postsNumber});
                    }
                })
                ;
            }
        });
    }
    else {
        callback({
            code:410,
            message: 'Can`t connect with database'
        }, null);
    }
}

ctrlConfig.addUser = function(callback){
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
        database.ConfigModel.getConfig(function(err,results){
            if(err){
                console.log('Cannot update config.');
                callback(err,null);
            }
            else {
                var usersNumber = results[0]._doc.numberOfUsers + 1;
                database.ConfigModel.updateOne({},{$set:{numberOfUsers:usersNumber}}, function onUpdate(err){
                    if(err){
                        console.log(err);
                        callback(err,null);
                    }
                    else {
                        console.log('Users number updated: ', usersNumber);
                        callback(null, {numberOfUsers:usersNumber});
                    }
                });
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

ctrlConfig.getNumberOfUsers = function(callback){
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
        database.ConfigModel.getConfig(function(err,results){
            if(err){
                console.log('Cannot update config.');
                callback(err,null);
            }
            else {
                console.log('Return value: ', results[0]._doc.numberOfUsers);
                return results[0]._doc.numberOfUsers;
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

ctrlConfig.getNumberOfGroups = function(callback){
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
        database.ConfigModel.getConfig(function(err,results){
            if(err){
                console.log('Cannot get config info.');
                callback(err,null);
            }
            else {
                console.log('Return value: ', results[0]._doc.numberOfGroups);
                return results[0]._doc.numberOfGroups;
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

ctrlConfig.getNumberOfPosts = function(callback){
    console.log('Get post numbers...');
    var database = global.database;
    
    if( database){
        console.log('Load database object...');
    }
    else {
        callback({
            code:410,
            message: 'Can`t load database object...'
        }, null);
    }
    
    if( database.db){
        console.log('Connected with database.');
        database.ConfigModel.getConfig(function(err,results){
            if(err){
                console.log('Cannot get config info.');
                callback(err,null);
            }
            else {
                console.log('Return value: ', results[0]._doc.numberOfPosts);
                callback(null, results[0]._doc.numberOfPosts);
            }
        });
    }
    else {
        return null;
    }
};

module.exports = ctrlConfig;