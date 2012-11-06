function Story(item, tab) {
	function setRowData(data, maxRow) {
		var dataSet = [];
		for (var i = 0; i < maxRow; i++) {
			var row = Ti.UI.createTableViewRow({
				backgroundColor: 'transparent',
				// backgroundImage: '/images/handheld/bookShelf.png',
				// selectedBackgroundColor: 'transparent',
				height: 40,
				id: data[i]._id,
				info: data[i]
			});
			var labelChapter = Ti.UI.createLabel({
				text: data[i].chapter + ':',
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
					myGlobal.addFavorite(favoriteButton.itemId, 0, e.data, function() {
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
				// console.log(JSON.parse(user.result));
				myGlobal.addFavorite(favoriteButton.itemId, 0, JSON.parse(user.result), function() {
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
	myGlobal.getAjax('/getStory', {
		'id': item.itemId,
		'userId': Titanium.Facebook.getUid()
	},
	function(response) {
		var json = JSON.parse(response);
		Ti.API.info(JSON.stringify(json));
		if (json.favorite) {
			self.rightNavButton = favoritedButton;
		} else {
			self.rightNavButton = favoriteButton; 
		}
		var listChapters = json.data.chapters;
		var tbl_data = setRowData(listChapters, myGlobal.MAX_DISPLAY_ROW);
		//header with search
		var createCustomView = function() {
			var view = Ti.UI.createView({
				backgroundColor: '#222',
				height: 40,
				backgroundImage: '/images/handheld/searchBackground.png',
				backgroundColor: 'transparent',
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
						listChapters.sort(myGlobal.dynamicSort('_id', 1));
						Ti.API.info(JSON.stringify(listChapters));
						break;
					case 1:
						listChapters.sort(myGlobal.dynamicSort('_id', -1));
						break;
				}
				table.setData([]);
				tbl_data = setRowData(listChapters, myGlobal.MAX_DISPLAY_ROW);
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
	    // backgroundImage: '/images/handheld/bookShelf.png',
	    // separatorColor: 'transparent',
	    headerView: createCustomView(),
		});
		myGlobal.dynamicLoad(table, listChapters);
		self.add(table);
		tab.containingTab.open(self);
	});
};

module.exports = Story;
