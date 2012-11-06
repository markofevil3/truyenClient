function StoryReading(item) {
	var self = Ti.UI.createWindow({
		title: item.title,
	});
	var webview = Ti.UI.createWebView({
		height: '100%',
		width: '100%',
		url: myGlobal.SERVER + '/images/story/sample/test.pdf',
	});
	var buttonClose = Titanium.UI.createButton({
		title: 'close',
		width: 60,
		height: 25,
		right: 10,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#ffffff',
		backgroundColor: '#222',
		backgroundImage: 'NONE',
		selectedColor: '#333',
		color: '#CCCCCC'
	});
	buttonClose.addEventListener('click', function() {
		var smallDown = Titanium.UI.create2DMatrix();
		smallDown = smallDown.scale(0);
		self.close({ transform: smallDown, duration:300 });
	});
	self.add(buttonClose);
	self.add(webview);
	self.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP });
};

module.exports = StoryReading;
