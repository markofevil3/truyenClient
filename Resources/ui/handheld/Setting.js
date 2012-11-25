function Setting() {
	var self = Ti.UI.createWindow({
		title: 'Setting',
		backgroundColor: '#fff'
	});
	self.barImage = '/images/handheld/corkboard.jpg';
	var facebookButton = Titanium.Facebook.createLoginButton({
		style: Ti.Facebook.BUTTON_STYLE_NORMAL,
	})
	// self.add(facebookButton);
	var webview = Titanium.UI.createWebView({
		url: myGlobal.SERVER + '/facebook',
		width: '100%',
		height: 120,
		bottom: 0
	});
	var tbl_data = [];
	
	var askForBook = Ti.UI.createTableViewRow({
		height: 40,
		id: 0,
		hasChild: true,
		title: 'Helps/Ask For Book!'
	});
	tbl_data.push(askForBook);
	var table = Titanium.UI.createTableView({
    data: tbl_data,
    height: 'auto',
    scrollable: false
    // backgroundImage: '/images/handheld/bookShelf.png',
	});
	self.add(table);
	self.add(webview);
	return self;
};

module.exports = Setting;
