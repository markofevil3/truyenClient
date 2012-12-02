Ti.include('etc/overrideTabs.js');
function ApplicationTabGroup(Window) {
	//create module instance
	var self = Ti.UI.createTabGroup({
	});
	
	//create app tabs
	var home = new Window('Home');
	var favorites = new Window('Favorites');
	var	settings = new Window('Settings');
	
	var homeTab = Ti.UI.createTab({
		// title: 'Home',
		icon: '/images/handheld/home.png',
		window: home
	});
	home.containingTab = homeTab;
	
	var favoritesTab = Ti.UI.createTab({
		// title: 'Favorites',
		icon: '/images/handheld/favorite.png',
		window: favorites
	});
	favorites.containingTab = favoritesTab;
	
	var settingsTab = Ti.UI.createTab({
		// title: 'Settings',
		icon: '/images/handheld/setting.png',
		window: settings
	});
	settings.containingTab = settingsTab;
	
	self.addTab(homeTab);
	self.addTab(favoritesTab);
	self.addTab(settingsTab);
	overrideTabs(
    self, // The tab group
    { backgroundImage: '/images/handheld/top.png' }, // View parameters for the background
    { backgroundImage: '/images/handheld/top_active.png', backgroundColor: 'transparent', color: '#000', style: 0 }, // View parameters for selected tabs 
    { backgroundImage: '/images/handheld/top.png', backgroundColor: 'transparent', color: '#888', style: 0 } // View parameters for deselected tabs
	);
	return self;
};

module.exports = ApplicationTabGroup;
