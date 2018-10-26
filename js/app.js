(function (window, Vue, undefined) {
	new Vue({
		el: '#app',
		data: {
			dataList: JSON.parse(window.localStorage.getItem('dataList')) || [],
			newTodo: '',
			beforeUpdate: {},
			activeBtn: 1,
			showArr: []
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
				this.$refs.show.forEach(item => item.classList.remove('editing'));
				this.$refs.show[index].classList.add('editing');
				this.beforeUpdate = JSON.parse(JSON.stringify(this.dataList[index]));
			},
			//真正的编辑内容事件
			updeteTodo(index) {
				if (!this.dataList[index].content.trim()) return this.dataList.splice(index, 1);
				if (this.dataList[index].content !== this.beforeUpdate.content) this.dataList[index].isFinish = false;
				this.$refs.show[index].classList.remove('editing');
				this.beforeUpdate = {};
			},
			// esc还原内容
			backTodo(index) {
				this.dataList[index].content = this.beforeUpdate.content;
				this.$refs.show[index].classList.remove('editing');
				this.beforeUpdate = {};
			},
			// 哈希change事件
			hashchange() {
				switch (window.location.hash) {
					case '':
					case '#/':
						this.showAll();
						this.activeBtn = 1;
						break;
					case '#/active':
						this.activeAll(false);
						this.activeBtn = 2;
						break;
					case '#/completed':
						this.activeAll(true);
						this.activeBtn = 3;
						break;
				}
			},
			// 显示所有 创建一个显示的数组
			showAll () {
				this.showArr = this.dataList.map(() => true)
			},
			// 修改显示的数组使用 就是显示活动的
			activeAll(boo) {
				this.showArr = this.dataList.map(item => item.isFinish === boo);
				// 在切换到active等页面显示列表的时候 使用全部删除同样需要判断当前还是否有可显示的数据 没有就跳转
				if (this.dataList.every(item => item.isFinish === !boo)) return window.location.hash = '#/';
			}
		},
		watch: {
			dataList: {
				handler(newArr) {
					window.localStorage.setItem('dataList', JSON.stringify(newArr));
					// 判断当前显示的三大列表之一是否有可以显示数据  如果没有 跳转至所有显示
					this.hashchange();
				},
				deep: true
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
		// 自定义指令
		directives: {
			focus: {
				inserted(el) {
					el.focus();
				}
			}
		},
		// 生命周期 在最一开始就执行 这个钩子函数在创建了数据后还没有开始渲染页面时触发 如data methods装载在vue实例后就执行
		created() {
			this.hashchange();
			window.onhashchange = () => {
				this.hashchange();
			}
		}
	})
})(window, Vue);
