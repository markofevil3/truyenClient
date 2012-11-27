var defaultHintTextColor = 'gray';

var filter = function (/*Object*/ source){
	var newObj = {};

	for(name in source){
		if(name != 'hintText' && name != 'hintTextColor'){
			newObj[name] = source[name];
		}
	}
	return newObj; // Object
};


/**
 * Initializes a TextArea with support for HintText on the iPhone
 * @param Dictionary with TextArea properties plus optional 'hintTextColor'
 * @returns Ti.UI.TextArea
 */
exports.createHintTextArea = function(/*object*/ properties){
	if(Ti.Platform.osname == 'android')
		return Ti.UI.createTextArea(properties);

	var newProperties = filter(properties);
	var textArea = Ti.UI.createTextArea(newProperties);
	textArea._hintText = properties.hintText;
	textArea._hintTextColor = properties.hintTextColor || defaultHintTextColor;
	textArea._color = textArea.getColor();

	if(textArea.value == null || textArea.value == ""){
		textArea.value = textArea._hintText;
	   	textArea.color = textArea._hintTextColor;
	}

	textArea.addEventListener('focus', function(e){
	    if(e.source.value == e.source._hintText){
	        e.source.value = "";
	        e.source.color = textArea._color;
	    }
	});
	textArea.addEventListener('blur', function(e){
	    if(e.source.value==""){
	        e.source.value = e.source._hintText;
	        e.source.color = textArea._hintTextColor;
	    }
	});

	return textArea;
}