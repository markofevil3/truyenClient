var Util = require('etc/Util');
function Story(item, tab) {
	function setRowData(data) {
		var dataSet = [];
		for (var i = 0; i < data.length; i++) {
			var row = Ti.UI.createTableViewRow({
				backgroundColor: 'transparent',
				// backgroundImage: '/images/handheld/bookShelf.png',
				// selectedBackgroundColor: 'transparent',
				height: 40,
				id: item.id,
				chapterId: data[i]._id,
				info: data[i],
				type: item.type
			});
			var labelChapter = Ti.UI.createLabel({
				text: 'Chapter ' + data[i].chapter + ':',
				left:10,
				font: { fontWeight: 'bold', fontSize: 17 }
			});
			var labelTitle = Ti.UI.createLabel({
				text: data[i].title,
				left: 105
			});
			row.add(labelChapter);
			row.add(labelTitle);
			selectItem(row);
			dataSet.push(row);
		}
		return dataSet;
	};
	
	function selectItem(item) {
		item.addEventListener('click', function(e) {
			var Window = require('ui/tablet/StoryReading');
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
		title: item.name,
		rightNavButton: favoriteButton
	});
	//enable favorite button
	favoriteButton.addEventListener('click', function() {
		if (Titanium.Facebook.loggedIn == 0) {
			Ti.Facebook.authorize();
			Titanium.Facebook.addEventListener('login', function(e) {
		    if (e.success) {
		    	//add to favorite
					Util.addFavorite(favoriteButton.itemId, 1, e.data, function() {
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
				Util.addFavorite(favoriteButton.itemId, 1, JSON.parse(user.result), function() {
					self.rightNavButton = favoritedButton;
				});
			});
		}
	});
	//change top bar image
	self.barImage = '/images/handheld/corkboard.jpg';
	//change back button style
	var backbutton = Titanium.UI.createButton({
		title:'back', 
		// backgroundImage:'/images/handheld/corkboard.jpg',
		width:50,
		height:20
	});
	backbutton.addEventListener('click', function() {
		self.close();
	});
	self.leftNavButton = backbutton;
	//send request to get manga info
	Util.getAjax('/getStory', {
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
		var tbl_data = setRowData(listChapters);
		//header with search
		var createCustomView = function() {
			var view = Ti.UI.createView({
				backgroundColor: '#222',
				height: 40,
				backgroundImage: '/images/handheld/searchBackground.png',
				backgroundColor: 'transparent',
				top: 120
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
			});
			sortButton.addEventListener('singletap', function(e) {
				dialog.show();
			});
			//### end sort
			view.add(sortButton);
			view.add(search);
			return view;
		};
		var infoView = Titanium.UI.createView({
			width: '100%',
			height: 120,
			top: 0,
			backgroundColor: '#fff'
		});
		var cover = Titanium.UI.createImageView({
			image: Util.SERVER + '/images/story/sample/cover.jpg',
			width: '22%',
			height: '100%',
			left: 5
		});
		var labelTitle = Ti.UI.createLabel({
			text: json.data.title,
			left: '25%',
			top: 2,
			font: { fontWeight: 'bold', fontSize: 17 }
		});
		var labelAuthor = Ti.UI.createLabel({
			top: 20,
			left: '25%',
			text: 'Tác giả: ' + json.data.author,
			font: { fontSize: 15, fontStyle: 'italic' }
		});
		var labelDes = Ti.UI.createLabel({
			top: 36,
			left: '25%',
			text: json.data.shortDes,
			font: { fontSize: 14 }
		});
		infoView.add(cover);
		infoView.add(labelTitle);
		infoView.add(labelAuthor);
		infoView.add(labelDes);
		var table = Titanium.UI.createTableView({
	    data: tbl_data,
	    // backgroundImage: '/images/handheld/bookShelf.png',
	    // separatorColor: 'transparent',
	    // headerView: createCustomView(),
	    top: 160,
		});
		self.add(table);
		self.add(infoView);
		self.add(createCustomView());
		tab.containingTab.open(self);
	});
};

module.exports = Story;
