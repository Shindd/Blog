var Schema = {};

Schema.createSchema = function(mongoose){
    var CategorySchema = mongoose.Schema({
        category_name : {type:String, required:true}
        ,parent_group : {type:String, required:true}
        ,short_name : {type:String, required:true}
        ,articles : {type:String, 'default':''}
        ,created_at:{type:Date, index:{unique:false}, 'default':Date.now}
        ,updated_at:{type:Date, index:{unique:false}, 'default':Date.now}
    });
    
    CategorySchema.pre('save', function(next) {
		if(!this.isNew) return next();
        next();
	});
    
    CategorySchema.static('findByShortname', function(name, callback){
        return this.find({short_name:name}, callback);  
    });
    
    CategorySchema.static('findByGroup_Catename', function(group, categoryName, callback){
        return this.find({parent_group:group, category_name:categoryName}, callback); 
    });
    
	return CategorySchema;
};

module.exports = Schema;