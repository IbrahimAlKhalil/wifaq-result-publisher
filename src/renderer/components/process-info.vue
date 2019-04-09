<template>
    <el-card class="info">
        <div slot="header">
            <h5 class="title">{{title}}</h5>
        </div>
        <div class="content">
            <slot/>
        </div>
    </el-card>
</template>

<script>
    export default {
        props: {
            title: {
                required: true,
                type: String
            }
        }
    }
</script>


<style scoped>
    .title {
        margin: 0;
    }

    .content {
        font-size: .9rem;
    }
</style>
