<template>
    <div id="customLenovo">
      
        <el-table :data="dataList" style="width: 100%" max-height="280px" @row-click="selectData" :show-header="false">
            <el-table-column prop="customerName" label="客户名称" min-width="130"></el-table-column>
            <!-- <el-table-column prop="taxId" label="税号"></el-table-column>
            <el-table-column prop="addressAndPhone" label="地址电话"></el-table-column>
            <el-table-column prop="bankAndAccount" label="开户行及账号"></el-table-column>
            <el-table-column prop="invoicePhone" label="收票手机号"></el-table-column>
            <el-table-column prop="invoiceEmail" label="收票邮箱"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column> -->
        </el-table>
    </div>
</template>

<script>
import "@/utils/global.js";

export default {
    name: "customLenovo",
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
          box:'',
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
