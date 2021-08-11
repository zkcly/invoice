<template>
    <div id="setDiscount">
        <el-form :rules="rules" ref="setRel" :model="discountForm" label-width="85px">
            <el-form-item label="被折扣行" prop="index">
                <el-select v-model="discountForm.index" placeholder="请选择" style="width:100%;" @change="discountIndex()">
                    <el-option
                    v-for="item in indexProduct"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品金额">
                <el-input v-model="discountForm.amount" readonly ></el-input>
            </el-form-item>
            <el-form-item label="折扣率%" prop="rate">
                <el-input v-model="discountForm.rate" v-on:input="watchRate()" @keyup="value=value.replace(/[^\d\.]/g,'')" type="text"></el-input>
            </el-form-item>
            <el-form-item label="折扣金额" prop="discountAmount">
                <el-input v-model="discountForm.discountAmount" v-on:input="watchAmount()" @keyup="value=value.replace(/[^\d\.]/g,'')" type="text" ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: right;">
            <el-button @click="onCancel">取 消</el-button>
            <el-button type="primary" @click="onDetermine">确 定</el-button>
        </div>
    </div>
</template>

<script>
import {validDiscount4, validDisAmount2 } from '@/utils/validate.js';
export default {
    name: "SetDiscount",
    components: {},
    props: {
        //商品信息
        productInfos: {
            type: Array,
            default: []
        },
    },
    data() {
        var checkDiscountAmount = (rule, value, callback) => {
            if (value == '0') {
                callback(new Error('折扣金额不能为零'));
            } 
            else if (value == '') {
                    callback(new Error('请输入折扣金额'));
            }
            else if (value > this.discountForm.amount){
                this.discountForm.rate = '100.0000'
                callback(new Error('折扣金额不可大于商品金额'))
            }
            else {
                callback();
            }
        };
        return {
            // 折扣弹框
            discountForm: {
                index: '',
                amount: '',
                rate: '',
                discountAmount: '',
            },
            rules: {
                index: [{ required: true, message: '请选择被折扣行', trigger: 'change' }],
                rate: [{ required: true, message: '请输入折扣率', trigger: 'change' },],
                discountAmount: [
                    // { required: true, message: '请输入折扣金额', trigger: 'blur' },
                    { required: true, validator: checkDiscountAmount, trigger: 'change' }
                ],
            },
            
            // 被折扣行
            indexProduct: [
                // {value: '0', label: '1'}, 
                // {value: '1', label: '2'}, 
            ],


        };
    },
    created() {},
    mounted() {
        this.indexDiscount()
    },

    computed: {},
    methods: {
        // 设置被折扣行数据
        indexDiscount() {
            let arr = this.productInfos
            for (let i = 0; i < arr.length; i++) {
                const el = arr[i];
                // 未设置折扣的商品行
                if (!el.isDiscount) {
                    if (el.name.toString() && el.price.toString() && el.tax.toString() && el.taxRate.toString()) {
                        let obj = {value: i, label: `第${i+1}行`}
                        this.indexProduct.push(obj)
                    }
                }
            }
            this.getSelect()
            console.log('arr', arr)
        },
        // 根据被折扣行 设置商品金额项
        discountIndex() {
            this.discountForm.amount = this.productInfos[this.discountForm.index].amountView
        },
        // 判断是否有被折扣行数据
        getSelect() {
            if (this.indexProduct.length == 0) {
                let _this = this
                setTimeout(function(){
                    _this.$alert('未获取有效商品信息,请返回补全商品信息！', '提示', {
                        confirmButtonText: '确定',
                    });
                }, 1000);
            }
        },



        // 确定
        onDetermine() {
            console.log('折扣确定')
            this.$refs['setRel'].validate((valid) => {
                if (valid) {
                    if(parseFloat(this.discountForm.discountAmount) > parseFloat(this.discountForm.amount)) {
                        this.$alert('折扣金额不能大于原商品金额！', '提示', {
                            confirmButtonText: '确定',
                        });
                    }else {
                        this.$emit('setDiscountDetermine', this.discountForm)
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        // 取消
        onCancel() {
            this.$emit('setDiscountClose')
        },



        // 监听折扣率, 求折扣金额
        watchRate() {
          this.discountForm.rate=this.discountForm.rate.replace(/[^\d\.]/g,'')
            let num = this.discountForm.rate
            if (num === '') {
                this.discountForm.rate = ''
                return
            }
            let str = num
            if (this.discountForm.amount) {
                let boolen = validDiscount4(str)
                console.log('boolen', boolen)
                if (boolen) {
                    let amounts = parseFloat(this.discountForm.amount)
                    let res = amounts * parseFloat(str) / 100
                    this.discountForm.discountAmount = res ? res.toFixed(2):''
                }else {
                    let num = this.validDotNum(str)
                    if (num > 1) {
                        this.discountForm.discountAmount = ''
                        this.discountForm.rate = ''
                    }
                    if (num == 1) {
                        let res = this.validFloatDate(str, 9, 4)
                        if (res.indexOf('.') != 0 && res.indexOf('.') != res.length-1) {
                            this.discountForm.rate = res
                            
                        }
                        else if (str.indexOf('.') != str.length-1){
                            this.discountForm.discountAmount = ''
                            this.discountForm.rate = ''
                        }
                    }
                    if (num == 0) {
                        if (str.length > 1 && str.charAt(0)==0) {
                            this.discountForm.discountAmount = ''
                            this.discountForm.rate = ''
                        }
                        else if (str > 100) {
                            this.discountForm.rate = str.substring(0, 2)
                        }
                        
                    }
                }
                
            }else {
                this.discountForm.rate = ''
                this.$alert('请先选择被折扣行', '提示', {
                    confirmButtonText: '确定',
                });
            }
        },

        // 监听折扣金额, 求折扣率
        watchAmount() {
          this.discountForm.discountAmount=this.discountForm.discountAmount.replace(/[^\d\.]/g,'')
            let num = this.discountForm.discountAmount
            if (num === '') {
                this.discountForm.discountAmount = ''
                return
            }

            if(this.discountForm.amount==0){
              return;
            }
            let str = num
            if (this.discountForm.amount!=0) {
                let boolen = validDisAmount2(str)
                console.log('boolen', boolen)
                if (boolen && str.length <= 9) {
                    let amounts = parseFloat(this.discountForm.amount)
                    let res = (parseFloat(str) / amounts) * 100
                    this.discountForm.rate = res ? res.toFixed(4):''
                }
                else if (boolen && str.length > 9) {
                    if(parseInt(str)==str){
                        this.discountForm.discountAmount = str.substring(0, 9)
                    }else{
                        this.discountForm.discountAmount = this.validFloatDate(str, 9, 2)
                    }
                    
                }
                else {
                    let num = this.validDotNum(str)
                    if (parseInt(num) > 1) {
                        this.discountForm.discountAmount = ''
                        this.discountForm.rate = ''
                    }
                    if (num == 1) {
                        let res = this.validFloatDate(str, 9, 2)
                        console.log('res', res);
                        if (res.indexOf('.') != 0 && res.indexOf('.') != res.length-1) {
                            this.discountForm.discountAmount = res
                        }
                        else if (str.indexOf('.') != str.length-1){
                            this.discountForm.discountAmount = ''
                            this.discountForm.rate = ''
                        }
                    }
                    if (num == 0) {
                        if (str.length > 1 && str.charAt(0)==0) {
                            this.discountForm.discountAmount = ''
                            this.discountForm.rate = ''
                        }
                        
                    }
                }
                
            }else {
                this.discountForm.discountAmount = ''
                this.$alert('请先选择被折扣行', '提示', {
                    confirmButtonText: '确定',
                });
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
