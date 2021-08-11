<template>
    <div id="setDifference">
        <el-form :rules="rules" ref="setRel" :model="differenceForm" label-width="93px">
            <el-form-item label="含税销售额" prop="sales">
                <el-input v-model="differenceForm.sales" v-on:input="watchSales()"></el-input>
            </el-form-item>
            <el-form-item label="扣除额" prop="deduction">
                <el-input v-model="differenceForm.deduction" v-on:input="watchDeduction()"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
            <el-button @click="onCancel">取 消</el-button>
            <el-button type="primary" @click="onDetermine">确 定</el-button>
        </div>
    </div>
</template>

<script>
import {validDisAmount2 } from '@/utils/validate.js';
export default {
    name: "SetDifference",
    components: {},
    props: {
        //商品信息
        // productInfos: {
        //     type: Array,
        //     default: []
        // },
    },
    data() {
        return {
            // 差额设置弹框
            differenceForm: {
                sales: '',
                deduction: '',
            },
            rules: {
                sales: [{ required: true, message: '请输入含税销售额', trigger: 'blur' },],
                deduction: [{ required: true, message: '请输入扣除额', trigger: 'blur' }],
            },


        };
    },
    created() {},
    mounted() {},

    computed: {},
    methods: {

        // 确定
        onDetermine() {
            this.$refs['setRel'].validate((valid) => {
                if (valid) {
                    if(parseFloat(this.differenceForm.deduction) > parseFloat(this.differenceForm.sales)) {
                        this.$alert('扣除金额不能大于含税销售金额!', '提示', {
                            confirmButtonText: '确定',
                        });
                        console.log(this.differenceForm.deduction, this.differenceForm.sales);
                    }else {
                        this.$emit('setDifferenceDetermine', this.differenceForm)
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        // 取消
        onCancel() {
            this.$emit('setDifferenceClose')
        },



        // 监听销售额, 并校验(2位小数)
        watchSales() {
            let str = this.differenceForm.sales + ''
            let num = str.replace(/[^\d\.]/g,'')
            this.differenceForm.sales = num
            if (this.differenceForm.sales) {
                let str = this.differenceForm.sales
                let boolen = validDisAmount2(str)
                console.log('boolen', boolen)
                if (boolen && str.length <= 9) {
                    return
                }
                else if (boolen && str.length > 9) {
                    if(parseInt(str)==str){
                        this.differenceForm.sales = str.substring(0, 9)
                    }else{
                        this.differenceForm.sales = this.validFloatDate(str, 9, 2)
                    }
                }
                else {
                    let num = this.validDotNum(str)
                    if (parseInt(num) > 1) {
                        this.differenceForm.sales = ''
                    }
                    if (num == 1) {
                        let res = this.validFloatDate(str, 9, 2)
                        console.log('res', res);
                        if (res.indexOf('.') != 0 && res.indexOf('.') != res.length-1) {
                            this.differenceForm.sales = res
                        }
                        else if (str.indexOf('.') != str.length-1){
                            this.differenceForm.sales = ''
                        }
                    }
                    if (num == 0) {
                        if (str.length > 1 && str.charAt(0)==0) {
                            this.differenceForm.sales = ''
                        }
                        
                    }
                }
            }
        },
        
        // 监听扣除额, 并校验(2位小数)
        watchDeduction() {
            let str = this.differenceForm.deduction + ''
            let num = str.replace(/[^\d\.]/g,'')
            this.differenceForm.deduction = num
            if (this.differenceForm.deduction) {
                let str = this.differenceForm.deduction
                let boolen = validDisAmount2(str)
                console.log('boolen', boolen)
                if (boolen && str.length <= 9) {
                    return
                }
                else if (boolen && str.length > 9) {
                    if(parseInt(str)==str){
                        this.differenceForm.deduction = str.substring(0, 9)
                    }else{
                        this.differenceForm.deduction = this.validFloatDate(str, 9, 2)
                    }
                }
                else {
                    let num = this.validDotNum(str)
                    if (parseInt(num) > 1) {
                        this.differenceForm.deduction = ''
                    }
                    if (num == 1) {
                        let res = this.validFloatDate(str, 9, 2)
                        console.log('res', res);
                        if (res.indexOf('.') != 0 && res.indexOf('.') != res.length-1) {
                            this.differenceForm.deduction = res
                        }
                        else if (str.indexOf('.') != str.length-1){
                            this.differenceForm.deduction = ''
                        }
                    }
                    if (num == 0) {
                        if (str.length > 1 && str.charAt(0)==0) {
                            this.differenceForm.deduction = ''
                        }
                        
                    }
                }
            }

        },

        

        // 校验小数点出现次数
        validDotNum(str) {
            let index = str.indexOf('.'); // 字符出现的位置
            let num = 0; // 这个字符出现的次数
            while(index !== -1) {
                num++; 
                index = str.indexOf('.',index + 1); // 从字符串出现的位置的下一位置开始继续查找
            }
            return num
        },
        // 校验小数并限制长度
        validFloatDate(str, len1, len2) {
            if (str.indexOf('.') > -1) {
                let arr = str.split('.')
                let beg = arr[0]
                let end = arr[1]
                            console.log('valid', arr)
                if (beg && end) {
                    if (beg.length > 1) {
                        if (beg.charAt(0) == 0){
                            return ''
                        }else {
                            if (beg.length > len1) {
                                beg = beg.substring(0, len1)
                            }
                        }
                    }
                    
                    if (end.length > len2) {
                        end = end.substring(0, len2)
                    }

                    return beg+'.'+end
                }
                else {
                    return ''
                }
                
            }

        },

        
    },
};
</script>

<style scoped>

</style>
