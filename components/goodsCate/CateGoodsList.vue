<template>
    <view class="cate-goods-list">
        <CateGoodsItem v-for="(item, idx) in goods" :key="idx" :img="item.img" :title="item.title" :price="item.price"
            @click.native="$emit('itemClick', item, idx)" />
    </view>
</template>
<script>
import CateGoodsItem from './CateGoodsItem.vue'
export default {
    name: 'CateGoodsList',
    components: { CateGoodsItem },
    props: {
        goods: {
            type: Array,
            default: () => []
        }
    }
}
</script>
<style scoped>
.cate-goods-list {
    /* 这里根据Figma设计图调整布局 */
}
</style>