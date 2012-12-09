var Util = require('etc/Util');
function StoryList(tab) {
	var MAX_DISPLAY_ROW = 4;
	var search;
	var listStory;
	function getTypeText(type) {
		if (type == 1) {
			return 'Truyện ngắn';
		} else {
			return 'Truyện dài';
		}
	};
	function setRowData(data) {
		var dataSet = [];
		for (var i = 0; i < data.length; i++) {
			var row = Ti.UI.createTableViewRow({
				height: 100 * Util.RATIO,
				backgroundColor: 'transparent',
				backgroundImage: '/images/handheld/dark-background.png',
				// selectedBackgroundColor: 'transparent',
				name: data[i].title,
				id: data[i]._id,
				type: data[i].type
			});
			var bookStyle = 4;
			if (data[i].type == 0) {
				bookStyle = 5;
			}
			var bookView = Ti.UI.createView({
				backgroundImage: '/images/handheld/book' + bookStyle + '.png',
				backgroundColor: 'transparent',
				width: '19%',
				height: '90%',
				left: '1%'
			});
			var cover = Ti.UI.createImageView({
				image: Util.SERVER + '/images/story/sample/cover.jpg',
				width: '100%',
				height: '92%',
			});
			bookView.add(cover);
			var detailsView = Ti.UI.createView({
				width: '75%',
				height: '100%',
				left: '24%',
				layout: 'vertical',
			})
			var labelTitle = Ti.UI.createLabel({
				text: data[i].title,
				font: { fontWeight: 'bold', fontSize: 19 * Util.RATIO, fontFamily: 'Chalkboard SE' },
				left: 0,
				color: '#fff'
			});
			var labelAuthor = Ti.UI.createLabel({
				text: 'Tác giả: ' + data[i].author,
				font: { fontSize: 17 * Util.RATIO, fontStyle: 'italic', fontFamily: 'Chalkboard SE' },
				left: 0,
				color: '#fff'
			});
			var labeType = Ti.UI.createLabel({
				text: 'Thể loại: ' + getTypeText(data[i].title.type),
				font: { fontStyle: 'italic', fontSize: 15 * Util.RATIO, fontFamily: 'Chalkboard SE' },
				left: 0,
				color: '#fff'
			});
			detailsView.add(labelTitle);
			detailsView.add(labelAuthor);
			detailsView.add(labeType);
			row.add(bookView);
			row.add(detailsView);
			selectItem(row);
			dataSet.push(row);
		}
		return dataSet;
	};
	
	function selectItem(item) {
		item.addEventListener('click', function(e) {
			if (item.type == 0) {
				var Window = require('ui/common/StoryReading');
				new Window(item);
			}
			if (item.type == 1) {
				var Window = require('ui/common/Story');
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
			height: 40 * Util.RATIO,
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
		backgroundImage: '/images/handheld/setting_bg.png',
	});
	//change top bar image
	self.barImage = '/images/handheld/top.png';
	self.leftNavButton = Util.backButton(self);
	
	Util.getAjax('/storyList', {
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
				backgroundImage: '/images/handheld/setting_bg.png',
				backgroundColor: 'transparent',
				top: 0
			});
			search = Titanium.UI.createSearchBar({
				barColor:'transparent',
				backgroundImage: '/images/handheld/setting_bg.png',
				hintText:'search',
				width: '65%',
				left: 16 * Util.RATIO
			});
			search.addEventListener('change', function(e) {
				var results = [];
				var regexValue = new RegExp(Util.removeUTF8(e.value), 'i');
				for (var i in listStory) {
					if (regexValue.test(Util.removeUTF8(listStory[i].title))) {
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
				options:['A -> Z', 'Most View', 'Newest', 'Z -> A'],
				selectedIndex: 0,
				title:'SORT BY'
			};
			var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
			dialog.addEventListener('click',function(e) {
				switch (e.index) {
					case 0:
						listStory.sort(Util.dynamicSort('title', 1));
						break;
					case 1:
						listStory.sort(Util.dynamicSort('numView', -1));
						break;
					case 2:
						listStory.sort(Util.dynamicSort('datePost', -1));
						break;
					case 3:
						listStory.sort(Util.dynamicSort('title', -1));
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
			var tabBar = Titanium.UI.iOS.createTabbedBar({
				labels:['Tất cả', 'Tr.ngắn', 'Tr.dài'],
				index:0,
				backgroundColor:'#c69656',
				style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
				color: '#fff',
				font: { fontWeight: 'bold' }
			});
			var cloneListStory = listStory.slice(0);
			tabBar.addEventListener('click', function(e) {
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
				table.setData([]);
				table.setData(setRowData(listStory.slice(0, MAX_DISPLAY_ROW)));
			});
			self.setTitleControl(tabBar);
			//### end filter
			view.add(search);
			view.add(sortButton);
			return view;
		};
		
		var table = Titanium.UI.createTableView({
	    data:tbl_data,
	    // backgroundImage: '/images/handheld/setting_bg.png',
	    backgroundColor: 'transparent',
	    separatorColor: '#aa7845',
	    top: 40
		});
		dynamicLoad(table);
		self.add(createCustomView());
		self.add(table);
		tab.containingTab.open(self);
	});
};

module.exports = StoryList;
