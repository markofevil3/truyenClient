(function(){

myGlobal.SERVER = 'http://localhost:3000';
myGlobal.MAX_DISPLAY_ROW = 10;

myGlobal.getAjax = function(url, query, callback) {
	var xhr = Ti.Network.createHTTPClient({
    onload: function(e) {
	    Ti.API.debug(this.responseText);
	    if (callback) {
	      callback(this.responseText);
	    }
    },
    onerror: function(e) {
			Ti.API.debug(e.error);
    },
    timeout: 10000
	});
	var fullUrl = myGlobal.SERVER + url;
	if (query) {
    if (isHash(query)) {
      var isFirstParameter = true;
      for (var key in query) {
        fullUrl += (isFirstParameter ? '?' : '&');
        isFirstParameter = false;

        fullUrl += encodeURIComponent(key) + '=' + encodeURIComponent(query[key]);
      }
    } else if (query.length > 0) {
      fullUrl += '?' + query;
    }
  }
  
  fullUrl += '&timestamp=' + Date.now();
	xhr.open("GET", fullUrl);
	xhr.send();
};

myGlobal.dynamicSort = function(property, type) {
  return function (a,b) {
    return (a[property] < b[property]) ? (-1 * type) : (a[property] > b[property]) ? (1 * type) : 0;
  }
};

myGlobal.dynamicLoad = function(tableView, data) {
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
	function selectItem(item) {
		item.addEventListener('click', function(e) {
			var Window = require('ui/handheld/Reading');
			new Window(item);
		});
	};
	function endUpdate() {
		updating = false;
		loadingIcon.hide();
		tableView.deleteRow(lastRowIndex - 1, { animationStyle:Titanium.UI.iPhone.RowAnimationStyle.NONE });
		var nextRowIndex = lastRowIndex - 1 + myGlobal.MAX_DISPLAY_ROW;
		if (nextRowIndex > data.length) {
			nextRowIndex = data.length;
		}
		for (var i = lastRowIndex - 1; i < nextRowIndex; i++) {
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
			tableView.appendRow(row, { animationStyle:Titanium.UI.iPhone.RowAnimationStyle.NONE });
		}
		lastRowIndex += myGlobal.MAX_DISPLAY_ROW;
		tableView.scrollToIndex(lastRowIndex - myGlobal.MAX_DISPLAY_ROW,{animated:true,position:Ti.UI.iPhone.TableViewScrollPosition.BOTTOM});
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
			if (!updating && (total >= nearEnd) && lastRowIndex < data.length && tableView.data[0].rows[0].id == data[0]._id 
			&& tableView.data[0].rows[1].id == data[1]._id
			&& tableView.data[0].rows[lastRowIndex - 1].id != data[data.length -1]._id && lastRowIndex >= myGlobal.MAX_DISPLAY_ROW) {
				beginUpdate();
			}
		}
		lastDistance = distance;
	});
};

myGlobal.addFavorite = function(itemId, itemType, user, callback) {
	myGlobal.getAjax('/addFavorite', {
		userId: user.id,
		username: user.username,
		fullName: user.name,
		itemId: itemId,
		itemType: itemType,
	},
	function(response) {
		var data = JSON.parse(response).data;
		console.log(data);
		if (data == 'success') {
			callback();
		}
	});
};

function isHash(obj) {
  return obj.constructor == Object;
};

})();