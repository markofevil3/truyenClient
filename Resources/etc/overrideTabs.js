/**
 * Override a tab group's tab bar on iOS.
 *
 * NOTE: Call this function on a tabGroup AFTER you have added all of your tabs to it! We'll look at the tabs that exist
 * to generate the overriding tab bar view. If your tabs change, call this function again and we'll update the display.
 *
 * @param tabGroup The tab group to override
 * @param backgroundOptions The options for the background view; use properties like backgroundColor, or backgroundImage.
 * @param selectedOptions The options for a selected tab button.
 * @param deselectedOptions The options for a deselected tab button.
 */
var Util = require('etc/Util');
function overrideTabs(tabGroup, backgroundOptions, selectedOptions, deselectedOptions) {
    // a bunch of our options need to default to 0 for everything to position correctly; we'll do it en mass:
    deselectedOptions.top = deselectedOptions.bottom
        = selectedOptions.top = selectedOptions.bottom
        = backgroundOptions.left = backgroundOptions.right = backgroundOptions.bottom = 0;

    // create the overriding tab bar using the passed in background options
    backgroundOptions.height = 50;
    var background = Ti.UI.createView(backgroundOptions);

    // pass all touch events through to the tabs beneath our background	
    background.touchEnabled = false;

    // create our individual tab buttons
    var increment = 100 / tabGroup.tabs.length;
    if (Util.isTablet()) {
    	deselectedOptions.width = selectedOptions.width = 100 / 9 + '%';
    } else {
    	deselectedOptions.width = selectedOptions.width = increment + '%';
    }
    for (var i = 0, l = tabGroup.tabs.length; i < l; i++) {
        var tab = tabGroup.tabs[i];
        // position our views over the tab.
        if (Util.isTablet()) {
        	selectedOptions.left = deselectedOptions.left = (3 * 100 / 9 - 3) + ((100 / 9) + 3) * i + '%';
        } else {
        	selectedOptions.left = deselectedOptions.left = increment * i + '%';
        }
        // customize the selected and deselected based on properties in the tab.
        selectedOptions.title = deselectedOptions.title = tab.title;
        selectedOptions.image = deselectedOptions.image = tab.icon;
        selectedOptions.height = deselectedOptions.height = 50;
        if (tab.backgroundImage) {
            selectedOptions.backgroundImage = deselectedOptions.backgroundImage = tab.backgroundImage;
        }
        if (tab.selectedBackgroundImage) {
            selectedOptions.backgroundImage = tab.selectedBackgroundImage;
        }
        if (tab.deselectedBackgroundImage) {
            deselectedOptions.backgroundImage = tab.deselectedBackgroundImage;
        }
        selectedOptions.visible = false;
        background.add(tab.deselected = Ti.UI.createButton(deselectedOptions));
        background.add(tab.selected = Ti.UI.createButton(selectedOptions));
        Titanium.Gesture.addEventListener('orientationchange', function(e) {
			    switch (Titanium.Gesture.orientation) {
		        case Titanium.UI.LANDSCAPE_LEFT:
		        case Titanium.UI.LANDSCAPE_RIGHT:
		            background.width = '100%';
		        break;
		        case Titanium.UI.PORTRAIT:
		        case Titanium.UI.UPSIDE_PORTRAIT:
							background.width = '100%';  
		        break;
			    }
				});
    }

    // update the tab group, removing any old overrides
    if (tabGroup.overrideTabs) {
        tabGroup.remove(tabGroup.overrideTabs);
    }
    else {
        tabGroup.addEventListener('focus', overrideFocusTab);
    }

    tabGroup.add(background);
    tabGroup.overrideTabs = background;
}

function overrideFocusTab(evt) {
    if (evt.previousIndex >= 0) {
        evt.source.tabs[evt.previousIndex].selected.visible = false;
    }
    evt.tab.selected.visible = true;
}