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
		font: { fontSize: 18 * Util.RATIO, fontWeight: 'bold' },
		textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
		top: 0,
		color: 'blue'
	});
	var labelVersion = Ti.UI.createLabel({
		text: 'Version 1.0',
		font: { fontSize: 15 * Util.RATIO, fontStyle: 'italic' },
		textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
		top: 22 * Util.RATIO,
	});
	var labelEmail= Ti.UI.createLabel({
		text: 'Support: struyen@gmail.com',
		font: { fontSize: 17 * Util.RATIO, fontStyle: 'bold' },
		textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
		top: 45 * Util.RATIO,
		color: '#008AE6'
	});
	var view = Ti.UI.createView({
		width: '100%',
		height: 100 * Util.RATIO,
	})
	view.add(labelName);
	view.add(labelVersion);
	view.add(labelEmail);
	self.add(view);
	tab.containingTab.open(self);
};

module.exports = AboutUs;
