function StoryList(tab) {
	var MAX_DISPLAY_ROW = 4;
	var search;
	var listStory;
	function setRowData(data) {
		var dataSet = [];
		for (var i = 0; i < data.length; i++) {
			var row = Ti.UI.createTableViewRow({
				height: 100,
				// backgroundColor: 'transparent',
				// backgroundImage: '/images/handheld/bookShelf.png',
				// selectedBackgroundColor: 'transparent',
				name: data[i].title,
				id: data[i]._id,
				type: data[i].type
			});
			var cover = Ti.UI.createImageView({
				image: myGlobal.SERVER + '/images/story/sample/cover.jpg',
				width: '22%',
				height: '95%',
				left: 0
			});
			var labelTitle = Ti.UI.createLabel({
				text: data[i].title,
				left: 70,
				top: 3,
				font: { fontWeight: 'bold', fontSize: 19 }
			});
			var labelAuthor = Ti.UI.createLabel({
				top: 26,
				left: 70,
				text: 'Tác giả: ' + data[i].author,
				font: { fontSize: 17, fontStyle: 'italic' }
			});
			row.add(cover);
			row.add(labelTitle);
			row.add(labelAuthor);
			selectItem(row);
			dataSet.push(row);
		}
		return dataSet;
	};
	
	function selectItem(item) {
		item.addEventListener('click', function(e) {
			if (item.type == 0) {
				var Window = require('ui/handheld/StoryReading');
				new Window(item);
			}
			if (item.type == 1) {
				var Window = require('ui/handheld/Story');
				new Window(item, tab);
			}
		});
	};
	
	function dynamicLoad(tableView) {
		var loadingIcon = Titanium.UI.createActivityIndicator({
			style:Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
		});
		var loadingView = Titanium.UI.createView();
		loadingView.add(loadingIcon);
		var loadingRow = Ti.UI.createTableViewRow({
			height: 40,
		});
		loadingRow.add(loadingView);
		var lastRowIndex = tableView.data[0].rowCount;
		var updating = false;
		
		function beginUpdate() {
			updating = true;
			tableView.appendRow(loadingRow);
			loadingIcon.show();
			setTimeout(endUpdate, 500);
		};
		function endUpdate() {
			updating = false;
			loadingIcon.hide();
			tableView.deleteRow(lastRowIndex - 1, { animationStyle:Titanium.UI.iPhone.RowAnimationStyle.NONE });
			var nextRowIndex = lastRowIndex - 1 + MAX_DISPLAY_ROW;
			if (nextRowIndex > listStory.length) {
				nextRowIndex = listStory.length;
			}
			var nextRowIndexs = listStory.slice(lastRowIndex - 1, nextRowIndex);
			var nextRows = setRowData(nextRowIndexs);
			for (var i = 0; i < nextRows.length; i++) {
				tableView.appendRow(nextRows[i], { animationStyle:Titanium.UI.iPhone.RowAnimationStyle.NONE });
			}
			lastRowIndex += MAX_DISPLAY_ROW;
			tableView.scrollToIndex(lastRowIndex - MAX_DISPLAY_ROW,{animated:true,position:Ti.UI.iPhone.TableViewScrollPosition.BOTTOM});
		};
		var lastDistance = 0;
		tableView.addEventListener('scroll',function(e) {
			lastRowIndex = tableView.data[0].rowCount;
			var offset = e.contentOffset.y;
			var height = e.size.height;
			var total = offset + height;
			var theEnd = e.contentSize.height;
			var distance = theEnd - total;
		
			if (distance < lastDistance) {
				var nearEnd = theEnd * 1;
				if (!updating && (total >= nearEnd) && (search.value == null || search.value == '') && lastRowIndex < listStory.length && lastRowIndex >= MAX_DISPLAY_ROW) {
					beginUpdate();
				}
			}
			lastDistance = distance;
		});
	};
	var self = Ti.UI.createWindow({
		title: 'Story',
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
	//end
	
	myGlobal.getAjax('/storyList', {
		'null': null
	},
	function(response) {
		listStory = JSON.parse(response).data;
		var tbl_data = setRowData(listStory.slice(0, MAX_DISPLAY_ROW));
		//header with search
		var createCustomView = function() {
			var view = Ti.UI.createView({
				backgroundColor: '#222',
				height: 40,
				backgroundImage: '/images/handheld/searchBackground.png',
				backgroundColor: 'transparent',
				top: 0
			});
			search = Titanium.UI.createSearchBar({
				barColor:'transparent',
				backgroundImage: '/images/handheld/search.png',
				hintText:'search',
				width: '65%',
				left: 16
			});
			search.addEventListener('change', function(e) {
				var results = [];
				var regexValue = new RegExp(myGlobal.removeUTF8(e.value), 'i');
				for (var i in listStory) {
					if (regexValue.test(myGlobal.removeUTF8(listStory[i].title))) {
						results.push(listStory[i]);
					}
				}
				tbl_data = setRowData(results);
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
				options:['A -> Z', 'Most View', 'Newest', 'Z -> A'],
				selectedIndex: 0,
				title:'SORT BY'
			};
			var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
			dialog.addEventListener('click',function(e) {
				switch (e.index) {
					case 0:
						listStory.sort(myGlobal.dynamicSort('title', 1));
						break;
					case 1:
						listStory.sort(myGlobal.dynamicSort('numView', -1));
						break;
					case 2:
						listStory.sort(myGlobal.dynamicSort('datePost', -1));
						break;
					case 3:
						listStory.sort(myGlobal.dynamicSort('title', -1));
						break;
				}
				table.setData([]);
				table.setData(setRowData(listStory.slice(0, MAX_DISPLAY_ROW)));
			});
			sortButton.addEventListener('singletap', function(e) {
				dialog.show();
			});
			//#### end sort
			//### filter
			var filterButton = Titanium.UI.createButton({
				text: 'filter',
				color: '#fff',
				height: 40,
				width: 40,
				right: 50,
				backgroundColor: 'transparent',
				backgroundImage: '/images/handheld/sort.png',
			});
			var optionsFilterDialogOpts = {
				options:['Tất Cả', 'Truyện Ngắn', 'Truyện Dài'],
				// selectedIndex: 0,
				title:'Thể Loại:',
				destructive: 0
			};
			var cloneListStory = listStory.slice(0);
			var filterDialog = Titanium.UI.createOptionDialog(optionsFilterDialogOpts);
			filterDialog.addEventListener('click',function(e) {
				switch (e.index) {
					case 0:
						listStory = cloneListStory.slice(0);
						break;
					case 1:
						listStory = [];
						for (var i = 0; i < cloneListStory.length; i++) {
							if (cloneListStory[i].type == 0) {
								listStory.push(cloneListStory[i]);
							}
						}
						break;
					case 2:
						listStory = [];
						for (var i = 0; i < cloneListStory.length; i++) {
							if (cloneListStory[i].type == 1) {
								listStory.push(cloneListStory[i]);
							}
						}
						break;
				}
				filterDialog.destructive = e.index;
				table.setData([]);
				table.setData(setRowData(listStory.slice(0, MAX_DISPLAY_ROW)));
				// dynamicLoad(table, listStory);
			});
			filterButton.addEventListener('singletap', function(e) {
				filterDialog.show();
			});
			//### end filter
			view.add(search);
			view.add(sortButton);
			view.add(filterButton);
			return view;
		};
		
		var table = Titanium.UI.createTableView({
	    data:tbl_data,
	    backgroundImage: '/images/handheld/bookShelf.png',
	    top: 40
		});
		dynamicLoad(table);
		self.add(createCustomView());
		self.add(table);
		tab.containingTab.open(self);
	});
};

module.exports = StoryList;
