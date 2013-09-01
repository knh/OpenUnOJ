var tools = require('./routetools.js');
var admin = require('./admin.js');
var problem = require('./problem.js');
var ranking = require('./ranking.js');
var usertools = null;

exports.load = function(u, c){
  usertools = u;
  problem.init(tools);
  ranking.init(tools);
  admin.init(c, tools);
};

exports.index = function(req, res){
  res.render('index', tools.nav(req));
};

exports.noexist = function(req, res){
  res.render('404', tools.nav(req));
};

exports.login = function(req, res){
  if(req.method === "GET"){
    res.render('login', tools.nav(req));
  }else{
    //handle login information and give cookies etc.
    var user = req.body.username;
    var pass = req.body.password;
    /* TODO: Change this into a working login **/
    if(!usertools) throw "Error, not loaded";
    var uid = usertools.auth(user, pass);
    if(uid >= 0){
      req.session.uid = uid;
      res.redirect(req.body.referer ? req.body.referer : "/");
    }else{
      res.writeHead(200, {"Content-Type":"text/plain"});
      res.end(user + ":" + pass);
    }
  }
};

exports.logout = function(req, res){
  if(usertools.nonce(req.session, "logout") + "" === req.query.nonce){
    /** Allow logout **/
    usertools.destroy(req.session);
    usertools.nonce(req.session, "logout", true);
    res.redirect("/");
  }else{
    var n = tools.nav(req);
    n.edesc = "Nonce expired or not provided";
    res.render('403', n);
  }
}

exports.admin = admin;
exports.problem = problem;
exports.ranking = ranking;
