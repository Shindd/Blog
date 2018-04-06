var Schema = {};

Schema.createSchema = function(mongoose) {
	// 스키마 정의
	var PostSchema = mongoose.Schema({
		title: {type: String, required:true}
        , number: {type: Number, required:true}
        , writer: {type:String, required:true}
        , postNumber: {type:Number, 'default':0}
	    , description: {type: String, 'default':''}
	    , filepath:{type:Array, 'default':[] }
        , created_at: {type: Date, index: {unique: false}, 'default': Date.now}
	    , updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
    });  
    
    PostSchema.static('findByNumber', function(number, callback){
        return this.find({number:number}, callback);
    });
    
    return PostSchema;
};

// module.exports에 UserSchema 객체 직접 할당
module.exports = Schema;