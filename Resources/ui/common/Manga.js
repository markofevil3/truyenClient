var Util = require('etc/Util');
function Manga(item, tab) {
	function setRowData(data, maxRow) {
		var dataSet = [];
		for (var i = 0; i < maxRow; i++) {
			if (data[i]) {
				var row = Ti.UI.createTableViewRow({
			    backgroundImage: '/images/handheld/bookShelf.png',
					height: 40 * Util.RATIO,
					chapterId: data[i]._id,
					id: item.id,
				});
				var labelChapter = Ti.UI.createLabel({
					text: 'Chapter ' + data[i].chapter,
					color: '#fff',
					textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
					font: { fontWeight: 'bold', fontSize: 17 * Util.RATIO, fontFamily: 'Chalkboard SE' }
				});
				var labelTitle = Ti.UI.createLabel({
					text: data[i].title,
					left: 105 * Util.RATIO
				});
				row.add(labelTitle);
				row.add(labelChapter);
				selectItem(row);
				dataSet.push(row);
			}
		}
		return dataSet;
	};
	
	function selectItem(item) {
		item.addEventListener('click', function(e) {
			var Window = require('ui/common/Reading');
			new Window(item);
		});
	};
	var favoriteButton = Titanium.UI.createButton({
		text: 'favorite', 
		color: '#fff',
		height: 40,
		width: 40,
		itemId: item.id,
		backgroundColor: 'transparent',
		backgroundImage: '/images/handheld/favorites_dark.png',
	});
	favoritedButton = Titanium.UI.createButton({
		text: 'favorite', 
		color: '#fff',
		height: 40,
		width: 40,
		backgroundColor: 'transparent',
		backgroundImage: '/images/handheld/favorites_color.png',
	});
	var self = Ti.UI.createWindow({
		title: item.name,
		rightNavButton: favoriteButton,
		backgroundImage: '/images/handheld/setting_bg.png',
	});
	//enable favorite button
	favoriteButton.addEventListener('click', function() {
		if (Titanium.Facebook.loggedIn == 0) {
			Ti.Facebook.authorize();
			Titanium.Facebook.addEventListener('login', function(e) {
		    if (e.success) {
		    	//add to favorite
					Util.addFavorite(favoriteButton.itemId, 0, e.data, function() {
						self.rightNavButton = favoritedButton;
					});
		    } else if (e.error) {
	        alert(e.error);
		    } else if (e.cancelled) {
	        alert("Cancelled");
		    }
			});
		} else {
			Titanium.Facebook.requestWithGraphPath('/' + Titanium.Facebook.getUid(), {}, 'GET', function(user) {
				Util.addFavorite(favoriteButton.itemId, 0, JSON.parse(user.result), function() {
					self.rightNavButton = favoritedButton;
				});
			});
		}
	});
	//change top bar image
	self.barImage = '/images/handheld/top.png';
	self.leftNavButton = Util.backButton(self);
	//send request to get manga info
	Util.getAjax('/manga', {
		'id': item.id,
		'userId': Titanium.Facebook.getUid()
	},
	function(response) {
		var json = JSON.parse(response);
		if (json.favorite) {
			self.rightNavButton = favoritedButton;
		} else {
			self.rightNavButton = favoriteButton; 
		}
		var listChapters = json.data.chapters;
		var tbl_data = setRowData(listChapters, Util.MAX_DISPLAY_ROW);
		
		function getNewestChapter() {
			var newest = 0;
			for (var i = 0; i < listChapters.length; i++) {
				if (listChapters[i].chapter > newest) {
					newest = listChapters[i].chapter;
				}
			}
			return newest;
		}
		//header with search
		var createCustomView = function() {
			var view = Ti.UI.createView({
				backgroundColor: '#222',
				height: 40,
				backgroundImage: '/images/handheld/setting_bg.png',
				backgroundColor: 'transparent',
				top: 120 * Util.RATIO,
			});
			var search = Titanium.UI.createSearchBar({
				barColor:'transparent',
				hintText:'search',
				backgroundImage: '/images/handheld/setting_bg.png',
				backgroundColor: 'transparent',
				width: '70%',
				height: 40,
				left: 16 * Util.RATIO
			});
			search.addEventListener('change', function(e) {
				var results = [];
				var regexValue = new RegExp(e.value, 'i');
				for (var i in listChapters) {
					if (regexValue.test(listChapters[i].chapter)) {
						results.push(listChapters[i]);
					}
				}
				tbl_data = setRowData(results, results.length);
				table.setData([]);
				table.setData(tbl_data);
			});
			search.addEventListener('focus', function(e) {
				search.showCancel = true;
			});
			search.addEventListener('return', function(e) {
				search.showCancel = false;
				search.blur();
			});
			search.addEventListener('cancel', function(e) {
				search.showCancel = false;
				search.blur();
			});
			//#### sort
			var sortButton = Titanium.UI.createButton({
				opacity: 0.7,
				height: 30,
				width: 30,
				right: '8%',
				borderRadius: 4,
				borderWidth: 1,
				borderColor: '#9b652e',
				backgroundImage: '/images/handheld/sort-button2.png',
			});
			var optionsDialogOpts = {
				options:['A -> Z', 'Z -> A'],
				selectedIndex: 0,
				title:'SORT BY'
			};
			var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
			dialog.addEventListener('click',function(e) {
				switch (e.index) {
					case 0:
						listChapters.sort(Util.dynamicSort('chapter', 1));
						break;
					case 1:
						listChapters.sort(Util.dynamicSort('chapter', -1));
						break;
				}
				table.setData([]);
				tbl_data = setRowData(listChapters, Util.MAX_DISPLAY_ROW);
				table.setData(tbl_data);
			});
			sortButton.addEventListener('singletap', function(e) {
				dialog.show();
			});
			//### end sort
			view.add(sortButton);
			view.add(search);
			return view;
		};
		var table = Titanium.UI.createTableView({
	    data: tbl_data,
	    backgroundColor: 'transparent',
	    separatorColor: 'transparent',
	    style: Ti.UI.iPhone.TableViewStyle.PLAIN,
	    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
	    top: 160 * Util.RATIO - (40 * (Util.RATIO - 1)),
	    id: item.id,
		});
		Util.dynamicLoad(table, listChapters);
		
		var infoView = Titanium.UI.createView({
			width: '100%',
			height: 120 * Util.RATIO,
			top: 0,
			backgroundColor: '#d8cdc0',
			backgroundImage: '/images/handheld/whitePaper.png',
			layout: 'horizontal'
		});
		var bookView = Titanium.UI.createView({
			width: '22%',
			height: '100%',
			left: 5 * Util.RATIO
		});
		var book = Titanium.UI.createImageView({
			image: '/images/handheld/book1.png',
			width: '100%',
			height: '100%',
			zIndex: 1,
		});
		var cover = Titanium.UI.createImageView({
			image: Util.SERVER + json.data.folder + '/cover.jpg',
			width: '80%',
			height: '96%',
			defaultImage: '/images/handheld/default_image.jpg',
			zIndex: 2,
			top: 0,
			left: '14%',
		});
		bookView.add(book);
		bookView.add(cover);
		var details = Titanium.UI.createView({
			width: '72%',
			height: '100%',
			backgroundColor: 'transparent',
			layout: 'vertical',
			left: 5 * Util.RATIO
		});
		var labelTitle = Ti.UI.createLabel({
			text: json.data.title,
			color: '#fff',
			font: { fontWeight: 'bold', fontSize: 19 * Util.RATIO, fontFamily: 'Chalkboard SE'},
			left: 0
		});
		var labelAuthor = Ti.UI.createLabel({
			text: 'Tác giả: ' + json.data.author,
			font: { fontSize: 16 * Util.RATIO, fontStyle: 'italic' },
			left: 0
		});
		var labelChapter = Ti.UI.createLabel({
			text: 'Newest Chapter: ' + getNewestChapter(),
			font: { fontSize: 18 * Util.RATIO, fontStyle: 'bold' },
			left: 0
		});
		var labelView = Ti.UI.createLabel({
			text: json.data.numView,
			font: { fontSize: 18 * Util.RATIO, fontStyle: 'bold' },
			left: 25 * Util.RATIO,
			top: -20 * Util.RATIO
		});
		var viewIcon = Ti.UI.createImageView({
			image: '/images/handheld/view.png',
			width: 20 * Util.RATIO,
			height: 20 * Util.RATIO,
			left: 0
		});
		// var labelDes = Ti.UI.createLabel({
			// top: 36,
			// left: '25%',
			// font: { fontSize: 14 }
		// });

		details.add(labelTitle);
		details.add(labelAuthor);
		details.add(labelChapter);
		details.add(viewIcon);
		details.add(labelView);
		infoView.add(bookView);
		infoView.add(details);
		self.add(infoView);
		self.add(createCustomView());
		self.add(table);
		tab.containingTab.open(self);
	});
};

module.exports = Manga;
