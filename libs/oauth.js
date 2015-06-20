// 
'use strict';
var miaou;

exports.configure = function(_miaou){
	miaou = _miaou;
	return this;
}
exports.appGetCheckOauth = function(req, res){
	console.log("appGetCheckOauth", req.params.pluginName);
	for (var i=0; i<miaou.plugins.length; i++) {
		var plugin = miaou.plugins[i];
		if (plugin.name===req.params.pluginName) {
			console.log('plugin found');
			try {
				var	config = miaou.config.pluginConfig[plugin.name].oauth,
					params = Object.assign({}, config.params);
				console.log('oauth plugin config:');
				console.dir(config);
				req.session.oauthState = plugin.name+'/'+(Math.random()*Math.pow(36,5)|0).toString(36);
				params.state = req.session.oauthState;
				params.redirect_uri = miaou.config.server+'/oauthcb/'+plugin.name;
				console.log('url params:');
				console.dir(params);
				var url = config.url + '?' + Object.keys(params).map(function(p){
					return p+"="+encodeURIComponent(params[p]);
				}).join('&');	
				res.redirect(url);
			} catch (e) {
				console.log(e); // not a valid URL, probably
				res.status(404).send("plugin doesn't seem to be configured for an oauth");
			}
			return;
		}
	}
	res.status(404).send("plugin not found");
}
exports.appGetOauthCb = function(req, res){
	console.log("appGetOauthCb", req.params.pluginName);
	console.log("body:");
	console.dir(req.body);
	console.log("query:");
	console.dir(req.query);
	res.send("dev in progress...");

	// THIS DOESN'T WORK FOR BATTLE.NET IF MIAOU ISN'T IN HTTPS
	// https://dev.battle.net/docs/read/oauth
}
