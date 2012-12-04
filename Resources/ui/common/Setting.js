var Util = require('etc/Util');
function Setting() {
	var self = Ti.UI.createWindow({
		title: 'Setting',
		backgroundColor: 'transparent',
		backgroundImage: '/images/handheld/setting_bg.png'
	});
	self.barImage = '/images/handheld/top.png';
	var osname = Ti.Platform.osname;
	var version = Ti.Platform.version;
	var height = Ti.Platform.displayCaps.platformHeight;
	var width = Ti.Platform.displayCaps.platformWidth;
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	var type;
	if (isTablet) {
		type = 1;
	} else {
		type = 0;
	}
	var webview = Titanium.UI.createWebView({
		url: Util.SERVER + '/facebook?type=' + type,
		width: '100%',
		height: 120 * Util.RATIO,
		bottom: 0,
		textAlign:'center', 
		backgroundColor: 'transparent',
		// backgroundImage: '/images/handheld/background.png'
	});
	var tbl_data = [];
	
	var support = Ti.UI.createTableViewRow({
		height: 40 * Util.RATIO,
		id: 'Support',
		hasChild: true,
		title: 'Yêu Cầu Truyện',
		color: '#fff',
		font: { fontWeight: 'bold', fontSize: 16 * Util.RATIO, fontFamily: 'Chalkboard SE' },
	});
	var aboutUs = Ti.UI.createTableViewRow({
		height: 40 * Util.RATIO,
		id: 'AboutUs',
		hasChild: true,
		title: 'Giới Thiệu',
		color: '#fff',
		font: { fontWeight: 'bold', fontSize: 16 * Util.RATIO, fontFamily: 'Chalkboard SE' },
	});
	var account = Ti.UI.createTableViewRow({
		height: 40 * Util.RATIO,
		id: 'Account',
		hasChild: true,
		title: 'Tài Khoản',
		color: '#fff',
		font: { fontWeight: 'bold', fontSize: 16 * Util.RATIO, fontFamily: 'Chalkboard SE' },
	});
	tbl_data.push(account);
	tbl_data.push(support);
	tbl_data.push(aboutUs);
	var table = Titanium.UI.createTableView({
    data: tbl_data,
    height: '50%',
    scrollable: false,
    backgroundColor: 'transparent',
    top: 0
	});
	table.addEventListener('click', function(e) {
		var Window = require('ui/common/' + e.rowData.id);
		new Window(self);
	});
	self.add(table);
	self.add(webview);
	return self;
};

module.exports = Setting;
