<template>
  <div class="page-container">
    <div class="title">
      <!-- <i
        class="el-icon-arrow-left"
        style="cursor: pointer"
        @click="$router.push('/settings/index')"
      ></i>
      <span @click="$router.push('/settings/index')" style="cursor: pointer"
        >初始设置</span
      > -->
      <breadnav textTitle="初始设置" @leftEvent='clickLeft'/>
      <el-button
        type="primary"
        class="newadd"
        v-show="showButton"
        @click="newadd"
        >新增</el-button
      >
    </div>
    <div class="navigation">
      <el-tabs
        :tab-position="tabPosition"
        v-model="tabName"
        @tab-click="buttonShow"
      >
        <el-tab-pane label="企业信息" name="qyxx">
          <div class="information">
            <div class="prompt" v-show="show">
              <i class="el-icon-info"></i>
              <span
                >温馨提示：准确填写以下信息，将会获取更准确的税收政策推送！</span
              >
              <i class="el-icon-close" @click="hidden"></i>
            </div>
            <div class="content">
              <el-form
                :model="form1"
                :rules="rules1"
                ref="form1"
                label-width="150px"
                label-suffix=":"
              >
                <el-form-item label="企业名称">
                  <span>{{ form1.companyName }}</span>
                </el-form-item>
                <el-form-item label="纳税人识别号">
                  <span>{{ form1.taxId }}</span>
                </el-form-item>
                <el-form-item label="注册地址" prop="district">
                  <el-select
                    v-model="form1.province"
                    @change="getCityList()"
                    placeholder="请选择省份"
                  >
                    <el-option
                      v-for="attr in listSheng"
                      :key="attr.code"
                      :label="attr.name"
                      :value="attr.code"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-model="form1.city"
                    @change="getCityList1()"
                    placeholder="请选择市"
                  >
                    <el-option
                      v-for="attr in listShi"
                      :key="attr.code"
                      :label="attr.name"
                      :value="attr.code"
                    ></el-option>
                  </el-select>
                  <el-select v-model="form1.district" placeholder="请选择区">
                    <el-option
                      v-for="attr in listQu"
                      :key="attr.code"
                      :label="attr.name"
                      :value="attr.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="纳税人性质" prop="resource">
                  <el-radio-group v-model="form1.taxpayerNature">
                    <el-radio :label="1">一般纳税人</el-radio>
                    <el-radio :label="2">小规模纳税人</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="行业类型">
                  <el-select
                    v-model="form1.companyType"
                    placeholder="请选择"
                    style="width: 295px"
                  >
                    <el-option
                      v-for="attr in optionsType"
                      :key="attr.code"
                      :label="attr.industryName"
                      :value="attr.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="增值税合理税负率">
                  <el-input-number
                    v-model="form1.vatReasonableRateMin"
                    controls-position="right"
                    :precision="2"
                    :step="0.5"
                    :max="100"
                    @change="boxNumChange"
                  ></el-input-number>
                  <span class="symbol">%</span>
                  <span class="symbol" style="margin-left: -3px">—</span>
                  <el-input-number
                    v-model="form1.vatReasonableRateMax"
                    controls-position="right"
                    :precision="2"
                    :step="0.5"
                    :max="100"
                    @change="boxNumChange1"
                  ></el-input-number>
                  <span class="symbol">%</span>
                  <div class="el-form-item__error" v-if="showTips">
                    请勿输入大于右侧输入框的值
                  </div>
                </el-form-item>
                <el-form-item label="税务机关代码">
                  <span>{{ form1.taxBureauCode }}</span>
                </el-form-item>
                <el-form-item label="税务机关名称">
                  <span>{{ form1.taxBureauName }}</span>
                </el-form-item>
              </el-form>
            </div>
            <el-button type="primary" @click="getSaveComany('form1')"
              >保存</el-button
            >
          </div>
        </el-tab-pane>

        <el-tab-pane label="税盘设置" name="spsz">
          <div class="tax-disc">
            <el-table
              :header-cell-style="{ background: '#eef1f6', color: '#000 0.85' }"
              :data="taxData"
              tooltip-effect="dark"
              style="width: 100%"
            >
              <div slot="empty">
                <listnodate :tableFlag="noDateFlag" />
              </div>
              <el-table-column prop="diskType" label="税盘类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.diskType == '1'">金税盘</span>
                  <span v-else-if="scope.row.diskType == '2'">税控盘</span>
                  <span v-else-if="scope.row.diskType == '3'">税务ukey</span>
                </template>
              </el-table-column>
              <el-table-column prop="taxDiskName" label="税盘名称">
              </el-table-column>
              <el-table-column prop="taxDiskNum" label="税盘编号">
              </el-table-column>
              <el-table-column prop="onlineLocation" label="税盘状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.onlineLocation == '1'">本地</span>
                  <span v-else-if="scope.row.onlineLocation == '2'">托管</span>
                </template>
              </el-table-column>
              <el-table-column prop="taxDiskPassword" label="税盘密码">
              </el-table-column>
              <el-table-column
                prop="digitalCertificatePassword"
                label="数字证书口令"
              >
              </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="taxEdit(scope.row, '1')"
                    size="mini"
                    :disabled="scope.row.onlineLocation == '2'"
                    >修改
                    <!--  -->
                  </el-button>
                  <el-button
                    type="text"
                    @click.native.prevent="taxDel(scope.$index, taxData)"
                    size="mini"
                    :disabled="scope.row.onlineLocation == '2' || scope.row.taxDiskNum==taxDiskNum"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="销方设置" name="xfsz">
          <div class="annul-set-just">
            <el-table
              :header-cell-style="{ background: '#eef1f6', color: '#000 0.85' }"
              :data="annulData"
              tooltip-effect="dark"
              style="width: 100%"
            >
              <div slot="empty">
                <listnodate :tableFlag="noDateFlag" />
              </div>
              <el-table-column prop="taxDiskName" label="税盘名称">
              </el-table-column>
              <el-table-column prop="taxDiskNum" label="税盘编号">
              </el-table-column>
              <el-table-column
                prop="sellerAddrTel"
                label="地址电话"
                width="150"
              >
              </el-table-column>
              <el-table-column
                prop="sellerBankAccount"
                label="开户行及账号"
                width="180"
              >
              </el-table-column>
              <el-table-column prop="kpr" label="开票人"> </el-table-column>
              <el-table-column prop="skr" label="收款人"> </el-table-column>
              <el-table-column prop="fhr" label="复核人"> </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="xiaoFangEdit(scope.row, '1')"
                    size="mini"
                    >修改
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    :disabled="annulData.length==1 || scope.row.defFlag == '1'"
                    @click.native.prevent="xiaoDel(scope.$index, annulData)"
                    >删除</el-button
                  >
                  <el-button
                    type="text"
                    size="mini"
                    :disabled="scope.row.defFlag == '1'"
                    @click="setDefault(scope.row, scope.$index)"
                    >设为默认</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="new-tax-disc">
            <el-dialog
              :title="addOrEditFlag"
              :visible.sync="newadd3"
              width="35%"
              :close-on-click-modal="false"
              @close="closeForm3"
            >
              <el-form
                :model="ruleForm3"
                :rules="rules3"
                ref="ruleForm3"
                label-suffix=":"
                label-width="110px"
              >
                <el-form-item label="税盘名称" prop="taxDiskName">
                  <el-select
                    v-model="ruleForm3.taxDiskNum"
                    placeholder="请选择税盘名称"
                    style="width: 80%"
                  >
                    <el-option
                      v-for="attr in taxData"
                      :key="attr.id"
                      :label="attr.taxDiskName"
                      :value="attr.taxDiskNum"
                    ></el-option>
                  </el-select>
                  <!-- <span
                    class="xfxz"
                    style="cursor: pointer"
                    @click="newadd2 = true"
                    >新增税盘</span
                  > -->
                  <el-button
                    @click="newadd2 = true;editOrAddFlag ='add'"
                    type="text"
                    size="small"
                    style="margin-left: 5px"
                  >
                    新增税盘
                  </el-button>
                </el-form-item>
                <el-form-item label="税盘编号" prop="taxDiskNum">
                  <span>{{ this.ruleForm3.taxDiskNum }} </span>
                </el-form-item>
                <el-form-item label="地址电话" prop="sellerAddrTel">
                  <el-input
                    v-model.trim="ruleForm3.sellerAddrTel"
                    style="width: 80%"
                    placeholder="请输入公司地址、电话"
                  />
                </el-form-item>
                <el-form-item label="开户行及账号" prop="sellerBankAccount">
                  <el-input
                    v-model.trim="ruleForm3.sellerBankAccount"
                    style="width: 80%"
                    placeholder="请输入开户行、银行账号"
                  />
                </el-form-item>
                <el-form-item label="开票人" prop="kpr">
                  <el-input
                    style="width: 80%"
                    maxlength="11"
                    v-model.trim="ruleForm3.kpr"
                    placeholder="请填写开票人"
                  />
                </el-form-item>
                <el-form-item label="收款人" prop="skr">
                  <el-input
                    style="width: 80%"
                    maxlength="11"
                    v-model.trim="ruleForm3.skr"
                    placeholder="请填写收款人"
                  />
                </el-form-item>
                <el-form-item label="复核人" prop="fhr">
                  <el-input
                    style="width: 80%"
                    maxlength="11"
                    v-model.trim="ruleForm3.fhr"
                    placeholder="请填写复核人"
                  />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm3">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </el-tab-pane>

        <el-tab-pane label="打印设置" name="dysz">
          <div class="print">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="专票打印" name="first">
                <div class="one">
                  <el-form
                    ref="form4"
                    :model="form4"
                    label-width="120px"
                    label-suffix=":"
                  >
                    <el-form-item label="专票打印机">
                      <el-select
                        v-model="form4.special"
                        placeholder="请选择"
                        size="small"
                      >
                        <el-option
                          v-for="item in printList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="打印边距">
                      <span>左边距</span>
                      <el-input-number
                      class="inputNum"
                        v-model="numzp"
                        controls-position="right"
                      ></el-input-number>
                      <span>上边距</span>
                      <el-input-number
                      class="inputNum"
                        v-model="zpnum"
                        controls-position="right"
                      ></el-input-number>
                    </el-form-item>
                  </el-form>
                  <el-button class="btn" type="primary" @click="savePrinter"
                    >保存</el-button
                  >
                  <el-button type="primary" @click="testPrint">打印测试页</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="普票打印" name="second">
                <div class="one">
                  <el-form
                    ref="form4"
                    :model="form4"
                    label-width="120px"
                    label-suffix=":"
                  >
                    <el-form-item label="普票打印机">
                      <el-select
                        v-model="form4.general"
                        placeholder="请选择"
                        size="small"
                      >
                        <el-option
                          v-for="item in printList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="打印边距">
                      <span>左边距</span>
                      <el-input-number
                      class="inputNum"
                        v-model="numpp"
                        controls-position="right"
                      ></el-input-number>
                      <span>上边距</span>
                      <el-input-number
                      class="inputNum"
                        v-model="ppnum"
                        controls-position="right"
                      ></el-input-number>
                    </el-form-item>
                  </el-form>
                  <el-button class="btn" type="primary" @click="savePrinter"
                    >保存</el-button
                  >
                  <el-button type="primary" @click="testPrint">打印测试页</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="机动车打印" name="third">
                <div class="one">
                  <el-form
                    ref="form4"
                    :model="form4"
                    label-width="120px"
                    label-suffix=":"
                  >
                    <el-form-item label="机动车打印机">
                      <el-select
                        v-model="form4.motor"
                        placeholder="请选择"
                        size="small"
                      >
                        <el-option
                          v-for="item in printList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="打印边距">
                      <span>左边距</span>
                      <el-input-number
                      class="inputNum"
                        v-model="numjdc"
                        controls-position="right"
                      ></el-input-number>
                      <span>上边距</span>
                      <el-input-number
                      class="inputNum"
                        v-model="jdcnum"
                        controls-position="right"
                      ></el-input-number>
                    </el-form-item>
                  </el-form>
                  <el-button class="btn" type="primary" @click="savePrinter"
                    >保存</el-button
                  >
                  <el-button type="primary" @click="testPrint">打印测试页</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="清单打印" name="fourth">
                <div class="one">
                  <el-form
                    ref="form4"
                    :model="form4"
                    label-width="120px"
                    label-suffix=":"
                  >
                    <el-form-item label="清单打印机">
                      <el-select
                        v-model="form4.listing"
                        placeholder="请选择"
                        size="small"
                      >
                        <el-option
                          v-for="item in printList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                        <!-- <el-option label="专票打印机" value="zp"></el-option>
                        <el-option label="普票打印机" value="pp"></el-option>
                        <el-option label="机动车打印机" value="jdc"></el-option>
                        <el-option label="清单打印机" value="qd"></el-option> -->
                      </el-select>
                    </el-form-item>
                    <el-form-item label="打印边距">
                      <span>左边距</span>
                      <el-input-number
                      class="inputNum"
                        v-model="numqd"
                        controls-position="right"
                      ></el-input-number>
                      <span>上边距</span>
                      <el-input-number
                      class="inputNum"
                        v-model="qdnum"
                        controls-position="right"
                      ></el-input-number>
                    </el-form-item>
                  </el-form>
                  <el-button class="btn" type="primary" @click="savePrinter"
                    >保存</el-button
                  >
                  <el-button type="primary" @click="testPrint">打印测试页</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="小票打印" name="five">
                <div class="one">
                  <el-form
                    ref="form4"
                    :model="form4"
                    label-width="120px"
                    label-suffix=":"
                  >
                    <el-form-item label="小票打印机">
                      <el-select
                        v-model="form4.small"
                        placeholder="请选择"
                        size="small"
                      >
                        <el-option
                          v-for="item in printList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="打印宽度">
                      <!-- <span>左边距</span> -->
                      <el-input-number
                      class="inputNum"
                        v-model="xpWidth"
                        controls-position="right"
                      ></el-input-number>
                      <span>单位：mm</span>

                      <!-- <span>上边距</span>
                      <el-input-number
                        v-model="xpnum"
                        controls-position="right"
                      ></el-input-number> -->
                    </el-form-item>
                  </el-form>
                  <el-button class="btn" type="primary" @click="savePrinter"
                    >保存</el-button
                  >
                  <el-button type="primary" @click="testPrint">打印测试页</el-button>
                </div>
              </el-tab-pane>

              <el-tab-pane label="其他打印" name="six">
                <div class="one">
                  <el-form
                    ref="form4"
                    :model="form4"
                    label-width="120px"
                    label-suffix=":"
                  >
                    <el-form-item label="其他打印机">
                      <el-select
                        v-model="form4.other"
                        placeholder="请选择"
                        size="small"
                      >
                        <el-option
                          v-for="item in printList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="打印边距">
                      <span>左边距</span>
                      <el-input-number
                      class="inputNum"
                        v-model="numother"
                        controls-position="right"
                      ></el-input-number>
                      <span>上边距</span>
                      <el-input-number
                      class="inputNum"
                        v-model="othernum"
                        controls-position="right"
                      ></el-input-number>
                    </el-form-item>
                  </el-form>
                  <el-button class="btn" type="primary" @click="savePrinter"
                    >保存</el-button
                  >
                  <el-button type="primary" @click="testPrint">打印测试页</el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>

        <el-tab-pane label="基本设置" name="jbsz">
          <div class="basic">
            <el-form
              ref="form5"
              :model="form5"
              label-width="150px"
              label-suffix=":"
            >
              <el-form-item label="自动启动">
                <el-checkbox v-model="form5.autostart"
                  >开机自动启动</el-checkbox
                >
              </el-form-item>
              <el-form-item label="关闭主页面板">
                <el-radio-group v-model="form5.panel">
                  <el-radio label="01">最小化到系统托盘</el-radio>
                  <el-radio label="02">退出电专工厂</el-radio>
                </el-radio-group>
              </el-form-item>
              <div class="exit">
                <el-form-item label="自动退出">
                  <el-checkbox v-model="form5.exit">空闲</el-checkbox>
                </el-form-item>
                <div class="minutes">
                  <el-input v-model.trim="form5.exitTime" 
                  @keydown.native="channelInputLimit"
                  type="number"
                  :disabled='!this.form5.exit' ></el-input>
                </div>
                <span>分钟后关闭软件</span>
              </div>
            </el-form>
            <el-button type="primary" @click="save5">保存</el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="参数设置" name="cssz">
          <div class="parameter">
            <el-form
              ref="form6"
              :model="form6"
              label-width="150px"
              label-suffix="："
            >
              <el-form-item label="机动车设置">
                <el-input
                  v-model="form6.barcode"
                  placeholder="请插入机动车扫码枪，选择扫描枪串口"
                ></el-input>
              </el-form-item>
              <el-form-item label="清单开票">
                <el-radio :label="1" v-model="form6.printMode"
                  >全打模式</el-radio
                >
                <el-radio :label="2" v-model="form6.printMode"
                  >套打模式</el-radio
                >
              </el-form-item>
              <el-form-item label="发票预览">
                <el-radio :label="1" v-model="form6.previewMode"
                  >开具后预览发票</el-radio
                >
                <el-radio :label="2" v-model="form6.previewMode"
                  >打印时预览发票</el-radio
                >
              </el-form-item>
              <el-form-item label="电子发票版式">
                税盘名称：
                <span style="margin-left: 5px">{{ form6.taxDiskName }}</span>
              </el-form-item>
              <el-form-item>
                <el-radio label="0" v-model="form6.invoiceFileType">PDF</el-radio>
                <el-radio label="1"  v-model="form6.invoiceFileType" v-show="ofdShow">OFD</el-radio>
                <!-- <el-radio-group v-model="form6.invoiceFileType">
                  <el-radio @click.native.prevent="clickitem(0)" :label="0"
                    >PDF</el-radio
                  >
                  <el-radio
                    @click.native.prevent="clickitem(1)"
                    :label="1"
                    v-show="ofdShow"
                    >OFD</el-radio
                  >
                </el-radio-group> -->
              </el-form-item>
               <el-form-item label="发票类型设置" v-if="this.taxDiskInfo.diskType==1 && this.taxDiskInfo.onlineLocation==1">
                   <el-checkbox-group v-model="invoicetype">
                      <el-checkbox v-for="invoice in invoiceTypes" :label="invoice.code"  :key="invoice.code">{{invoice.name}}</el-checkbox>
                    </el-checkbox-group>
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="save6">保存</el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="关于" name="gy">
          <div class="about">
            <h2>关于我们</h2>
            <p>
              电专工厂集发票管理、信息流转管理、智能报销、智能记账、电子档案管理等功能于一体，致力于提升企业
              运营效率，促进资金流转，远离财税风险，加速企业数字化进程。
            </p>
            <div>
              <el-button type="text" @click="dialogTableVisible = true"
                >《用户服务协议》</el-button
              >
              <el-dialog
                title="用户协议内容"
                :visible.sync="dialogTableVisible"
                width="60%"
                top="20px"
              >
                <div style="height: 500px; overflow-y: auto">
                  <h3>《互联网数据应用许可协议》</h3>
                  <p>
                    在客户点击同意互联网数据应用许可协议（以下简称本协议）的按钮时，意味着客户和
                    <span style="font-weight: 600"
                      >浙江旋极共创科技有限责任公司（以下简称本公司）</span
                    >成立了以下的协议条款：（点击前请仔细阅读，尤其是加黑文字）
                  </p>

                  <p>
                    <span style="font-weight: 600"
                      >1.本协议的内容可能会适时修订，并在网上公告。请予以关注，恕难单独通知，如不同意修订条款，客户有权终止本协议。</span
                    >
                  </p>
                  <p>
                    2.客户应当是符合中国法律的合法主体，本协议受中国大陆法律管辖，适用中国大陆法律，如客户对此有异议，可以停止使用本协议。
                  </p>
                  <p>
                    3.本公司应在法律允许的范围内采集和使用客户的数据信息。<span
                      style="font-weight: 600"
                      >客户签署本协议即表示客户同意一次性授权本公司采集使用客户的数据信息，</span
                    >但如果第三方查询使用客户的数据信息，那么应当经客户的书面同意。
                  </p>
                  <p>
                    <span style="font-weight: 600"
                      >4.特别提示：本公司提供融资服务中第三方机构或相关合法主体要求本公司应贷款业务需要提供客户的数据信息时,本公司将持续如实提供，本公司保证客户提供的数据信息仅用于融资服务，不会用于其它商业目的。但笫三方使用客户的数据信息不是出于融资服务的目的，则应由第三方和客户协商确定，由此产生的法律后果由客户和第三方自行承担。</span
                    >
                  </p>
                  <p>
                    5.客户向本公司提供的数据信息应当合法、真实、有效。否则由此产生的法律责任由客户承担。
                  </p>
                  <p>
                    6.本协议适用中国大陆法律，<span style="font-weight: 600"
                      >因本协议产生所有纠纷应提交上海市虹口区人民法院诉讼解决。</span
                    >
                  </p>

                  <h3>《用户服务协议》</h3>
                  <p>
                    <span style="font-weight: 600"
                      >1.郑重提示：用户一旦使用和接受浙江旋极共创科技有限责任公司（以下简称本公司）服务，即应了解和同意本公司服务协议的全部条款。</span
                    >
                  </p>
                  <p>
                    <span style="font-weight: 600">
                      2.为实现服务目标，用户授权本公司使用其数据信息并可将企业信息、发票数据等数据信息提供给本公司同意的第三方使用。
                    </span>
                  </p>
                  <p>
                    <span style="font-weight: 600">
                      3.为有效开具增值税电子发票，用户授权本公司使用软件生成电子印章“发票专用章”，使用国税颁发的数字证书进行电子签名。
                    </span>
                  </p>
                  <p>
                    4.用户应保证其提供的数据信息真实、完整、合法、有效，并不得在平台上进行违法或本公司不同意的行为。
                  </p>
                  <p>
                    <span style="font-weight: 600"
                      >5.本公司不会泄露给任何未经本公司许可的第三方，但法律规定或政府强制披露除外，由于用户原因或黑客攻击以及不可抗力导致的泄露，本公司也不承担任何责任。</span
                    >
                  </p>
                  <p>
                    6.用户需要对自己的用户名和密码的安全承担保密义务，并保证账号不出现任何异常情况，否则本公司有权采取必要的安全措施（如删除或冻结账号等），由此产生的一切后果由用户承担。
                  </p>
                  <p>
                    <span style="font-weight: 600">
                      7.用户应特别注意：本公司对服务导致的任何直接损失和间接损失不承担任赔偿责任，也不保证不会出现系统缺陷、病毒、黑客攻击以及其它不可抗力等事件，并对此导致的任何损失不承担赔偿责任。
                    </span>
                  </p>
                  <p>
                    <span style="font-weight: 600">
                      8.本公司对任何存储信息具有自主处分权，包括但不限于可以拒绝或删除用户信息，中断或拒绝提供服务，而且不需要事先告知。
                    </span>
                  </p>
                  <p>
                    <span style="font-weight: 600">
                      9.用户行为导致对本公司索赔的用户应承担本公司和关联公司以及相关人员所遭受的一切损失（包括但不限于赔偿费、律师费、诉讼费、仲裁费、差旅费等所有费用）。
                    </span>
                  </p>
                  <p>
                    <span style="font-weight: 600">
                      10.本公司决定变更或终止相关服务，将会通过相关网站进行公告，但不必事先逐个通知，也不对此承担任何责任。
                    </span>
                  </p>
                  <p>
                    <span style="font-weight: 600">
                      11.如用户对变更相关服务有异议，应立即拒绝服务，否则继续接受服务即视为同意本公司的变更。
                    </span>
                  </p>
                  <p>
                    <span style="font-weight: 600">
                      12.本协议适用中国大陆地区法律，因本协议产生任何纠纷经由上海市虹口区人民法院诉讼解决。
                    </span>
                  </p>
                  <p>13.本协议最终解释权由浙江旋极共创科技有限责任公司享有。</p>
                  <h3>《软件许可协议》</h3>
                  <p>
                    用户应认真阅读本（软件许可协议》（下称《协议》）中各条款，尤其包括免除或者限制<span
                      style="font-weight: 600"
                      >浙江旋极共创科技有限责任公司（以下简称本公司）</span
                    >责任的免责条款及对用户的权利限制条款。请在审阅后自愿决定是否接受或不接受本《协议》。<span
                      style="font-weight: 600"
                    >
                      除非用户接受《协议》条款，否则用户无权下载、安装或使用本“软件”及接受相关服务。如果用户选择安装使用本“软件”，将视为用户接受本《协议》及各项条款的约束。
                    </span>
                  </p>
                  <p>
                    本《协议》是用户与本公司之间关于用户下载、安装、使用、复制本公司软件（以下简称“软件”）所订立的协议。本《协议》规定本公司与用户之间关于“软件”许可使用及相关方面的权利义务。“用户”是通过本公司提供的获取软件授权的途径获得软件授权许可和/或软件产品的自然人、法人或其他合法民事主体。
                  </p>

                  <h4>1.权利声明</h4>
                  <p>
                    本“软件”由本公司开发。本“软件”的计算机软件著作权以及与“软件”相关的所有信息内容，包括但不限于：文字表述及其组合、图标、图饰、图表、色彩、界面设计、版面框架、有关数据、印刷材料、或电子文档等均为本公司独立所有，受著作权法和国际著作权公约以及其他知识
                    产权法律法规的保护。
                  </p>
                  <h4>2.用户使用许可授权范围</h4>

                  <p>
                    2.1用户可以在单一计算机（下统称“计算机”）上安装、使用、显示、运行本“软件”。
                  </p>
                  <p>
                    2.2保留权利：本《协议》未明示授权的其他一切权利仍归本公司所有，用户使用未明确授权的其他权利时须另外取得本公司的书面同意。
                  </p>
                  <p>
                    2.3除本《协议》有明确规定外，有些服务可能有单独的服务条款加以规范，请用户在使用这些服务时务必另行了解与确认。如用户使用这些服务，视为对相关单独服务条款的接受。
                  </p>
                  <h4>3.用户使用须知</h4>
                  <p>3.1本公司进项管理服务</p>
                  <p>
                    用户同意并授权本公司使用用户的“税务数字证书”，登陆各级税局机关“增值税发票选择确认平台”、“全国增值税发票查验平台”获取相关信息，并提供增值税发票相关服务，且用户授权是不可撤销的。<span
                      style="font-weight: 600"
                      >用户不当使用本“软件”包含的本公司进项管理服务而引致之任何意外、疏忽、合约毁坏、诽谤、版权或知识产权侵犯及其所造成的损失（包括因下载而感染电脑病毒），本公司概不负责，亦不承担任何法律责任。</span
                    >
                  </p>
                  <p>
                    3.2本“软件”不含有任何旨在破坏用户计算机数据和获取用户隐私信息的恶意代码，不含有任何跟踪、监视用户计算机和/或操作行为的功能代码，不会监控用户网上、网下的行为或泄露用户隐私。
                  </p>
                  <p>
                    3.3用户在遵守法律及本《协议》的前提下可依本《协议》使用本“软件”。用户无权实施包括但不限于下列行为：
                  </p>
                  <p>
                    3.3.1不得删除本“软件”及其他副本上所有关于版权的信息、内容；
                  </p>
                  <p>3.3.2不得对本“软件”进行反向工程、反向汇编、反向编译等；</p>
                  <p>
                    3.3.3对于本“软件”相关信息等，未经本公司书面同意，用户不得擅自实施包括但不限于下列行为：便用、复制、修改、链接、转载、
                    汇编、发表、出版，擅自借助“软件”发展与之有关的衍生产品、作品、服务等。
                  </p>
                  <p>
                    <span style="font-weight: 600">
                      3.4使用本“软件”必须遵守国家有关法律和政策，并遵守本《协议》，对于用户违法或违反本《协议》的使用而引起的一切责任，由用户负全部责任，一概与本公司及合作单位无关，导致本公司及合作单位损失的，本公司及合作单位有权要求用户赔偿，并有权立即停止向其提供服务，保留相关记录，保留配合司法机关追究法律责任的权利。
                    </span>
                  </p>
                  <p>
                    3.5本“软件”同大多数互联网软件一样，可能受到各种安全问题的侵扰；用户利用本“软件”下载安装的其它软件中可能舍有”特洛伊木马“等病毒，威胁到用户的计算机信息和数据的安全，继而影响本“软件”的正常使用等等。因此，本公司提醒用户应加强信息安全及使用者资料的保护意识，要注意加强密码保护，以免遭致损失和骚扰。
                  </p>
                  <p>
                    <span style="font-weight: 600">
                      3.6非经本公司或本公司授权开发并正式发布的其它任何由本“软件”衍生的软件均属非法，下载、安装、使用此类软件，将可能导致不可预知的风险，建议用户不要轻易下载、安装、使用，由此产生的一切法律责任与纠纷一概与本公司无关。
                    </span>
                  </p>
                  <p>
                    3.7本公司保留在任何时候根据适用法律、法规或政府要求的需要而披露任何信息，或由本公司自主决定全部或部分地编辑、拒绝张贴或删除任何信息或资料的权利。
                  </p>
                  <p>
                    3.8隐私权政策：为了给用户提供更好的服务，当用户使用或启动“软件”时，服务器会自动记录一些信息，包括但不限于URL、IP地址、浏览器的类型和使用的语言以及访问日期和时间等。除非取得用户同意、或者政府部门根据法律法规提出要求、或者用户违反了本《协议》的约定、或者维护本公司合法权利等情形，本公司将不会泄露用户的任何使用信息。
                  </p>
                  <p>
                    <span style="font-weight: 600">
                      3.9“软件”的替换、修改和升级：本公司保留在任何时候为用户提供本“软件”替换、修改、升级版本的权利。同时，用户在此同意，为提高用户体验，本公司有权将其他相关产品绑定在本“软件”上供用户进行下载和安装。
                    </span>
                  </p>
                  <p>
                    <span style="font-weight: 600">
                      3.10本“软件”可能使用的第三方软件或技术，是受到合法授权的。因第三方软件或技术引发的任何纠纷，由该第三方负责解决，本公司不承担任何责任。本公司不对第三方软件或技术提供客服支持，若用户需要获取支持，请与该软件或技术提供商联系。
                    </span>
                  </p>
                  <h4>4.法律责任与免责</h4>
                  <p>
                    4.1本公司特别提请用户注意，本公司为了保障公司业务发展和调整的自主权，本公司拥有随时自行修改或中断软件授权而不需通知用户的权利，如有必要，修改或中断会以通告形式公布于本公司网站页面上，但不会逐个通知用户。
                  </p>
                  <p style="font-weight: 600">
                    4.2用户违反本《协议》或相关的服务条款的规定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的诉讼费用和律师费用，用户同意赔偿本公司与合作公司、关联公司，并使之免受损害。对此，本公司有权视用户的行为性质，采取包括但不限于中断使用许可、停止提供服务、限制使用、法律追究等措施。
                  </p>
                  <p style="font-weight: 600">
                    4.3使用本“软件”涉及到互联网服务，可能会受到各个环节不稳定因素的影响，存在因不可抗力、计算机病毒、黑客攻击、系统不稳定、用户所在位置、用户关机以及其他任何网络、技术、通信线路等原因造成的服务中断或不能满足用户要求的风险，用户已经知哓并自行承担以上风险，本公司对此不承担任何责任。
                  </p>
                  <p style="font-weight: 600">
                    4.4用户因第三方如电信部门的通讯线路故障、技术问题、网络、电脑故障、系统不稳定性及其他各种非因本公司原因而遭受的经济损失，本公司不承担任何责任。
                  </p>
                  <p style="font-weight: 600">
                    4.5因技术故障等不可抗力事件影响到服务的正常运行的，本公司承诺在第一时间内与相关单位配合，及时处理进行修复，但用户因此而遭受
                    的经济损失，本公司不承担任何责任。
                  </p>
                  <h4>5.其他条款</h4>
                  <p>
                    5.1本《协议》所定的任何条款的部分无效者，不影响其它条款的效力。
                  </p>
                  <p>
                    5.2本《协议》的解释、效力及纠纷的解决，适用于中华人民共和国法律（大陆地区）。若用户和本公司之间发生任何纠纷或争议，首先应友好协商解决，协商不成的，用户在此完全同意将纠纷或争议提交上海市虹口区人民法院诉讼解决。
                  </p>
                  <p>5.3本《协议》的一切解释权与修改权归本公司所有</p>
                  <p>
                    5.4本《协议》自用户选择下载、安装或使用本“软件”之日起生效。
                  </p>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="dialogTableVisible = false"
                    >确 定</el-button
                  >
                </span>
              </el-dialog>

              <el-button type="text" @click="dialogFormVisible = true"
                >《隐私政策》</el-button
              >
              <el-dialog
                title="隐私政策内容"
                :visible.sync="dialogFormVisible"
                width="60%"
                top="20px"
              >
                <div style="height: 500px; overflow-y: auto">
                  <h3>发布于：2021年 5 月 20 日</h3>
                  <p>
                    浙江旋极共创科技有限责任公司及其关联公司（以下简称“我们”）深知用户信息的重要和安全性，并会尽全力保护您的信息及通信安全，为你提供更加安全、可靠的服务。
                  </p>
                  <p>
                    我们会严格遵守相关的法律法规，同时恪守以下原则：权责一致、目的明确、自主选择、合理必要、安全可靠、公开透明等原则。
                  </p>
                  <p>
                    在使用我们的产品或服务前，请您仔细阅读并了解《隐私政策》（以下简称“本政策”）。本政策详细说明了我们对信息的收集和处理方式，以便您能够更好的了解我们提供的产品或服务并作出适当的选择
                  </p>
                  <p>
                    如果您不同意本政策中的内容，请立即停止使用该产品或服务。若您继续使用我们的产品或服务，即代表您认同或同意对我们在本政策中所述内容。
                  </p>

                  <h4>一、我们收集的信息</h4>
                  <p>
                    我们会在合法、必要、正当的原则上，仅收集为实现产品功能或服务所需的必要信息。
                  </p>
                  <p>
                    （一）在账号注册及资质审核时，您主动提供的信息。例如：纳税人识别号、地址、手机号、税控盘号等相关信息。
                  </p>
                  <p>
                    （二）在开票或申请开票时提供信息，例如：收票人手机号、发票明细、购买方、销货方等相关信息。
                  </p>
                  <p>（三）商品或订单记录等相关信息</p>
                  <p>
                    （四）在使用服务时上传信息，例如：企业个性展示图片、发票查验、抄报状态等相关信息。
                  </p>
                  <p>（五）我们在您使用服务时获取的信息：</p>
                  <p>
                    我们收集数据是根据您与我们的互动和您所做出的选择，包括您使用的产品或功能。我们收集的数据（或日志）可能包括SDK/API/JS代码版本、浏览器、互联网服务提供商、IP地址、时间戳、应用标识符、应用程序版本、应用分发渠道、独立设备标识符、iOS广告标识符（IDFA)、安卓广告主标识符、网卡（MAC）地址、国际移动设备识别码（IMEI）、设备型号、终端制造厂商、终端设备操作系统版本、会话启动/停止时间、语言所在地、时区和网络状态（WiFi等）、硬盘、CPU和电池使用情况等。
                  </p>
                  <h4>二、我们如何使用收集的信息</h4>
                  <p>
                    我们会严格遵守相关的法律法规及与用户之间的约定，将收集的信息用于以下用途。
                  </p>
                  <p>
                    1、用于开展内部数据分析和研究，第三方SDK统计服务，来改善我们的产品或服务。
                  </p>
                  <p>2、向您推荐您可能感兴趣的广告、资讯等。</p>
                  <p>3、评估、改善我们的广告或其他功能服务。</p>
                  <p>4、满足您的个性化需求。</p>
                  <p>5、软件升级或认证等相关服务。</p>
                  <p>
                    6、存储并维护与您相关的信息，用于运营业务或履行法律义务。
                  </p>
                  <p>7、用于安全保障，风险防范等相关服务。</p>
                  <p>8、用于分析统计形成的行业洞察报告。</p>
                  <h4>三、我们如何使用Cookie和同类技术</h4>
                  <p>（一）Cookie</p>
                  <p>
                    为确保网站正常运转，我们会在您的计算机或移动设备上存储名为Cookie的小数据文件。Cookie通常包含标识符、站点名称以及一些号码和特殊字符。借助于Cookie，网站能够进行身份验证、偏好设置、安全等服务。
                  </p>
                  <p>
                    我们不会将Cookie用于本政策所述目的之外的任何用途。您可根据自己的偏好管理或删除Cookie。您可以清除计算机上保存的所有Cookie，大部分网络浏览器都设有阻止Cookie的功能。但如果您这么做，则需要在每一次访问我们的网站时亲自更改用户设置。
                  </p>
                  （二）网站信标和像素标签
                  <p>
                    除Cookie外，我们还会在网站上使用网站信标和像素标签等其他同类技术。例如，我们向您发送的电子邮件可能含有链接至我们网站内容的点击URL。如果您点击该链接，我们则会跟踪此次点击，帮助我们了解您的产品或服务偏好并改善客户服务。网站信标通常是一种嵌入到网站或电子邮件中的透明图像。借助于电子邮件中的像素标签，我们能够获知电子邮件是否被打开。如果您不希望自己的活动以这种方式被追踪，则可以随时从我们的寄信名单中退订。
                  </p>
                  <h4>四、我们如何分享您的信息</h4>
                  <p>
                    我们会严格遵守相关的法律法规的规定，对信息的分享进行严格的限制。
                  </p>
                  <p>（一）共享</p>
                  <p>
                    我们不会向其他任何公司、组织和个人分享您的信息，但以下情况除外：
                  </p>
                  <p>
                    1、在获取明确同意的情况下共享：获得您的明确同意后，我们会与第三方共享您的相关信息。
                  </p>
                  <p>
                    2、我们可能会根据法律法规规定，或按政府主管部门的强制性要求，对外共享您的相关信息。
                  </p>
                  <p>
                    3、与第三方合作伙伴（第三方服务提供商、代理、广告合作伙伴等）共享：您的信息可能会与第三方合作伙伴共享。在共享时，我们只会共享必要的信息，且受本政策中所声明目的的约束。
                  </p>
                  <p>
                    4、与授权合作伙伴共享：仅为实现本政策中声明的目的，我们的某些服务将由授权合作伙伴提供。我们可能会与合作伙伴共享您的某些信息，以提供更好的客户服务和用户体验。例如，我们聘请来提供第三方数据统计和分析服务的公司可能需要采集和访问某些数据以进行数据统计和分析。在这种情况下，这些公司必须遵守我们的数据隐私和安全要求。我们仅会出于合法、正当、必要、特定、明确的目的共享您的信息，并且只会共享提供服务所必要的信息。
                  </p>
                  <p>
                    5、我们会将所收集到的信息用于大数据分析。例如，我们将收集到的信息用于分析形成不含身份识别信息的行业洞察报告。我们可能对外公开并与我们的合作伙伴分享经统计加工后不含身份识别内容的信息，用于了解用户如何使用我们服务或让公众了解我们服务的总体使用趋势。
                  </p>
                  <p>
                    对我们与之共享信息的公司、组织和个人，我们会与其签署严格的保密协定，要求他们按照我们的说明、本政策以及其他任何相关的保密和安全措施来处理您的信息。
                  </p>
                  <p>（二）转让</p>
                  <p>
                    我们不会将您的信息转让给任何公司、组织和个人，但以下情况除外：
                  </p>
                  <p>
                    1、在获取明确同意的情况下转让：获得您的明确同意后，我们会向其他方转让您的个人信息；
                  </p>
                  <p>
                    2、随着我们业务的持续发展，可能会发生合并、收购、资产重组等情况时，如涉及到您的信息转让时，我们会通过推送通知、公告等形式告知您相关情况。按照相关的法律法规及不低于本政策所要求的内容继续保护或要求新的持有您信息的公司或组织继续保护您的信息，否则我们将要求该公司或组织重新向您征求授权同意。
                  </p>
                  <p>（三）披露</p>
                  <p>我们可能会在以下情况下，向他人或其他部门披露您的信息：</p>
                  <p>1、获得您明确同意后；</p>
                  <p>
                    2、基于法律的披露：在法律、法律程序、诉讼或政府主管部门强制性要求的情况下，我们可能会公开披露您的相关信息。
                  </p>
                  <h4>五、我们如何保护您的信息</h4>
                  <p>
                    我们为您的信息提供相应的安全保障，以防止信息的丢失、不当使用、未经授权访问或披露。
                  </p>
                  <p>1、我们严格遵守相关法律法规保护用户的数据通信安全。</p>
                  <p>
                    2、我们将在合理的安全水平内使用各种安全保护措施以保障信息的安全。例如，我们使用加密技术（例如：TLS、SSL）、匿名化处理等手段来保护您的相关信息。
                  </p>
                  <p>
                    3、我们建立专门的管理制度、流程和组织确保信息安全。例如，我们严格限制访问信息的人员范围，要求他们遵守保密义务，并进行审查。
                  </p>
                  <p>
                    4、若发生相关信息泄露等安全事件，我们会启动应急预案，阻止安全事件扩大，并以推送通知、公告等形式告知您。
                  </p>
                  <h4>六、您如何管理您的信息</h4>
                  <p>
                    您可以在使用我们服务的过程中，访问、修改和删除您提供的注册信息和其他信息，也可按照通知指引与我们联系。您访问、修改和删除个人及企业信息的范围和方式将取决于您使用的具体服务及权限。
                  </p>
                  <p>
                    我们将按照本政策所述，仅为实现我们产品功能或服务，收集、使用您的信息。如您发现我们违反相关的法律、行政法规的规定或者双方的约定收集、使用您的信息，您可以要求我们删除。如您发现我们收集、存储的您的信息有错误的，您也可以要求我们更正。请通过本政策列明的联系方式与我们联系。
                  </p>
                  <p>
                    在您访问、修改和删除相关信息时，我们可能会要求您进行身份等相关验证，以保障帐号的安全。
                  </p>
                  <p>
                    请您理解，由于技术所限、法律或监管要求，我们可能无法满足您的所有要求，我们会在合理的期限内答复您的请求。
                  </p>
                  <h4>七、我们可能向您（或您的客户）发送的信息</h4>

                  <p>
                    （一）您在使用我们的服务时，我们可能向您（或您的客户/顾客）发送电子邮件、短信、广告、资讯或推送通知。您可以按照我们的相关提示，在相关设备上进行可选择性取消。
                  </p>
                  <p>
                    （二）我们可能在必要时（例如：因系统维护而暂停某一项服务时）向您发出与服务有关的公告。您可能无法取消这些与服务有关、性质不属于广告的公告。
                  </p>
                  <h4>八、信息存储地点和期限</h4>
                  <p>（一）存储信息的地点：</p>
                  <p>
                    我们会遵守相关的法律法规的规定，将境内收集的用户信息存储于境内。
                  </p>
                  <p>（二）存储期限：</p>
                  <p>
                    一般而言，我们会一直保留您的相关信息，但出于仅为实现目的所必需的最短时间保留您的信息。在下列情况下，我们有可能因需符合法律要求，更改您的信息的存储时间：
                  </p>
                  <p>1、为遵守适用的法律法规等有关规定；</p>
                  <p>2、为遵守法院判决、裁定或其他法律程序的规定；</p>
                  <p>3、为遵守相关政府机关或法定授权组织的要求；</p>
                  <p>4、我们有理由确信需要遵守法律法规等有关规定；；</p>
                  <p>
                    5、为执行相关服务协议或本政策、维护社会公共利益，为保护我们及我们的客户、其他用户或雇员的人身财产安全或其他合法权益所合理必需的用途。
                  </p>
                  <p>
                    当我们的产品或服务发生停止运营的情形时，我们将会采取公告、推送通知或发送短信等形式通知您，并在合理的期限内删除或匿名化处理您的相关信息。
                  </p>
                  <h4>九、关于广告</h4>
                  <p></p>
                  <p>
                    我们可能根据您使用该产品软件或服务的相关情况，在相关网站、应用及其他渠道向您提供与您相关的个性化广告。
                  </p>
                  <p>
                    我们在向用户提供免费、优质的软件或服务时，广告收入是支持我们运营的部分收入来源。如果没有广告收入，我们将很难向您提供可持续的免费、优质的软件或服务。同时为了保证良好的用户体验，我们会尽可能地减少与您不相关的广告，并尽可能向您展示您可能更感兴趣、更实用的广告。在向您展示广告的过程中，我们将努力确保数据的安全性。
                  </p>
                  <h4>十、本政策如何更新</h4>
                  我们可能适时的会对本政策进行调整或变更，本政策的任何更新将以标注更新时间的方式公布在我们相关网站或应用上，除相关的法律法规或监管规定另有强制性规定外，经调整或变更的内容一经通知或公布后的7日后生效。如您在本政策调整或变更后继续使用我们提供的任一服务或访问我们相关网站的，我们相信这代表您已充分阅读、理解并接受修改后的本政策并受其约束。
                  <h4>十一、如何联系我们</h4>
                  <p>
                    如果您对本政策有任何疑问、意见或建议，通过以下方式与我们联系：
                  </p>
                  <p>服务电话：400-6728066</p>
                  <p>一般情况下，我们将在三十天内回复。</p>
                </div>

                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="dialogFormVisible = false"
                    >确 定</el-button
                  >
                </span>
              </el-dialog>
            </div>
            <h2>版本信息</h2>
            <p>{{ VersionInfo }}</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="new-tax-disc" id="a">
      <el-dialog
        :title="editOrAddFlag=='add'?'新增税盘':'修改税盘'"
        :visible.sync="newadd2"
        width="35%"
        destroy-on-close
        :close-on-click-modal="false"
      >
        <div class="taxTips"><span style="display:inline-block;text-align: left;vertical-align: middle;">温馨提示：本地税盘，请先插入再进行税盘设置，若为托管税盘请联系客服设置。</span></div>
        <el-form
          :model="ruleForm2"
          :rules="rules2"
          ref="ruleForm2"
          label-suffix=":"
          label-width="120px"
        >
          <el-form-item label="税盘名称" prop="taxDiskName">
            <el-input
              v-model.trim="ruleForm2.taxDiskName"
              maxlength="61"
              placeholder="请输入税盘名称"
            />
          </el-form-item>
          <el-form-item label="税盘类型" prop="diskType">
            <el-select
              @change="diskTypeChange"
              v-model="ruleForm2.diskType"
              placeholder="请选择税盘类型"
              style="width: 100%"
              :disabled="diskIsOnline=='1' && this.editOrAddFlag == 'edit'"
            >
              <el-option label="金税盘" :value="1"></el-option>
              <el-option label="税控盘" :value="2"></el-option>
              <el-option label="税务ukey" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="税盘编号" prop="taxDiskNum">
            <el-input
              v-model="ruleForm2.taxDiskNum"
              oninput="value=value.replace(/[^\d]/g,'')"
              maxlength="12"
              placeholder="请输入税盘编号"
            />
          </el-form-item>
          <el-form-item label="税盘状态" prop="onlineLocation">
            <el-radio-group v-model="ruleForm2.onlineLocation">
              <el-radio :label="1" :disabled="this.editOrAddFlag == 'edit'"
                >本地税盘</el-radio
              >
              <el-radio :label="2" disabled>托管</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="税盘密码"
            prop="taxDiskPassword"
            v-if="ruleForm2.diskType != '1'"
          >
            <el-input
              v-model="ruleForm2.taxDiskPassword"
              oninput="value=value.replace(/[^\d]/g,'')"
              maxlength="8"
              placeholder="请输入税盘密码"
              :disabled="diskIsOnline=='1' &&this.editOrAddFlag == 'edit'"
            />
          </el-form-item>
          <el-form-item label="数字证书口令" prop="digitalCertificatePassword">
            <el-input
              v-model="ruleForm2.digitalCertificatePassword"
              oninput="value=value.replace(/[^\d]/g,'')"
              maxlength="8"
              placeholder="请填写数字证书口令"
              :disabled="diskIsOnline=='1' && this.editOrAddFlag == 'edit'"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm2('ruleForm2')"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- //用户协议 -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import x2js from "x2js";
import { getClientInfo } from "@/api/commonAPI.js";
import request from "@/utils/request";
import Config from "@/settings";
Config.clientCode;
import Listnodate from "@/components/ListNoDate";
import { companyDiskRegistrationCodeInit } from "@/api/user.js";
import { getInstalledPrintersApi, printTest, ticketPrintTest } from "@/api/cefSharp.js";
import { setAutoRun } from "@/utils/cefSharp.js";
import { getCompanyInfoById } from "@/api/billType";
import {
  validStrCheckLength,
  validStrCheckLengthTextarea,
} from "@/utils/validate";
import {
  addApanBySetting,
  addXiaoApi,
  companyInfoApi,
  listByTokenApi,
  taxDiskIdApi,
  taxDiskEditApi,
  getCompanyIndustryTypeApi,
  editXiaoApi,
  listXiaoApi,
  defXiaoApi,
  deleteXiaoApi,
  getProvinceListApi,
  getCityListApi,
  taxDiskNumDetailsApi,
  saveTaxDiskNumApi,
} from "@/api/setpan.js";
import Breadnav from '@/components/Breadnav';

const X2JS = new x2js();
export default {
  name: "SettingsIndex",
  components: {
    Listnodate,Breadnav
  },
  data() {
    const validateUserName = (rule, value, callback) => {
      if (value && !validStrCheckLength(value, 11)) {
        console.log("ssss");
        callback(new Error("最多输入10个汉字或字符"));
      } else {
        callback();
      }
    };
    const validateUserText = (rule, value, callback) => {
      if (!validStrCheckLength(value, 101)) {
        console.log("ssss");
        callback(new Error("最多输入100个汉字或字符"));
      } else {
        callback();
      }
    };

    const validateTaxDiskName = (rule, value, callback) => {
      if (!validStrCheckLength(value, 61)) {
        console.log("ssss");
        callback(new Error("最多输入60个汉字或字符"));
      } else {
        callback();
      }
    };

    return {
      editOrAddFlag: "",
      addOrEditFlag: "新增销方信息", //0新增 1修改
      showButton: false, //右上角新增按钮是否隐藏
      tabName: "qyxx", //tab导航默认页
      noDateFlag: "successNoDate", //无数据时展示的样式
      show: true, //企业信息顶部提示是否隐藏
      tabPosition: "left", //Tab样式为靠左

      dialogTableVisible: false,
      dialogFormVisible: false,
      form1: {},
      rules1: {
        province: [{ required: true, message: "请选择", trigger: "change" }],
        city: [{ required: true, message: "请选择", trigger: "change" }],
        district: [{ required: true, message: "请选择", trigger: "change" }],
        vatReasonableRateMin: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
      },
      optionsType: [], // 行业类型
      listSheng: [], //省
      listShi: [], //市
      listQu: [], //区
      num1: 0, //增值税合理税负率初始值
      num2: 0,
      form: {},
      taxData: [], //税盘列表
      ruleForm2: {
        changeShuiPanFlag: false, //税盘修改按钮是否置灰
        delShuiPanFlag: false, //税盘删除按钮是否置灰
        id: "",
        taxDiskName: "",
        diskType: "",
        taxDiskNum: "",
        onlineLocation: 1,
        taxDiskPassword: "",
        digitalCertificatePassword: "",
      },
      rules2: {
        taxDiskName: [
          { required: true, message: "税盘名称不能为空", trigger: "blur" },
          { validator: validateTaxDiskName, trigger: "blur" },
        ],
        diskType: [
          { required: true, message: "请选择税盘类型", trigger: "blur" },
        ],
        taxDiskNum: [
          { required: true, message: "税盘编号不能为空", trigger: "blur" },
          { min: 11, max: 12, message: "请填写11位或12位税盘号" },
        ],
        onlineLocation: [
          { required: true, message: "税盘状态不能为空", trigger: "change" },
        ],
        taxDiskPassword: [
          { required: true, message: "税盘密码不能为空", trigger: "blur" },
          { min: 6, max: 8, message: "请填写6-8位数字" },
        ],
        digitalCertificatePassword: [
          { required: true, message: "数字证书口令不能为空", trigger: "blur" },
          { min: 6, max: 8, message: "请填写6-8位数字" },
        ],
      },
      annulData: [], //销方列表
      ruleForm3: {
        id: "",
        defFlag: "",
        taxDiskName: "",
        taxDiskNum: "",
        sellerAddrTel: "",
        sellerBankAccount: "",
        kpr: "",
        skr: "",
        fhr: "",
      },
      rules3: {
        taxDiskNum: [
          { required: true, message: "请选择税盘名称", trigger: "blur" },
        ],
        kpr: [
          { required: true, message: "请填写开票人", trigger: "blur" },
          { validator: validateUserName, trigger: "blur" },
        ],
        skr: [{ validator: validateUserName, trigger: "blur" }],
        fhr: [{ validator: validateUserName, trigger: "blur" }],
        sellerAddrTel: [
          { required: true, message: "请输入公司地址、电话", trigger: "blur" },
          { validator: validateUserText, trigger: "blur" },
        ],
      },
      form4: {
        special: "",
        general: "",
        motor: "",
        listing: "",
        small: "",
        other: "",
      },
      numzp: undefined,
      zpnum: undefined,
      numpp: undefined,
      ppnum: undefined,
      numjdc: undefined,
      jdcnum: undefined,
      numqd: undefined,
      qdnum: undefined,
      xpWidth: undefined,
      // xpnum: 1,
      numother: undefined,
      othernum: undefined,
      printList: [], //打印机列表
      form5: {
        autostart: false,
        panel: "02",
        exit: "",
        exitTime: 60
      },
      form6: {
      },
      invoicetype:[],
      ofdShow: false,
      activeName: "first",
      newadd2: false, //新增税盘弹窗
      newadd3: false, //新增销方弹窗
      taxDiskNum: "", //税盘号
      showTips: false,
      //版本信息
      VersionInfo: "",
      invoiceTypes:[
        {name:'增值税专用发票',code:'004'},
        {name:'增值税普通发票',code:'007'},
        // {name:'电子专用发票',code:'028'},
        {name:'电子普通发票',code:'026'},
      ],
    };
  },

  created() {
    this.listByToken();
    getCompanyInfoById({ companyId: this.loginInfo.companyId }).then((res) => {
      if (res.code == 200) {
        delete res.data.taxBureauCode
        delete res.data.taxBureauName
        this.form1 = { ...res.data };
        this.getTaxDiskNumDatils();
        this.getProvinceList();
        getCityListApi(this.form1.province).then((response) => {
          this.listShi = response.data;
        });
        getCityListApi(this.form1.city).then((response) => {
          this.listQu = response.data;
        });
      }
    });
    // this.form5 = localStorage.getItem("initSetBase")
    //   ? JSON.parse(localStorage.getItem("initSetBase"))
    //   : { autostart: false, panel: "02", exit: "" };
    if(localStorage.getItem("initSetBase")){
      this.form5=JSON.parse(localStorage.getItem("initSetBase"))
    }else{
      this.form5={ autostart: false, panel: "02", exit: "", exitTime: 60 };
      localStorage.setItem("initSetBase", JSON.stringify(this.form5));
      // this.$store.commit("settings/exitTime", this.form5.exitTime);
    }
  },
  mounted() {
    this.taxDiskNum = this.$store.state.user.taxDiskNum;
    this.getCompanyIndustryType();
    this.getAboutClient();
    this.getInstalledPrintersAjax();
    if (JSON.parse(localStorage.getItem("cefSharpinit_zp")) !== null) {
      let zp = JSON.parse(localStorage.getItem("cefSharpinit_zp"));
      this.numzp = zp.offsetX;
      this.zpnum = zp.offsetY;
      this.form4.special = zp.printValue;
    }
    if (JSON.parse(localStorage.getItem("cefSharpinit_pp")) !== null) {
      let pp = JSON.parse(localStorage.getItem("cefSharpinit_pp"));
      this.numpp = pp.offsetX;
      this.ppnum = pp.offsetY;
      this.form4.general = pp.printValue;
    }
    if (JSON.parse(localStorage.getItem("cefSharpinit_jdc")) !== null) {
      let jdc = JSON.parse(localStorage.getItem("cefSharpinit_jdc"));
      this.numjdc = jdc.offsetX;
      this.jdcnum = jdc.offsetY;
      this.form4.motor = jdc.printValue;
    }
    if (JSON.parse(localStorage.getItem("cefSharpinit_qd")) !== null) {
      let qd = JSON.parse(localStorage.getItem("cefSharpinit_qd"));
      this.numqd = qd.offsetX;
      this.qdnum = qd.offsetY;
      this.form4.listing = qd.printValue;
    }
    if (JSON.parse(localStorage.getItem("cefSharpinit_xp")) !== null) {
      let xp = JSON.parse(localStorage.getItem("cefSharpinit_xp"));
      this.xpWidth = xp.offsetX;
      this.form4.small = xp.printValue;
      // this.xpnum = xp.offsetY;
    }
    if (JSON.parse(localStorage.getItem("cefSharpinit_other")) !== null) {
      let other = JSON.parse(localStorage.getItem("cefSharpinit_other"));
      this.numother = other.offsetX;
      this.othernum = other.offsetY;
      this.form4.other = other.printValue;
    }
  },

  computed: {
    ...mapState("user", ["loginInfo", "taxDiskInfo",'diskIsOnline']),
  },

  methods: {
    channelInputLimit (e) {
      let key = e.key
      // 不允许输入'e'和'.'
      if (key === 'e' || key === '.' || key === '-' ) {
        e.returnValue = false
        return false
      }
      return true
    },
    // 参数设置----单选按钮 再次点击可以取消选中
    // clickitem(e) {
    //   e === this.form6.invoiceFileType ? (this.form6.invoiceFileType = '')
    //     : (this.form6.invoiceFileType = e);
    // },
    // 限制输入长度
    tableTail(value, item) {
      let obj = validStrCheckLengthTextarea(value, 20);
      if (!obj.flag) {
        if (obj.len) {
          this.ruleForm3[item] = value.substring(0, obj.len);
        }
      }
    },
    //负率结束不能大于开始
    boxNumChange(value) {
      if (this.form1.vatReasonableRateMax != "undefined") {
        if (value > this.form1.vatReasonableRateMax) {
          this.showTips = true;
        } else {
          this.showTips = false;
        }
      }
    },
    boxNumChange1(value) {
      if (this.form1.vatReasonableRateMin != "undefined") {
        if (value < this.form1.vatReasonableRateMin) {
          this.showTips = true;
        } else {
          this.showTips = false;
        }
      }
    },
    //参数设置详情
    getTaxDiskNumDatils() {
      var that = this;
      taxDiskNumDetailsApi(this.taxDiskNum)
        .then((response) => {
          if (response && response.code == "200") {
            console.log(response);
            if (response.data) {
              that.form6 = response.data;
              that.form1.taxBureauCode=response.data.taxBureauCode
              that.form1.taxBureauName=response.data.taxBureauName
              this.invoicetype=response.data.openedInvoiceType.split(',')
            }
            if (
              response.data.diskType == "1" ||
              response.data.diskType == "2"
            ) {
              that.form6.invoiceFileType = '0'
              that.ofdShow = false;
            } else if (response.data.diskType == "3") {
              that.form6.invoiceFileType = response.data.invoiceFileType + '';
              that.ofdShow = true;
              // saveTaxDiskNumApi(that.form6)
              //   .then((response) => {
              //     if (response && response.code == "200") {
              //       console.log(response);
              //       that.$message({
              //         type: "success",
              //         message: "保存成功",
              //       });
              //       //  that.form6=response.data;
              //       //  that.form6.barcode=null;
              //       //  previewMode  ---发票预览code  1开具后预览发票2打印时预览发票
              //       // printMode ----清单开票打印 1全打模式2套打模式
              //     } else {
              //       that.$message({
              //         type: "error",
              //         message: res.data.msg,
              //       });
              //     }
              //   })
              //   .catch((error) => {});
            }

            that.form6.barcode = null;
            //  previewMode  ---发票预览code  1开具后预览发票2打印时预览发票
            // printMode ----清单开票打印 1全打模式2套打模式
          }
        })
        .catch((error) => {});
    },
    diskTypeChange(){
    
      this.$set(this.ruleForm2,'taxDiskPassword','')
      this.$set(this.ruleForm2,'digitalCertificatePassword','')
    },

    //根据页面判断按钮是否隐藏
    buttonShow(tab, event) {
      if (this.tabName == "spsz") {
        this.showButton = true;
      } else if (this.tabName == "xfsz") {
        this.showButton = true;
        this.listXiao();
      } else if (this.tabName == "qyxx") {
        this.showButton = false;
      } else if (this.tabName == "dysz") {
        this.showButton = false;
      } else if (this.tabName == "jbsz") {
        this.showButton = false;
      } else if (this.tabName == "cssz") {
        this.showButton = false;
      } else if (this.tabName == "gy") {
        this.showButton = false;
      }
    },
    // 新增按钮
    newadd() {
      this.editOrAddFlag = "add";
      this.addOrEditFlag = "新增销方信息";
      this.ruleForm2 = { onlineLocation: 1 };
      this.ruleForm3 = {};
      if (this.tabName == "spsz") {
        this.newadd2 = true;
      } else if (this.tabName == "xfsz") {
        if (this.taxData.length == 1) {
          this.ruleForm3.taxDiskNum = this.taxData[0].taxDiskNum;
        }
        this.newadd3 = true;
      }
    },
    // 企业设置
    // 隐藏提示
    hidden() {
      this.show = false;
    },
    // 行业类型
    getCompanyIndustryType() {
      getCompanyIndustryTypeApi().then((response) => {
        this.optionsType = response.data;
      });
    },
    // 省
    getProvinceList() {
      getProvinceListApi().then((response) => {
        this.listSheng = response.data;
      });
    },
    // 市
    getCityList() {
      this.form1.city = "";
      this.form1.district = "";
      this.listQu = [];
      if (this.form1.province != "") {
        getCityListApi(this.form1.province).then((response) => {
          this.listShi = response.data;
        });
      }
    },
    // 区
    getCityList1() {
      this.form1.district = "";
      if (this.form1.city != "") {
        getCityListApi(this.form1.city).then((response) => {
          this.listQu = response.data;
        });
      }
    },
    // 保存
    getSaveComany(form1) {
      this.$refs[form1].validate((valid) => {
        if (valid) {
          if (!this.showTips) {
            companyInfoApi(this.form1)
              .then((response) => {
                if (response && response.code == "200") {
                  this.$message({
                    message: "保存成功",
                    center: true,
                    type: "success",
                  });
                }
              })
              .catch((error) => {});
          }
        } else {
          return false;
        }
      });
    },

    //税盘设置
    // 获取列表
    // 未完成：若为托管税盘，则税盘信息在后台维护，维护完成后用户进入此页面会自动将后台的税盘信息同步过来
    listByToken() {
      listByTokenApi()
        .then((response) => {
          this.taxData = response.data;
        })
        .catch((error) => {});
    },

    //同时用于获取ukey盘信息和税盘密码的参数
    getXmlParam1(key) {
      return {
        xml: `<?xml version=\"1.0\" encoding=\"utf-8\"?>
          <business comment=\"税控设备信息查询\" id=\"SKSBXXCX\">
          <body yylxdm=\"1\">
          <input>
          <sksbkl>${key}</sksbkl>
          </input>
          </body>
          </business>`,
      };
    },
    //税务u-key验证数字证书密码参数
    getXmlParam2(digitalCertificatePassword, taxDiskPassword) {
      return {
        xml: `<?xml version=\"1.0\" encoding=\"utf-8\"?><business comment=\"证书口令验证\" id=\"ZSKLYZ\">
                    <body yylxdm=\"1\">
                    <input>
                    <zskl>${digitalCertificatePassword}</zskl>
                    <sksbkl>${taxDiskPassword}</sksbkl>
                    </input>
                    </body>
                    </business>`,
      };
    },

    //导入税控盘注册码参数
    getXmlParam3(zcmxx) {
      return {
        xml: `<?xml version=\"1.0\" encoding=\"gbk\"?><business comment=\"注册码信息导入\" id=\"ZCMDR\">
  <body yylxdm=\"1\">
    <input>
      <zcmxx>${zcmxx}</zcmxx>
    </input>
  </body>
</business>`,
      };
    },

    //税控盘查询盘信息和检验税盘密码参数
    getXmlParam4(skpkl) {
      return {
        xml: `<?xml version=\"1.0\" encoding=\"gbk\"?>
<business comment=\"税控盘信息查询\" id=\"SKPXXCX\">
    <body yylxdm=\"1\">
        <input>
            <skpkl>${skpkl}</skpkl>
        </input>
    </body>
</business>`,
      };
    },
    //税控盘验证数字证书密码参数
    getXmlParam5(skpInfo, taxDiskPassword, digitalCertificatePassword) {
      return {
        xml: `<?xml version=\"1.0\" encoding=\"gbk\"?><business comment=\"监控数据查询\" id=\"JKSJCX\">
  <body yylxdm=\"1\">
    <input>
      <nsrsbh>${skpInfo.nsrsbh}</nsrsbh>
      <skpbh>${skpInfo.skpbh}</skpbh>
      <skpkl>${taxDiskPassword}</skpkl>
      <keypwd>${digitalCertificatePassword}</keypwd>
      <fplxdm>${skpInfo.fplxdm}</fplxdm>
    </input>
  </body>
</business>`,
      };
    },

    //金税盘获取盘信息和验证数字证书密码参数
    getXmlParam6(keypwd) {
      return {
        xml: `<?xml version=\"1.0\" encoding=\"utf-8\"?>
<business comment=\"打开金税卡\" id=\"OpenCard\">
    <body yylxdm=\"1\">
        <input>
            <keypwd>${keypwd}</keypwd>
        </input>
    </body>
</business>`,
      };
    },

    // 税盘弹窗内容验证提交
    submitForm2(formName2) {
      this.$refs[formName2].validate((valid) => {
        if (valid) {

             let applyParams = {
                        companyId: this.loginInfo.companyId,
                        ...this.ruleForm2,
                      };
          if(this.editOrAddFlag == "add"){
                 //判断本地是否插盘
          request({
            url: "http://localhost:13769/TaxDisk/GetTaxDeviceStates",
            method: "get",
          }).then((res) => {
            if (res.code == "0") {
              let diskIstheSame = false;
              switch (res.data.type) {
                case "Jsp":
                  diskIstheSame = this.ruleForm2.diskType == 1;
                  break;
                case "Skp":
                  diskIstheSame = this.ruleForm2.diskType == 2;
                  break;
                case "SWUKey":
                  diskIstheSame = this.ruleForm2.diskType == 3;
                  break;
              }

              if (!diskIstheSame) {
                this.$message({
                  message: "请选择所插入的税盘类型",
                  type: "warning",
                });
                return;
              }
              if (res.data.diskId == this.ruleForm2.taxDiskNum) {
                //插盘连接盘
                request({
                  url: "http://localhost:13769/TaxDisk/ConnectTaxDisk",
                  method: "get",
                }).then((res2) => {
                  if (res2.code == "0") {
                    let addNewDisk = () => {
                      if (this.editOrAddFlag == "add") {
                        addApanBySetting(applyParams)
                          .then((res) => {
                            if (res && res.code == "200") {
                              this.newadd2 = false;
                              if (this.tabName == "xfsz") {
                                listByTokenApi().then((response) => {
                                  this.taxData = response.data;
                                  this.$set(
                                    this.ruleForm3,
                                    "taxDiskName",
                                    this.ruleForm2.taxDiskNum
                                  );
                                  this.$refs.ruleForm3.clearValidate(
                                    "taxDiskName"
                                  );
                                });
                                return;
                              } else {
                                this.listByToken();
                                this.$message({
                                  message: "新增成功",
                                  type: "success",
                                });
                              }
                            }
                          })
                          .catch((error) => {});
                      } else {
                        taxDiskEditApi(applyParams)
                          .then((response) => {
                            if (response && response.code == "200") {
                              this.newadd2 = false;
                              this.listByToken();
                              if(this.diskIsOnline=='1'){
                                 this.$message({
                                 message: "修改成功",
                                 type: "success",
                                });
                              }else{
                                   this.$message({
                                   message: "修改成功,请退出后重新登录！",
                                   type: "success",
                                  });
                              } 
                            }
                          })
                          .catch((error) => {});
                      }
                    };

                    if (res.data.type == "Jsp") {
                      //验证数字证书密码 需要调2遍
                       request({
                        url: "http://localhost:13769/TaxDisk/JspOperate",
                        method: "post",
                        data: this.getXmlParam6(
                          this.ruleForm2.digitalCertificatePassword
                        ),
                      }).then((jspinfo)=>{
                        if(jspinfo.code=='0'){
                        let jspinfoObj = X2JS.xml2js(jspinfo.data).business.body.output
                        if(jspinfoObj.returncode == "0"){
                        request({
                        url: "http://localhost:13769/TaxDisk/JspOperate",
                        method: "post",
                        data: this.getXmlParam6(this.ruleForm2.digitalCertificatePassword),
                      }).then((jspres) => {
                        let isRight = X2JS.xml2js(jspres.data).business.body.output;
                        if (isRight.returncode == "0") {
                          if (isRight.qysh == this.loginInfo.taxId) {
                            addNewDisk();
                          } else {
                            this.$message({
                              message: "企业税号不同",
                              type: "warning",
                            });
                          }
                        } else {
                          this.$alert(isRight.returnmsg, {
                            confirmButtonText: "知道了",
                            title: "错误提示",
                            type: "error",
                          });
                        }
                      });
                        }else{
                           this.$alert(jspinfoObj.returnmsg, {
                            confirmButtonText: "知道了",
                            title: "错误提示",
                            type: "error",
                          });
                        }
                      
                      }else{
                         this.$alert(jspinfo.message, {
                            confirmButtonText: "知道了",
                            title: "错误提示",
                            type: "error",
                          });
                      }
                      })
                    } else {
                      if (res.data.type == "SWUKey") {
                        //判断税盘密码是否正确
                        request({
                          url: "http://localhost:13769/TaxDisk/SWUKeyOperate",
                          method: "post",
                          data: this.getXmlParam1(
                            this.ruleForm2.taxDiskPassword
                          ),
                        }).then((ukeypasswordres) => {
                          if (ukeypasswordres.code == "0") {
                            let diskInfo = X2JS.xml2js(ukeypasswordres.data)
                              .business.body.output;
                            console.log(diskInfo);
                            console.log(this.loginInfo.taxId);
                            console.log(diskInfo.nsrsbh);
                            if (diskInfo.returncode == "0") {
                              //密码正确  判断税号是否相同
                              if (diskInfo.nsrsbh == this.loginInfo.taxId) {
                                //判断数字证书口令是否正确
                                request({
                                  url:
                                    "http://localhost:13769/TaxDisk/SWUKeyOperate",
                                  method: "post",
                                  data: this.getXmlParam2(
                                    this.ruleForm2.digitalCertificatePassword,
                                    this.ruleForm2.taxDiskPassword
                                  ),
                                }).then((ukeykeywordres) => {
                                  let isRight = X2JS.xml2js(ukeykeywordres.data)
                                    .business.body.output;
                                  if (isRight.returncode == "0") {
                                    addNewDisk();
                                  } else {
                                    this.$alert(isRight.returnmsg, {
                                      confirmButtonText: "知道了",
                                      title: "错误提示",
                                      type: "error",
                                    });
                                  }
                                });
                              } else {
                                this.$message({
                                  message: "企业税号不同",
                                  type: "warning",
                                });
                              }
                            } else {
                              //密码不正确
                              this.$message({
                                message: diskInfo.returnmsg,
                                type: "warning",
                              });
                            }
                          }
                        });
                      } else {
                        //税控盘
                        //判断税盘密码是否正确 ruleForm2
                        request({
                          url: "http://localhost:13769/TaxDisk/SkpOperate",
                          method: "post",
                          data: this.getXmlParam4(
                            this.ruleForm2.taxDiskPassword
                          ),
                        }).then((skppasswordres) => {
                          if (skppasswordres.code == "0") {
                            let diskInfo = X2JS.xml2js(skppasswordres.data)
                              .business.body.output;
                            if (diskInfo.returncode == "00000000") {
                              //密码正确  判断税号是否相同
                              if (diskInfo.nsrsbh == this.loginInfo.taxId) {
                                //税控盘需导入注册码
                                companyDiskRegistrationCodeInit({
                                  digitalCertificatePassword: this.ruleForm2
                                    .digitalCertificatePassword,
                                  diskType: this.ruleForm2.diskType,
                                  onlineLocation: this.ruleForm2.onlineLocation,
                                  taxDiskNum: res.data.diskId,
                                  taxDiskPassword: this.ruleForm2
                                    .taxDiskPassword,
                                }).then((coderes) => {
                                  if (coderes.code == 200) {
                                    let registrationCode =
                                      coderes.data.registrationCode;
                                    request({
                                      url:
                                        "http://localhost:13769/TaxDisk/SkpOperate  ",
                                      method: "post",
                                      data: this.getXmlParam3(registrationCode),
                                    }).then(() => {
                                      //判断数字证书口令是否正确
                                      request({
                                        url:
                                          "http://localhost:13769/TaxDisk/SkpOperate",
                                        method: "post",
                                        data: this.getXmlParam5(
                                          diskInfo,
                                          this.ruleForm2.taxDiskPassword,
                                          this.ruleForm2
                                            .digitalCertificatePassword
                                        ),
                                      }).then((skpkeywordres) => {
                                        let isRight = X2JS.xml2js(
                                          skpkeywordres.data
                                        ).business.body.output;
                                        if (isRight.returncode == "00000000") {
                                          addNewDisk();
                                        } else {
                                          this.$alert(isRight.returnmsg, {
                                            confirmButtonText: "知道了",
                                            title: "错误提示",
                                            type: "error",
                                          });
                                        }
                                      });
                                    });
                                  }
                                });
                              } else {
                                this.$message({
                                  message: "企业税号不同",
                                  type: "warning",
                                });
                              }
                            } else {
                              //密码不正确
                              this.$message({
                                message: diskInfo.returnmsg,
                                type: "warning",
                              });
                            }
                          }
                        });
                      }
                    }
                  }
                });
              } else {
                this.$message({
                  message: "盘号不符",
                  type: "warning",
                });
              }
            } else {
              this.$alert("请插入税盘后重试", {
                confirmButtonText: "知道了",
                title: "税盘不在线",
                iconClass: "el-icon-warning",
              });
            }
          });
          }else{
               taxDiskEditApi(applyParams)
                          .then((response) => {
                            if (response && response.code == "200") {
                              this.newadd2 = false;
                              this.listByToken();
                              if(this.diskIsOnline=='1'){
                                 this.$message({
                                 message: "修改成功",
                                 type: "success",
                                });
                              }else{
                                   this.$message({
                                   message: "修改成功,请退出后重新登录！",
                                   type: "success",
                                  });
                              } 
                            }
                          })
          }
        
        } else {
          return false;
        }
      });
    },
    // 根据id删除税盘
    taxDel(index, rows) {
      this.$confirm("你确认删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          taxDiskIdApi(rows[index].id)
            .then((response) => {
              if (response && response.code == "200") {
                console.log(rows[index]);
                rows.splice(index, 1);
                this.listByToken();
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              }
            })
            .catch(() => {});
        })
        .catch((error) => {});
    },
    // 点击修改按钮 获取列表数据到弹窗
    taxEdit(val) {
      this.newadd2 = true;
      this.editOrAddFlag = "edit";
      this.ruleForm2 = JSON.parse(JSON.stringify(val));
    },

    // 销方设置
    // 获取销方信息
    listXiao() {
      listXiaoApi(this.taxDiskNum)
        .then((response) => {
          this.annulData = response.data;
        })
        .catch((error) => {});
    },
    // 新增销方信息
    addXiaoAjax() {
      var date = new Date();
      let applyParams = {
        //        createTime: date,
        //        defFlag: 0,//默认销方 0-正常 1-默认 不传
        fhr: this.ruleForm3.fhr, //复核人
        kpr: this.ruleForm3.kpr, //开票人
        sellerAddrTel: this.ruleForm3.sellerAddrTel, //销方地址电话
        sellerBankAccount: this.ruleForm3.sellerBankAccount, //销售方公司开户银行账户
        skr: this.ruleForm3.skr, //收款人
        taxDiskNum: this.ruleForm3.taxDiskNum,
      };
      addXiaoApi(applyParams)
        .then((response) => {
          if (response && response.code == "200") {
             this.$message({
                            message: "新增销方信息成功",
                            type: "success",
                          });
            this.listXiao();
          }
        })
        .catch((error) => {});
    },

    closeForm3() {
      console.log(333);
      this.$refs.ruleForm3.clearValidate();
    },

    // 销方弹窗内容验证提交
    submitForm3() {
      this.$refs["ruleForm3"].validate((valid) => {
        if (valid) {
          if (this.addOrEditFlag == "新增销方信息") {
            this.addXiaoAjax();
          } else {
            this.editXiao();
          }
          this.newadd3 = false;
        } else {
          return false;
        }
      });
    },
    // 根据销方id删除销方信息
    xiaoDel(index, rows) {
      this.$confirm("你确认删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteXiaoApi(rows[index].id)
            .then((response) => {
              if (response && response.code == "200") {
                console.log(rows[index]);
                rows.splice(index, 1);
                this.listByToken();
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    // 点击修改按钮 获取列表数据到弹窗
    xiaoFangEdit(val) {
      this.newadd3 = true;
      this.ruleForm3 = JSON.parse(JSON.stringify(val));
      this.addOrEditFlag = "修改销方信息";
    },
    // 修改销方信息
    editXiao() {
      let applyParams = {
        // createTime: "2021-04-23T09:22:53.504Z",
        defFlag: this.ruleForm3.defFlag,
        fhr: this.ruleForm3.fhr,
        id: this.ruleForm3.id,
        kpr: this.ruleForm3.kpr,
        sellerAddrTel: this.ruleForm3.sellerAddrTel,
        sellerBankAccount: this.ruleForm3.sellerBankAccount,
        skr: this.ruleForm3.skr,
        taxDiskNum: this.taxDiskNum,
      };
      editXiaoApi(applyParams)
        .then((response) => {
          if (response && response.code == "200") {
            this.listXiao();
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          }
        })
        .catch((error) => {});
    },
    // 设为默认
    setDefault(row, index) {
      let applyParams = {
        id: row.id,
        taxDiskNum: this.taxDiskNum,
      };
      defXiaoApi(applyParams)
        .then((response) => {
          if (response && response.code == "200") {
            this.listXiao();
             this.$message({
              type: "success",
              message: "修改默认销方成功!",
            });
          }
        })
        .catch((error) => {});
    },

    handleClick(tab, event) {
      // console.log(tab, event);
    },

    // 打印设置
    //获取打印机列表
    getInstalledPrintersAjax() {
      getInstalledPrintersApi()
        .then((response) => {
          console.log("打印机列表");
          if (response && response.code == "0") {
            let newArr = [];
            response.data.forEach((item, index) => {
              newArr.push({
                value: index,
                label: item,
              });
            });
            this.printList = newArr;
            console.log("response", response.data);
            // localStorage.setItem("cefSharpinitList", JSON.stringify(printList));
          }
        })
        .catch((error) => {});
    },
    // 保存
    savePrinter() {
      if (this.activeName == "first") {

        let printList = {
          printName: this.form4.special !== '' && this.printList.length !== 0 ? this.printList[this.form4.special].label : '',
          printValue: this.form4.special,
          offsetX: this.numzp,
          offsetY: this.zpnum,
        };
        localStorage.setItem("cefSharpinit_zp", JSON.stringify(printList));
      } else if (this.activeName == "second") {
        let printList = {
          printName: this.form4.general !== '' && this.printList.length !== 0 ? this.printList[this.form4.general].label : '',
          printValue: this.form4.general,
          offsetX: this.numpp,
          offsetY: this.ppnum,
        };
        localStorage.setItem("cefSharpinit_pp", JSON.stringify(printList));
      } else if (this.activeName == "third") {
        console.log(this.form4.motor)
        let printList = {
         printName: this.form4.motor !== '' && this.printList.length !== 0 ? this.printList[this.form4.motor].label : '',
          printValue: this.form4.motor,
          offsetX: this.numjdc,
          offsetY: this.jdcnum,
        };

        localStorage.setItem("cefSharpinit_jdc", JSON.stringify(printList));
      } else if (this.activeName == "fourth") {
        console.log(this.form4.listing)
        let printList = {
          printName: this.form4.listing !== '' && this.printList.length !== 0 ? this.printList[this.form4.listing].label : '',
          printValue: this.form4.listing,
          offsetX: this.numqd,
          offsetY: this.qdnum,
        };
        localStorage.setItem("cefSharpinit_qd", JSON.stringify(printList));
      } else if (this.activeName == "five") {
        console.log(this.form4.small)
        let printList = {
          printName: this.form4.small !== '' && this.printList.length !== 0 ? this.printList[this.form4.small].label : '',
          printValue: this.form4.small,
          offsetX: this.xpWidth,
          // offsetY: this.zpnum,
        };
        localStorage.setItem("cefSharpinit_xp", JSON.stringify(printList));
      } else if (this.activeName == "six") {
        console.log(this.form4.other)
        let printList = {
          printName: this.form4.other !== '' && this.printList.length !== 0 ? this.printList[this.form4.other].label : '',
          printValue: this.form4.other,
          offsetX: this.numother,
          offsetY: this.othernum,
        };
        localStorage.setItem("cefSharpinit_other", JSON.stringify(printList));
      }
      //alert("保存成功");
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    //打印测试页
    async testPrint() {
      if (this.activeName == "first") {
        if(JSON.parse(localStorage.getItem("cefSharpinit_zp")) == null){
          this.$message({
            type: 'info',
            message: '请设置打印机并保存后重试'
          })
          return
        }
        else if(JSON.parse(localStorage.getItem("cefSharpinit_zp")) !== null){
          let obj = JSON.parse(localStorage.getItem("cefSharpinit_zp"))
          if(obj.printName == ''){
            this.$message({
              type: 'info',
              message: '请设置打印机并保存后重试'
            })
            return
          }
          else{
            let data = {
              printName: this.printList[this.form4.special].label,
              offsetX: this.numzp,
              offsetY: this.zpnum
            }
            const res = await printTest(data)
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '打印测试页成功'
              })
            }
            else{
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          }
        }
      } else if (this.activeName == "second") {
        if(JSON.parse(localStorage.getItem("cefSharpinit_pp")) == null){
          this.$message({
            type: 'info',
            message: '请设置打印机并保存后重试'
          })
          return
        }
        else if(JSON.parse(localStorage.getItem("cefSharpinit_pp")) !== null){
          let obj = JSON.parse(localStorage.getItem("cefSharpinit_pp"))
          if(obj.printName == ''){
            this.$message({
              type: 'info',
              message: '请设置打印机并保存后重试'
            })
            return
          }
          else{
            let data = {
              printName: this.printList[this.form4.general].label,
              offsetX: this.numpp,
              offsetY: this.ppnum
            }
            const res = await printTest(data)
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '打印测试页成功'
              })
            }
            else{
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          }
        }
      } else if (this.activeName == "third") {
        if(JSON.parse(localStorage.getItem("cefSharpinit_jdc")) == null){
          this.$message({
            type: 'info',
            message: '请设置打印机并保存后重试'
          })
          return
        }
        else if(JSON.parse(localStorage.getItem("cefSharpinit_jdc")) !== null){
          let obj = JSON.parse(localStorage.getItem("cefSharpinit_jdc"))
          if(obj.printName == ''){
            this.$message({
              type: 'info',
              message: '请设置打印机并保存后重试'
            })
            return
          }
          else{
            let data = {
              printName: this.printList[this.form4.motor].label,
              offsetX: this.numjdc,
              offsetY: this.jdcnum
            }
            const res = await printTest(data)
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '打印测试页成功'
              })
            }
            else{
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          }
        }
      } else if (this.activeName == "fourth") {
        if(JSON.parse(localStorage.getItem("cefSharpinit_qd")) == null){
          this.$message({
            type: 'info',
            message: '请设置打印机并保存后重试'
          })
          return
        }
        else if(JSON.parse(localStorage.getItem("cefSharpinit_qd")) !== null){
          let obj = JSON.parse(localStorage.getItem("cefSharpinit_qd"))
          if(obj.printName == ''){
            this.$message({
              type: 'info',
              message: '请设置打印机并保存后重试'
            })
            return
          }
          else{
            let data = {
              printName: this.printList[this.form4.listing].label,
              offsetX: this.numqd,
              offsetY: this.qdnum
            }
            const res = await printTest(data)
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '打印测试页成功'
              })
            }
            else{
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          }
        }
      } else if (this.activeName == "five") {
        if(JSON.parse(localStorage.getItem("cefSharpinit_xp")) == null){
          this.$message({
            type: 'info',
            message: '请设置打印机并保存后重试'
          })
          return
        }
        else if(JSON.parse(localStorage.getItem("cefSharpinit_xp")) !== null){
          let obj = JSON.parse(localStorage.getItem("cefSharpinit_xp"))
          if(obj.printName == ''){
            this.$message({
              type: 'info',
              message: '请设置打印机并保存后重试'
            })
            return
          }
          else{
            let data = {
              printName: this.printList[this.form4.small].label,
              pageWidth: this.xpWidth,
            }
            const res = await ticketPrintTest(data)
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '打印测试页成功'
              })
            }
            else{
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          }
        }
      } else if (this.activeName == "six") {
        if(JSON.parse(localStorage.getItem("cefSharpinit_other")) == null){
          this.$message({
            type: 'info',
            message: '请设置打印机并保存后重试'
          })
          return
        }
        else if(JSON.parse(localStorage.getItem("cefSharpinit_other")) !== null){
          let obj = JSON.parse(localStorage.getItem("cefSharpinit_other"))
          if(obj.printName == ''){
            this.$message({
              type: 'info',
              message: '请设置打印机并保存后重试'
            })
            return
          }
          else{
            let data = {
              printName: this.printList[this.form4.other].label,
              offsetX: this.numother,
              offsetY: this.othernum
            }
            const res = await printTest(data)
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '打印测试页成功'
              })
            }
            else{
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          }
        }
      }
    },

    // 基本设置
    save5() {
      if((!this.form5.exitTime || this.form5.exitTime == 0) && this.form5.exit){
        this.$message({
          type: 'info',
          message: '请输入大于0的正整数'
        })
        return
      }
      let obj = this.form5;
      console.log("form5", obj);
      localStorage.setItem("initSetBase", JSON.stringify(obj));
      // alert("保存");
      setAutoRun(this.form5.autostart); //开机是否自启动
      this.$message({
        message: "保存成功",
        type: "success",
      });
    },

    save6() {
      let obj = this.form6;
      this.form6.openedInvoiceType=this.invoicetype.join(',')
      console.log("form6", obj);
      localStorage.setItem("initSetParameter", JSON.stringify(obj));
      // alert("保存");
      var that = this;
      saveTaxDiskNumApi(this.form6)
        .then((response) => {
          if (response && response.code == "200") {
            console.log(response);
            that.$message({
              type: "success",
              message: "保存成功",
            });
            //  that.form6=response.data;
            //  that.form6.barcode=null;
            //  previewMode  ---发票预览code  1开具后预览发票2打印时预览发票
            // printMode ----清单开票打印 1全打模式2套打模式
          }
        })
        .catch((error) => {});
    },

    // 关于
    getAboutClient() {
      let params = "";
      getClientInfo(params)
        .then((response) => {
          if (response && response.code == "200") {
            let res = response.data;
            this.VersionInfo = res.clientName + " " + res.version;
          }
        })
        .catch((error) => {});
    },

    clickLeft(){
        this.$router.push({ name: "settingIndex" });
      },
  },
};
</script>

<style lang="scss" scoped>
.userxy {
  color: #000;
}
.page-container {
  width: 100%;
  height: auto;
  min-height: 700px;
  background: #fff;
  margin: 0;
  padding: 0;
  .title {
    height: 64px;
    line-height: 64px;
    margin-left: 31px;
    background: #ffffff;
    border-radius: 2px 2px 0px 0px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #252525;
    border-bottom: 1px solid #f0f0f0;
    span {
      margin-left: 2px;
    }
  }
  .navigation {
    .el-tabs {
      margin-left: 70px;
    }
    .information {
      .prompt {
        width: 604px;
        height: 40px;
        line-height: 40px;
        margin-top: 35px;
        margin-left: 64px;
        background: #e6f7ff;
        border: 1px solid #91d5ff;
        .el-tabs__item {
          margin-left: 30px !important;
        }
        .el-icon-info {
          color: #1890ff;
          margin-left: 17px;
          margin-right: 4px;
        }
        span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.65);
          margin-right: 130px;
        }
      }
      .content {
        margin-top: 20px;
        margin-left: 60px;
        .el-select {
          width: 145px;
          height: 10px;
          margin-right: 10px;
        }
        span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.65);
        }
        .el-input {
          width: 350px;
          height: 32px;
        }
        .el-cascader {
          width: 350px;
          height: 32px;
        }
        .el-input-number {
          width: 120px;
        }
        .symbol {
          margin-left: 10px;
          margin-right: 10px;
        }
      }
      .el-button {
        border: none;
        width: 88px;
        margin-top: 37px;
        margin-left: 250px;
        margin-bottom: 100px;
        border-radius: 2px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }
  }
  //税盘设置
  .tax-disc {
    display: flex;
  }
  .newadd {
    // float: right;
    position: absolute;
    right: 20px;
    top: 20px;
    width: 74px;
    height: 32px;
    line-height: 3px;
    margin-top: 20px;
    margin-right: 20px;
    border: none;
    text-align: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  
  .new-tax-disc {
    .taxTips{
      color: #1890ff;
      font-size: 14px;
      margin-bottom: 10px;
      text-align: center;
      // justify-self: left;
      // justify-content: left;
      // align-items:center;
      position: relative;
      top: -15px;
    }
    .el-form-item {
      margin-bottom: 40px;
    }
    .xfxz {
      position: relative;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #5e8cf9;
      margin-left: -65px;
    }
  }
  //打印设置
  .print {
    .el-tabs {
      margin-left: 45px;
      .el-tab-pane {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000000;
      }
      .el-tabs__active-bar {
        background: #000 !important;
      }
      .one {
        .inputNum{
              position: relative;
              left: 6px;
            }
        .el-select {
          width: 320px;

        }
        span {
          margin-right: 8px;
        }
        .el-input-number {
          width: 100px;
          margin-right: 20px;
        }
        .el-button {
          border: none;
          margin-top: 50px;
          margin-left: 70px;
          margin-bottom: 200px;
          text-align: center;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
        }
        .btn {
          width: 110px;
          margin-right: -50px;
        }
      }
    }
  }
  //基本设置
  .basic {
    margin-top: 40px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    .exit {
      display: flex;
      align-items: center;
      .minutes {
        padding: 5px;
        text-align: center;
        .el-input{
          width: 50px;
          position:relative;
          bottom: 3px;
        }
      }
      span {
        margin-top: -6px;
      }
    }

    .el-button {
      border: none;
      width: 88px;
      margin-top: 40px;
      margin-left: 100px;
      margin-bottom: 100px;
      // background: #5E8CF9;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
  //参数设置
  .parameter {
    margin-top: 40px;
    .el-input {
      width: 350px;
      height: 32px;
    }
    .el-select {
      width: 350px;
      height: 32px;
    }

    span {
      position: relative;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #5e8cf9;
      margin-left: -65px;
    }
    .el-button {
      border: none;
      width: 88px;
      margin-top: 40px;
      margin-left: 230px;
      margin-bottom: 100px;
      border-radius: 2px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
  //关于我们
  .about {
    margin-top: 40px;
    margin-left: 60px;
    padding-right: 330px;
    padding-bottom: 150px;
    p {
      word-wrap: break-word;
      word-break: break-all;
    }
    div {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      line-height: 24px;
    }
  }

  .navigation .el-tabs__item:hover {
    background: #f1f5ff;
  }
  .el-form-item__label {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000;
  }
  .el-form-item {
    height: 25px;
    line-height: 25px;
  }

   ::v-deep .el-input-number.is-controls-right .el-input__inner {
    height: 32px;
  }
  ::v-deep .el-input-number__increase {
    margin-top: 3px;
    height: 16px;
    line-height: 16px;
  }
   ::v-deep .el-input-number__decrease {
    height: 16px;
    margin-bottom: 3px;
     line-height: 16px;
  }

  /* 打印 */
  .print .el-tabs__nav-wrap::after {
    width: 0;
  }
}
</style>
