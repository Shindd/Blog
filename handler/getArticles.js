var getArticles = function(params, callback){
    console.log('Called JSON-RPC:getArticles.');
    console.dir(params);
    
    if( params.length != 2){
        callback({
            code:400,
            message: 'Insufficient parameters'
        }, null);
        return;
    }
    
    var category = params[0];
    var group = params[1]
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
        database.CategoryModel.findByGroup_Catename(group, category, function(err, results){
            if(err){
                callback({
                    code:410,
                    message: 'Can`t find UserModel: ' + email
                }, null);
            }
            
            if( results.length > 0){
                if( results[0]._doc.articles == '')
                    callback(null, null);
                else { 
                    var article_numbers = results[0]._doc.articles.split(';');
                    var articles = [];
                    console.log(article_numbers.length);
                    for(var i = 0; i < article_numbers.length; i++){
                        database.PostModel.findByNumber(article_numbers[i], function(err, result){
                            var data = {
                                'title':result[0]._doc.title,
                                'number':result[0]._doc.number,
                                'writer':result[0]._doc.writer,
                                'postNumber':result[0]._doc.postNumber,
                                'description':result[0]._doc.description,
                                'filepath':result[0].filepath,
                                'date':result[0].created_at
                            };
                            articles.push(data);
                            if( articles.length == article_numbers.length){
                                callback(null, articles);
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

module.exports = getArticles;