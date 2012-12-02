function Home() {
	var self = Ti.UI.createWindow({
		title: 'Home',
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
			height:120,
			backgroundColor: 'transparent',
			selectedBackgroundColor: 'transparent',
			name: homeMenus[i].name,
			id: homeMenus[i].id
		});
		var image = Ti.UI.createImageView({
			image: homeMenus[i].image,
			width: 181,
			// top: -5,
			height: 45,
		});
		var title = Ti.UI.createLabel({
			text: homeMenus[i].name,
			color: '#fff',
			font: { fontSize: 20, fontWeight: 'bold', fontFamily: 'Chalkboard SE' },
			zIndex: 2
		});
		row.add(title);
		row.add(image);
		tbl_data.push(row);
	}
	
	// now assign that array to the table's data property to add those objects as rows
	var table = Titanium.UI.createTableView({
	    data:tbl_data,
	    backgroundImage: '/images/handheld/bookShelf.png',
	    backgroundRepeat: true,
	    separatorColor: 'transparent',
	});
	
	table.addEventListener('click', function(e) {
		var Window = require('ui/handheld/' + e.rowData.id);
		new Window(self);
	});
	self.add(table);
	
	return self;
};

module.exports = Home;
