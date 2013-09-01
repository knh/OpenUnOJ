var user = {
  uid: 0,
  login: "testing",
  nickname: "测试用户"
};

exports.auth = function(user, pass){
	if(user == "testing" && pass == "testing")
		return 1;
	return -1;
};

exports.destroy = function(session){
	session.uid = -1;
};

exports.getName = function(){
	return user.nickname;
};

exports.nonce = function(session, nonceId, generate){
	if(session["nonce"] == null)
		session["nonce"] = {};
	if(session["nonce"][nonceId] == null || generate)
		session["nonce"][nonceId] = Math.round(Math.random() * 65536) % 65536;
	return session["nonce"][nonceId];
};
