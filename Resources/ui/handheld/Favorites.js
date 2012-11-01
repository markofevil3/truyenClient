function Favorites() {
	var self = Ti.UI.createWindow({
		title: 'Favorites',
	});
	var tableView = Ti.UI.createTableView({
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
				mangaSection.add(Ti.UI.createTableViewRow({
					title: listFavorites['manga'][i].title,
					itemId: listFavorites['manga'][i]._id,
				}));
			}
	
			tableView.data = [mangaSection, storySection, funnySection];
		});
	};
	
	self.barImage = '/images/corkboard.jpg';
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
	self.add(tableView);
	return self;
};

module.exports = Favorites;
