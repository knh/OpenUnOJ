var tools = null;

exports.init = function(toolkit){
	tools = toolkit;
}

exports.discussion = function (req, res){
	res.render('problem/discussion', tools.preload(req));
};


exports.problem = function (req, res){
	res.render('problem/problem', tools.preload(req, {
		"problem":{
			"id":req.params.id,
			"time":1000,
			"memory":10000,
			"language":["*"],
			"status":{
				"accepted":1,
				"submit":2
			}
		}
	}));
};

exports.submission = function (req, res){
	if(req.method === "GET"){
		res.render('problem/submission', tools.preload(req, {
			"problem":{
				"id":req.params.id,
				"languages":[{
					"name":"C++",
					"value":"cpp"
				},{
					"name":"C",
					"value":"c"
				},{
					"name":"PHP",
					"value":"php"
				},{
					"name":"Java",
					"value":"java"
				},{
					"name":"LittleLisp",
					"value":"littlelisp"
				}
				],
			}
		}));
	}else{
		res.render('404', tools.nav(req));
	}
};

exports.problemlist = function (req, res){
	res.render('problem/problemlist', tools.nav(req));
};

exports.problemredirect = function (req, res){
	res.render('problem', tools.nav(req));
};
