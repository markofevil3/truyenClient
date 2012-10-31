function Setting() {
	var self = Ti.UI.createWindow({
		title: 'Setting',
	});
	self.barImage = '/images/corkboard.jpg';
	var facebookButton = Titanium.Facebook.createLoginButton({
		style: Ti.Facebook.BUTTON_STYLE_NORMAL,
	})
	self.add(facebookButton);
	return self;
};

module.exports = Setting;
