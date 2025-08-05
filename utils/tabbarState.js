// Tabbar状态管理
class TabbarState {
	constructor() {
		this.currentTab = 0;
		this.listeners = [];
	}
	
	// 设置当前tab
	setCurrentTab(index) {
		if (this.currentTab !== index) {
			this.currentTab = index;
			this.notifyListeners();
		}
	}
	
	// 获取当前tab
	getCurrentTab() {
		return this.currentTab;
	}
	
	// 添加监听器
	addListener(callback) {
		this.listeners.push(callback);
	}
	
	// 移除监听器
	removeListener(callback) {
		const index = this.listeners.indexOf(callback);
		if (index > -1) {
			this.listeners.splice(index, 1);
		}
	}
	
	// 通知所有监听器
	notifyListeners() {
		this.listeners.forEach(callback => {
			callback(this.currentTab);
		});
	}
}

// 创建全局实例
const tabbarState = new TabbarState();

export default tabbarState;
