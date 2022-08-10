<template>
    <div class="content">
        {{ txt }}
    </div>
</template>

<script>
export default {
    data() {
        return {
            txt: '日事日毕 日清日高'
        }
    },
    mounted() {
        // 
    }
}
</script>

<style lang="scss" scoped>
.content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    /*50%为自身尺寸的一半 绝对定位居中*/
    font-family: PingFangSC-Semibold;
    font-size: 20px;
    color: #4A4A4A;
}
</style>