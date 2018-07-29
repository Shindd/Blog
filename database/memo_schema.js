var Schema = {};

Schema.createSchema = function(mongoose) {
	// Set schema entity
	var MemoSchema = mongoose.Schema({
		title: {type: String, required:true}
        , writer: {type:String, required:true}
        , postNumber: {type:Number, 'default':0}
	    , description: {type: String, 'default':''}
	    , filepath:{type:Array, 'default':[] }
        , created_at: {type: Date, index: {unique: false}, 'default': Date.now}
	    , updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
    });  
    
    MemoSchema.static('findByPostNumber', function(_number, callback){
        return this.find({postNumber:_number}, callback);
    });
    
    return MemoSchema;
};

module.exports = Schema;