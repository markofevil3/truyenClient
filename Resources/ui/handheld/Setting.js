function Setting() {
	var self = Ti.UI.createWindow({
		title: 'Setting',
	});
	self.barImage = '/images/handheld/corkboard.jpg';
	var facebookButton = Titanium.Facebook.createLoginButton({
		style: Ti.Facebook.BUTTON_STYLE_NORMAL,
	})
	// self.add(facebookButton);
	var webview = Titanium.UI.createWebView({
		url: myGlobal.SERVER + '/facebook',
		width: '100%',
		height: 200
	});
	self.add(webview);
	return self;
};

module.exports = Setting;
