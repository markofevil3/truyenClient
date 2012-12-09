var Util = require('etc/Util');
function Account(tab) {
	var self = Ti.UI.createWindow({
		title: 'Tài Khoản',
		backgroundColor: '#fff'
	});
	self.leftNavButton = Util.backButton(self);
	self.barImage = '/images/handheld/top.png';
	var facebookButton = Titanium.Facebook.createLoginButton({
		style: Ti.Facebook.BUTTON_STYLE_NORMAL,
		width: 200  * Util.RATIO,
		height: 50 * Util.RATIO
	});
	var view = Ti.UI.createView({
		width: '100%',
		height: '100%',
		backgroundColor: '#eabf8b',
		backgroundImage: '/images/handheld/setting_bg.png',
	});
	view.add(facebookButton);
	self.add(view);
	tab.containingTab.open(self);
};

module.exports = Account;
