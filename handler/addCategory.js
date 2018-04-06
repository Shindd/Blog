var addCategory = function(params, callback){
    console.log('Called JSON-RPC:addCategory.');
    console.dir(params);
    
    if( params.length != 3){
        callback({
            code:400,
            message: 'Insufficient parameters'
        }, null);
        return;
    }
    
    var category_name=params[0];
    var short_name=params[1];
    var parent_group=params[2];
    
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
        var category = new database.CategoryModel({
            'category_name':category_name,
            'parent_group':parent_group,
            'short_name':short_name
        });
        
        console.log('Create new CategoryModel object.');
        category.save(function(err){
            if(err){
                console.log('Error occur in save category info.');
                callback(err,null);
            } 
            else{
                console.log('Add Category data.');
                
                database.GroupModel.findByGroupname(parent_group, function(err, results){
                    if( err){
                        console.log('Cannot add category on group[%s].', parent_group)
                        callback(err,null);
                    }
                    else {
                        var new_category = results[0]._doc.category + ';' + short_name;
                        console.log('New category string: ' + new_category);
                        database.GroupModel.updateOne({groupname:parent_group}, {$set: {category:new_category}}, function onUpdate(err){
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log('Add category[%s], on group[%s]', short_name, parent_group);
                                callback(null, {'category_name':params[0]});    
                            }
                        });
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

module.exports = addCategory;