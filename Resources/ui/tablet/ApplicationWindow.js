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
			Window = require('ui/tablet/Setting');
			break;
	}
	var self = new Window();
	return self;
};

module.exports = ApplicationWindow;
