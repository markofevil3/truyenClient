function StoryReading(item) {
	var self = Ti.UI.createWindow({
		title: item.title,
	});
	var labelContent;
	function changeTextSize(size) {
		labelContent.font = { fontSize: size };
	};
	var buttonClose = Titanium.UI.createButton({
		title: 'close',
		width: 60,
		height: 30,
		right: 5,
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
	var buttonTextBig = Titanium.UI.createButton({
		width: 30,
		height: 30,
		right: 75,
		title: 'A',
		color: '#fff',
		font: { fontWeight: 'bold', fontSize: 19 },
		backgroundColor: '#222',
		backgroundImage: 'NONE',
		selectedColor: '#333',
		borderRadius: 3,
	});
	var buttonTextSmall = Titanium.UI.createButton({
		width: 30,
		height: 30,
		right: 115,
		title: 'A',
		color: '#fff',
		font: { fontWeight: 'bold', fontSize: 13 },
		backgroundColor: '#222',
		backgroundImage: 'NONE',
		selectedColor: '#333',
		borderRadius: 3,
	});
	
	buttonTextBig.addEventListener('click', function() {
		changeTextSize(22);
	});
	buttonTextSmall.addEventListener('click', function() {
		changeTextSize(18);
	});
	var topBar = Ti.UI.createView({
		width: '100%',
		height: 40,
		backgroundColor: '#fff',
		top: 0
	});
	topBar.add(buttonClose);
	topBar.add(buttonTextBig);
	topBar.add(buttonTextSmall);
	myGlobal.getAjax('/getStoryContent', {
		'id': item.id,
		'type': item.type,
		'chapter': item.chapterId
	},
	function(response) {
		var story = JSON.parse(response).data;
		Ti.API.info(JSON.stringify(story.content));
		var view = Ti.UI.createScrollView({
		  contentHeight: 'auto',
		  showVerticalScrollIndicator: true,
		  width: '100%',
		  backgroundColor: '#fff',
		  top: 40,
		});
		labelContent = Ti.UI.createLabel({
			text: story.content,
			left: 5,
			right: 5,
			top: 5,
			font: { fontSize: 18 },
		});
		view.add(labelContent);
		// view.add(topBar);
		self.add(view);
		self.add(topBar);
		self.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP });
	});
};

module.exports = StoryReading;
