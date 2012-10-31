if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	
	var Window;
	if (isTablet) {
		Window = require('ui/tablet/ApplicationWindow');
	}
	else {
		Window = require('ui/handheld/ApplicationWindow');
	}
	Titanium.UI.iPhone.statusBarStyle = Titanium.UI.iPhone.StatusBar.OPAQUE_BLACK;
	Titanium.Facebook.appid = "514307815249030";
	Titanium.Facebook.permissions = ['publish_stream', 'read_stream'];
	myGlobal = {};
	Ti.include('etc/helpers.js');
	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	new ApplicationTabGroup(Window).open({transition: Ti.UI.iPhone.AnimationStyle.CURL_UP});
})();

//CACHE REMOTE IMAGE
// var Utils = {
	// /* modified version of https://gist.github.com/1243697 
	// *  adds detection of file extension rather than hard-coding .jpg as in the original
	// */
	// _getExtension: function(fn) {
		// // from http://stackoverflow.com/a/680982/292947
		// var re = /(?:\.([^.]+))?$/;
		// var tmpext = re.exec(fn)[1];
		// return (tmpext) ? tmpext : '';
	// },
	// RemoteImage: function(a){
		// a = a || {};
		// var md5;
		// var needsToSave = false;
		// var savedFile;
		// if(a.image){
			// md5 = Ti.Utils.md5HexDigest(a.image)+this._getExtension(a.image);
			// savedFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,md5);
			// if(savedFile.exists()){
				// a.image = savedFile;
			// } else {
				// needsToSave = true;
			// }
		// }
		// var image = Ti.UI.createImageView(a);
		// if(needsToSave === true){
			// function saveImage(e){
				// image.removeEventListener('load',saveImage);
				// savedFile.write(
					// Ti.UI.createImageView({image:image.image,width:'auto',height:'auto'}).toImage()
				// );
			// }
			// image.addEventListener('load',saveImage);
		// }
		// return image;
	// }
// };
// // example usage
// var image = Utils.RemoteImage({
	// image:'http://farm7.staticflickr.com/6059/6262552465_e53bccbd52_z.jpg',
	// defaultImage:'KS_nav_ui.png',
	// width:300,
	// height:200,
	// top:20
// });
// win.add(image);
