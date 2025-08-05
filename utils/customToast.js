/**
 * 自定义Toast工具类
 * 提供美观的提示框，替代uni.showToast
 */

class CustomToast {
  constructor() {
    this.toastInstance = null;
  }

  /**
   * 初始化Toast实例
   * 需要在页面中引入CustomToast组件并通过ref获取实例
   */
  init(instance) {
    this.toastInstance = instance;
  }

  /**
   * 显示成功提示
   * @param {string} message - 提示消息
   * @param {number} duration - 显示时长，默认2000ms
   */
  success(message, duration = 2000) {
    if (this.toastInstance) {
      this.toastInstance.show({
        message,
        type: 'success',
        duration
      });
    } else {
      // 降级到系统Toast
      uni.showToast({
        title: message,
        icon: 'success',
        duration
      });
    }
  }

  /**
   * 显示错误提示
   * @param {string} message - 提示消息
   * @param {number} duration - 显示时长，默认2000ms
   */
  error(message, duration = 2000) {
    if (this.toastInstance) {
      this.toastInstance.show({
        message,
        type: 'error',
        duration
      });
    } else {
      // 降级到系统Toast
      uni.showToast({
        title: message,
        icon: 'none',
        duration
      });
    }
  }

  /**
   * 显示信息提示
   * @param {string} message - 提示消息
   * @param {number} duration - 显示时长，默认2000ms
   */
  info(message, duration = 2000) {
    if (this.toastInstance) {
      this.toastInstance.show({
        message,
        type: 'info',
        duration
      });
    } else {
      // 降级到系统Toast
      uni.showToast({
        title: message,
        icon: 'none',
        duration
      });
    }
  }

  /**
   * 显示普通提示（兼容原有调用方式）
   * @param {string|Object} options - 提示选项
   */
  show(options) {
    let config = {};
    
    if (typeof options === 'string') {
      config = {
        message: options,
        type: 'success',
        duration: 2000
      };
    } else {
      config = {
        message: options.title || options.message || '操作成功',
        type: this.getTypeFromIcon(options.icon) || 'success',
        duration: options.duration || 2000
      };
    }

    if (this.toastInstance) {
      this.toastInstance.show(config);
    } else {
      // 降级到系统Toast
      uni.showToast({
        title: config.message,
        icon: config.type === 'success' ? 'success' : 'none',
        duration: config.duration
      });
    }
  }

  /**
   * 根据uni.showToast的icon参数转换为自定义类型
   * @param {string} icon - uni.showToast的icon参数
   * @returns {string} 自定义Toast类型
   */
  getTypeFromIcon(icon) {
    switch (icon) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'none':
      default:
        return 'info';
    }
  }

  /**
   * 隐藏Toast
   */
  hide() {
    if (this.toastInstance) {
      this.toastInstance.hide();
    }
  }
}

// 创建全局实例
const customToast = new CustomToast();

// 扩展uni对象，添加自定义Toast方法
if (typeof uni !== 'undefined') {
  // 保存原始方法
  uni._showToast = uni.showToast;
  
  // 重写showToast方法
  uni.showToast = function(options) {
    // 特殊处理购物车相关的成功提示
    if (options.title && options.title.includes('购物车') && options.title.includes('更新')) {
      customToast.success('数量已更新 ✨', options.duration);
      return;
    }
    
    if (options.title && options.title.includes('已加入购物车')) {
      customToast.success('已加入购物车 🛒', options.duration);
      return;
    }
    
    if (options.title && options.title.includes('删除成功')) {
      customToast.success('删除成功 🗑️', options.duration);
      return;
    }
    
    // 其他情况使用自定义Toast
    customToast.show(options);
  };
}

export default customToast;
