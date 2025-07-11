<template>
    <view class="goods-cate-right-panel">
        <CateBanner v-if="bannerData" v-bind="bannerData" />
        <CateTabs v-if="tabs && tabs.length" :tabs="tabs" :activeIndex="activeTab" @change="onTabChange" />
        <CateGoodsList :goods="goodsList" @itemClick="$emit('itemClick', $event)" />
    </view>
</template>
<script>
import CateBanner from './CateBanner.vue'
import CateTabs from './CateTabs.vue'
import CateGoodsList from './CateGoodsList.vue'
export default {
    name: 'GoodsCateRightPanel',
    components: { CateBanner, CateTabs, CateGoodsList },
    props: {
        bannerData: Object,
        tabs: Array,
        activeTab: Number,
        goodsList: Array
    },
    methods: {
        onTabChange (idx) {
            this.$emit('tabChange', idx)
        }
    }
}
</script>
<style scoped>
.goods-cate-right-panel {
    /* 这里根据Figma设计图调整整体布局 */
}
</style>