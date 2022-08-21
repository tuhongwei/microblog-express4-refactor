var mongoClient = require('./mongoClient');
function User(user){
	this.name = user.name;
	this.password = user.password;
}
module.exports = User;

User.prototype.save = function(callback){
	var user = {
		name: this.name,
		password: this.password
	};
	mongoClient.connect(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('users',function(err,collection){
			if(err){
				mongoClient.close();
				return callback(err);
			}
			//为name属性添加索引
			collection.ensureIndex('name',{unique: true});
			collection.insert(user,{safe: true},function(err,user){
				mongoClient.close();
				callback(err,user);
			});
		});
	});	
};

User.get = function(username,callback){
	mongoClient.connect(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('users',function(err,collection){
			if(err){
				mongoClient.close();
				return callback(err);
			}
			collection.findOne({name: username},function(err,doc){
				mongoClient.close();
				if(doc){
					var user = new User(doc);
					callback(err,user);
				}else{
					callback(err,null);
				}
			});
		});
	});	
};