var Util = require('etc/Util');
function AboutUs(tab) {
	var self = Ti.UI.createWindow({
		title: 'Giới Thiệu',
		backgroundColor: '#fff',
	});
	self.leftNavButton = Util.backButton(self);
	self.barImage = '/images/handheld/top.png';
	var labelName = Ti.UI.createLabel({
		text: 'S Truyện',
		color: '#fff',
		font: { fontSize: 20 * Util.RATIO, fontWeight: 'bold', fontFamily: 'Chalkboard SE'  },
		textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
		top: '30%',
	});
	var labelVersion = Ti.UI.createLabel({
		text: 'Version 1.0',
		font: { fontSize: 15 * Util.RATIO, fontStyle: 'italic' },
		textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
	});
	var labelEmail= Ti.UI.createLabel({
		text: 'Support: struyen@gmail.com',
		font: { fontSize: 17 * Util.RATIO, fontStyle: 'bold' },
		textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
		color: '#008AE6'
	});
	var view = Ti.UI.createView({
		width: '100%',
		height: '100%',
		backgroundColor: '#eabf8b',
		backgroundImage: '/images/handheld/setting_bg.png',
		layout: 'vertical'
	})
	view.add(labelName);
	view.add(labelVersion);
	view.add(labelEmail);
	self.add(view);
	tab.containingTab.open(self);
};

module.exports = AboutUs;
