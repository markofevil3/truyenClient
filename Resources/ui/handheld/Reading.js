function Reading(item) {
	var self = Ti.UI.createWindow({
		title: item.info.title,
		backgroundColor:'#000'		
	});
	Ti.API.info(JSON.stringify(item.info));
	var images = [];
	var pagesLabel;
	var listImages;
	listImages = item.info;
	//###### TOPBAR
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
	var chapterLabel = Ti.UI.createLabel({
		text: item.info.chapter,
		color: '#CCCCCC',
		font: { fontWeight: 'bold', fontSize: 17 }
	});
	pagesLabel = Ti.UI.createLabel({
		text: '1/' + listImages.numPages,
		color: '#CCCCCC',
		left: 10,
		font: { fontSize: 17 }
	});
	var topBar =  Ti.UI.createView({
		backgroundColor: '#000',
		height: 40,
		top: 0,
		zIndex: 999
	});
	topBar.add(pagesLabel);
	topBar.add(chapterLabel);
	topBar.add(buttonClose);
	self.addEventListener('singletap', function() {
		if (topBar.visible) {
			topBar.animate({opacity: 0, duration: 1000}, function() {
				topBar.hide();
			});
		} else {
			topBar.show();
			topBar.animate({opacity: 1, duration: 1000}, function() {
			});
		}
	});
	topBar.hide();
	topBar.opacity = 0;
	self.add(topBar);
	//### END TOP BAR
	//ADD IMAGES
	var maxZindex = listImages.numPages;
	for (var i = 0; i < listImages.numPages; i++) {
		var image = Ti.UI.createImageView({
			image: myGlobal.SERVER + '/images/manga/sample/sample' + i + '.jpg',
			width: '100%',
			height: '100%',
		});
		var scrollView = Ti.UI.createScrollView({
		  contentWidth: '100%',
		  contentHeight: '100%',
		  backgroundColor: '#000',
		  showVerticalScrollIndicator: true,
		  showHorizontalScrollIndicator: true,
		  height: '100%',
		  width: '100%',
		  zIndex: maxZindex,
		  index: i,
		  maxZoomScale: 3,
			minZoomScale: 1
		});
		scrollView.add(image);
		changePage(scrollView);
		images.push(scrollView);
		self.add(scrollView);
		maxZindex--;
	}
	self.open({ transition: Ti.UI.iPhone.AnimationStyle.CURL_UP });
	function changePage(page) {
		page.addEventListener('swipe', function(e) {
			if (e.direction == 'left') {
				if (images[page.index + 1]) {
					self.animate({ view: images[page.index + 1], transition: Ti.UI.iPhone.AnimationStyle.CURL_UP, duration: 500 });
					page.hide();
					pagesLabel.text = (page.index + 2) + '/' + listImages.numPages;
				}
			}
			if (e.direction == 'right') {
				if (images[page.index - 1]) {
					self.animate({ view: images[page.index - 1], transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN, duration: 500 });
					images[page.index - 1].show();
					pagesLabel.text = page.index + '/' + listImages.numPages;
				}
			}
		});
	};
};

module.exports = Reading;
