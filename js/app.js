(function (window, Vue, undefined) {

	new Vue({
		el: '#app',
		data: {
			dataList: JSON.parse(window.localStorage.getItem('dataList')) || [],
			newTodo: '',
			beforeUpdate: {}
		},
		watch: {
			dataList: {
				handler(newArr) {
					window.localStorage.setItem('dataList', JSON.stringify(newArr));
				},
				deep: true
			}
		},
		methods: {
			// 添加一个todo
			addTodo() {
				if (!this.newTodo.trim()) return;
				this.dataList.push({
					content: this.newTodo.trim(),
					isFinish: false,
					id: this.dataList.length ? this.dataList.sort((a, b) => a.id - b.id)[this.dataList.length - 1]['id'] + 1 : 1
				});
				this.newTodo = ""
			},
			// 删除一个todo
			delTodo(index) {
				this.dataList.splice(index, 1)
			},
			// 删除所有的todo
			delAll() {
				this.dataList = this.dataList.filter(item => !item.isFinish)
			},
			//给当前li添加editing类名 显示编辑文本框
			showEdit(index) {
				this.$refs.show.forEach(item => { return item.classList.remove('editing'); });
				this.$refs.show[index].classList.add('editing');
				this.beforeUpdate = JSON.parse(JSON.stringify(this.dataList[index]));
			},
			//真正的编辑内容事件
			updeteTodo(index) {
				if (!this.dataList[index].content.trim()) return this.dataList.splice(index, 1);
				if (this.dataList[index].content !== this.beforeUpdate.content) this.dataList[index].isFinish = false;
				this.$refs.show[index].classList.remove('editing');
				this.beforeUpdate = {};
			}
		},
		//计算属性
		computed: {
			activeNum() {
				return this.dataList.filter(item => !item.isFinish).length
			},
			// 全选反选
			toggleAll: {
				get() {
					return this.dataList.every(item => item.isFinish);
				},
				set(val) {
					this.dataList.forEach(item => item.isFinish = val);
				}
			}
		},
		directives: {
			focus: {
				inserted(el) {
					el.focus();
				}
			}
		}

	})


})(window, Vue);
