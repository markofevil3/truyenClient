var Util = require('etc/Util');
function Support(tab) {
	var HintTextArea = require('etc/HintTextArea');
	var self = Ti.UI.createWindow({
		title: 'Yêu Cầu Truyện',
		backgroundColor: '#fff'
	});
	self.leftNavButton = Util.backButton(self);
	self.barImage = '/images/handheld/top.png';
	var labelSubject = Ti.UI.createLabel({
		text: 'Để yêu cầu truyện, bạn nên cung cấp đầy đủ thông tin về truyện: tên truyện, tác giả, quốc gia, link truyện(nếu có) ...',
		color: '#fff',
		font: { fontSize: 15 * Util.RATIO, fontStyle: 'italic' },
		textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
	});
	var textArea = HintTextArea.createHintTextArea({
	  borderWidth: 2,
	  borderColor: '#bbb',
	  borderRadius: 5,
	  color: '#000',
	  font: {fontSize: 18 * Util.RATIO},
		keyboardType : Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType : Ti.UI.RETURNKEY_DEFAULT,
	  textAlign: 'left',
	  hintText : 'This is a hint text',
	  width: '95%',
	  height : 170 * Util.RATIO,
	  top: 10 * Util.RATIO,
	  suppressReturn: false
	});
	var sendButton = Ti.UI.createButton({
		title:'Send', 
		width: 70 * Util.RATIO,
		height: 30 * Util.RATIO,
		top: 10 * Util.RATIO,
		font: {fontSize: 14 * Util.RATIO, fontWeight: 'bold'},
	});
	sendButton.addEventListener('singletap', function(e) {
		if (textArea.value.length > 20) {
			sendButton.enabled = false;
			Util.getAjax('/support', {
				content: textArea.value
			},
			function(response) {
				alert('Yêu cầu của bạn đã được gửi đi!');
				sendButton.enabled = true;
				textArea.value = '';
			});
		} else {
			alert('Nội dung quá ngắn!');
		}
		
	});
	
	var view = Ti.UI.createScrollView({
		width: '100%',
		height: '100%',
		backgroundColor: '#eabf8b',
		backgroundImage: '/images/handheld/setting_bg.png',
		layout: 'vertical'
	})
	view.addEventListener('singletap', function(e) {
		textArea.blur();
	});
	view.add(labelSubject);
	view.add(sendButton);
	view.add(textArea);
	self.add(view);
	tab.containingTab.open(self);
};

module.exports = Support;
