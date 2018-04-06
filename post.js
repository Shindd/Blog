var ctrlConfig = require('./handler/ctrlConfig');

var post = {};
post.writePost = function(params, callback){
    console.log('Called writePost.');
    
    var title = params.title;
    var postNumber = params.postNumber;
    var description = params.description;
    var filepath = params.filepath;
    console.log(title, postNumber, description, filepath);
    ctrlConfig.getNumberOfPosts(function(err, data){
        if( err){
            console.log('Can`t bring post number.');
            callback({
                code:410,
                message:'Can`t bring post number.'
            }, null);
        }
        else {
            var number = data;
            console.log('Post number: ', number);
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
                database.UserModel.findByEmail(params.writer, function(err, results){
                   if(err){
                       callback({
                           code:410,
                           message: 'Can`t find writer: ' + params.writer
                       }, null);
                   } 

                    if( results.length > 0){
                        var writer = results[0]._doc.name;
                        var post = new database.PostModel({
                            "title":title,
                            "writer":writer,
                            "postNumber":postNumber,
                            "filepath":filepath,
                            "description":description,
                            "number":number
                        });
                        console.log('Create new PostModel object');
                        post.save(function(err){
                            if(err){
                                console.log('Error occur in save post info.')
                                callback(err, null);
                            }
                            else {
                                ctrlConfig.addPost(function(err,result){
                                    if(err){
                                        callback({
                                           code:410,
                                           message: 'Can`t add Post number.'
                                        },null);
                                    }
                                    else {
                                        console.log("Add post data.");
                                        callback(null, {'number':number});    
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
        }
    });
};

module.exports = post;