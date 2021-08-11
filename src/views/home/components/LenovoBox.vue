<template>
    <div id="LenovoBox">
        <el-table :data="dataList" style="width: 100%" max-height="197px" @row-click="selectData">
            <el-table-column prop="goodsName" label="商品名称" min-width="130"> </el-table-column>
            <el-table-column prop="specifications" label="规格型号" > </el-table-column>
            <el-table-column prop="unit" label="计量单位" > </el-table-column>
            <el-table-column prop="goodsPrice" label="单价" > </el-table-column>
            <el-table-column label="税率" >
                <template slot-scope="scope">{{scope.row.taxRate*100}}%</template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import "@/utils/global.js";

export default {
    name: "LenovoBox",
    components: { },
    props: {
        //联想数据
        dataList:{
            type: Array,
            default: [],
        },
    },
    data() {
        return {
        };
    },
    created() {},
    mounted() {
    },
    methods: {
        // 选择
        selectData(row) {   
            this.$emit('lenovoDetermine', row)
        },


    },
};
</script>

<style scoped>
</style>
