var Util = require('etc/Util');
function Manga(item, tab) {
	function setRowData(data, maxRow) {
		var dataSet = [];
		for (var i = 0; i < maxRow; i++) {
			if (data[i]) {
				var row = Ti.UI.createTableViewRow({
					backgroundColor: 'transparent',
					// backgroundImage: '/images/handheld/bookShelf.png',
					// selectedBackgroundColor: 'transparent',
					height: 40,
					chapterId: data[i]._id,
					id: item.id,
				});
				var labelChapter = Ti.UI.createLabel({
					text: 'Chapter ' + data[i].chapter,
					left:10,
					font: { fontWeight: 'bold', fontSize: 17 }
				});
				var labelTitle = Ti.UI.createLabel({
					text: data[i].title,
					left: 105
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
			var Window = require('ui/handheld/Reading');
			new Window(item);
		});
	};
	var favoriteButton = Titanium.UI.createButton({
		text: 'favorite', 
		// backgroundImage:'/images/handheld/corkboard.jpg',
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
		title: item.title,
		rightNavButton: favoriteButton
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
				backgroundImage: '/images/handheld/searchBackground.png',
				backgroundColor: 'transparent',
				top: 120,
			});
			var search = Titanium.UI.createSearchBar({
				barColor:'transparent',
				hintText:'search',
				backgroundImage: '/images/handheld/search.png',
				backgroundColor: 'transparent',
				width: '70%',
				left: 16
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
				text: 'sort',
				color: '#fff',
				height: 40,
				width: 40,
				right: 16,
				backgroundColor: 'transparent',
				backgroundImage: '/images/handheld/sort.png',
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
				// Util.dynamicLoad(table, listChapters);
				// table.setData(setRowData(listChapters));
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
	    // backgroundImage: '/images/handheld/bookShelf.png',
	    // separatorColor: 'transparent',
	    // headerView: createCustomView(),
	    top: 160,
		});
		Util.dynamicLoad(table, listChapters);
		
		var infoView = Titanium.UI.createView({
			width: '100%',
			height: 120,
			top: 0,
			backgroundColor: '#fff',
			layout: 'horizontal'
		});
		var cover = Titanium.UI.createImageView({
			image: Util.SERVER + json.data.folder + '/cover.jpg',
			width: '22%',
			height: '100%',
			left: 5
		});
		var details = Titanium.UI.createView({
			width: '72%',
			height: '100%',
			backgroundColor: '#fff',
			layout: 'vertical',
			left: 5
		});
		var labelTitle = Ti.UI.createLabel({
			text: json.data.title,
			font: { fontWeight: 'bold', fontSize: 19 },
			left: 0
		});
		var labelAuthor = Ti.UI.createLabel({
			text: 'Tác giả: ' + json.data.author,
			font: { fontSize: 16, fontStyle: 'italic' },
			left: 0
		});
		var labelChapter = Ti.UI.createLabel({
			text: 'Newest Chapter: ' + getNewestChapter(),
			font: { fontSize: 18, fontStyle: 'bold' },
			left: 0
		});
		var labelView = Ti.UI.createLabel({
			text: json.data.numView,
			font: { fontSize: 18, fontStyle: 'bold' },
			left: 25,
			top: -20
		});
		var viewIcon = Ti.UI.createImageView({
			image: '/images/handheld/view.png',
			width: 20,
			height: 20,
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
		infoView.add(cover);
		infoView.add(details);
		self.add(infoView);
		self.add(createCustomView());
		self.add(table);
		tab.containingTab.open(self);
	});
};

module.exports = Manga;
