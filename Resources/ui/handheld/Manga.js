function Manga(item, tab) {
	function setRowData(data, maxRow) {
		var dataSet = [];
		for (var i = 0; i < maxRow; i++) {
			var row = Ti.UI.createTableViewRow({
				backgroundColor: 'transparent',
				// backgroundImage: '/images/bookShelf.png',
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
		// backgroundImage:'/images/corkboard.jpg',
		// width:50,
		// height:20
		color: '#fff',
		height: 40,
		width: 40,
		backgroundColor: 'transparent',
		backgroundImage: '/images/favorites_dark.png',
	});
	var self = Ti.UI.createWindow({
		title: item.title,
		rightNavButton: favoriteButton
	});
	favoriteButton.addEventListener('click', function() {
		favoriteButton = Titanium.UI.createButton({
			text: 'favorite', 
			color: '#fff',
			height: 40,
			width: 40,
			backgroundColor: 'transparent',
			backgroundImage: '/images/favorites_color.png',
		});
		self.rightNavButton = favoriteButton;
	});
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
	
	myGlobal.getAjax('/manga', {
		'id': item.id
	},
	function(response) {
		var listChapters = JSON.parse(response).data.chapters;
		var tbl_data = setRowData(listChapters, myGlobal.MAX_DISPLAY_ROW);
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
				hintText:'search',
				backgroundImage: '/images/search.png',
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
				backgroundImage: '/images/sort.png',
			});
			var optionsDialogOpts = {
				options:['A -> Z', 'Z -> A'],
				// destructive:1,
				// cancel:2,
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
				// myGlobal.dynamicLoad(table, listChapters);
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
		// Ti.API.info(JSON.stringify(tbl_data));
		var table = Titanium.UI.createTableView({
	    data: tbl_data,
	    // backgroundImage: '/images/bookShelf.png',
	    // separatorColor: 'transparent',
	    headerView: createCustomView(),
		});
		myGlobal.dynamicLoad(table, listChapters);
		self.add(table);
		tab.containingTab.open(self);
	});
};

module.exports = Manga;
