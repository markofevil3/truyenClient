var Util = require('etc/Util');
function MangaList(tab) {
	var MAX_DISPLAY_ROW = 5;
	function setRowData(data) {
		var dataSet = [];
		for (var i = 0; i < Math.round(data.length / 3); i++) {
			var row = Ti.UI.createTableViewRow({
				height:120,
				backgroundColor: 'transparent',
				backgroundImage: '/images/handheld/bookShelf.png',
				selectedBackgroundColor: 'transparent',
			});
			for (var j = 0; j < 3; j++) {
				var index = (i * 3) + j;
				if (data[index]) {
					var image = Ti.UI.createImageView({
						image: Util.SERVER + data[index].folder + '/cover.jpg',
						width: '18%',
						height: '60%',
						bottom: 13,
						left: 12 + (j * (21 + 8)) + '%',
						name: data[index].title,
						id: data[index]._id,
						zIndex: 2,
					});
					var nameTag = Ti.UI.createLabel({
						text: data[index].title,
						color: '#fff',
						// backgroundImage: '/images/handheld/bg_paper_tournament.png',
						height: 29,
						width: 85,
						font: { fontSize: 13, fontWeight: 'bold' },
						textAlign: 'center',
						top: 3,
						horizontalWrap: true,
						left: 8 + (j * (21 + 8)) + '%',
						zIndex: 3,
						name: data[index].title,
						id: data[index]._id,
					});
					var nameTagBackground = Ti.UI.createImageView({
						image: '/images/handheld/bg_paper_tournament.png',
						height: 40,
						top: 0,
						width: 90,
						left: 7.5 + (j * (21 + 8)) + '%',
						zIndex: 2
					});
					var shadow = Ti.UI.createView({
						width: '18%',
						height: '70%',
						bottom: 10,
						left: 13 + (j * (21 + 8)) + '%',
						zIndex: 1,
				    backgroundGradient: {
			        type: 'linear',
			        startPoint: { x: '50%', y: '100%' },
			        endPoint: { x: '50%', y: '0%' },
			        colors: [ { color: '#000', offset: 0.0}, { color: '#999999', offset: 1.0 } ],
				    },
					});
					selectItem(image);
					selectItem(nameTag);
					// row.add(shadow);
					row.add(nameTagBackground);
					row.add(nameTag);
					row.add(image);
				}
			}
			dataSet.push(row);
		}
		return dataSet;
	};
	
	function selectItem(item) {
		item.addEventListener('click', function(e) {
			var Window = require('ui/tablet/Manga');
			new Window(item, tab);
		});
	};
	var self = Ti.UI.createWindow({
		title: 'Manga',
	});
	var listManga;
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
	
	Util.getAjax('/mangaList', {
		'null': null
	},
	function(response) {
		listManga = JSON.parse(response).data;
		var tbl_data = setRowData(listManga.slice(0, MAX_DISPLAY_ROW * 3));
		//header with search
		var search;
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
				width: '70%',
				left: 16
			});
			search.addEventListener('change', function(e) {
				var results = [];
				var regexValue = new RegExp(Util.removeUTF8(e.value), 'i');
				for (var i in listManga) {
					if (regexValue.test(Util.removeUTF8(listManga[i].title))) {
						results.push(listManga[i]);
					}
				}
				tbl_data = setRowData(results);
				table.setData([]);
				table.setData(tbl_data);
				// Ti.API.info(JSON.stringify(results));
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
				// destructive:1,
				// cancel:2,
				selectedIndex: 0,
				title:'SORT BY'
			};
			var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
			dialog.addEventListener('click',function(e) {
				switch (e.index) {
					case 0:
						listManga.sort(Util.dynamicSort('title', 1));
						break;
					case 1:
						listManga.sort(Util.dynamicSort('numView', -1));
						break;
					case 2:
						listManga.sort(Util.dynamicSort('datePost', -1));
						break;
					case 3:
						listManga.sort(Util.dynamicSort('title', -1));
						break;
				}
				table.setData([]);
				table.setData(setRowData(listManga.slice(0, MAX_DISPLAY_ROW * 3)));
			});
			sortButton.addEventListener('singletap', function(e) {
				dialog.show();
			});
			//#### end sort
			view.add(search);
			view.add(sortButton);
			return view;
		};
		
		var table = Titanium.UI.createTableView({
	    data:tbl_data,
	    backgroundImage: '/images/handheld/bookShelf.png',
	    separatorColor: 'transparent',
	    style: Ti.UI.iPhone.TableViewStyle.PLAIN,
	    separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
	    top: 40
		});
		
		function dynamicLoad(tableView, data) {
			var loadingIcon = Titanium.UI.createActivityIndicator({
				style:Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
			});
			var loadingView = Titanium.UI.createView({
				backgroundColor: 'transparent',
				backgroundImage: 'NONE'
			});
			loadingView.add(loadingIcon);
			var loadingRow = Ti.UI.createTableViewRow({
				height: 40,
				backgroundColor: 'transparent',
				backgroundImage: 'NONE'
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
				if (nextRowIndex > Math.round(data.length / 3)) {
					nextRowIndex = Math.round(data.length / 3);
				}
				var nextRowIndexs = data.slice((lastRowIndex - 1) * 3, nextRowIndex * 3);
				var nextRows = setRowData(nextRowIndexs);
				for (var i = 0; i < nextRows.length; i ++) {
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
				console.log('b');
				if (distance < lastDistance) {
					var nearEnd = theEnd * 1;
					if (!updating && (total >= nearEnd) && lastRowIndex < Math.round(data.length / 3) && lastRowIndex >= MAX_DISPLAY_ROW && (search.value == null || search.value == '')) {
						beginUpdate();
					}
				}
				lastDistance = distance;
			});
		};
		dynamicLoad(table, listManga);
		self.add(createCustomView());
		self.add(table);
		tab.containingTab.open(self);
	});
};

module.exports = MangaList;
