var Util = require('etc/Util');
var tab;
function Favorites() {
	var listFavorites;
	var self = Ti.UI.createWindow({
		title: 'Favorites',
		backgroundImage: '/images/handheld/setting_bg.png',
	});
	tab = self;
	var tabBar = Titanium.UI.iOS.createTabbedBar({
		labels:['Tất Cả', 'Truyện Tranh', 'Truyện Chữ'],
		index:0,
		backgroundColor:'#c69656',
		style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		color: '#fff',
		top: 0
	});
	var tableView = Ti.UI.createTableView({
		editable:true,
		allowsSelectionDuringEditing:true,
		backgroundColor: 'transparent',
		backgroundRepeat: true,
    separatorColor: 'transparent',
  	style: Ti.UI.iPhone.TableViewStyle.PLAIN,
    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
    top: 30 + (40 * Util.RATIO),
	});
	function getFavorites() {
		Util.getAjax('/getFavorites', {
			'userId': Titanium.Facebook.getUid()
		},
		function(response) {
			listFavorites = JSON.parse(response).data;
			var mangaRows = setRowData(listFavorites['manga'], 0);
			var storyRows = setRowData(listFavorites['story'], 1);
			tableView.data = mangaRows.concat(storyRows);
			tabBar.addEventListener('click', function(e) {
				switch (e.index) {
					case 0:
						var mangaRows = setRowData(listFavorites['manga'], 0);
						var storyRows = setRowData(listFavorites['story'], 1);
						tableView.data = mangaRows.concat(storyRows);
						break;
					case 1:
						tableView.data = setRowData(listFavorites['manga'], 0);
						break;
					case 2:
						tableView.data = setRowData(listFavorites['story'], 1);
						break;
				}
			});
		});
	};
	
	self.barImage = '/images/handheld/top.png';
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
	var adView = Ti.UI.createView({
		width: '100%',
		height: 40 * Util.RATIO,
		top : 30,
	});
	Util.adv(6, function(advImage) {
		adView.add(advImage);
	});
	self.add(adView);
	self.add(tabBar);
	self.add(tableView);
	return self;
};

function selectItem(item, type) {
	item.addEventListener('click', function(e) {
		var dir;
		if (type == 0) {
			dir = 'ui/common/Manga';
		} else {
			dir = 'ui/common/Story';
		}
		var Window = require(dir);
		new Window(item, tab);
	});
};

function returnTypeText(type) {
	switch(type) {
		case 0:
			return 'Truyện Tranh';
			break;
		case 1:
			return 'Truyện Chữ';
			break;
	}
};

function setRowData(data, type) {
	var dataSet = [];
	for (var i = 0; i < data.length; i++) {
		var coverLink;
		var storyType = null;
		if (type == 1) {
			storyType = 1;
		}
		if (type == 0) {
			coverLink = Util.SERVER + data[i].folder + '/cover.jpg';
		} else {
			coverLink = Util.SERVER + '/images/story/sample/cover.jpg';
		}
		var cover = Ti.UI.createImageView({
			image: coverLink,
			width: 40 * Util.RATIO,
			height: 60 * Util.RATIO,
			left: 10 * Util.RATIO,
		});
		var labelTitle = Ti.UI.createLabel({
			text: data[i].title,
			left: 55 * Util.RATIO,
			top: 3 * Util.RATIO,
			height: 20 * Util.RATIO,
			font: { fontWeight: 'bold', fontSize: 18 * Util.RATIO, fontFamily: 'Chalkboard SE' },
			color: '#fff'
		});
		var labelChapter = Ti.UI.createLabel({
			text: 'Newest: ' + data[i].chapters[data[i].chapters.length - 1].chapter,
			left: 55 * Util.RATIO,
			top: 23 * Util.RATIO,
			font: { fontSize: 14 * Util.RATIO, fontStyle: 'italic' },
			color: '#fff'
		});
		var labelType = Ti.UI.createLabel({
			text: 'Thể loại:' + returnTypeText(type),
			left: 55 * Util.RATIO,
			top: 40 * Util.RATIO,
			font: { fontSize: 14 * Util.RATIO, fontStyle: 'italic' },
			color: '#fff'
		});
		var row = Ti.UI.createTableViewRow({
			// title: listFavorites['manga'][i].title,
			backgroundColor: 'transparent',
			backgroundImage: '/images/handheld/bookShelf.png',
			id: data[i]._id,
			type: storyType,
			name: data[i].title,
			height: 70 * Util.RATIO
		});
		row.add(labelTitle);
		row.add(labelType);
		row.add(labelChapter);
		row.add(cover);
		selectItem(row, type);
		dataSet.push(row);
	}
	return dataSet;
};

module.exports = Favorites;
