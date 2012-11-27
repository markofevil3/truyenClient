function Account(tab) {
	var self = Ti.UI.createWindow({
		title: 'Tài Khoản',
		backgroundColor: '#fff'
	});
	var facebookButton = Titanium.Facebook.createLoginButton({
		style: Ti.Facebook.BUTTON_STYLE_NORMAL,
	});
	var view = Ti.UI.createView({
		width: '100%',
		height: 'auto',
	});
	view.add(facebookButton);
	self.add(view);
	tab.containingTab.open(self);
};

module.exports = Account;
