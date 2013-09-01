var tools = null;

exports.init = function(toolkit){
	tools = toolkit;
}

exports.ranking = function (req, res){
	res.render('ranking', tools.nav(req));
};

