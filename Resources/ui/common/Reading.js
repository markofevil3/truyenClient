var Util = require('etc/Util');
function Reading(item) {
	Util.getAjax('/mangaReading', {
		'id': item.id,
		'chapter': item.chapterId
	},
	function(response) {
		var json = JSON.parse(response).data;
		var self = Ti.UI.createWindow({
			title: 'Chapter ' + json.chapter,
			backgroundColor:'#000'		
		});
		var images = [];
		var pagesLabel;
		var listImages;
		listImages = json.pages;
		//###### TOPBAR
		var buttonClose = Titanium.UI.createButton({
			title: 'close',
			width: 60 * Util.RATIO,
			height: 25 * Util.RATIO,
			right: 10 * Util.RATIO,
			font: { fontWeight: 'bold', fontSize: 14 * Util.RATIO },
			borderRadius: 5 * Util.RATIO,
			borderWidth: 1 * Util.RATIO,
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
			text: 'Chapter ' + json.chapter,
			color: '#CCCCCC',
			font: { fontWeight: 'bold', fontSize: 17 * Util.RATIO }
		});
		pagesLabel = Ti.UI.createLabel({
			text: '1/' + listImages.length,
			color: '#CCCCCC',
			left: 10,
			font: { fontSize: 17 * Util.RATIO }
		});
		var topBar =  Ti.UI.createView({
			backgroundColor: '#000',
			height: 40 * Util.RATIO,
			top: 0,
			zIndex: 999
		});
		topBar.add(pagesLabel);
		topBar.add(chapterLabel);
		topBar.add(buttonClose);
		var adView = Ti.UI.createView({
			width: '100%',
			height: 40 * Util.RATIO,
			bottom: 0,
			zIndex: 999
		});
		Util.adv(3, function(advImage) {
			adView.add(advImage);
		});
		self.addEventListener('singletap', function() {
			if (topBar.visible) {
				adView.animate({opacity: 0, duration: 1000}, function() {
					adView.hide();
				});
				topBar.animate({opacity: 0, duration: 1000}, function() {
					topBar.hide();
				});
			} else {
				adView.show();
				adView.animate({opacity: 1, duration: 1000}, function() {
				});
				topBar.show();
				topBar.animate({opacity: 1, duration: 1000}, function() {
				});
			}
		});
		adView.hide();
		adView.opacity = 0;
		topBar.hide();
		topBar.opacity = 0;
		self.add(topBar);
		self.add(adView);
		//### END TOP BAR
		//ADD IMAGES
		var maxZindex = listImages.length;
		for (var i = 0; i < listImages.length; i++) {
			var image = Ti.UI.createImageView({
				image: Util.SERVER + listImages[i],
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
						pagesLabel.text = (page.index + 2) + '/' + listImages.length;
					}
				}
				if (e.direction == 'right') {
					if (images[page.index - 1]) {
						self.animate({ view: images[page.index - 1], transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN, duration: 500 });
						images[page.index - 1].show();
						pagesLabel.text = page.index + '/' + listImages.length;
					}
				}
			});
		};
	});
};

module.exports = Reading;
