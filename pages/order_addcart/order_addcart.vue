<template>
  <view :style="colorStyle">
    <view class="shoppingCart copy-data" v-if="canShow">
      <!-- 购物车头部组件 -->
      <view class="header-bar">
        <view class="header-left"></view>
        <view class="title">购物车</view>
        <view class="edit-btn" v-if="cartList.valid.length > 0" @click="onEdit">{{ footerswitch ? '编辑' : '取消' }}</view>
        <view class="header-right" v-else></view>
      </view>

      <!-- 移除PromotionBar组件，已在ValidCartItems.vue中实现 -->

      <view
        v-if="(cartList.valid.length > 0 || cartList.invalid.length > 0) && canShow"
      >
        <!-- 有效商品列表组件 -->
        <valid-cart-items
          :cart-items="cartList.valid"
          :is-editing="footerswitch"
          :disabled-change-number="disabledChangeNumber"
          @checkbox-change="checkboxChange"
          @re-election="reElection"
          @sub-cart="subCart"
          @add-cart="addCart"
          @ipt-cart-num="iptCartNum"
          @blur-input="blurInput"
        />

        <!-- 失效商品列表组件 -->
        <invalid-cart-items
          :invalid-items="cartList.invalid"
          :is-hidden="goodsHidden"
          :is-loading="loadingInvalid"
          :loadend="loadend"
          :load-title="loadTitleInvalid"
          @toggle-open="goodsOpen"
          @clear="unsetCart"
        />
      </view>

      <!-- 空购物车提示组件 -->
      <empty-cart
        v-if="cartList.valid.length == 0 && cartList.invalid.length == 0 && canShow"
        :img-host="imgHost"
        :host-product="hostProduct"
      />
      
      <!-- 猜你喜欢区域 -->
      <view class="guess-you-like" v-if="cartList.valid.length > 0 || likeProducts.length > 0">
        <view class="divider"></view>
        <view class="section-title">—— 猜你喜欢 ——</view>
        <view class="product-grid">
          <view class="product-item" v-for="(item, index) in likeProducts" :key="index">
            <image :src="setDomain(item.image)" mode="aspectFill"></image>
            <view class="product-name">{{item.name}}</view>
          </view>
        </view>
      </view>



      <!-- 底部结算栏组件 -->
      <cart-footer
        v-if="cartList.valid.length > 0 && canShow"
        :is-all-select="!!isAllSelect"
        :selected-count="selectValue.length"
        :total-price="selectCountPrice"
        :is-editing="footerswitch"
        :is-diy-set="is_diy && is_diy_set"
        @checkbox-all-change="checkboxAllChange"
        @submit-order="subOrder"
        @submit-delete="subDel"
      />
    </view>

    <!-- 底部导航栏 -->
    <customTabbar />

    <!-- 自定义Toast组件 -->
    <CustomToast ref="customToast" />

    <!-- 其他组件保持不变 -->
    <productWindow
      :attr="attr"
      :isShow="1"
      :iSplus="1"
      :iScart="1"
      @myevent="onMyEvent"
      @ChangeAttr="ChangeAttr"
      @ChangeCartNum="ChangeCartNum"
      @attrVal="attrVal"
      @iptCartNum="iptCartNum"
      @goCat="reGoCat"
      id="product-window"
    ></productWindow>
    <!-- #ifdef MP -->
    <!-- <authorize :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize> -->
    <!-- #endif -->
    <view class="uni-p-b-98"></view>
  </view>
</template>

<script>
// 使用条件编译合并sysHeight声明
let sysHeight = 0;
// #ifdef APP-PLUS
sysHeight = uni.getSystemInfoSync().statusBarHeight + "px";
// #endif

import {
  GroupCartManager,
  getGroupCart,
  updateGroupCart,
  removeGroupCartItem,
  checkoutCart
} from "@/api/groupCart.js";
import { getProductHot } from "@/api/store.js";
import { handleListApi } from "@/utils/apiHelper.js";

import { mapGetters } from "vuex";
import recommend from "@/components/recommend/index.vue";
import productWindow from "@/components/productWindow/index.vue";
import customTabbar from "@/components/customTabbar/index.vue";
import colors from "@/mixins/color";

// 导入拆分的组件
import CartHeader from "@/components/cart/CartHeader.vue";
// 移除PromotionBar导入，已在ValidCartItems.vue中实现
import ValidCartItems from "@/components/cart/ValidCartItems.vue";
import InvalidCartItems from "@/components/cart/InvalidCartItems.vue";
import EmptyCart from "@/components/cart/EmptyCart.vue";
import CartFooter from "@/components/cart/CartFooter.vue";
import CustomToast from "@/components/common/CustomToast.vue";
import customToast from '@/utils/customToast.js';
import { HTTP_REQUEST_URL } from '@/config/app.js';

export default {
  components: {
    recommend,
    productWindow,
    customTabbar,
    CartHeader,
    // 移除PromotionBar组件注册，已在ValidCartItems.vue中实现
    ValidCartItems,
    InvalidCartItems,
    EmptyCart,
    CartFooter,
    CustomToast
  },
  mixins: [colors],
  data() {
    return {
      imgHost: this.$VUE_APP_API_URL,
      cartList: { valid: [], invalid: [] },
      isAllSelect: false,
      selectValue: [],
      likeProducts: [],
      selectCountPrice: 0.00, // 确保初始值为数字
      isAuto: false,
      isShowAuth: false,
      goodsHidden: true,
      footerswitch: true,
      isSubmittingOrder: false, // 防止重复提交订单
      hostProduct: [],
      attr: {
        cartAttr: false,
        productSelect: {}
      },
      isShow: false,
      loadend: false,
      loadTitle: "",
      loading: false,
      loadTitleInvalid: "",
      loadingInvalid: false,
      loadendInvalid: false,
      canShow: false,
      disabledChangeNumber: false,
      is_diy: false,
      is_diy_set: false,
      sysHeight: sysHeight
    };
  },
  computed: mapGetters(["isLogin"]),
  onLoad(options) {
    if (options.is_diy) {
      this.is_diy = options.is_diy;
      this.is_diy_set = options.is_diy_set;
    }
  },
  mounted() {
    // 初始化自定义Toast
    if (this.$refs.customToast) {
      customToast.init(this.$refs.customToast);
    }
  },
  onShow() {
    if (this.isLogin) {
      this.getCartList();
      this.getHostProduct();
      this.loadLikeProducts();
      this.canShow = true;
    } else {
      this.cartList = { valid: [], invalid: [] };
      this.hostProduct = [];
      this.canShow = true;
    }
    this.disabledChangeNumber = false;
    this.selectValue = [];
    this.selectCountPrice = '0.00'; // 使用字符串格式，确保显示两位小数
    this.isAllSelect = false;
  },
  methods: {
    // 授权关闭
    authColse(e) {
      this.isShowAuth = e;
    },
    newDataStatus(val, num) {
      this.is_diy = val;
      this.is_diy_set = num;
    },
    // 修改购物车
    reGoCat() {
      this.disabledChangeNumber = true;
      let id = this.attr.productSelect.id;
      if (id) {
        this.attr.cartAttr = false;
        let cartId = this.attr.currentCartId;
        uni.showLoading({ title: this.$t(`请求中`) });
        changeCartNum(cartId, this.attr.productSelect.cart_num)
          .then(res => {
            uni.hideLoading();
            this.attr.cartAttr = false;
            this.getCartList();
            this.disabledChangeNumber = false;
          })
          .catch(err => {
            uni.hideLoading();
            this.disabledChangeNumber = false;
            this.$util.Tips({ title: err });
          });
      }
    },
    onMyEvent() {
      this.attr.cartAttr = false;
    },
    reElection(item) {
      this.getGoodsDetails(item);
    },
    /**
     * 获取产品详情
     *
     */
    getGoodsDetails(item) {
      this.attr.cartAttr = true;
      this.attr.productSelect = item;
      this.attr.productAttr = item.productInfo.attrInfo;
      this.attr.productSelect.cart_num = item.cart_num;
      this.attr.currentCartId = item.id;
      this.attr.productSelect.is_virtual = item.productInfo.virtual_type > 0;
      this.attr.productSelect.is_presale = item.productInfo.presale_start_time > 0;
      this.attr.productSelect.presale_start_time = item.productInfo.presale_start_time;
      this.attr.productSelect.presale_end_time = item.productInfo.presale_end_time;
      this.attr.productSelect.cart_num = 1;
      this.attr.productSelect.quota = item.productInfo.quota;
      this.attr.productSelect.quota_show = item.productInfo.quota_show;
      this.attr.productSelect.product_id = item.product_id;
      this.DefaultSelect();
    },
    /**
     * 属性变动赋值
     */
    ChangeAttr(res) {
      this.attr.productSelect.image = res.image;
      this.attr.productSelect.price = res.price;
      this.attr.productSelect.stock = res.stock;
      this.attr.productSelect.unique = res.unique;
      this.attr.productSelect.cart_num = 1;
      this.attr.productSelect.quota = res.quota;
      this.attr.productSelect.quota_show = res.quota_show;
      this.attr.productSelect.product_id = res.product_id;
      this.attr.productSelect.is_virtual = res.is_virtual;
    },
    /**
     * 默认选中属性
     */
    DefaultSelect() {
      let productAttr = this.attr.productAttr;
      let value = [];
      for (let i = 0; i < productAttr.length; i++) {
        for (let j = 0; j < productAttr[i].attr_values.length; j++) {
          if (j === 0) value.push(productAttr[i].attr_values[j]);
        }
      }
      for (let i = 0; i < this.attr.productAttr.length; i++) {
        this.$set(this.attr.productAttr[i], "index", 0);
      }
      //sort();排序函数:数字-英文-汉字；
      let productSelect = this.attr.productSelect;
      if (productSelect && productSelect.attrValue) {
        let attrValue = productSelect.attrValue.split(";");
        for (let i = 0; i < attrValue.length; i++) {
          if (attrValue[i]) {
            for (let j = 0; j < productAttr[i].attr_values.length; j++) {
              if (productAttr[i].attr_values[j] === attrValue[i]) {
                this.$set(this.attr.productAttr[i], "index", j);
              }
            }
          }
        }
      }
      let valueArr = [];
      for (let i = 0; i < productAttr.length; i++) {
        valueArr.push(productAttr[i].attr_values[productAttr[i].index]);
      }
      this.getProductSelect(valueArr);
    },
    attrVal(val) {
      let value = "";
      for (let i = 0; i < val.length; i++) {
        value += val[i] + ";";
      }
      return value;
    },
    /**
     * 购物车数量加和数量减
     */
    ChangeCartNum(changeValue) {
      //changeValue:是否 加|减
      //获取当前变动属性
      let productSelect = this.attr.productSelect;
      //如果没有属性,赋值给商品默认库存
      if (productSelect.product_id === undefined) return;
      let stock = productSelect.stock || 0;
      let num = productSelect.cart_num;
      let quotaShow = productSelect.quota_show || 0;
      let quota = productSelect.quota || 0;
      if (changeValue) {
        num++;
        if (quotaShow !== 0 && num > quota) {
          uni.showToast({
            title: this.$t(`每人限购`) + quotaShow + this.$t(`件`),
            icon: "none",
            duration: 2000
          });
          return;
        }
        if (num > stock) {
          uni.showToast({
            title: this.$t(`库存不足`),
            icon: "none",
            duration: 2000
          });
          return;
        }
      } else {
        num = num - 1 <= 0 ? 1 : num - 1;
      }
      productSelect.cart_num = num;
    },
    /**
     * 购物车手动填写
     */
    iptCartNum(e) {
      this.attr.productSelect.cart_num = e;
    },
    subDel(event) {
      let that = this;
      uni.showModal({
        title: that.$t(`提示`),
        content: that.$t(`确定要删除此商品吗？`),
        success: async function(res) {
          if (res.confirm) {
            uni.showLoading({ title: that.$t(`请求中`) });

            try {
              // 检查选中的商品
              console.log('准备删除的商品ID:', that.selectValue);

              if (that.selectValue.length === 0) {
                uni.hideLoading();
                that.$util.Tips({ title: '请选择要删除的商品' });
                return;
              }

              // 批量删除选中的商品，使用cart_ids
              const response = await GroupCartManager.removeItem(that.selectValue);
              console.log('删除API响应:', response);

              const result = GroupCartManager.handleResponse(response);
              console.log('删除处理结果:', result);

              uni.hideLoading();

              if (result.success) {
                that.$util.Tips({ title: result.message || that.$t(`删除成功`) });
                that.getCartList();
                that.$store.dispatch("updateCartNum");
              } else {
                that.$util.Tips({ title: result.message || '删除失败' });
              }

            } catch (error) {
              uni.hideLoading();
              console.error('删除商品失败:', error);

              // 尝试从错误中提取更详细的信息
              let errorMsg = '删除失败，请重试';
              if (error && error.data && error.data.msg) {
                errorMsg = error.data.msg;
              } else if (error && error.msg) {
                errorMsg = error.msg;
              } else if (typeof error === 'string') {
                errorMsg = error;
              }

              that.$util.Tips({ title: errorMsg });
            }
          }
        }
      });
    },
    getSelectValueProductId() {
      let productId = [];
      for (let i = 0; i < this.cartList.valid.length; i++) {
        if (this.cartList.valid[i].checked) {
          productId.push(this.cartList.valid[i].product_id);
        }
      }
      return productId;
    },

    async subOrder(event) {
      let that = this;

      // 防重复提交
      if (that.isSubmittingOrder) {
        return;
      }

      if (that.selectValue.length <= 0)
        return that.$util.Tips({ title: that.$t(`请选择要结算的商品`) });

      that.isSubmittingOrder = true;

      try {
        uni.showLoading({ title: '正在结算...' });

        // 调用购物车结算接口，明确传递coupon_id参数为0
        const response = await GroupCartManager.checkout(that.selectValue, 0);

        uni.hideLoading();

        // 检查响应结果
        const result = GroupCartManager.handleResponse(response);

        if (result.success && result.data && result.data.order_id) {
          // 结算成功，显示成功提示
          customToast.success('订单创建成功！');

          // 延迟跳转到支付页面或订单详情页面
          setTimeout(() => {
            uni.navigateTo({
              url: `/pages/users/order_details/index?order_id=${result.data.order_id}`
            });
          }, 1000);

          // 刷新购物车
          that.getCartList();
        } else {
          // 检查是否是购物车已清空的情况
          if (result.message && result.message.includes('购物车商品不存在')) {
            customToast.info('购物车已更新，请重新选择商品');
            that.getCartList(); // 刷新购物车
          } else {
            that.$util.Tips({ title: result.message || '结算失败' });
          }
        }
      } catch (error) {
        uni.hideLoading();

        // 检查是否是成功的响应被当作错误处理
        const result = GroupCartManager.handleResponse(error);
        if (result.success && result.data && result.data.order_id) {
          customToast.success('订单创建成功！');
          setTimeout(() => {
            uni.navigateTo({
              url: `/pages/users/order_details/index?order_id=${result.data.order_id}`
            });
          }, 1000);
          that.getCartList();
        } else {
          // 检查是否是购物车已清空的情况
          if (result.message && result.message.includes('购物车商品不存在')) {
            customToast.info('购物车已更新，请重新选择商品');
            that.getCartList(); // 刷新购物车
          } else {
            that.$util.Tips({ title: '结算失败，请重试' });
          }
        }
      } finally {
        // 重置提交状态
        setTimeout(() => {
          that.isSubmittingOrder = false;
        }, 2000); // 2秒后允许再次提交
      }
    },
    checkboxAllChange(event) {
      let value = event.detail.value;
      if (value.length > 0) {
        this.setAllSelectValue(true);
      } else {
        this.setAllSelectValue(false);
      }
    },
    // 修改setAllSelectValue方法
    setAllSelectValue(status) {
      let selectValue = [];
      let selectCountPrice = 0.00; // 确保初始值为数字
      if (status) {
        for (let i = 0; i < this.cartList.valid.length; i++) {
          let item = this.cartList.valid[i];
          if (item.attrStatus) {
            item.checked = true;
            selectValue.push(item.id);
            
            // 确保获取正确的价格
            let itemPrice = 0;
            if (item.combination && item.combination.group_price) {
              itemPrice = parseFloat(item.combination.group_price);
            } else if (item.combination && item.combination.price) {
              itemPrice = parseFloat(item.combination.price);
            } else if (item.productInfo && item.productInfo.price) {
              itemPrice = parseFloat(item.productInfo.price);
            } else if (typeof item.truePrice === 'number') {
              itemPrice = item.truePrice;
            } else if (typeof item.price === 'number' || typeof item.price === 'string') {
              itemPrice = parseFloat(item.price);
            }
            
            // 确保获取正确的数量
            let itemQuantity = parseInt(item.cart_num || 1);
            
            // 累加到总价中
            selectCountPrice += itemPrice * itemQuantity;
            
            console.log(`全选商品[${item.id}]价格: ${itemPrice}, 数量: ${itemQuantity}, 小计: ${itemPrice * itemQuantity}`);
          }
        }
      } else {
        for (let i = 0; i < this.cartList.valid.length; i++) {
          this.cartList.valid[i].checked = false;
        }
      }
      this.isAllSelect = status;
      this.selectValue = selectValue;
      this.selectCountPrice = parseFloat(selectCountPrice).toFixed(2); // 确保格式化为两位小数的字符串
      console.log('全选后计算的总价:', this.selectCountPrice);
    },
    checkboxChange(event) {
      let value = event.detail.value;
      let selectValue = [];
      let selectCountPrice = 0.00; // 确保初始值为数字
      
      for (let i = 0; i < this.cartList.valid.length; i++) {
        let item = this.cartList.valid[i];
        if (this.inArray(item.id, value)) {
          item.checked = true;
          selectValue.push(item.id);
          
          // 确保获取正确的价格
          let itemPrice = 0;
          if (item.combination && item.combination.group_price) {
            itemPrice = parseFloat(item.combination.group_price);
          } else if (item.combination && item.combination.price) {
            itemPrice = parseFloat(item.combination.price);
          } else if (item.productInfo && item.productInfo.price) {
            itemPrice = parseFloat(item.productInfo.price);
          } else if (typeof item.truePrice === 'number') {
            itemPrice = item.truePrice;
          } else if (typeof item.price === 'number' || typeof item.price === 'string') {
            itemPrice = parseFloat(item.price);
          }
          
          // 确保获取正确的数量
          let itemQuantity = parseInt(item.cart_num || 1);
          
          // 累加到总价中
          selectCountPrice += itemPrice * itemQuantity;
          
          console.log(`选中商品[${item.id}]价格: ${itemPrice}, 数量: ${itemQuantity}, 小计: ${itemPrice * itemQuantity}`);
        } else {
          item.checked = false;
        }
      }
      
      this.selectValue = selectValue;
      this.selectCountPrice = parseFloat(selectCountPrice).toFixed(2); // 确保格式化为两位小数的字符串
      console.log('选中商品后计算的总价:', this.selectCountPrice);
      
      let validLength = this.cartList.valid.length;
      let clength = this.cartList.valid.length;
      for (let i = 0; i < this.cartList.valid.length; i++) {
        if (!this.cartList.valid[i].attrStatus) {
          validLength--;
        }
      }
      if (selectValue.length < validLength) {
        this.isAllSelect = false;
      } else if (clength > 0) {
        this.isAllSelect = true;
      } else {
        this.isAllSelect = false;
      }
    },
    inArray(search, array) {
      for (let i in array) {
        if (array[i] == search) {
          return true;
        }
      }
      return false;
    },
    // 修改switchSelect方法
    switchSelect() {
      let that = this;
      if (that.footerswitch) {
        that.footerswitch = false;
        that.selectValue = [];
        let selectCountPrice = 0.00; // 确保初始值为数字
        for (let i = 0; i < that.cartList.valid.length; i++) {
          that.cartList.valid[i].checked = false;
        }
        that.isAllSelect = false;
        that.selectValue = [];
        that.selectCountPrice = parseFloat(selectCountPrice).toFixed(2); // 确保格式化为两位小数的字符串
      } else {
        that.footerswitch = true;
      }
    },
    /**
     * 购物车手动填写
     */
    iptCartNum(index) {
      if (this.disabledChangeNumber) return;
      let item = this.cartList.valid[index];
      item.numSub = item.cart_num > 1 ? true : false;
      item.numAdd = item.cart_num < item.trueStock ? true : false;
    },
    // 修改blurInput方法
    blurInput(index) {
      let item = this.cartList.valid[index];
      let originalNum = item.originalCartNum || item.cart_num; // 保存原始数量

      if (item.cart_num < 1) item.cart_num = 1;
      if (item.cart_num > 99) {
        item.cart_num = 99;
        this.$util.Tips({ title: '商品数量不能超过99个' });
      }
      if (item.cart_num > item.trueStock) item.cart_num = item.trueStock;

      // 计算变化量
      let changeAmount = item.cart_num - originalNum;
      if (changeAmount !== 0) {
        this.setCartNum(item.product_id || item.goods_id, changeAmount);
        item.originalCartNum = item.cart_num; // 更新原始数量
        
        // 如果商品已选中，重新计算总价
        if (item.checked) {
          this.recalculateTotalPrice();
        }
      }
    },
    subCart(index) {
      if (this.disabledChangeNumber) return;
      let item = this.cartList.valid[index];
      if (item.cart_num <= 1) return;
      item.cart_num = item.cart_num - 1;
      item.numSub = item.cart_num > 1 ? true : false;
      item.numAdd = true;
      // 传递-1表示减少1个
      this.setCartNum(item.product_id || item.goods_id, -1);
      
      // 重新计算选中商品的总价
      this.recalculateTotalPrice();
    },
    addCart(index) {
      if (this.disabledChangeNumber) return;
      let item = this.cartList.valid[index];
      if (item.cart_num >= item.trueStock) return;
      if (item.cart_num >= 99) {
        this.$util.Tips({ title: '商品数量不能超过99个' });
        return;
      }
      item.cart_num = item.cart_num + 1;
      item.numSub = item.cart_num > 1 ? true : false;
      item.numAdd = item.cart_num < item.trueStock ? true : false;
      // 传递+1表示增加1个
      this.setCartNum(item.product_id || item.goods_id, 1);
      
      // 重新计算选中商品的总价
      this.recalculateTotalPrice();
    },
    async setCartNum(goodsId, cartNum, successCallback, errorCallback) {
      let that = this;
      that.disabledChangeNumber = true;
      uni.showLoading({ title: that.$t(`请求中`) });

      try {
        // 使用团购购物车管理器更新数量（传递变化量：+1增加，-1减少）
        const response = await GroupCartManager.updateQuantity(goodsId, cartNum);
        const result = GroupCartManager.handleResponse(response);

        uni.hideLoading();
        that.disabledChangeNumber = false;

        if (result.success) {
          if (successCallback) successCallback(response);
          // 刷新购物车列表
          that.getCartList();
        } else {
          that.$util.Tips({ title: result.message || '更新失败' });
          if (errorCallback) errorCallback(result);
        }

      } catch (error) {
        uni.hideLoading();
        that.disabledChangeNumber = false;

        const result = GroupCartManager.handleResponse(error);

        // 只有真正的错误才打印日志
        if (!result.success) {
          console.error('更新购物车数量失败:', error);
          if (errorCallback) errorCallback(error);
        } else {
          // 成功的情况，静默处理
          if (successCallback) successCallback(error);
          that.getCartList();
        }
      }
    },
    async getCartNum() {
      let that = this;
      try {
        // 使用团购购物车获取数量
        const response = await GroupCartManager.getCart();
        const result = GroupCartManager.handleResponse(response);

        if (result.success && result.data) {
          // 根据实际API返回的数据结构计算总数量
          const cartItems = Array.isArray(result.data) ? result.data : [];
          const totalQuantity = cartItems.reduce((total, item) => {
            return total + (item.quantity || 0);
          }, 0);

          that.$store.dispatch("indexData/setCartnumber", totalQuantity);
        }
      } catch (error) {
        console.error('获取购物车数量失败:', error);
        // 静默失败，不显示错误提示
      }
    },
    getCartData(data) {
      let that = this;
      console.log('getCartData 接收到的数据:', data);

      let cartList = data.valid;
      let valid = [];

      console.log('原始购物车列表长度:', cartList.length);

      for (let i = 0; i < cartList.length; i++) {
        let item = cartList[i];
        console.log(`处理商品 ${i}:`, item);
        console.log(`商品 ${i} attrStatus:`, item.attrStatus);

        if (item.attrStatus) {
          item.numSub = item.cart_num > 1 ? true : false;
          item.numAdd = item.cart_num < item.trueStock ? true : false;
          item.checked = false;
          valid.push(item);
          console.log(`商品 ${i} 已添加到有效列表`);
        } else {
          console.log(`商品 ${i} 被过滤，attrStatus 为 false`);
        }
      }

      console.log('最终有效商品数量:', valid.length);

      that.cartList.valid = valid;
      that.cartList.invalid = data.invalid;

      console.log('设置后的 cartList.valid 长度:', that.cartList.valid.length);
    },
    async getCartList(init) {
      let that = this;
      if (init) that.loading = true;
      uni.showLoading({ title: that.$t(`正在加载`) });

      try {
        // 使用团购购物车管理器获取购物车
        const response = await GroupCartManager.getCart();
        const result = GroupCartManager.handleResponse(response);

        uni.hideLoading();

        if (result.success) {
          // 根据实际API返回的数据结构处理 - API直接返回数组
          const cartItems = Array.isArray(result.data) ? result.data : [];

          // 直接设置购物车数据，绕过复杂的处理逻辑
          if (cartItems.length > 0) {
            console.log('购物车原始数据:', cartItems);

            // 简化的数据格式转换
            const validItems = cartItems.map(item => {
              // 确保价格是有效数字
              let price = '0.00';
              if (item.combination && item.combination.group_price) {
                price = item.combination.group_price;
              } else if (item.combination && item.combination.price) {
                price = item.combination.price;
              } else if (item.goods && item.goods.price) {
                price = item.goods.price;
              }
              
              // 确保转换为数字
              const numericPrice = parseFloat(price);
              
              return {
                id: item.id,
                product_id: item.goods_id,
                cart_num: item.quantity,
                productInfo: {
                  title: item.goods?.title || '商品名称',
                  image: item.goods?.image || '',
                  price: price,
                  stock: item.combination?.stock || 0,
                  ...item.goods
                },
                attrInfo: {
                  unique: item.unique || '',
                  price: price,
                  stock: item.combination?.stock || 0,
                  ...item.combination
                },
                // 必要字段
                attrStatus: true,
                trueStock: item.combination?.stock || 999,
                truePrice: numericPrice, // 确保是数字
                price: numericPrice, // 添加直接价格字段
                numSub: item.quantity > 1,
                numAdd: item.quantity < (item.combination?.stock || 999),
                checked: false,
                originalCartNum: item.quantity, // 保存原始数量，用于计算变化量
                // 原始数据
                combination: item.combination,
                group: item.group,
                goods: item.goods,
                ...item
              };
            });

            console.log('转换后的购物车数据:', validItems);

            // 直接设置到 cartList
            that.cartList.valid = validItems;
            that.cartList.invalid = [];

            // 计算价格相关信息
            that.calculatePrices();

            // 强制触发Vue响应式更新
            that.$forceUpdate();

            // 确保canShow为true
            that.canShow = true;
          } else {
            that.cartList.valid = [];
            that.cartList.invalid = [];
          }

          that.loading = false;
          that.loadend = true;
          that.loadTitle = that.$t(`没有更多了`);

        } else {
          console.error('获取购物车失败:', result);
          that.loading = false;
          that.loadend = true;
          that.loadTitle = that.$t(`没有更多了`);

          // 显示具体的错误信息
          if (result.status !== 110002) {
            that.$util.Tips({ title: result.message || '获取购物车失败' });
          }

          // 设置空的购物车数据
          that.cartList = { valid: [], invalid: [] };
        }

      } catch (error) {
        uni.hideLoading();
        console.error('获取购物车异常:', error);
        that.loading = false;
        that.loadend = true;
        that.loadTitle = that.$t(`没有更多了`);

        const result = GroupCartManager.handleResponse(error);
        if (result.status !== 110002) {
          // 显示具体的错误信息
          that.$util.Tips({ title: result.message || '获取购物车失败' });
        }

        // 设置空的购物车数据
        that.cartList = { valid: [], invalid: [] };
      }
    },

    // 获取团购购物车
    getGroupCartList() {
      let that = this;
      return new Promise((resolve, reject) => {
        getCartInfo().then(res => {
          if (res.status === 200 && res.data) {
            uni.hideLoading();

            // 转换团购购物车数据格式以适配页面显示
            const cartData = {
              valid: res.data.items || [],
              invalid: res.data.invalid_items || []
            };

            // 格式化购物车数据
            if (cartData.valid.length > 0) {
              cartData.valid = cartData.valid.map(item => ({
                id: item.id,
                product_id: item.product_id,
                cart_num: item.quantity || item.cart_num,
                productInfo: {
                  title: item.title || item.name,
                  image: item.image,
                  price: item.price,
                  ...item
                },
                attrInfo: item.attr_info || {},
                ...item
              }));
            }

            that.getCartData(cartData);
            that.loading = false;
            that.loadend = true;
            that.loadTitle = that.$t(`没有更多了`);
            that.getCartNum();
            resolve(res);
          } else {
            reject(new Error('团购购物车数据格式错误'));
          }
        }).catch(err => {
          console.log('获取团购购物车失败:', err);
          reject(err);
        });
      });
    },
    getInvalidList() {
      let that = this;
      if (that.loadingInvalid === true) return;
      if (that.loadendInvalid === true) return;
      that.loadingInvalid = true;
      that.loadTitleInvalid = that.$t(`加载更多`);
      getResetCart()
        .then(res => {
          that.loadingInvalid = false;
          that.loadendInvalid = res.data.length < 20;
          that.loadTitleInvalid = that.loadendInvalid
            ? that.$t(`没有更多了`)
            : that.$t(`加载更多`);
          let validList = [];
          validList = validList.concat(res.data);
          that.cartList.invalid = validList;
        })
        .catch(err => {
          that.loadingInvalid = false;
          that.loadendInvalid = true;
          that.loadTitleInvalid = that.$t(`没有更多了`);
          that.$util.Tips({ title: err });
        });
    },
    async getHostProduct() {
      let that = this;
      try {
        const response = await getProductHot({
          page: 1,
          limit: 4
        });

        // 完全静默处理，不显示任何提示信息
        const result = handleListApi(response, {
          showErrorToast: false // 连错误也静默处理
        });

        if (result.success) {
          that.hostProduct = result.data || [];
        } else {
          that.hostProduct = [];
        }
      } catch (error) {
        console.error('获取推荐商品失败:', error);
        that.hostProduct = [];
      }
    },
    goodsOpen() {
      this.goodsHidden = !this.goodsHidden;
    },
    goToIndex() {
      uni.switchTab({
        url: "/pages/index/index"
      });
    },
    // 修改manage方法
    manage() {
      this.footerswitch = !this.footerswitch;
      let selectValue = [];
      let selectCountPrice = 0.00; // 确保初始值为数字
      if (this.footerswitch) {
        for (let i = 0; i < this.cartList.valid.length; i++) {
          this.cartList.valid[i].checked = false;
        }
      } else {
        for (let i = 0; i < this.cartList.valid.length; i++) {
          this.cartList.valid[i].checked = false;
        }
      }
      this.isAllSelect = false;
      this.selectValue = selectValue;
      this.selectCountPrice = parseFloat(selectCountPrice).toFixed(2); // 确保格式化为两位小数的字符串
    },
    unsetCart() {
      let that = this;
      uni.showModal({
        title: that.$t(`提示`),
        content: that.$t(`确定要清空失效商品吗？`),
        success: function(res) {
          if (res.confirm) {
            uni.showLoading({ title: that.$t(`请求中`) });
            getResetCart("1")
              .then(res => {
                uni.hideLoading();
                that.$util.Tips({ title: that.$t(`清空成功`) });
                that.cartList.invalid = [];
              })
              .catch(err => {
                uni.hideLoading();
                that.$util.Tips({ title: err });
              });
          }
        }
      });
    },
    // 修改onEdit方法
    onEdit() {
      this.footerswitch = !this.footerswitch;
      let selectValue = [];
      let selectCountPrice = 0.00; // 确保初始值为数字
      if (this.footerswitch) {
        for (let i = 0; i < this.cartList.valid.length; i++) {
          this.cartList.valid[i].checked = false;
        }
      } else {
        for (let i = 0; i < this.cartList.valid.length; i++) {
          this.cartList.valid[i].checked = false;
        }
      }
      this.isAllSelect = false;
      this.selectValue = selectValue;
      this.selectCountPrice = parseFloat(selectCountPrice).toFixed(2); // 确保格式化为两位小数的字符串
    },

    // 计算价格相关信息
    calculatePrices() {
      let selectValue = [];
      let selectCountPrice = 0.00; // 确保初始值为数字
      let isAllSelect = true;

      // 遍历有效商品，计算选中商品的价格
      for (let i = 0; i < this.cartList.valid.length; i++) {
        let item = this.cartList.valid[i];
        if (item.checked) {
          selectValue.push(item.id.toString());
          
          // 确保获取正确的价格，优先使用combination.group_price
          let itemPrice = 0;
          if (item.combination && item.combination.group_price) {
            itemPrice = parseFloat(item.combination.group_price);
          } else if (item.combination && item.combination.price) {
            itemPrice = parseFloat(item.combination.price);
          } else if (item.productInfo && item.productInfo.price) {
            itemPrice = parseFloat(item.productInfo.price);
          } else if (typeof item.truePrice === 'number') {
            itemPrice = item.truePrice;
          } else if (typeof item.price === 'number' || typeof item.price === 'string') {
            itemPrice = parseFloat(item.price);
          }
          
          // 确保获取正确的数量
          let itemQuantity = parseInt(item.cart_num || 1);
          
          // 计算这个商品的总价
          let itemTotal = itemPrice * itemQuantity;
          
          // 累加到总价中
          selectCountPrice += itemTotal;
          
          console.log(`商品[${item.id}]价格: ${itemPrice}, 数量: ${itemQuantity}, 小计: ${itemTotal}, 累计总价: ${selectCountPrice}`);
        } else {
          isAllSelect = false;
        }
      }

      // 如果没有商品或者没有选中的商品，全选状态为false
      if (this.cartList.valid.length === 0 || selectValue.length === 0) {
        isAllSelect = false;
      }

      // 更新状态
      this.selectValue = selectValue;
      this.selectCountPrice = parseFloat(selectCountPrice).toFixed(2); // 确保格式化为两位小数的字符串
      console.log('最终计算的总价:', this.selectCountPrice);
      this.isAllSelect = isAllSelect;
    },

    // 添加一个新方法来重新计算总价
    recalculateTotalPrice() {
      let selectCountPrice = 0.00;
      
      for (let i = 0; i < this.cartList.valid.length; i++) {
        let item = this.cartList.valid[i];
        if (item.checked) {
          // 确保获取正确的价格
          let itemPrice = 0;
          if (item.combination && item.combination.group_price) {
            itemPrice = parseFloat(item.combination.group_price);
          } else if (item.combination && item.combination.price) {
            itemPrice = parseFloat(item.combination.price);
          } else if (item.productInfo && item.productInfo.price) {
            itemPrice = parseFloat(item.productInfo.price);
          } else if (typeof item.truePrice === 'number') {
            itemPrice = item.truePrice;
          } else if (typeof item.price === 'number' || typeof item.price === 'string') {
            itemPrice = parseFloat(item.price);
          }
          
          // 确保获取正确的数量
          let itemQuantity = parseInt(item.cart_num || 1);
          
          // 累加到总价中
          selectCountPrice += itemPrice * itemQuantity;
        }
      }
      
      this.selectCountPrice = parseFloat(selectCountPrice).toFixed(2);
      console.log('重新计算后的总价:', this.selectCountPrice);
    },

    // 处理图片URL
    setDomain(url) {
      if (!url) return '';
      url = url.toString();

      // 如果是相对路径，拼接域名
      if (url.indexOf('/') === 0) {
        return HTTP_REQUEST_URL + url;
      }

      // 如果已经是完整URL，直接返回
      if (url.indexOf("http") === 0) {
        return url;
      }

      // 其他情况拼接域名
      return HTTP_REQUEST_URL + '/' + url;
    },

    // 加载猜你喜欢商品
    async loadLikeProducts() {
      try {
        const response = await getProductHot(1, 4);
        if (response.status === 200 && response.data) {
          const products = response.data.list || response.data;
          this.likeProducts = products.map(item => ({
            id: item.id,
            name: item.title || item.store_name,
            image: item.image,
            price: item.price || item.min_price
          }));
        }
      } catch (error) {
        console.error('加载推荐商品失败:', error);
        // 静默失败，不显示错误提示
      }
    }
  },
  onReachBottom() {
    // this.getInvalidList();
  },
  // 滚动监听
  onPageScroll(e) {
    // let scrollTop = e.scrollTop;
    // this.isFixed = scrollTop > 30 ? true : false;
  }
};
</script>

<style scoped lang="scss">
.shoppingCart {
  background-color: #F0F0F0;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.uni-p-b-98 {
  padding-bottom: 40rpx; /* 减少底部空隙 */
}

/* 通用样式 */
.copy-data {
  background-color: #F0F0F0;
}

.cart-color {
  color: #FF840B !important;
  border-color: #FF840B !important;
}

.bg-color {
  background-color: #FF840B !important;
  border-color: #FF840B !important;
}

.round-checkbox {
  border-radius: 50% !important;
}

.checkAll {
  font-size: 28rpx;
  color: #282828;
}

/* 商品名称和价格样式 */
.product-name {
  font-weight: bold;
  margin-bottom: 10rpx;
}

.product-price {
  color: #FF840B !important;
}

/* 按钮样式 */
.round-btn {
  border-radius: 50% !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 猜你喜欢区域样式 */
.guess-you-like {
  padding: 20rpx;
  margin: 20rpx;
  margin-top: 20rpx;
  
  .divider {
    height: 1rpx;
    background-color: #F0F0F0;
    margin-bottom: 20rpx;
  }
  
  .section-title {
    text-align: center;
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 40rpx;
  }
  
  .product-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    
    .product-item {
      width: 48%;
      margin-bottom: 20rpx;
      background-color: transparent;
      border-radius: 0;
      overflow: visible;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}

/* 猜你喜欢区域的图片样式 - 单独定义以确保兼容性 */
.product-grid .product-item image {
  width: 100%;
  height: 468rpx; /* 高比宽1.3:1，360rpx × 1.3 = 468rpx */
  object-fit: cover;
  border-radius: 8rpx 8rpx 0 0; /* 只有上方圆角 */
  display: block;
  background: #F8F8F8;
}

/* 猜你喜欢区域的商品名称样式 */
.product-grid .product-item .product-name {
  margin-top: 0; /* 移除上边距，与图片紧贴 */
  padding: 24rpx 20rpx; /* 增加上下内边距 */
  min-height: 80rpx; /* 设置最小高度，确保文字区域有足够空间 */
  font-size: 28rpx; /* 稍微增大字号 */
  color: #333333;
  text-align: center;
  background: #FFFFFF;
  border-radius: 0 0 8rpx 8rpx; /* 只有下方圆角 */
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06);
  line-height: 1.5; /* 增加行高 */
  width: 100%;
  box-sizing: border-box;
  /* 支持多行文字显示 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

/* 加载更多样式 */
.loadingicon {
  font-size: 24rpx;
  color: #999;
  padding: 20rpx 0;
}

.loadingicon .loading {
  animation: loading 3s infinite;
  font-size: 32rpx;
  margin-right: 10rpx;
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.header-bar {
  display: flex;
  align-items: center;
  height: 48px;
  background: #fff;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;

  .header-left {
    width: 60px; // 与edit-btn等宽，保持平衡
  }

  .title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    color: #333;
    font-weight: 500;
    letter-spacing: 1px;
  }

  .edit-btn {
    font-size: 16px;
    color: #333333;
    width: 60px;
    text-align: right;
  }

  .header-right {
    width: 60px; // 与edit-btn等宽，保持平衡
  }
}
</style>
