// (function(){

function Util() {};

Util.SERVER = 'http://localhost:3000';
Util.MAX_DISPLAY_ROW = 30;
Util.RATIO = 1;

Util.isTablet = function() {
	var osname = Ti.Platform.osname,
	version = Ti.Platform.version,
	height = Ti.Platform.displayCaps.platformHeight,
	width = Ti.Platform.displayCaps.platformWidth;
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	return isTablet;
}

Util.backButton = function(window) {
	var backbutton = Titanium.UI.createButton({
		// title:'back', 
		backgroundImage:'/images/handheld/back.png',
		width:50,
		height:30
	});
	backbutton.addEventListener('click', function() {
		window.close();
	});
	return backbutton;
};

Util.getAjax = function(url, query, callback) {
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
	var fullUrl = Util.SERVER + url;
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

Util.dynamicSort = function(property, type) {
  return function (a,b) {
    return (a[property] < b[property]) ? (-1 * type) : (a[property] > b[property]) ? (1 * type) : 0;
  }
};

Util.dynamicLoad = function(tableView, data) {
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
		var nextRowIndex = lastRowIndex - 1 + Util.MAX_DISPLAY_ROW;
		if (nextRowIndex > data.length) {
			nextRowIndex = data.length;
		}
		for (var i = lastRowIndex - 1; i < nextRowIndex; i++) {
			var row = Ti.UI.createTableViewRow({
		    backgroundImage: '/images/handheld/bookShelf.png',
				height: 40,
				chapterId: data[i]._id,
				id: tableView.id,
				// id: data[i]._id,
				// info: data[i]
			});
			var labelChapter = Ti.UI.createLabel({
				text: 'Chapter ' + data[i].chapter,
				color: '#fff',
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				font: { fontWeight: 'bold', fontSize: 17, fontFamily: 'Chalkboard SE' }
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
		lastRowIndex += Util.MAX_DISPLAY_ROW;
		tableView.scrollToIndex(lastRowIndex - Util.MAX_DISPLAY_ROW,{animated:true,position:Ti.UI.iPhone.TableViewScrollPosition.BOTTOM});
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
			if (!updating && (total >= nearEnd) && lastRowIndex < data.length && tableView.data[0].rows[0].chapterId == data[0]._id 
			&& (tableView.data[0].rows[1] && tableView.data[0].rows[1].chapterId == data[1]._id)
			&& tableView.data[0].rows[lastRowIndex - 1].chapterId != data[data.length -1]._id && lastRowIndex >= Util.MAX_DISPLAY_ROW) {
				beginUpdate();
			}
		}
		lastDistance = distance;
	});
};

Util.addFavorite = function(itemId, itemType, user, callback) {
	Util.getAjax('/addFavorite', {
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

Util.removeUTF8 = function(str) {
  str = str.toLowerCase();  
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");  
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");  
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");  
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");  
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");  
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");  
  str = str.replace(/đ/g,"d");  
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-"); 
  str= str.replace(/-+-/g,"-");
  str= str.replace(/^\-+|\-+$/g,"");  
  return str;  
}

function isHash(obj) {
  return obj.constructor == Object;
};

// })();
module.exports = Util;