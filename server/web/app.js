
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , config = require('./config.js')
  , users = require('./core/user.js');

var app = express();

app.configure(function(){
  app.disable('x-powered-by');
  app.set('port', process.env.PORT || config.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser());
  app.use(express.session({secret: config.sessionSecret}));
  app.use(express.favicon());
  if(config.dev){
    app.use(express.logger('dev'));
  }
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

/** Set up config references for routes **/
routes.load(users, config);

/** Define routes **/
app.get('/', routes.index);
/** Individual Problem **/
app.get('/problem/:id/discussion', routes.problem.discussion);
app.get('/problem/submit', routes.problem.submission);
app.get('/problem/submit/:id', routes.problem.submission);
app.post('/problem/submit/:id', routes.problem.submission);
app.post('/problem/submit', routes.problem.submission);
app.get('/problem/:id', routes.problem.problem);
app.get('/problems', routes.problem.problemlist);

app.get('/ranking', routes.ranking.ranking);
app.get('/login', routes.login);
app.post('/login', routes.login);
app.get('/logout', routes.logout);

/** Admin **/
app.get('/admin', routes.admin.home);
app.get('/admin/status', routes.admin.status);
app.get('/admin/users/:uid', routes.admin.users);
app.get('/admin/users', routes.admin.users);
app.get('/admin/api/statusfwd', routes.admin.dofwd('/status'));
app.get('/admin/api/serverfwd', routes.admin.dofwd('/server'));
app.get('/admin/*', routes.admin.noexist);
app.get('*', routes.noexist);

/** Create Server **/
http.createServer(app).listen(app.get('port'), function(){
  if(config.dev){
    console.log("[Log] Express server listening on port " + app.get('port'));
  }
}).on('error', function(){
	console.log("[Err] Express server init failed. Port in use?");
});;

