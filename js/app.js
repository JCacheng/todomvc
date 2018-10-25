(function (window, Vue, undefined) {
	
	new Vue({
		el: '#app',
		data: {
			dataList: JSON.parse(window.localStorage.getItem('dataList')) || []
		},
		watch: {
			dataList: {
				handler (newArr) {
					window.localStorage.setItem('dataList', JSON.stringify(newArr));
				},
				deep: true
			}
		},
		directives: {
			focus: {
				inserted (el) {
					el.focus();
				}
			}
		}

	})


})(window, Vue);
