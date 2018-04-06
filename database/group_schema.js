var Schema = {};

Schema.createSchema = function(mongoose){
    var GroupSchema = mongoose.Schema({
        groupname : {type:String, 'default':'', required:true, unique:true}
        ,leader : {type:String, 'default':'', required:true}
        ,category : {type:String, 'default':''}
        ,created_at:{type:Date, index:{unique:false}, 'default':Date.now}
        ,updated_at:{type:Date, index:{unique:false}, 'default':Date.now}
    });
    
    GroupSchema.pre('save', function(next) {
		if(!this.isNew) return next();
        next();
	});
        
    GroupSchema.path('groupname').validate(function(groupname) {
        return groupname.length; 
    }, 'No groupname column value.');
    
    GroupSchema.static('findByGroupname', function(groupname, callback){
        return this.find({groupname:groupname}, callback);
    }); 
    
    GroupSchema.static('updateCategory', function(groupname, new_category, callback){
        return this.update({groupname:groupname}, {$set: {category:new_category}}, callback); 
    });
    
	return GroupSchema;
};

module.exports = Schema;