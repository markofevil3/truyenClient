function Home() {
	var self = Ti.UI.createWindow({
		title: 'Home',
		backgroundImage: '/images/handheld/setting_bg.png',
	});
	self.barImage = '/images/handheld/top.png';
	// Create an array of explicitly defined custom TableViewRows
	var tbl_data = [];
	var homeMenus = [
		{ 'id': 'MangaList', 'name': 'Manga', 'image': '/images/handheld/woodbar.png' },
		{ 'id': 'StoryList', 'name': 'Truyen Chu', 'image': '/images/handheld/bg_paper_tournament.png' },
		{ 'id': 'FunnyList', 'name': 'Truyen Cuoi', 'image': '/images/handheld/bg_paper_tournament.png' },
	];
	for (var i = 0; i < homeMenus.length; i++) {
		var row = Ti.UI.createTableViewRow({
			height: 120 * Util.RATIO,
			backgroundColor: 'transparent',
			backgroundImage: '/images/handheld/bookShelf.png',
			selectedBackgroundColor: 'transparent',
			name: homeMenus[i].name,
			id: homeMenus[i].id
		});
		var image = Ti.UI.createImageView({
			image: homeMenus[i].image,
			width: 181 * Util.RATIO,
			// top: -5,
			height: 45 * Util.RATIO,
		});
		var title = Ti.UI.createLabel({
			text: homeMenus[i].name,
			color: '#fff',
			font: { fontSize: 20 * Util.RATIO, fontWeight: 'bold', fontFamily: 'Chalkboard SE' },
			zIndex: 2
		});
		row.add(title);
		row.add(image);
		tbl_data.push(row);
	}
	
	// now assign that array to the table's data property to add those objects as rows
	var table = Titanium.UI.createTableView({
    data:tbl_data,
    backgroundColor: 'transparent',
    separatorColor: 'transparent',
    style: Ti.UI.iPhone.TableViewStyle.PLAIN,
    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
	});
	
	table.addEventListener('click', function(e) {
		if (e.rowData.id == 'FunnyList') {
			alert('Comming Soon!');
		} else {
			var Window = require('ui/common/' + e.rowData.id);
			new Window(self);			
		}
	});
	self.add(table);
	
	return self;
};

module.exports = Home;
