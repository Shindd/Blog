var Schema = {};

Schema.createSchema = function(mongoose){
    var ConfigSchema = mongoose.Schema({
        numberOfUsers : {type:Number, 'default':'', required:true, unique:true}
        ,numberOfGroups : {type:Number, 'default':''}
        ,numberOfPosts : {type:Number, 'default':''}
    });
    
    ConfigSchema.static('getConfig', function(callback){
        return this.find({}, callback);
    });
    
	return ConfigSchema;
};

module.exports = Schema;