<template>
  <view class="custom-input-container">
    <input class="custom-input" :placeholder="placeholder" :value="value" @input="onInput" @focus="onFocus"
      @blur="onBlur" />
  </view>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.detail.value)
    },
    onFocus() {
      this.$emit('focus')
    },
    onBlur() {
      this.$emit('blur')
    }
  }
}
</script>

<style scoped>
.custom-input-container {
  padding: 20rpx;
}

.custom-input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}
</style>