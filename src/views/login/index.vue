<template>
  <div class="login">
    <div class="main">
      <div class="login-form">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
          <img
            src="@/assets/4366632_slices/4366632.png"
            alt=""
            style="width: 50px; height: 50px; margin-left: 110px"
          />
          <h2 class="title">账号登录</h2>
          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="loginForm.userName"
              placeholder="Username"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            >
              <svg-icon slot="prefix" icon-class="user" class="input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="loginFun"
            >
              <svg-icon
                slot="prefix"
                icon-class="password"
                class="el-input__icon input-icon"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox >自动登录</el-checkbox>
            <el-checkbox >记住密码</el-checkbox>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              type="primary"
              style="width: 100%; margin-bottom: 30px"
              @click="loginFun"
              >登录</el-button
            >
          </el-form-item>
          <div class="tips">
            <el-link type="primary" @click="forgetPassword">忘记密码</el-link>
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog
      title="选择税盘"
      :visible.sync="selectDiskVisible"
      width="350px"
      center
    >
      <el-form :model="form">
        <el-form-item>
          <el-select
            v-model="currentTaxDisk"
            placeholder="请选择"
            value-key="id"
            style="margin-left: 50px"
          >
            <el-option
              v-for="item in taxDiskList"
              :key="item.id"
              :label="item.taxDiskName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          @click="handleDiskChange"
          style="width: 200px; margin: auto 0"
          >确 定</el-button
        >
      </div>
    </el-dialog>
     <el-dialog
      title="企业信息设置"
      :visible.sync="companyInfoSetting"
      width="40%"
    >
       <el-form
          ref="companyInfoForm"
          label-width="120px"
          label-position="right"
          :model="companyInfo"
        >
          <el-form-item label="企业名称：" prop="companyName">
            <el-input
              size="small"
              disabled
              v-model="companyInfo.companyName"
            ></el-input>
          </el-form-item>
          <el-form-item label="纳税人识别号：" prop="taxId">
            <el-input
              size="small"
              disabled
              v-model="companyInfo.taxId"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="注册地址："
            prop="district"
            :rules="{
              required: true,
              message: '请选择注册地址',
              trigger: 'change',
            }"
          >
            <el-select
              @change="getCityList()"
              placeholder="请选择省份"
              style="width: 30%"
              size="small"
              v-model="companyInfo.province"
            >
              <el-option
                v-for="attr in provinceList"
                :key="attr.code"
                :label="attr.name"
                :value="attr.code"
              ></el-option>
            </el-select>
            <el-select
              @change="getDistrictList()"
              placeholder="请选择市"
              style="width: 30%; margin: 0 5%"
              size="small"
              v-model="companyInfo.city"
            >
              <el-option
                v-for="attr in cityList"
                :key="attr.code"
                :label="attr.name"
                :value="attr.code"
              ></el-option>
            </el-select>
            <el-select
              placeholder="请选择区"
              v-model="companyInfo.district"
              style="width: 30%"
              size="small"
            >
              <el-option
                v-for="attr in districtList"
                :key="attr.code"
                :label="attr.name"
                :value="attr.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="地址电话："
            prop="sellerAddrTel"
            :rules="{
              required: true,
              message: '请输入地址电话',
              trigger: 'blur',
            }"
          >
            <el-input
              size="small"
              v-model="companyInfo.sellerAddrTel"
            ></el-input>
          </el-form-item>
          <el-form-item label="开户行及账号：" prop="sellerBankAccount">
            <el-input
              size="small"
              v-model="companyInfo.sellerBankAccount"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="开票人："
            prop="kpr"
            :rules="{
              required: true,
              message: '请输入开票人',
              trigger: 'blur',
            }"
          >
            <el-input size="small" v-model="companyInfo.kpr"></el-input>
          </el-form-item>
          <el-form-item label="收款人：" prop="skr">
            <el-input size="small" v-model="companyInfo.skr"></el-input>
          </el-form-item>
          <el-form-item label="复核人：" prop="fhr">
            <el-input size="small" v-model="companyInfo.fhr"></el-input>
          </el-form-item>
        </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          @click="saveCompanyInfoSetting"
          style="width: 100px; margin: auto 0"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="初始化"
      width="60%"
      height="500px"
      :close-on-click-modal="false"
      :visible.sync="setTemplateVisible"
      destroy-on-close
    >
      <el-steps :active="currentsetp">
        <el-step title="用户协议"></el-step>
        <el-step title="税盘设置"></el-step>
        <el-step title="企业信息"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <div
        style="width: 60%; margin: 25px auto; height: 400px"
        v-if="currentsetp == 1"
      >
        <div style="height: 350px; overflow-y: auto; background: #f5f5f5">
          <pre style="white-space: pre-wrap; word-wrap: break-word">

     盼望着，盼望着，东风来了，春天的脚步近了。
一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸红起来了。
小草偷偷地从土里钻出来，嫩嫩的，绿绿的。园子里，田野里，瞧去，一大片一大片满是的。
坐着，躺着，打两个滚，踢几脚球，赛几趟跑，捉几回迷藏。风轻悄悄的，草软绵绵的。
桃树、杏树、梨树，你不让我，我不让你，都开满了花赶趟儿。红的像火，粉的像霞，白的像雪。
花里带着甜味儿；闭了眼，树上仿佛已经满是桃儿、杏儿、梨儿。花下成千成百的蜜蜂嗡嗡地闹着，
大小的蝴蝶飞来飞去。野花遍地是：杂样儿，有名字的，没名字的，散在草丛里，像眼睛，像星星，
还眨呀眨的。
“吹面不寒杨柳风”，不错的，像母亲的手抚摸着你。风里带来些新翻的泥土的气息，混着青草味儿，
还有各种花的香，都在微微润湿的空气里酝酿。鸟儿将窠巢安在繁花嫩叶当中，高兴起来了，
呼朋引伴地卖弄清脆的喉咙，唱出宛转的曲子，与轻风流水应和着。牛背上牧童的短笛，这时候也成天在嘹亮地响。
雨是最寻常的，一下就是三两天。可别恼。看，像牛毛，像花针，像细丝，密密地斜织着，人家屋顶上全笼着一层薄烟。
树叶子却绿得发亮，小草也青得逼你的眼。傍晚时候，上灯了，一点点黄晕的光，烘托出一片安静而和平的夜。
乡下去，小路上，石桥边，有撑起伞慢慢走着的人；还有地里工作的农夫，披着蓑，戴着笠的。他们的草屋，稀稀疏疏的，
在雨里静默着。
天上风筝渐渐多了，地上孩子也多了。城里乡下，家家户户，老老小小，他们也赶趟儿似的，一个个都出来了。
舒活舒活筋骨，抖擞抖擞精神，各做各的一份事去。“一年之计在于春”，刚起头儿，有的是工夫，有的是希望。
春天像刚落地的娃娃，从头到脚都是新的，他生长着。
春天像小姑娘，花枝招展的，笑着，走着。
春天像健壮的青年，有铁一般的胳膊和腰脚，他领着我们上前去。
盼望着，盼望着，东风来了，春天的脚步近了。
一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸红起来了。
小草偷偷地从土里钻出来，嫩嫩的，绿绿的。园子里，田野里，瞧去，一大片一大片满是的。
坐着，躺着，打两个滚，踢几脚球，赛几趟跑，捉几回迷藏。风轻悄悄的，草软绵绵的。
桃树、杏树、梨树，你不让我，我不让你，都开满了花赶趟儿。红的像火，粉的像霞，白的像雪。
花里带着甜味儿；闭了眼，树上仿佛已经满是桃儿、杏儿、梨儿。花下成千成百的蜜蜂嗡嗡地闹着，
大小的蝴蝶飞来飞去。野花遍地是：杂样儿，有名字的，没名字的，散在草丛里，像眼睛，像星星，
还眨呀眨的。
“吹面不寒杨柳风”，不错的，像母亲的手抚摸着你。风里带来些新翻的泥土的气息，混着青草味儿，
还有各种花的香，都在微微润湿的空气里酝酿。鸟儿将窠巢安在繁花嫩叶当中，高兴起来了，
呼朋引伴地卖弄清脆的喉咙，唱出宛转的曲子，与轻风流水应和着。牛背上牧童的短笛，这时候也成天在嘹亮地响。
雨是最寻常的，一下就是三两天。可别恼。看，像牛毛，像花针，像细丝，密密地斜织着，人家屋顶上全笼着一层薄烟。
树叶子却绿得发亮，小草也青得逼你的眼。傍晚时候，上灯了，一点点黄晕的光，烘托出一片安静而和平的夜。
乡下去，小路上，石桥边，有撑起伞慢慢走着的人；还有地里工作的农夫，披着蓑，戴着笠的。他们的草屋，稀稀疏疏的，
在雨里静默着。
天上风筝渐渐多了，地上孩子也多了。城里乡下，家家户户，老老小小，他们也赶趟儿似的，一个个都出来了。
舒活舒活筋骨，抖擞抖擞精神，各做各的一份事去。“一年之计在于春”，刚起头儿，有的是工夫，有的是希望。
春天像刚落地的娃娃，从头到脚都是新的，他生长着。
春天像小姑娘，花枝招展的，笑着，走着。
春天像健壮的青年，有铁一般的胳膊和腰脚，他领着我们上前去。
盼望着，盼望着，东风来了，春天的脚步近了。
一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸红起来了。
小草偷偷地从土里钻出来，嫩嫩的，绿绿的。园子里，田野里，瞧去，一大片一大片满是的。
坐着，躺着，打两个滚，踢几脚球，赛几趟跑，捉几回迷藏。风轻悄悄的，草软绵绵的。
桃树、杏树、梨树，你不让我，我不让你，都开满了花赶趟儿。红的像火，粉的像霞，白的像雪。
花里带着甜味儿；闭了眼，树上仿佛已经满是桃儿、杏儿、梨儿。花下成千成百的蜜蜂嗡嗡地闹着，
大小的蝴蝶飞来飞去。野花遍地是：杂样儿，有名字的，没名字的，散在草丛里，像眼睛，像星星，
还眨呀眨的。
“吹面不寒杨柳风”，不错的，像母亲的手抚摸着你。风里带来些新翻的泥土的气息，混着青草味儿，
还有各种花的香，都在微微润湿的空气里酝酿。鸟儿将窠巢安在繁花嫩叶当中，高兴起来了，
呼朋引伴地卖弄清脆的喉咙，唱出宛转的曲子，与轻风流水应和着。牛背上牧童的短笛，这时候也成天在嘹亮地响。
雨是最寻常的，一下就是三两天。可别恼。看，像牛毛，像花针，像细丝，密密地斜织着，人家屋顶上全笼着一层薄烟。
树叶子却绿得发亮，小草也青得逼你的眼。傍晚时候，上灯了，一点点黄晕的光，烘托出一片安静而和平的夜。
乡下去，小路上，石桥边，有撑起伞慢慢走着的人；还有地里工作的农夫，披着蓑，戴着笠的。他们的草屋，稀稀疏疏的，
在雨里静默着。
天上风筝渐渐多了，地上孩子也多了。城里乡下，家家户户，老老小小，他们也赶趟儿似的，一个个都出来了。
舒活舒活筋骨，抖擞抖擞精神，各做各的一份事去。“一年之计在于春”，刚起头儿，有的是工夫，有的是希望。
春天像刚落地的娃娃，从头到脚都是新的，他生长着。
春天像小姑娘，花枝招展的，笑着，走着。
春天像健壮的青年，有铁一般的胳膊和腰脚，他领着我们上前去。
    </pre
          >
        </div>
        <div style="text-align: center; margin-top: 25px">
          <el-button type="primary" @click="currentsetp = 2"
            >阅读并接受协议</el-button
          >
        </div>
      </div>

      <div v-show="currentsetp == 2" style="width: 60%; margin: 10px auto">
        <el-alert
          title="温馨提示：本地税盘，请先插入再进行税盘设置，若为托管税盘请联系客服设置"
          type="success"
        >
        </el-alert>
        <el-form
          ref="addNewtaxDiskForm"
          label-width="120px"
          label-position="right"
          :model="diskInfoForm"
          :rules="rules"
        >
          <el-form-item label="税盘名称：" prop="taxDiskName">
            <el-input
              size="small"
              style="width: 80%"
              v-model.trim="diskInfoForm.taxDiskName"
            ></el-input>
          </el-form-item>
          <el-form-item label="税盘类型：" prop="diskType">
            <el-select
              placeholder="请选择税盘类型"
              size="small"
              style="width: 80%"
              v-model="diskInfoForm.diskType"
            >
              <el-option label="金税盘" :value="1"></el-option>
              <el-option label="税控盘" :value="2"></el-option>
              <el-option label="税务ukey" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="税盘编号：" prop="taxDiskNum">
            <el-input
              size="small"
              style="width: 80%"
              maxlength="12"
              v-model.trim="diskInfoForm.taxDiskNum"
            ></el-input>
          </el-form-item>
          <el-form-item label="税盘状态：" prop="onlineLocation">
            <el-radio-group v-model="diskInfoForm.onlineLocation">
              <el-radio :label="1">本地税盘</el-radio>
              <el-radio :label="2" disabled>托管</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="税盘密码：" prop="taxDiskPassword" v-if="diskInfoForm.diskType != '1'">
            <el-input
              size="small"
              style="width: 80%"
              maxlength="16"
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="diskInfoForm.taxDiskPassword"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="数字证书口令："
            prop="digitalCertificatePassword"
          >
            <el-input
              size="small"
              style="width: 80%"
              maxlength="16"
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model.trim="diskInfoForm.digitalCertificatePassword"
            ></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button type="primary" @click="currentsetp = 1">上一步</el-button>
          <el-button type="primary" @click="setNewTaxDisk">下一步</el-button>
        </div>
      </div>
      <div v-show="currentsetp == 3" style="width: 60%; margin: 0 auto">
        <el-form
          ref="companyInfoForm"
          label-width="120px"
          label-position="right"
          :model="companyInfo"
        >
          <el-form-item label="企业名称：" prop="companyName">
            <el-input
              size="small"
              disabled
              v-model="companyInfo.companyName"
            ></el-input>
          </el-form-item>
          <el-form-item label="纳税人识别号：" prop="taxId">
            <el-input
              size="small"
              disabled
              v-model="companyInfo.taxId"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="注册地址："
            prop="district"
            :rules="{
              required: true,
              message: '请选择注册地址',
              trigger: 'change',
            }"
          >
            <el-select
              @change="getCityList()"
              placeholder="请选择省份"
              style="width: 30%"
              size="small"
              v-model="companyInfo.province"
            >
              <el-option
                v-for="attr in provinceList"
                :key="attr.code"
                :label="attr.name"
                :value="attr.code"
              ></el-option>
            </el-select>
            <el-select
              @change="getDistrictList()"
              placeholder="请选择市"
              style="width: 30%; margin: 0 5%"
              size="small"
              v-model="companyInfo.city"
            >
              <el-option
                v-for="attr in cityList"
                :key="attr.code"
                :label="attr.name"
                :value="attr.code"
              ></el-option>
            </el-select>
            <el-select
              placeholder="请选择区"
              v-model="companyInfo.district"
              style="width: 30%"
              size="small"
            >
              <el-option
                v-for="attr in districtList"
                :key="attr.code"
                :label="attr.name"
                :value="attr.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="地址电话："
            prop="sellerAddrTel"
            :rules="{
              required: true,
              message: '请输入地址电话',
              trigger: 'blur',
            }"
          >
            <el-input
              size="small"
              v-model="companyInfo.sellerAddrTel"
            ></el-input>
          </el-form-item>
          <el-form-item label="开户行及账号：" prop="sellerBankAccount">
            <el-input
              size="small"
              v-model="companyInfo.sellerBankAccount"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="开票人："
            prop="kpr"
            :rules="{
              required: true,
              message: '请输入开票人',
              trigger: 'blur',
            }"
          >
            <el-input size="small" v-model="companyInfo.kpr"></el-input>
          </el-form-item>
          <el-form-item label="收款人：" prop="skr">
            <el-input size="small" v-model="companyInfo.skr"></el-input>
          </el-form-item>
          <el-form-item label="复核人：" prop="fhr">
            <el-input size="small" v-model="companyInfo.fhr"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button type="primary" @click="currentsetp = 2">上一步</el-button>
          <el-button type="primary" @click="saveCompanyInfo">下一步</el-button>
        </div>
      </div>
      <div v-if="currentsetp == 4" style="text-align: center">
        <div
          style="
            height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <div>
            <span
              class="el-icon-success"
              style="color: #52c41a; font-size: 70px"
            ></span>
            <h3>初始化完成</h3>
            <h2>欢迎使用电专工厂</h2>
          </div>
        </div>
        <div>
          <el-button type="primary" @click="currentsetp = 3">上一步</el-button>
          <el-button type="primary" @click="completeSetDisk">确定</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import x2js from 'x2js'
import { validUsername } from "@/utils/validate";
import { checkTaxDiskIsOnline ,invoiceInquiryInit ,companyDiskRegistrationCodeInit} from "@/api/loginprocessApi.js";
import request from '@/utils/request'
import {
  getProvinceListApi,
  getCityListApi,
  addApanApi,
  companyInfoInit,
  listXiaoApi,
} from "@/api/setpan.js";
const X2JS= new x2js();
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      form: {},
      setTemplateVisible: false,
      companyInfoSetting:false,
      currentsetp: 1,
      loginForm: {
        userName: "",
        password: "",
      },
      loginRules: {
        userName: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      rules: {
        taxDiskName: [
          { required: true, message: "请输入税盘名称", trigger: "blur" },
         
        ],
        diskType: [
          { required: true, message: "请选择税盘类型", trigger: "change" },
        ],
        taxDiskNum: [
          { required: true, message: "请输入税盘编号", trigger: "blur" },
          { min: 11, max: 12, message: "请填写11位或12位税盘号" },
        ],
        onlineLocation: [
          { required: true, message: "请选择税盘状态", trigger: "change" },
        ],
        taxDiskPassword: [
          { required: true, message: "请输入税盘密码", trigger: "blur" },
          { min: 6, max: 16, message: "请填写6-16位数字" },
        ],
        digitalCertificatePassword: [
          { required: true, message: "请输入数字证书口令", trigger: "blur" },
          { min: 6, max: 16, message: "请填写6-16位数字" },
        ],
      },
      provinceList: [], //省
      cityList: [], //市
      districtList: [], //区
      loading: false,
      passwordType: "password",
      redirect: undefined,
      selectDiskVisible: false,
      taxDiskList: [],
      diskInfoForm: {
        taxDiskName: "",
        diskType: "",
        taxDiskNum: "",
        onlineLocation: 1,
        taxDiskPassword: "",
        digitalCertificatePassword: "",
      },
      companyInfo: {
        companyName: "",
        taxId: "",
        registerAddress: "",
        sellerAddrTel: "",
        sellerBankAccount: "",
        kpr: "",
        skr: "",
        fhr: "",
      },
      currentTaxDisk: "",
    };
  },
   computed: {
    ...mapState('user', [
      'loginInfo','taxDiskInfo'
    ])
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },

     //忘记密码
    forgetPassword() {
      this.$router.push({ path: "/resetPassword" });
    },
    //登录
    loginFun() {
      clearInterval(localStorage.getItem('setIntervalId'))
      this.$store.dispatch("user/login", this.loginForm, true).then((res) => {
          if (res.code == 200) {
            this.$store.dispatch("user/listByTokenApi").then(() => {
              this.taxDiskList = this.$store.state.user.taxDiskList;
              if (this.taxDiskList.length==0) {
                //登录成功后没有税盘跳转到引导设置盘
                const loginInfo = this.$store.state.user.loginInfo;
                this.companyInfo.companyName = loginInfo.companyName;
                this.companyInfo.taxId = loginInfo.taxId;
                this.setTemplateVisible = true;
                this.getProvinceList();
              } else {
                //有盘打开选择盘弹窗
                this.selectDiskVisible = true;
              }
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
   //同时用于获取ukey盘信息和税盘密码的参数
    getXmlParam1(key){
        return {
        "xml": `<?xml version=\"1.0\" encoding=\"utf-8\"?>
          <business comment=\"税控设备信息查询\" id=\"SKSBXXCX\">
          <body yylxdm=\"1\">
          <input>
          <sksbkl>${key}</sksbkl>
          </input>
          </body>
          </business>`
        }
    },
    //税务u-key验证数字证书密码参数
    getXmlParam2(digitalCertificatePassword,taxDiskPassword){
         return {
            "xml": `<?xml version=\"1.0\" encoding=\"utf-8\"?><business comment=\"证书口令验证\" id=\"ZSKLYZ\">
                    <body yylxdm=\"1\">
                    <input>
                    <zskl>${digitalCertificatePassword}</zskl>
                    <sksbkl>${taxDiskPassword}</sksbkl>
                    </input>
                    </body>
                    </business>`
               }
    },

     //导入税控盘注册码参数
       getXmlParam3(zcmxx){
               return {"xml":`<?xml version=\"1.0\" encoding=\"gbk\"?><business comment=\"注册码信息导入\" id=\"ZCMDR\">
  <body yylxdm=\"1\">
    <input>
      <zcmxx>${zcmxx}</zcmxx>
    </input>
  </body>
</business>`}
       },


        //税控盘查询盘信息和检验税盘密码参数
       getXmlParam4(skpkl){
    return {"xml":`<?xml version=\"1.0\" encoding=\"gbk\"?>
<business comment=\"税控盘信息查询\" id=\"SKPXXCX\">
    <body yylxdm=\"1\">
        <input>
            <skpkl>${skpkl}</skpkl>
        </input>
    </body>
</business>`}
       },
          //税控盘验证数字证书密码参数
       getXmlParam5(skpInfo){
    return {
  "xml": `<?xml version=\"1.0\" encoding=\"gbk\"?><business comment=\"监控数据查询\" id=\"JKSJCX\">
  <body yylxdm=\"1\">
    <input>
      <nsrsbh>${skpInfo.nsrsbh}</nsrsbh>
      <skpbh>${skpInfo.skpbh}</skpbh>
      <skpkl>${this.taxDiskInfo.taxDiskPassword}</skpkl>
      <keypwd>${this.taxDiskInfo.digitalCertificatePassword}</keypwd>
      <fplxdm>${skpInfo.fplxdm}</fplxdm>
    </input>
  </body>
</business>`
}
       },

       

          //金税盘获取盘信息和验证数字证书密码参数
       getXmlParam6(keypwd){
               return  {"xml":`<?xml version=\"1.0\" encoding=\"utf-8\"?>
<business comment=\"打开金税卡\" id=\"OpenCard\">
    <body yylxdm=\"1\">
        <input>
            <keypwd>${keypwd}</keypwd>
        </input>
    </body>
</business>`}
       },
     
    

    //检查本地是否插盘方法
    GetTaxDeviceStates(){
       return  request({
                  url: 'http://localhost:13769/TaxDisk/GetTaxDeviceStates',
                  method: 'get',
                })
    },
    //登录成功后台初始化调用以及设置监听是否拔盘（A3）
   
    completeLogin(diskId){
          this.$store.commit("user/SET_diskIsOnline", '1');
      let GetTaxDeviceStates=this.GetTaxDeviceStates
       function  watchDiskStatus(){
           const judgeOff=setInterval(() => {
           GetTaxDeviceStates().then((res)=>{
                         if(res.code!='0'){
                         //变更盘状态为断开
                        this.$store.commit("user/SET_diskIsOnline", '0');
                         console.log('盘已断开')
                        clearInterval(judgeOff)
                const judgeOn=setInterval(()=>{
                    GetTaxDeviceStates().then((res)=>{
                        if(res.code=='0'){
                          //变更状态为在线
                          this.hasDiskInsert(res)
                          clearInterval(judgeOn)
                          watchDiskStatus()
                        }
                    })
                },2000)
                 localStorage.setItem('setIntervalId',judgeOn)
                  }
                  })
        }, 2000);
        localStorage.setItem('setIntervalId',judgeOff)

        }
        watchDiskStatus()
        invoiceInquiryInit(diskId);
    },
    //确定本地插入盘后流程(A1)
      hasDiskInsert(res){
                 //插盘连接盘
                  request({
                  url: 'http://localhost:13769/TaxDisk/ConnectTaxDisk',
                  method: 'get',
                }).then((connectres)=>{
                  if(connectres.code=='0'){
                       //当前登录账号选择的盘号与插入盘号是否一致
                           let istheSame=res.data.diskId==this.taxDiskInfo.taxDiskNum
                           if(istheSame){
                            //验证数字证书密码
                            let judgeDigitPassword=(url,param)=>{
                                  request({
                                       url: url,
                                       method: 'post',
                                       data:param
                                      }).then((res2)=>{
                                           let  isRight = X2JS.xml2js( res2.data ).business.body.output;
                                           if(isRight.returncode=='0'){
                                               request({
                                               url: 'http://localhost:13769/TaxDisk/StartServer',
                                               method: 'post',
                                               data:{taxId:isRight.nsrsbh||isRight.qysh||this.loginInfo.taxId,diskId:this.taxDiskInfo.taxDiskNum}
                                              }).then(()=>{
                                                  //流程结束
                                                this.$router.push({ path: "./dashboard" });
                                                this.completeLogin(isRight.sksbbh);
                                              })
                                             
                                           }else{

                                             this.$message({
                                             message: isRight.returnmsg+'请至税盘设置模块检查税盘密码和口令是否正确',
                                             type: "warning",
                                            })
                                           }
                                      })
                            }
                             if(res.type=='Skp'){
                               //税控盘需导入注册码
                               companyDiskRegistrationCodeInit({taxDiskNum:res.data.diskId}).then((coderes)=>{
                                    if(coderes==200){
                                      registrationCode=coderes.data.registrationCode
                                      request({
                                       url: 'http://localhost:13769/TaxDisk/SkpOperate  ',
                                       method: 'post',
                                       data:this.getXmlParam3(registrationCode)
                                      }).then(()=>{
                                      request({
                                       url: 'http://localhost:13769/TaxDisk/SkpOperate  ',
                                       method: 'post',
                                       data:this.getXmlParam4(this.taxDiskInfo.taxDiskPassword)
                                      }).then((skpInfo)=>{
                                           if(skpInfo.code=='0'){
                                            judgeDigitPassword('http://localhost:13769/TaxDisk/SkpOperate',this.getXmlParam5(skpInfo))
                                           } 
                                      })
                                       
                                      })
                                    }
                               })

                             }else if(res.type=='SWUKey'){
                                  judgeDigitPassword('http://localhost:13769/TaxDisk/SWUKeyOperate',this.getXmlParam2(this.taxDiskInfo.digitalCertificatePassword,this.taxDiskInfo.taxDiskPassword))
                             }else if(res.type=='Jsp'){
                                  judgeDigitPassword('http://localhost:13769/TaxDisk/JspOperate',this.getXmlParam6(this.taxDiskInfo.digitalCertificatePassword))
                             }
                             
                           }else{
                           //当前登录账号选择的盘与当前插入的盘号不同(A2)
                                    const judgeOff=setInterval(() => {
                                       this.GetTaxDeviceStates().then((res)=>{
                                       if(res.code!='0'){
                                       console.log('A2盘已断开')
                                       clearInterval(judgeOff)
                                       const judgeOn=setInterval(()=>{
                                        this.GetTaxDeviceStates().then((res)=>{
                                        if(res.code=='0'){
                                         console.log('A2重新插盘')
                                         clearInterval(judgeOn)
                                         this.hasDiskInsert(res)
                                         }
                                        })
                                       },2000)
                                      localStorage.setItem('setIntervalId',judgeOn)
                                      }
                                     })
                                   }, 2000);
                                    localStorage.setItem('setIntervalId',judgeOff)  
                                this.$alert('插入盘与登录时选择的税盘盘号不同，请检查税盘是否正确', {
                                confirmButtonText: '知道了',
                                title:'税盘信息不一致',
                                iconClass:'el-icon-warning'
                             });
                           }
                   
                  }
                   
                })   
         },

    //确定税盘之后流程
    confirmDisk(currentdisk){
         //检查盘是否在线
      checkTaxDiskIsOnline(currentdisk.taxDiskNum).then((res) => {
        if (res.code == 200 ) {
            //在线
          if(res.data){
              this.$store.commit("user/SET_diskIsOnline", '1');
                //不是托管 流程结束
          if (currentdisk.onlineLocation == 1) {
            this.$router.push({ path: "./dashboard" });
            this.completeLogin(currentdisk.taxDiskNum)
            //启动A3(监听是否断开)

          } else {
            //是托管 检查企业销方是否完整
            listXiaoApi(currentdisk.taxDiskNum).then((res) => {
              if (res.code == 200) {
                if (res.data.length > 0) {
                  //完整调用后台初始化数据接口 流程结束
                    this.$router.push({ path: "./dashboard" });
                   invoiceInquiryInit(currentdisk.taxDiskNum);
                } else {
                     //否则引导初始设置（同意协议、设置盘、企业信息、完成）
                     this.setTemplateVisible=true;
                     this.getProvinceList();
                }
              }
            });
          }
         }else{
               this.$store.commit("user/SET_diskIsOnline", '0');
           //不在线
            if (currentdisk.onlineLocation == '1') {
            //不是托管 检查企业销方是否完整
             listXiaoApi(currentdisk.taxDiskNum).then((res) => {
              if (res.code == 200) {
                if (res.data.length > 0) {
                  //完整检查是否插盘
                 this.GetTaxDeviceStates().then((res)=>{
                      if(res.code=='0'){
                        //本地有插盘 (需要封装公共方法，轮询有相同逻辑)
                        this.hasDiskInsert(res)
                        
                      }else{
                     //没盘提示插盘 并启动网页轮询(A1)
                    let tiemID=setInterval(() => {
                       this.GetTaxDeviceStates().then((res)=>{
                         if(res.code=='0'){
                            clearInterval(tiemID)
                            this.hasDiskInsert(res)
                         }
                       })
                    }, 2000);
                     localStorage.setItem('setIntervalId',tiemID)
                    this.$alert(res.message, {
                    confirmButtonText: '确定',

                  });}
                  })
                } else {
                  //否则引导设置企业信息
                   this.$confirm("企业销方信息不完整，请进行初始设置", "温馨提示", {
                    confirmButtonText: "确定",
                    cancelButtonText:'',
                    type: "warning",
                  }).then(() => {
                       this.companyInfo.companyName = this.loginInfo.companyName;
                       this.companyInfo.taxId = this.loginInfo.taxId;
                       this.companyInfoSetting=true
                       this.getProvinceList();
                    })
                }
              }
            });
          }else{
            //是托管 提示联系客服
             this.$alert('请联系客服人员解决', {
              confirmButtonText: '知道了',
              title:'税盘不在线',
              iconClass:'el-icon-warning'
            });
          }
         }
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    //选择税盘
    handleDiskChange() {
      //保存当前选择盘信息
      let disk = this.currentTaxDisk;
      let diskInfo = { l_label: disk.taxDiskName + disk.taxDiskNum, ...disk };
      this.$store.commit("user/SET_TAXDISK", diskInfo);
      this.confirmDisk(disk)
    },
    //保存新设置盘信息
    setNewTaxDisk() {
      this.$refs["addNewtaxDiskForm"].validate((valid) => {
      
        if (valid) {
          //判断本地是否插盘
          this.GetTaxDeviceStates().then((res)=>{
                      if(res.code=='0') {
                           let diskIstheSame =false
              switch (res.data.type){
                  case 'Jsp':
                    diskIstheSame=this.diskInfoForm.diskType==1
                  break;
                  case 'Skp':
                    diskIstheSame=this.diskInfoForm.diskType==2
                  break;
                  case 'SWUKey':
                    diskIstheSame=this.diskInfoForm.diskType==3
                  break;
              }

              if(!diskIstheSame){
                   this.$message({
                            message: "请选择所插入的税盘类型",
                            type: "warning",
                          });
                  return
              }
                        if(res.data.diskId==this.diskInfoForm.taxDiskNum){
                           //插盘连接盘
                            request({
                            url: 'http://localhost:13769/TaxDisk/ConnectTaxDisk',
                            method: 'get',
                           }).then((res2)=>{
                               if(res2.code=='0'){
                                  if(res.data.type=='Jsp'){

                            }else if(res.data.type=='SWUKey'){
                            console.log('swukey')
                          //判断税盘密码是否正确
                            request({
                            url: 'http://localhost:13769/TaxDisk/SWUKeyOperate',
                            method: 'post',
                            data:this.getXmlParam1(this.diskInfoForm.taxDiskPassword)
                           }).then((res3)=>{
                               if(res3.code=='0'){
                                let  diskInfo = X2JS.xml2js( res3.data ).business.body.output;
                                 if(diskInfo.returncode=='0'){
                                   //密码正确  判断税号是否相同
                                    console.log(diskInfo)
                                    if(diskInfo.nsrsbh==this.loginInfo.taxId){
                                        //相同 判断是否税控盘
                                        if(res.data.type=='Skp'){

                                        }else{
                                        
                                      //判断数字证书口令是否正确
                                       request({
                                       url: 'http://localhost:13769/TaxDisk/SWUKeyOperate',
                                       method: 'post',
                                       data:this.getXmlParam2(this.diskInfoForm.digitalCertificatePassword,this.diskInfoForm.taxDiskPassword)
                                         }).then((res4)=>{
                                           let  isRight = X2JS.xml2js( res4.data ).business.body.output;
                                           console.log(isRight)
                                           if(isRight.returncode=='0'){
                                                let params = {
                                                companyId: this.$store.state.user.loginInfo.companyId,
                                                // createBy: this.$store.state.user.loginInfo.username,
                                               ...this.diskInfoForm,
                                               };
                                            addApanApi(params).then((res) => {
                                            if (res.code == 200) {
                                             let diskInfo = { l_label: params.taxDiskName + params.taxDiskNum, ...params};
                                             this.$store.commit("user/SET_TAXDISK", diskInfo);
                                             this.currentsetp = 3;
                                             } else {
                                            this.$alert(res.msg, {
                                            confirmButtonText: '知道了',
                                            title:'税盘初始化失败',
                                            type:'error'
                                              });
                                             }
                                            });
                                           }else{
                                            this.$alert(isRight.returnmsg, {
                                            confirmButtonText: '知道了',
                                            title:'税盘初始化失败',
                                            type:'error'
                                              });
                                           }
                                                  
                                         })
                                      }
                                    }else{
                                           this.$message({
                                           message: '企业税号不同',
                                           type: "warning",
                                          })
                                    }
                                 }else{
                                   //密码不正确
                                    this.$message({
                                          message: diskInfo.returnmsg,
                                          type: "warning",
                                        })
                                 }
                               }
                           })     
                          }
                               }
                           })    
                        }else{
                         this.$message({
                         message: '盘号不符',
                         type: "warning",
                        })
                        }
                      }else{
                         this.$alert('请插入税盘后重试', {
                         confirmButtonText: '知道了',
                         title:'税盘不在线',
                         iconClass:'el-icon-warning'
                        });
                      }
                  })
        }
      });
    },
    //初始话销方企业信息
    saveCompanyInfo() {
      this.$refs["companyInfoForm"].validate((valid) => {
        console.log(valid);
        if (valid) {
          let param = {
            taxDiskNum: this.$store.state.user.taxDiskInfo.taxDiskNum,
            ...this.companyInfo,
          };
          companyInfoInit(param).then((res) => {
            if (res.code == 200) {
              this.currentsetp = 4;
            }
          });
        }
      });
    },
    saveCompanyInfoSetting(){
        this.$refs["companyInfoForm"].validate((valid) => {
        console.log(valid);
        if (valid) {
          let param = {
            taxDiskNum: this.$store.state.user.taxDiskInfo.taxDiskNum,
            ...this.companyInfo,
          };
          companyInfoInit(param).then((res) => {
            if (res.code == 200) {
            
            }
          });
        }
      });
    },
    //完成税盘设置后的流程
    completeSetDisk(){
     this.setTemplateVisible = false
     this.confirmDisk(this.$store.state.user.taxDiskInfo)
    },

    // 省
    getProvinceList() {
      getProvinceListApi().then((response) => {
        this.provinceList = response.data;
      });
    },
    // 市
    getCityList() {
       this.companyInfo.city=''
       this.companyInfo.district=''
       this.districtList=[]
      if (this.companyInfo.province != "") {
        getCityListApi(this.companyInfo.province).then((response) => {
          this.cityList = response.data;
        });
      }
    },
    // 区
    getDistrictList() {
      if (this.companyInfo.city != "") {
        getCityListApi(this.companyInfo.city).then((response) => {
          this.districtList = response.data;
        });
      }
    },
  },
};
</script>

<style  scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #0d1d30;
  position: relative;
}

.main {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
}

.main_U > img {
  width: 270px;
  height: 270px;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 350px;
  height: 450px;
  padding: 58px 40px 33px 40px;
}

.title {
  width: 85px;
  font-size: 20px;
  margin: 0px auto 10px auto;
  text-align: center;
  color: #333333;
  padding-bottom: 8px;
}

.el-input {
  height: 32px;
}

input {
  outline: none;
  height: 38px;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-radius: 0;
}

input:focus {
  color: rgba(6, 104, 185, 1);
}

.color-class {
  color: rgba(6, 104, 185, 1);
}

.input-icon {
  height: 39px;
  width: 19px;
  margin-left: 2px;
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  user-select: none;
}
.tips {
  font-size: 14px;
  color: #fff;
  margin-left: 200px;
  margin-top: -40px;
}
.el-form-item {
  margin-bottom: 15px;
}
.login >>> .el-dialog__header {
  border-bottom: 1px solid #ddd;
}
</style>
