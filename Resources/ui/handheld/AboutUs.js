function AboutUs(tab) {
	var self = Ti.UI.createWindow({
		title: 'Giới Thiệu',
		backgroundColor: '#fff'
	});
	var labelName = Ti.UI.createLabel({
		text: 'S Truyện',
		font: { fontSize: 18, fontWeight: 'bold' },
		textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
		top: 0
	});
	var labelVersion = Ti.UI.createLabel({
		text: 'Version 1.0',
		font: { fontSize: 15, fontStyle: 'italic' },
		textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
		top: 22,
	});
	var labelEmail= Ti.UI.createLabel({
		text: 'Support: struyen@gmail.com',
		font: { fontSize: 17, fontStyle: 'bold' },
		textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
		top: 45,
		color: '#008AE6'
	});
	var view = Ti.UI.createView({
		width: '100%',
		height: 100,
	})
	view.add(labelName);
	view.add(labelVersion);
	view.add(labelEmail);
	self.add(view);
	tab.containingTab.open(self);
};

module.exports = AboutUs;
