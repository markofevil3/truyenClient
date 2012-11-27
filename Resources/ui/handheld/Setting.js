function Setting() {
	var self = Ti.UI.createWindow({
		title: 'Setting',
		backgroundColor: '#fff'
	});
	self.barImage = '/images/handheld/corkboard.jpg';
	var webview = Titanium.UI.createWebView({
		url: myGlobal.SERVER + '/facebook',
		width: '100%',
		height: 120,
		bottom: 0
	});
	var tbl_data = [];
	
	var support = Ti.UI.createTableViewRow({
		height: 40,
		id: 'Support',
		hasChild: true,
		title: 'Yêu Cầu Truyện',
		font: { fontWeight: 'bold', fontSize: 14 },
	});
	var aboutUs = Ti.UI.createTableViewRow({
		height: 40,
		id: 'AboutUs',
		hasChild: true,
		title: 'Giới Thiệu',
		font: { fontWeight: 'bold', fontSize: 14 },
	});
	var account = Ti.UI.createTableViewRow({
		height: 40,
		id: 'Account',
		hasChild: true,
		title: 'Tài Khoản',
		font: { fontWeight: 'bold', fontSize: 14 },
	});
	tbl_data.push(account);
	tbl_data.push(support);
	tbl_data.push(aboutUs);
	var table = Titanium.UI.createTableView({
    data: tbl_data,
    height: 'auto',
    scrollable: false,
    // backgroundImage: '/images/handheld/bookShelf.png',
	});
	table.addEventListener('click', function(e) {
		var Window = require('ui/handheld/' + e.rowData.id);
		new Window(self);
	});
	self.add(table);
	self.add(webview);
	return self;
};

module.exports = Setting;
