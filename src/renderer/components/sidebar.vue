<template>
    <div>
        <el-card class="sidebar">
            <div slot="header">
                <span>Tables</span>
            </div>
            <div>
                <div v-for="o in 4" :key="o" class="text item">
                    {{'List item ' + o }}
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {}
</script>

<style>
    .sidebar {
        width: 300px;
        height: 100vh;
        border-radius: 0;
    }
</style>
