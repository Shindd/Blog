var crypto = require('crypto');
var Schema = {};

Schema.createSchema = function(mongoose) {
	// Set schema entity
	var UserSchema = mongoose.Schema({
		email: {type: String, 'default':''}
        ,number:{type:Number, 'default':1}
	    , hashed_password: {type: String, required: true, 'default':''}
	    , name: {type: String, index: 'hashed', required:true, 'default':''}
        , memo_list: {type:Array, 'default':{}}
	    , salt: {type:String, required:true}
	    , created_at: {type: Date, index: {unique: false}, 'default': Date.now}
	    , updated_at: {type: Date, index: {unique: false}, 'default': Date.now} 
        , authority: {type:String, default:'normal'}
    });
    
    // Set virtual method with password
	UserSchema
	  .virtual('password')
	  .set(function(password) {
	    this._password = password;
	    this.salt = this.makeSalt();
        this.authority = "normal";
	    this.hashed_password = this.encryptPassword(password);
	    console.log('virtual password : ' + this.hashed_password);
	  })
	  .get(function() { return this._password });

	/* Add method on model instance */
    
    // Method: Encrypt password
    UserSchema.method('encryptPassword', function(plainText, inSalt) {
		if (inSalt) {
			return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
		} else {
			return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
		}
	});
	
	// Method: Make salt value
	UserSchema.method('makeSalt', function() {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	});
	
	// Method: Authenticate( compare with password) - return: true/false
    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
		if (inSalt) {
			console.log('authenticate -> %s : %s', this.encryptPassword(plainText, inSalt), hashed_password);
			return this.encryptPassword(plainText, inSalt) == hashed_password;
		} else {
			console.log('authenticate -> %s : %s', this.encryptPassword(plainText), this.hashed_password);
			return this.encryptPassword(plainText) == this.hashed_password;
		}
	});
	
	// Function: Check the value is valid?
	var validatePresenceOf = function(value) {
		return value && value.length;
	};

	// Function: trigger with save( invalid password -> error)
    UserSchema.pre('save', function(next) {
		if (!this.isNew) return next();
	
		if (!validatePresenceOf(this.password)) {
			next(new Error('Invalid password field.'));
		} else {
			next();
		}
	});
	
    // Check the email value in column
	UserSchema.path('email').validate(function (email) {
		return email.length;
	}, 'No email column value.');
	
	UserSchema.path('hashed_password').validate(function (hashed_password) {
		return hashed_password.length;
	}, 'No hashed_password column value.');
	
    /* Add methods on model object */
	UserSchema.static('findByEmail', function(email, callback) {
		return this.find({email:email}, callback);
	});
    
    console.log('Set UserSchema.');

	return UserSchema;
};

module.exports = Schema;