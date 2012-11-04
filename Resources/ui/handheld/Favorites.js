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
		myGlobal.getAjax('/getFavorites', {
			'userId': Titanium.Facebook.getUid()
		},
		function(response) {
			var listFavorites = JSON.parse(response).data;
			console.log(listFavorites);
			
			var mangaSection = Ti.UI.createTableViewSection({
				headerTitle: 'Manga'
			});
			var storySection = Ti.UI.createTableViewSection({
				headerTitle: 'Story'
			});
			var funnySection = Ti.UI.createTableViewSection({
				headerTitle: 'Funny'
			});
			for (var i = 0; i < listFavorites['manga'].length; i++) {
				var cover = Ti.UI.createImageView({
					image: myGlobal.SERVER + listFavorites['manga'][i].cover,
					width: 40,
					height: 60,
					left: 10,
				});
				var labelTitle = Ti.UI.createLabel({
					text: listFavorites['manga'][i].title,
					left: 55,
					top: 5,
					font: { fontWeight: 'bold', fontSize: 19 }
				});
				var labelChapter = Ti.UI.createLabel({
					text: 'Newest: ' + listFavorites['manga'][i].chapters[listFavorites['manga'][i].chapters.length - 1].chapter,
					left: 55,
					top: 27,
					font: { fontSize: 17 }
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
		myGlobal.getAjax('/removeFavorite', {
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
