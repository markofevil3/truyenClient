function ApplicationWindow(title) {
	var tab;
	switch (title) {
		case 'Home':
			Window = require('ui/tablet/Home');
			break;
		case 'Favorites':
			Window = require('ui/tablet/Favorites');
			break;
		case 'Settings':
			Window = require('ui/common/Setting');
			break;
	}
	var self = new Window();
	// var self = Ti.UI.createWindow({
		// title:title,
		// backgroundColor:'white'
	// });
// 	
	// var button = Ti.UI.createButton({
		// height:44,
		// width:200,
		// title:L('openWindow'),
		// top:20
	// });
	// self.add(button);
// 	
	// button.addEventListener('click', function() {
		// //containingTab attribute must be set by parent tab group on
		// //the window for this work
		// self.containingTab.open(Ti.UI.createWindow({
			// title: L('newWindow'),
			// backgroundColor: 'white'
		// }));
	// });
	
	return self;
};

module.exports = ApplicationWindow;
