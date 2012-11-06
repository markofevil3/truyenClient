function StoryList(tab) {
	
	function setRowData(data) {
		var dataSet = [];
		for (var i = 0; i < data.length; i++) {
			var row = Ti.UI.createTableViewRow({
				height: 100,
				// backgroundColor: 'transparent',
				// backgroundImage: '/images/handheld/bookShelf.png',
				// selectedBackgroundColor: 'transparent',
				name: data[i].title,
				itemId: data[i]._id,
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
	var self = Ti.UI.createWindow({
		title: 'Story',
	});
	var listStory;
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
		var tbl_data = setRowData(listStory);
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
				table.setData(setRowData(listStory));
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
	    // separatorColor: 'transparent',
	    headerView: createCustomView(),
		});
	
		self.add(table);
		tab.containingTab.open(self);
	});
};

module.exports = StoryList;
