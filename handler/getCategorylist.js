var getCategorylist = function(params, callback){
    console.log('Called JSON-RPC:makeGroup.');
    console.dir(params);
    
    if( params.length != 1){
        callback({
            code:400,
            message: 'Insufficient parameters'
        }, null);
        return;
    }
    
    var groupname = params[0];
    
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
        database.GroupModel.findByGroupname(groupname, function(err, results){
            if(err){
                callback({
                    code:410,
                    message: 'Can`t find UserModel: ' + email
                }, null);
            }
            
            if( results.length > 0){
                if( results[0]._doc.category == '')
                    callback(null, null);
                else { 
                    var shortName_list = results[0]._doc.category.split(';');
                    var categoryList = []; 
                    for(var i = 0; i < shortName_list.length; i++){
                        database.CategoryModel.findByShortname(shortName_list[i], function(err, result){
                            if(err){
                                callback({
                                    code:410,
                                    message:'Can`t find CategoryModel: ' + shortName_list[i]
                                }, null);
                            }
                            categoryList.push({category:result[0].category_name, group:groupname});
                            if(categoryList.length == shortName_list.length){
                                callback(null,categoryList);
                            }
                        });
                    }
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

module.exports = getCategorylist;