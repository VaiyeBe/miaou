// the aim here is to have a generic component for external identity
// validation using Oauth. Right now it's tied to the only use: Battle.net
// I'll make it more generic when other uses arise.
// https://dev.battle.net/docs/read/oauth
'use strict';
var	miaou,
	request = require('request');

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
	if (req.query.state!==req.session.oauthState) {
		console.log(req.query.state,'!==',req.session.oauthState);
		return res.status(404).send("Invalid State in OAuth provider answer");
	}
	var code = req.query.code;
	if (!code) {
		console.log("no code in oauth answer");
		return res.status(404).send("No authorization code in OAuth provider answer");
	}
	var pluginName = req.session.oauthState.split('/')[0];
	var	config = miaou.config.pluginConfig[pluginName].oauth,
		params = Object.assign({}, config.params);
	params.redirect_uri = miaou.config.server+'/oauthcb/'+pluginName;
	params.grant_type = 'authorization_code';
	params.code = req.query.code;
	console.log('url params:');
	console.dir(params);
	var url = config.url;
       	// + '?' + Object.keys(params).map(function(p){
	// 	return p+"="+encodeURIComponent(params[p]);
	// }).join('&');	
	console.log("2nd query:", url);
	request({
		url:url,
		method:'post',
		formData:params,
		auth:{
			user:config.params.client_id,
			pass:config.secret
		}
	}, function(rerr, rres, rbody){
		console.log(arguments);
		res.send("dev in progress...");
	});
}
