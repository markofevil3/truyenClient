var Util = require('etc/Util');
function StoryReading(item) {
	var self = Ti.UI.createWindow({
		title: item.title,
		backgroundColor: '#f3f3f3'
	});
	var labelContent;
	function changeTextSize(size) {
		labelContent.font = { fontSize: size };
	};
	var buttonClose = Titanium.UI.createButton({
		title: 'close',
		width: 60 * Util.RATIO,
		height: 30 * Util.RATIO,
		right: 5 * Util.RATIO,
		borderRadius: 5 * Util.RATIO,
		borderWidth: 1 * Util.RATIO,
		borderColor: '#ffffff',
		backgroundColor: '#222',
		backgroundImage: 'NONE',
		font: { fontWeight: 'bold', fontSize: 14 * Util.RATIO },
		selectedColor: '#333',
		color: '#CCCCCC'
	});
	buttonClose.addEventListener('click', function() {
		var smallDown = Titanium.UI.create2DMatrix();
		smallDown = smallDown.scale(0);
		self.close({ transform: smallDown, duration:300 });
	});
	var buttonTextBig = Titanium.UI.createButton({
		width: 30 * Util.RATIO,
		height: 30 * Util.RATIO,
		right: 75 * Util.RATIO,
		title: 'A',
		color: '#fff',
		font: { fontWeight: 'bold', fontSize: 19 * Util.RATIO },
		backgroundColor: '#222',
		backgroundImage: 'NONE',
		selectedColor: '#333',
		borderRadius: 3 * Util.RATIO,
	});
	var buttonTextSmall = Titanium.UI.createButton({
		width: 30 * Util.RATIO,
		height: 30 * Util.RATIO,
		right: 115 * Util.RATIO,
		title: 'A',
		color: '#fff',
		font: { fontWeight: 'bold', fontSize: 13 * Util.RATIO },
		backgroundColor: '#222',
		backgroundImage: 'NONE',
		selectedColor: '#333',
		borderRadius: 3 * Util.RATIO,
	});
	
	buttonTextBig.addEventListener('click', function() {
		changeTextSize(22 * Util.RATIO);
	});
	buttonTextSmall.addEventListener('click', function() {
		changeTextSize(18 * Util.RATIO);
	});
	var topBar = Ti.UI.createView({
		width: '100%',
		height: 40 * Util.RATIO,
		backgroundColor: '#fff',
		top: 0
	});
	topBar.add(buttonClose);
	topBar.add(buttonTextBig);
	topBar.add(buttonTextSmall);
	Util.getAjax('/getStoryContent', {
		'id': item.id,
		'type': item.type,
		'chapter': item.chapterId
	},
	function(response) {
		var story = JSON.parse(response).data;
		var view = Ti.UI.createScrollView({
		  contentHeight: 'auto',
		  showVerticalScrollIndicator: true,
		  width: '100%',
		  backgroundColor: '#fff',
		  top: 40 * Util.RATIO,
		});
		labelContent = Ti.UI.createLabel({
			text: story.content,
			left: 5 * Util.RATIO,
			right: 5 * Util.RATIO,
			top: 5 * Util.RATIO,
			font: { fontSize: 18  * Util.RATIO},
		});
		view.add(labelContent);
		// view.add(topBar);
		self.add(view);
		self.add(topBar);
		self.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP });
	});
};

module.exports = StoryReading;
