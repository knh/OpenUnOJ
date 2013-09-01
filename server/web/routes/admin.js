var conf = null;
var tools = null;

function isAdmin(req){
  /** TODO: check for admin privs **/
  return true;
}

function nav(req){
  var nav = {
    "navigate":"home",
    "sidebar":"home"
  };
  var page = req.url.split('/');
  if(page.length < 3 || page[1] !== "admin")
    nav.navigate = "home";
  else if(page[1] === "admin" && page[2] === "")
    nav.navigate = "home";
  else
    nav.navigate = page[2].split("?").shift();
  if(req.query != null && req.query.page != null){
    nav.sidebar = req.query.page;
  }else{
    nav.sidebar = "home";
  }
  return nav;
}

exports.init = function(config, tool){
  conf = config;
  tools = tool;
}

exports.home = function(req, res){
  if(isAdmin(req)){
    res.render('admin/index', nav(req));
  }else{
    res.render('admin/403', nav(req));
  }
}

exports.status = function(req, res){
  if(isAdmin(req)){
    res.render('admin/status', nav(req));
  }else{
    res.render('admin/403', nav(req));
  }
}

exports.users = function(req, res){
  if(isAdmin(req)){
    res.render('admin/users', nav(req));
  }else{
    res.render('admin/403', nav(req));
  }
}

exports.noexist = function(req, res){
  if(isAdmin(req)){
    res.render('admin/404', nav(req));
  }else{
    res.render('admin/403', nav(req));
  }
}

exports.dofwd = function(forward){
  var addr = forward;
  return function(req, res){
    /** Forward the system status to the web user **/
    if(conf !== null && conf.judgment !== null && isAdmin(req)){
      var http = require('http');
      var connectionRefused = function(){
        res.writeHead(200, {"Content-Type":"application/json"});
        res.end(JSON.stringify({
          "status":503,
          "msg":"Service Unavailable. Status server down or not configured properly."
        }));
      };
      
      var options = { 
        "host": conf.judgment.server,
        "port": conf.judgment.port,
        "path": addr,
        "method": "GET"
      };
      try{
        var request = http.request(options, function(res2){
          res.writeHead(res2.statusCode, {"Content-Type" : "application/json"});
          res2.setEncoding('utf8');
          res2.on('data', function(chunk){
            res.write(chunk);
          });
          res2.on('end', function(){
            try{
              res.end();
            }catch(e){}
          });
        });
        request.on('error', function(e){
          connectionRefused();
        });
        request.end();
      }catch(e){
        /** Connection Failed **/
        connectionRefused();
      }
    }else{
      res.writeHead(403, {"Content-Type" : "application/json"});
      res.end(JSON.stringify({
        "status":403,
        "msg":"Permission Denied"
      }));
    };
  }
}
