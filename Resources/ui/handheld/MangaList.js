function MangaList(tab) {
	
	function setRowData(data) {
		var dataSet = [];
		for (var i = 0; i < Math.round(data.length / 3); i++) {
			var row = Ti.UI.createTableViewRow({
				height:120,
				backgroundColor: 'transparent',
				backgroundImage: '/images/bookShelf.png',
				selectedBackgroundColor: 'transparent',
				name: data[i].title,
				chapter: data[i].chapter
			});
			for (var j = 0; j < 3; j++) {
				var index = (i * 3) + j;
				if (data[index]) {
					var image = Ti.UI.createImageView({
						image: myGlobal.SERVER + data[index].cover,
						width: '21%',
						height: '70%',
						left: 10 + (j * (21 + 8)) + '%',
						title: data[index].title,
						id: data[index]._id,
					});
					selectItem(image);
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
	self.barImage = '/images/corkboard.jpg';
	//change back button style
	var backbutton = Titanium.UI.createButton({
		title:'back', 
		// backgroundImage:'/images/corkboard.jpg',
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
				backgroundImage: '/images/searchBackground.png',
				backgroundColor: 'transparent',
			});
			var search = Titanium.UI.createSearchBar({
				barColor:'transparent',
				backgroundImage: '/images/search.png',
				hintText:'search',
				width: '70%',
				left: 16
			});
			search.addEventListener('change', function(e) {
				var results = [];
				var regexValue = new RegExp(e.value, 'i');
				for (var i in listManga) {
					if (regexValue.test(listManga[i].title)) {
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
				backgroundImage: '/images/sort.png',
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
	    backgroundImage: '/images/bookShelf.png',
	    separatorColor: 'transparent',
	    headerView: createCustomView(),
		});
	
		self.add(table);
		tab.containingTab.open(self);
	});
};

module.exports = MangaList;
