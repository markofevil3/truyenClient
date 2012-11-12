function MangaList(tab) {
	
	function setRowData(data) {
		var dataSet = [];
		for (var i = 0; i < Math.round(data.length / 3); i++) {
			var row = Ti.UI.createTableViewRow({
				height:120,
				backgroundColor: 'transparent',
				backgroundImage: '/images/handheld/bookShelf.png',
				selectedBackgroundColor: 'transparent',
				name: data[i].title,
				chapter: data[i].chapter
			});
			for (var j = 0; j < 3; j++) {
				var index = (i * 3) + j;
				if (data[index]) {
					var image = Ti.UI.createImageView({
						image: myGlobal.SERVER + data[index].cover,
						width: '18%',
						height: '60%',
						bottom: 13,
						left: 12 + (j * (21 + 8)) + '%',
						title: data[index].title,
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
			var Window = require('ui/handheld/Manga');
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
	
	myGlobal.getAjax('/mangaList', {
		'null': null
	},
	function(response) {
		listManga = JSON.parse(response).data;
		var tbl_data = setRowData(listManga);
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
				backgroundImage: '/images/handheld/search.png',
				hintText:'search',
				width: '70%',
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
						listManga.sort(myGlobal.dynamicSort('title', 1));
						break;
					case 1:
						listManga.sort(myGlobal.dynamicSort('numView', -1));
						break;
					case 2:
						listManga.sort(myGlobal.dynamicSort('datePost', -1));
						break;
					case 3:
						listManga.sort(myGlobal.dynamicSort('title', -1));
						break;
				}
				table.setData([]);
				table.setData(setRowData(listManga));
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
	    headerView: createCustomView(),
		});
	
		self.add(table);
		tab.containingTab.open(self);
	});
};

module.exports = MangaList;
