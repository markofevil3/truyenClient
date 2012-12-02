var Util = require('etc/Util');
function Favorites() {
	var self = Ti.UI.createWindow({
		title: 'Favorites',
	});
	var tableView = Ti.UI.createTableView({
		editable:true,
		allowsSelectionDuringEditing:true,
		backgroundColor: 'transparent',
		backgroundImage: '/images/handheld/bookShelf.png',
		backgroundRepeat: true,
		separatorColor: 'transparent',
	});
	function getFavorites() {
		Util.getAjax('/getFavorites', {
			'userId': Titanium.Facebook.getUid()
		},
		function(response) {
			var listFavorites = JSON.parse(response).data;
			
			var mangaSection = Ti.UI.createTableViewSection({
				headerTitle: 'Manga'
			});
			var storySection = Ti.UI.createTableViewSection({
				headerTitle: 'Story'
			});
			var funnySection = Ti.UI.createTableViewSection({
				headerTitle: 'Funny'
			});
			//####### MANGA
			for (var i = 0; i < listFavorites['manga'].length; i++) {
				var cover = Ti.UI.createImageView({
					image: Util.SERVER + listFavorites['manga'][i].folder + '/cover.jpg',
					width: 40,
					height: 60,
					left: 10,
				});
				var labelTitle = Ti.UI.createLabel({
					text: listFavorites['manga'][i].title,
					left: 55,
					top: 5,
					height: 20,
					font: { fontWeight: 'bold', fontSize: 19 },
					color: '#fff'
				});
				var labelChapter = Ti.UI.createLabel({
					text: 'Newest: ' + listFavorites['manga'][i].chapters[listFavorites['manga'][i].chapters.length - 1].chapter,
					left: 55,
					top: 27,
					font: { fontSize: 17 },
					color: '#fff'
				});
				var row = Ti.UI.createTableViewRow({
					// title: listFavorites['manga'][i].title,
					backgroundColor: 'transparent',
					backgroundImage: '/images/handheld/bookShelf.png',
					itemId: listFavorites['manga'][i]._id,
					height: 70
				});
				row.add(labelTitle);
				row.add(labelChapter);
				row.add(cover);
				mangaSection.add(row);
			}
			//##### STORY
			for (var i = 0; i < listFavorites['story'].length; i++) {
				var labelTitle = Ti.UI.createLabel({
					text: listFavorites['story'][i].title,
					left: 55,
					top: 5,
					height: 20,
					font: { fontWeight: 'bold', fontSize: 19 },
					color: '#fff'
				});
				if (listFavorites['story'][i].type == 0) {
					var labelAuthor = Ti.UI.createLabel({
						text: 'Tác giả: ' + listFavorites['story'][i].author,
						left: 55,
						top: 27,
						font: { fontSize: 17 },
						color: '#fff'
					});
				} else {
					var labelChapter = Ti.UI.createLabel({
						text: 'Newest: Chapter ' + listFavorites['story'][i].chapters[listFavorites['story'][i].chapters.length - 1].chapter,
						left: 55,
						top: 27,
						font: { fontSize: 17 },
						color: '#fff'
					});
				}
				var row = Ti.UI.createTableViewRow({
					backgroundColor: 'transparent',
					backgroundImage: '/images/handheld/bookShelf.png',
					itemId: listFavorites['story'][i]._id,
					height: 70
				});
				row.add(labelTitle);
				if (labelChapter) {
					row.add(labelChapter);
				}
				if (labelAuthor) {
					row.add(labelAuthor);
				}
				storySection.add(row);
			}
	
	
			tableView.data = [mangaSection, storySection, funnySection];
		});
	};
	
	self.barImage = '/images/handheld/corkboard.jpg';
	var facebookButton = Titanium.Facebook.createLoginButton({
		style: Ti.Facebook.BUTTON_STYLE_NORMAL,
	});
	self.addEventListener('focus', function(f) {
		if (Titanium.Facebook.loggedIn == 0) {
			Ti.Facebook.authorize();
			Titanium.Facebook.addEventListener('login', function(e) {
		    if (e.success) {
					getFavorites();
		    } else if (e.error) {
	        alert(e.error);
		    } else if (e.cancelled) {
	        alert("You must login to use Favorites function!");
		    }
			});
		} else {
			getFavorites();
		}
	});
	tableView.addEventListener('delete', function(e) {
		Util.getAjax('/removeFavorite', {
			'userId': Titanium.Facebook.getUid(),
			'itemId': e.rowData.itemId
		},
		function(response) {
		});
	});
	self.add(tableView);
	return self;
};

module.exports = Favorites;
