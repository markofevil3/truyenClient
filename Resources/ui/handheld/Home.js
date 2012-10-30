function Home() {
	var self = Ti.UI.createWindow({
		title: 'Home',
	});
	self.barImage = '/images/corkboard.jpg';
	// Create an array of explicitly defined custom TableViewRows
	var tbl_data = [];
	var homeMenus = [
		{ 'id': 'MangaList', 'name': 'Manga', 'image': '/images/banner16.jpeg' },
		{ 'id': 'BookList', 'name': 'Truyen Chu', 'image': '/images/banner16.jpeg' },
		{ 'id': 'FunnyList', 'name': 'Truyen Cuoi', 'image': '/images/banner16.jpeg' },
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
			width: '70%',
			height: '100%',
		});
		row.add(image);
		tbl_data.push(row);
	}
	
	// now assign that array to the table's data property to add those objects as rows
	var table = Titanium.UI.createTableView({
	    data:tbl_data,
	    backgroundImage: '/images/bookShelf.png',
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