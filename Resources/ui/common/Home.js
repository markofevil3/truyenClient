var Util = require('etc/Util');
function Home() {
	var self = Ti.UI.createWindow({
		title: 'Home',
		backgroundImage: '/images/handheld/setting_bg.png',
	});
	self.barImage = '/images/handheld/top.png';
	var tbl_data = [];
	var homeMenus = [
		{ 'id': 'MangaList', 'name': 'Manga', 'image': '/images/handheld/woodbar.png' },
		{ 'id': 'StoryList', 'name': 'Truyen Chu', 'image': '/images/handheld/bg_paper_tournament.png' },
		{ 'id': 'FunnyList', 'name': 'Truyen Cuoi', 'image': '/images/handheld/bg_paper_tournament.png' },
	];
		//## ADVERTISE
	var isTablet = Util.isTablet();
	var device;
	if (isTablet) {
		device = 1;
	} else {
		device = 0;
	}
	var advRow = Ti.UI.createTableViewRow({
		height: 40 * Util.RATIO,
		backgroundColor: '#fff',
		// backgroundImage: '/images/handheld/bookShelf.png',
		selectedBackgroundColor: 'transparent',
		name: 'Advertise',
		id: 'Advertise'
	});
	Util.adv(0, function(advImage) {
		advRow.add(advImage);
	});
	tbl_data.push(advRow);
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
		row.addEventListener('click', function(e) {
			if (e.rowData.id == 'FunnyList') {
				alert('Comming Soon!');
			} else {
				var Window = require('ui/common/' + e.rowData.id);
				new Window(self);			
			}
		});
		tbl_data.push(row);
	}
	
	var table = Titanium.UI.createTableView({
    data:tbl_data,
    backgroundColor: 'transparent',
    separatorColor: 'transparent',
    style: Ti.UI.iPhone.TableViewStyle.PLAIN,
    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
	});
	
	// table.addEventListener('click', function(e) {
		// if (e.rowData.id == 'FunnyList') {
			// alert('Comming Soon!');
		// } else {
			// var Window = require('ui/common/' + e.rowData.id);
			// new Window(self);			
		// }
	// });
	self.add(table);
	
	return self;
};

module.exports = Home;
