exports.isLoggedIn = function(req){
  //Check to see if the user is logged on
  if(!req.session)
    return false;
  if(req.session.uid == null || req.session.uid < 0)
    return false;//Logged out
  return true;
}

exports.nav = function(req){
  var nav = {
    navigate:"home",
    url:req.url,
    loggedIn:exports.isLoggedIn(req),
  }
  if(nav.loggedIn){
    nav.nickname = usertools.getName();
    nav.nonce = usertools.nonce(req.session, "logout");
  }
  var page = req.url.split('/');
  if(page.length < 2 || page[1] === "")
     return nav;
  nav.navigate = page[1].split('?').shift();
  nav.category = req.query.cat;
  return nav;
}

exports.preload = function(req, hdr){
	var h = exports.nav(req);
	if(hdr == null) return h;
	for(var x in hdr){
		h[x] = hdr[x];
	}
	return h;
}
