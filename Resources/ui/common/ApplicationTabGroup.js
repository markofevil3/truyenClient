function ApplicationTabGroup(Window) {
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	//create app tabs
	var home = new Window('Home');
	var favorites = new Window('Favorites');
	var	settings = new Window('Settings');
	
	var homeTab = Ti.UI.createTab({
		title: 'Home',
		icon: 'KS_nav_ui.png',
		window: home
	});
	home.containingTab = homeTab;
	
	var favoritesTab = Ti.UI.createTab({
		title: 'Favorites',
		icon: Titanium.UI.iPhone.SystemIcon.FAVORITES,
		window: favorites
	});
	favorites.containingTab = favoritesTab;
	
	var settingsTab = Ti.UI.createTab({
		title: 'Settings',
		icon: 'KS_nav_views.png',
		window: settings
	});
	settingsTab.containingTab = settings;
	
	self.addTab(homeTab);
	self.addTab(favoritesTab);
	self.addTab(settingsTab);
	
	return self;
};

module.exports = ApplicationTabGroup;
