(function(window) {
	var dom = document.createElement('div');
	window.sdk = {
		arrive: function(id, markup) {
			var ele = document.getElementById(id);
			dom.innerHTML = markup;
			var target = dom.firstChild;
			ele.parentNode.replaceChild(target, ele);
		}
	};
})(window);