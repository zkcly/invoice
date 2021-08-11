<template >
  <div>
    <div class="mask"></div>
    <div class="login">
      <div class="main" v-show="showLoginBox">
        <div class="login-form">
          <button class="el-dialog__headerbtn" @click="closeLoginWin">
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
            <div style="text-align: center; margin-bottom: 20px">
              <img
                src="@/assets/images/icon_box@2x.png"
                style="width: 80px; height: 80px"
              />
            </div>
            <el-form-item prop="userName">
               <el-select   style="width:100%"
               v-model.trim="loginForm.userName"
               filterable 
               allow-create 
               default-first-option 
               @blur="usernameblur"
               @keypress.native="usernameinput"
               @change="userNameChange"
               > 
                <el-option v-for="item in userNameList" :label="item.userName" :key="item.userName" :value="item.userName"></el-option>
                <svg-icon slot="prefix" icon-class="user" class="input-icon" />
              </el-select>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                :key="passwordType"
                v-model.trim="loginForm.password"
                type="password"
                maxlength="21"
                placeholder="请输入登录密码"
                name="password"
                auto-complete="on"
                @keyup.enter.native="loginFun"
              >
                <svg-icon
                  slot="prefix"
                  icon-class="password"
                  class="el-input__icon input-icon"
                />
              </el-input>
            </el-form-item>
            <el-form-item>
              <!-- <el-checkbox>自动登录</el-checkbox> -->
              <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
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
        <reset-password v-if="showResetPasswordBox" :closeResetPasswordBox="closeResetPasswordBox"/>
      <el-dialog
        title="选择税盘"
        :visible.sync="selectDiskVisible"
        width="350px"
        center
        :modal="false"
        :show-close="false"
        :close-on-click-modal="false"
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
          :rules="companyRules"
        >
          <el-form-item label="企业名称：" prop="companyName">
            <el-input
              size="small"
              disabled
              v-model.trim="companyInfo.companyName"
            ></el-input>
          </el-form-item>
          <el-form-item label="纳税人识别号：" prop="taxId">
            <el-input
              size="small"
              disabled
              v-model.trim="companyInfo.taxId"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="注册地址："
            prop="district"
          >
            <el-select
              @change="getCityList()"
              placeholder="请选择省"
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
            <el-form-item label="纳税人性质：" prop="taxpayerNature">
              <el-radio-group v-model="companyInfo.taxpayerNature">
                <el-radio :label="1">一般纳税人</el-radio>
                <el-radio :label="2">小规模纳税人</el-radio>
              </el-radio-group>
            </el-form-item>
          <el-form-item
            label="地址电话："
            prop="sellerAddrTel"
          >
            <el-input
              size="small"
              v-model.trim="companyInfo.sellerAddrTel"
            ></el-input>
          </el-form-item>
          <el-form-item label="开户行及账号：" prop="sellerBankAccount">
            <el-input
              size="small"
              v-model.trim="companyInfo.sellerBankAccount"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="开票人："
            prop="kpr"
          >
            <el-input size="small" v-model.trim="companyInfo.kpr"></el-input>
          </el-form-item>
          <el-form-item label="收款人：" prop="skr">
            <el-input size="small" v-model.trim="companyInfo.skr"></el-input>
          </el-form-item>
          <el-form-item label="复核人：" prop="fhr">
            <el-input size="small" v-model.trim="companyInfo.fhr"></el-input>
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
        :modal="false"
        :close-on-click-modal="false"
        :visible.sync="setTemplateVisible"
        :before-close="setTemplateClose"
      >
        <el-steps :active="currentsetp"    style="width:90%;margin:0 auto">
          <el-step title="用户协议"></el-step>
          <el-step title="税盘设置"></el-step>
          <el-step title="企业信息"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <div
          style="width: 80%; margin: 25px auto; height: 400px"
          v-if="currentsetp == 1"
        >
          <div style="height: 350px; overflow-y: auto; background: #f5f5f5;line-height:24px">
              <div style="text-align:center"><h2 >注册协议</h2></div>
              <h3>《互联网数据应用许可协议》</h3>
                    <p>
                    在客户点击同意互联网数据应用许可协议（以下简称本协议）的按钮时，意味着客户和 <span style="font-weight:600">浙江旋极共创科技有限责任公司（以下简称本公司）</span>成立了以下的协议条款：（点击前请仔细阅读，尤其是加黑文字）
                  </p>

                  <p>
                    <span style="font-weight:600">1.本协议的内容可能会适时修订，并在网上公告。请予以关注，恕难单独通知，如不同意修订条款，客户有权终止本协议。</span>
                  </p>
                  <p>
                    2.客户应当是符合中国法律的合法主体，本协议受中国大陆法律管辖，适用中国大陆法律，如客户对此有异议，可以停止使用本协议。
                  </p>
                  <p>
                    3.本公司应在法律允许的范围内采集和使用客户的数据信息。<span style="font-weight:600">客户签署本协议即表示客户同意一次性授权本公司采集使用客户的数据信息，</span>但如果第三方查询使用客户的数据信息，那么应当经客户的书面同意。
                  </p>
                  <p>
                    <span style="font-weight:600">4.特别提示：本公司提供融资服务中第三方机构或相关合法主体要求本公司应贷款业务需要提供客户的数据信息时,本公司将持续如实提供，本公司保证客户提供的数据信息仅用于融资服务，不会用于其它商业目的。但笫三方使用客户的数据信息不是出于融资服务的目的，则应由第三方和客户协商确定，由此产生的法律后果由客户和第三方自行承担。</span>
                  </p>
                  <p>
                    5.客户向本公司提供的数据信息应当合法、真实、有效。否则由此产生的法律责任由客户承担。
                  </p>
                  <p>
                    6.本协议适用中国大陆法律，<span style="font-weight:600">因本协议产生所有纠纷应提交上海市虹口区人民法院诉讼解决。</span>
                  </p>

                  <h3>《用户服务协议》</h3>
                  <p>
                    <span style="font-weight:600">1.郑重提示：用户一旦使用和接受浙江旋极共创科技有限责任公司（以下简称本公司）服务，即应了解和同意本公司服务协议的全部条款。</span>
                  </p>
                  <p>
                    <span style="font-weight:600">
                    2.为实现服务目标，用户授权本公司使用其数据信息并可将企业信息、发票数据等数据信息提供给本公司同意的第三方使用。
                    </span>
                  </p>
                  <p>
                    <span style="font-weight:600">
                    3.为有效开具增值税电子发票，用户授权本公司使用软件生成电子印章“发票专用章”，使用国税颁发的数字证书进行电子签名。
                    </span>
                  </p>
                  <p>
                    4.用户应保证其提供的数据信息真实、完整、合法、有效，并不得在平台上进行违法或本公司不同意的行为。
                  </p>
                  <p>
                    <span style="font-weight:600">5.本公司不会泄露给任何未经本公司许可的第三方，但法律规定或政府强制披露除外，由于用户原因或黑客攻击以及不可抗力导致的泄露，本公司也不承担任何责任。</span>
                  </p>
                  <p>
                    6.用户需要对自己的用户名和密码的安全承担保密义务，并保证账号不出现任何异常情况，否则本公司有权采取必要的安全措施（如删除或冻结账号等），由此产生的一切后果由用户承担。
                  </p>
                  <p>
                    <span style="font-weight:600">
                      7.用户应特别注意：本公司对服务导致的任何直接损失和间接损失不承担任赔偿责任，也不保证不会出现系统缺陷、病毒、黑客攻击以及其它不可抗力等事件，并对此导致的任何损失不承担赔偿责任。
                    </span>
                  </p>
                  <p>
                    <span style="font-weight:600">
                      8.本公司对任何存储信息具有自主处分权，包括但不限于可以拒绝或删除用户信息，中断或拒绝提供服务，而且不需要事先告知。
                    </span>
                  </p>
                  <p>
                    <span style="font-weight:600">
                      9.用户行为导致对本公司索赔的用户应承担本公司和关联公司以及相关人员所遭受的一切损失（包括但不限于赔偿费、律师费、诉讼费、仲裁费、差旅费等所有费用）。
                    </span>
                  </p>
                  <p>
                    <span style="font-weight:600">
                      10.本公司决定变更或终止相关服务，将会通过相关网站进行公告，但不必事先逐个通知，也不对此承担任何责任。
                    </span>
                  </p>
                  <p>
                    <span style="font-weight:600">
                      11.如用户对变更相关服务有异议，应立即拒绝服务，否则继续接受服务即视为同意本公司的变更。
                    </span>
                  </p>
                  <p>
                    <span style="font-weight:600">
                      12.本协议适用中国大陆地区法律，因本协议产生任何纠纷经由上海市虹口区人民法院诉讼解决。
                    </span>
                  </p>
                  <p>
                    13.本协议最终解释权由浙江旋极共创科技有限责任公司享有。
                  </p>
                  <h3>《软件许可协议》</h3>
                  <p>
                    用户应认真阅读本（软件许可协议》（下称《协议》）中各条款，尤其包括免除或者限制<span style="font-weight:600">浙江旋极共创科技有限责任公司（以下简称本公司）</span>责任的免责条款及对用户的权利限制条款。请在审阅后自愿决定是否接受或不接受本《协议》。<span style="font-weight:600">
                      除非用户接受《协议》条款，否则用户无权下载、安装或使用本“软件”及接受相关服务。如果用户选择安装使用本“软件”，将视为用户接受本《协议》及各项条款的约束。
                    </span>
                  </p>
                  <p>
                    本《协议》是用户与本公司之间关于用户下载、安装、使用、复制本公司软件（以下简称“软件”）所订立的协议。本《协议》规定本公司与用户之间关于“软件”许可使用及相关方面的权利义务。“用户”是通过本公司提供的获取软件授权的途径获得软件授权许可和/或软件产品的自然人、法人或其他合法民事主体。
                  </p>

                  <h4>1.权利声明</h4>
                  <p>
                    本“软件”由本公司开发。本“软件”的计算机软件著作权以及与“软件”相关的所有信息内容，包括但不限于：文字表述及其组合、图标、图饰、图表、色彩、界面设计、版面框架、有关数据、印刷材料、或电子文档等均为本公司独立所有，受著作权法和国际著作权公约以及其他知识 产权法律法规的保护。
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
                    用户同意并授权本公司使用用户的“税务数字证书”，登陆各级税局机关“增值税发票选择确认平台”、“全国增值税发票查验平台”获取相关信息，并提供增值税发票相关服务，且用户授权是不可撤销的。<span style="font-weight:600">用户不当使用本“软件”包含的本公司进项管理服务而引致之任何意外、疏忽、合约毁坏、诽谤、版权或知识产权侵犯及其所造成的损失（包括因下载而感染电脑病毒），本公司概不负责，亦不承担任何法律责任。</span>
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
                    3.3.3对于本“软件”相关信息等，未经本公司书面同意，用户不得擅自实施包括但不限于下列行为：便用、复制、修改、链接、转载、 汇编、发表、出版，擅自借助“软件”发展与之有关的衍生产品、作品、服务等。
                  </p>
                  <p>
                    <span style="font-weight:600">
                      3.4使用本“软件”必须遵守国家有关法律和政策，并遵守本《协议》，对于用户违法或违反本《协议》的使用而引起的一切责任，由用户负全部责任，一概与本公司及合作单位无关，导致本公司及合作单位损失的，本公司及合作单位有权要求用户赔偿，并有权立即停止向其提供服务，保留相关记录，保留配合司法机关追究法律责任的权利。
                    </span>
                  </p>
                  <p>
                    3.5本“软件”同大多数互联网软件一样，可能受到各种安全问题的侵扰；用户利用本“软件”下载安装的其它软件中可能舍有”特洛伊木马“等病毒，威胁到用户的计算机信息和数据的安全，继而影响本“软件”的正常使用等等。因此，本公司提醒用户应加强信息安全及使用者资料的保护意识，要注意加强密码保护，以免遭致损失和骚扰。
                  </p>
                  <p>
                    <span style="font-weight:600">
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
                    <span style="font-weight:600">
                      3.9“软件”的替换、修改和升级：本公司保留在任何时候为用户提供本“软件”替换、修改、升级版本的权利。同时，用户在此同意，为提高用户体验，本公司有权将其他相关产品绑定在本“软件”上供用户进行下载和安装。
                    </span>
                  </p>
                  <p>
                    <span style="font-weight:600">
                      3.10本“软件”可能使用的第三方软件或技术，是受到合法授权的。因第三方软件或技术引发的任何纠纷，由该第三方负责解决，本公司不承担任何责任。本公司不对第三方软件或技术提供客服支持，若用户需要获取支持，请与该软件或技术提供商联系。
                    </span>
                  </p>
                  <h4>4.法律责任与免责</h4>
                  <p>
                    4.1本公司特别提请用户注意，本公司为了保障公司业务发展和调整的自主权，本公司拥有随时自行修改或中断软件授权而不需通知用户的权利，如有必要，修改或中断会以通告形式公布于本公司网站页面上，但不会逐个通知用户。
                  </p>
                  <p style="font-weight:600">
                    4.2用户违反本《协议》或相关的服务条款的规定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的诉讼费用和律师费用，用户同意赔偿本公司与合作公司、关联公司，并使之免受损害。对此，本公司有权视用户的行为性质，采取包括但不限于中断使用许可、停止提供服务、限制使用、法律追究等措施。
                  </p>
                  <p style="font-weight:600">
                    4.3使用本“软件”涉及到互联网服务，可能会受到各个环节不稳定因素的影响，存在因不可抗力、计算机病毒、黑客攻击、系统不稳定、用户所在位置、用户关机以及其他任何网络、技术、通信线路等原因造成的服务中断或不能满足用户要求的风险，用户已经知哓并自行承担以上风险，本公司对此不承担任何责任。
                  </p>
                  <p style="font-weight:600">
                    4.4用户因第三方如电信部门的通讯线路故障、技术问题、网络、电脑故障、系统不稳定性及其他各种非因本公司原因而遭受的经济损失，本公司不承担任何责任。
                  </p>
                  <p style="font-weight:600">
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

                    <div style="text-align:center"><h2 >隐私政策</h2></div>
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
                  <p>4、满足您的个性化需求。 </p>
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
                  <p>我们会严格遵守相关的法律法规的规定，对信息的分享进行严格的限制。</p>
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
                  <p>2、基于法律的披露：在法律、法律程序、诉讼或政府主管部门强制性要求的情况下，我们可能会公开披露您的相关信息。</p>
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
                  <p>如果您对本政策有任何疑问、意见或建议，通过以下方式与我们联系：</p>
                  <p>服务电话：400-6728066</p>
                  <p> 一般情况下，我们将在三十天内回复。</p>
          </div>
          <div style="text-align: center; margin-top: 25px">
            <el-button type="primary" @click="currentsetp=2"
              >阅读并接受协议</el-button
            >
          </div>
        </div>

        <div v-show="currentsetp == 2 && !isOnlineLocation" style="width: 70%; margin: 10px auto">
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
                maxlength="61"
                v-model.trim="diskInfoForm.taxDiskName"
              ></el-input>
            </el-form-item>
            <el-form-item label="税盘类型：" prop="diskType">
              <el-select
               @change="diskInfoForm.taxDiskPassword='';diskInfoForm.digitalCertificatePassword=''"
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
            <el-form-item
              label="税盘密码："
              prop="taxDiskPassword"
              v-if="diskInfoForm.diskType != '1'"
            >
              <el-input
                size="small"
                style="width: 80%"
                maxlength="8"
                v-model.trim="diskInfoForm.taxDiskPassword"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="数字证书口令："
              prop="digitalCertificatePassword"
            >
              <el-input
                size="small"
                style="width: 80%"
                maxlength="8"
                v-model.trim="diskInfoForm.digitalCertificatePassword"
              ></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: center;margin-top:20px">
            <el-button type="primary" @click="currentsetp = 1"
              >上一步</el-button
            >
            <el-button type="primary" @click="setNewTaxDisk">下一步</el-button>
          </div>
        </div>

         <div v-show="currentsetp == 2&& isOnlineLocation" style="width: 70%; margin: 10px auto">
          <el-alert
            title="温馨提示：本地税盘，请先插入再进行税盘设置，若为托管税盘请联系客服设置"
            type="success"
          >
          </el-alert>
          <el-form
            label-width="120px"
            label-position="right"
            :model="diskInfoForm"
            :disabled="isOnlineLocation"
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
            <el-form-item
              label="税盘密码："
              prop="taxDiskPassword"
              v-if="diskInfoForm.diskType != '1'"
            >
              <el-input
                size="small"
                style="width: 80%"
                maxlength="16"
                v-model.trim="diskInfoForm.taxDiskPassword"
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
                v-model.trim="diskInfoForm.digitalCertificatePassword"
              ></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: center">
            <el-button type="primary" @click="currentsetp = 1"
              >上一步</el-button
            >
            <el-button type="primary" @click="currentsetp = 3">下一步</el-button>
          </div>
        </div>

        <div v-show="currentsetp == 3" style="width: 70%; margin: 0 auto">
          <el-form
            ref="companyInfoForm"
            label-width="120px"
            label-position="right"
            :model="companyInfo"
            :rules="companyRules"
          >
            <el-form-item label="企业名称：" prop="companyName">
              <el-input
                size="small"
                disabled
                v-model.trim="companyInfo.companyName"
              ></el-input>
            </el-form-item>
            <el-form-item label="纳税人识别号：" prop="taxId">
              <el-input
                size="small"
                disabled
                v-model.trim="companyInfo.taxId"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="注册地址："
              prop="district"
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
            <el-form-item label="纳税人性质：" prop="taxpayerNature">
              <el-radio-group v-model="companyInfo.taxpayerNature">
                <el-radio :label="1">一般纳税人</el-radio>
                <el-radio :label="2">小规模纳税人</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="地址电话："
              prop="sellerAddrTel"
            >
              <el-input
                size="small" maxlength='101'
                v-model.trim="companyInfo.sellerAddrTel"
              ></el-input>
            </el-form-item>
            <el-form-item label="开户行及账号：" prop="sellerBankAccount">
              <el-input
                size="small" maxlength='101'
                v-model.trim="companyInfo.sellerBankAccount"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="开票人："
              prop="kpr"
            >
              <el-input maxlength='11' size="small" v-model.trim="companyInfo.kpr"></el-input>
            </el-form-item>
            <el-form-item label="收款人：" prop="skr">
              <el-input maxlength='11' size="small" v-model.trim="companyInfo.skr"></el-input>
            </el-form-item>
            <el-form-item label="复核人：" prop="fhr">
              <el-input maxlength='11' size="small" v-model.trim="companyInfo.fhr"></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: center">
            <el-button type="primary" @click="currentsetp = 2"
              >上一步</el-button
            >
            <el-button type="primary" @click="saveCompanyInfo"
              >下一步</el-button
            >
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
            <el-button type="primary" @click="currentsetp = 3"
              >上一步</el-button
            >
            <el-button type="primary" @click="completeSetDisk">确定</el-button>
          </div>
        </div>
      </el-dialog>
     
    </div>
    <div class="logindialog">
    <el-dialog
  :visible.sync="loginloading"
  width="25%"
  :modal="false"
  :before-close="closeLoginLoading"
  :close-on-click-modal="false"
   top='40vh'
  >
  <div style="font-size:24px;text-align:center"> 
  <span class="el-icon-loading" ></span>
  <span>税盘初始化中</span>
  </div>
</el-dialog>
    </div>
  
  </div>
</template>

<script>
import { mapState } from "vuex";
import x2js from "x2js";
import { validUsername,validStrCheckLength } from "@/utils/validate";
import { GetDateTime ,debounce} from '@/utils/function.js'
import {
  checkTaxDiskIsOnline,
  invoiceInquiryInit,
  companyDiskRegistrationCodeInit,
  getLoginInfo,
  listXiaoApi,
  listByTokenApi
} from "@/api/loginprocessApi.js";
import {request,simpleRequest} from "@/utils/requestClient";
import {
  getProvinceListApi,
  getCityListApi,
  addApanApi,
  companyInfoInit,
 
} from "@/api/setpan.js";
import { getToken, setToken, removeToken } from "@/utils/auth";
import ResetPassword from "./ResetPassword.vue";
const X2JS = new x2js();
export default {
  name: "Login",
   components: {
      ResetPassword
    },
  props: {},
  inject: ["reload"],
  data() {
      const validateUserName = (rule, value, callback) => {
        if (value&&!validStrCheckLength(value, 11)) {
        callback(new Error('最多输入10个汉字或字符'));
      } else {
        callback();
      }
    };
      const validateTaxDiskName = (rule, value, callback) => {
           if (!validStrCheckLength(value, 61)) {
                callback(new Error("最多输入60个汉字或字符"));
            } else {
                callback();
            }
        };

    const checkPassword=(rule, value, callback)=>{
     if (!new RegExp(/^[0-9]{6,8}$/).test(value)) {
        callback(new Error("请填写6-8位数字"));
      } else {
        callback();
      }
    }
    return {
      loginloading:false,
      showLoginBox: true,
      form: {},
      setTemplateVisible: false,
      companyInfoSetting: false,
      currentsetp: 1,
      loginForm: {
        userName: "",
        password: "",
      },
      loginRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "change" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          // { min: 6, max: 20, message: "密码需介于6-20位之间", trigger: "blur" },
          { validator: (rule, value, callback)=>{ if (!new RegExp(/^[0-9a-zA-Z]{6,20}$/).test(value)) {
           callback(new Error("请输入6-20位字母或数字")); } else {callback();}}, trigger: 'blur' }
        ],
      },
      rules: {
        taxDiskName: [
            { required: true, message: "请输入税盘名称", trigger: "blur" },
            { validator: validateTaxDiskName, trigger: 'blur' },
        ],
        diskType: [
          { required: true, message: "请选择税盘类型", trigger: "change" },
        ],
        taxDiskNum: [
          { required: true, message: "请输入税盘编号", trigger: "blur" },
          { validator: (rule, value, callback)=>{ if (!new RegExp(/^[0-9]{11,12}$/).test(value)) {
           callback(new Error("请填写11-12位数字")); } else {callback();}}, trigger: 'blur' }
        ],
        onlineLocation: [
          { required: true, message: "请选择税盘状态", trigger: "change" },
        ],
        taxDiskPassword: [
          { required: true, message: "请输入税盘密码", trigger: "blur" },
          { validator: checkPassword, trigger: 'blur' },
        ],
        digitalCertificatePassword: [
          { required: true, message: "请输入数字证书口令", trigger: "blur" },
          { validator: checkPassword, trigger: 'blur' },
        ],
      },

      companyRules:{
        district: [{required: true,message: '请选择注册地址',trigger: 'change'},],
        taxpayerNature: [{ required: true, message: "请选择纳税人性质", trigger: "change" },],
        sellerAddrTel: [{required: true,message: '请输入地址电话',trigger: 'blur'},
        {max:100,message: "最多输入100个汉字或字符", trigger: "blur"}],
        sellerBankAccount:[{max:100,message: "最多输入100个汉字或字符", trigger: "blur"}],
        kpr: [{required: true,message: '请输入开票人',trigger: 'blur'},
              {validator: validateUserName, trigger: "blur"}],
        skr: [{validator: validateUserName, trigger: "blur"}],
        fhr: [{validator: validateUserName, trigger: "blur"}],
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
        district: "",
      },
      currentTaxDisk: "",
      userNameList:[],
      rememberPassword:false,
      isOnlineLocation:false,
      showResetPasswordBox:false,
      jspSoftVersion:''
    };
  },
  computed: {
    ...mapState("user", ["loginInfo", "taxDiskInfo", "showLoginWin"]),
  },
  created() {
   this.userNameList=this.$store.state.app.userNameList
   let lastLoginUser=this.$store.state.app.lastLoginUser
   if(lastLoginUser){
    this.loginForm.userName=lastLoginUser.userName
    this.rememberPassword=lastLoginUser.rememberPassword
    if(lastLoginUser.rememberPassword){
          this.loginForm.password=lastLoginUser.password
      }
   }
   this.setNewTaxDisk=debounce(this.setNewTaxDisk,500)
   this.saveCompanyInfo=debounce(this.saveCompanyInfo,500)
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
    usernameinput(e){
      if(e.keyCode == 32){
        e.returnValue=false
      }
    },
    usernameblur(e){
        if(e.target.value){
          this.loginForm.userName=e.target.value
        }
    },
    //  querySearch(queryString, cb) {
    //     var userNameList = this.userNameList?this.userNameList:[];
    //     userNameList.forEach((item)=>{
    //        item.value=item.userName
    //     })
    //     var results = queryString ? userNameList.filter((userName)=>{
    //       return userName.userName.indexOf(queryString)!=-1
    //     }) : userNameList;
    //     // 调用 callback 返回建议列表的数据
    //     cb(results);
    //   },
    userNameChange(val){
      console.log(val)
      if( this.userNameList){
           this.userNameList.map((item)=>{
          if(item.userName==val){
            if(item.rememberPassword){
              this.loginForm.password=item.password
            }else{
              this.loginForm.password=""
            }
            this.rememberPassword=item.rememberPassword
            return
          }
       })
      }
    },
    closeLoginWin() {
       this.$store.commit("user/showLoginWin", false);
    },

    //忘记密码
    forgetPassword() {
      // this.$router.push({ path: "/resetPassword" });
      this.showResetPasswordBox=true
    },
    closeResetPasswordBox(){
     this.showResetPasswordBox=false
    },
    //登录
    loginFun() {

      this.$refs["loginForm"].validate((valid) => {
        if (valid) {
          clearTimeout(localStorage.getItem("setIntervalId"));
          this.$store
            .dispatch("user/login", this.loginForm, true)
            .then((res) => {
              if (res.code == 200) {
                this.$store.commit('app/SET_LASTUSER',{rememberPassword:this.rememberPassword,...this.loginForm})
                let userNameList=this.$store.state.app.userNameList
                 if(userNameList.length>0){
                         let olduser=false
                         userNameList.forEach((item)=>{
                            if(item.userName==this.loginForm.userName){
                              item.rememberPassword=this.rememberPassword
                              olduser=true
                            }
                         })
                         if(!olduser){
                            userNameList.unshift({...this.loginForm,rememberPassword:this.rememberPassword})
                         }
                           this.$store.commit('app/ADD_USERLIST',userNameList)
                 }else{
                      this.$store.commit('app/ADD_USERLIST',[{...this.loginForm,rememberPassword:this.rememberPassword}])
                 }

                  getLoginInfo().then(response => {
                        const { data } = response
                        if (!data) {
                            return reject('Verification failed, please Login again.')
                        }
                       this.$store.commit('user/SET_LOGININFO', response.data)
                       this.$store.dispatch("user/listByTokenApi").then(() => {
                       this.taxDiskList = this.$store.state.user.taxDiskList;
                  if (this.taxDiskList.length == 0) {
                    //登录成功后没有税盘跳转到引导设置盘
                    this.setTemplateVisible = true;
                    let body=document.getElementsByTagName('body')[0]
                        body.style.overflow='hidden'
                    this.getProvinceList();
                  } else {
                    if(this.taxDiskList.length==1){
                      //一个盘默认选中并不打开选择盘弹窗
                      this.currentTaxDisk=this.taxDiskList[0]
                      this.handleDiskChange()
                    }else{
                      //有盘打开选择盘弹窗
                      this.selectDiskVisible = true;
                    }
                  }
                   this.showLoginBox = false;
           
                });

                    })
               
              }
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    

    closeLoginLoading(done){
        this.closeLoginWin()
        done()
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
rand:new Date().getTime()
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
    getXmlParam5(skpInfo,taxDiskPassword,digitalCertificatePassword) {
      return {
        xml: `<?xml version=\"1.0\" encoding=\"gbk\"?><business comment=\"监控数据查询\" id=\"JKSJCX\">
  <body yylxdm=\"1\">
    <input>
      <nsrsbh>${skpInfo.nsrsbh}</nsrsbh>
      <skpbh>${skpInfo.skpbh}</skpbh>
      <skpkl>${taxDiskPassword}</skpkl>
      <keypwd>${digitalCertificatePassword}</keypwd>
      <fplxdm>${skpInfo.fplxdm?skpInfo.fplxdm.substr(0,3):''}</fplxdm>
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

    //检查本地是否插盘方法
    GetTaxDeviceStates() {
      return simpleRequest({
        url: `http://localhost:13769/TaxDisk/GetTaxDeviceStates?tmptime=${(new Date()).getTime()}`,
        method: "get",
      });
    },
    //登录成功后台初始化调用以及设置监听是否拔盘（A3）

    completeLogin(diskId,vsersion) {
      this.reload();
      this.loginloading=false
      this.closeLoginWin();
      this.selectDiskVisible = false;
      this.$store.commit("user/SET_diskIsOnline", "1");
      let GetTaxDeviceStates = this.GetTaxDeviceStates;
      // let watchDiskStatus = () => {
      //   const judgeOff = setInterval(() => {
      //     GetTaxDeviceStates().then((res) => {
      //       if (res.code != "0") {
      //         //变更盘状态为断开
      //          this.$alert( "盘已断开", {
      //                       confirmButtonText: "知道了",
      //                       title: "提示",
      //                       type: "warning",
      //               });
      //         this.$store.commit("user/SET_diskIsOnline", "0");
      //         clearInterval(judgeOff);
      //         const judgeOn = setInterval(() => {
      //           GetTaxDeviceStates().then((res) => {
      //             if (res.code == "0") {
      //               //变更状态为在线
      //               this.hasDiskInsert(res);
      //               clearInterval(judgeOn);
      //             }
      //           });
      //         }, 2000);
      //         localStorage.setItem("setIntervalId", judgeOn);
      //       }
      //     });
      //   }, 2000);
      //   localStorage.setItem("setIntervalId", judgeOff);
      // };
      // watchDiskStatus();
      
                    let timeFunc=()=>{
                          let timer= setTimeout(()=>{
                            this.GetTaxDeviceStates().then((res) => {
                            if (res.code != "0") {
                                 //变更盘状态为断开
                            this.$alert( "盘已断开", {
                            confirmButtonText: "知道了",
                            title: "提示",
                            type: "warning",
                             });
                            this.$store.commit("user/SET_diskIsOnline", "0");
                             let judgeOnFunc=()=>{
                               let timer2 = setTimeout(() => {
                                   GetTaxDeviceStates().then((res) => {
                                  if (res.code == "0") {
                                   //变更状态为在线
                                   this.hasDiskInsert(res);
                                   }else{
                                     judgeOnFunc()
                                   }
                                 });
                                  clearTimeout(timer2)
                               }, 3000);
                              localStorage.setItem("setIntervalId", timer2);
                             }
                              judgeOnFunc()
                             }else{
                              timeFunc()
                             }
                            });
                            clearTimeout(timer)
                        },3000)
                           localStorage.setItem("setIntervalId", timer);
                        }
                        timeFunc()

      invoiceInquiryInit({taxDiskNum:diskId,version:vsersion});
    },
    //确定本地插入盘后流程(A1)
    hasDiskInsert(res) {
      //插盘连接盘
      request({
        url: "http://localhost:13769/TaxDisk/ConnectTaxDisk",
        method: "get",
        showLoading:false
      }).then((connectres) => {
        if (connectres.code == "0") {
          //当前登录账号选择的盘号与插入盘号是否一致
          let istheSame = res.data.diskId == this.taxDiskInfo.taxDiskNum;
          if (istheSame) {
            //验证数字证书密码
            let judgeDigitPassword = (url, param) => {
              request({
                url: url,
                method: "post",
                data: param,
                showLoading:false
              }).then((res2) => {
                if(res2.code=='0'){
                    let isRight = X2JS.xml2js(res2.data).business.body.output;
                if (isRight.returncode == "0"|| isRight.returncode == "00000000") {
                  request({
                    url: "http://localhost:13769/TaxDisk/StartServer",
                    method: "post",
                    data: {
                      taxId:
                        isRight.nsrsbh || isRight.qysh || this.loginInfo.taxId,
                      diskId: this.taxDiskInfo.taxDiskNum,
                    },
                    showLoading:false
                  }).then(() => {
                    //流程结束
                    // this.$router.push({ path: "/dashboard" });
                    this.completeLogin(this.taxDiskInfo.taxDiskNum,res.data.jspSoftVersion);
                  });
                } else {
                   this.loginloading=false
                   //"请至税盘设置模块检查税盘密码和口令是否正确"
                   this.$alert( isRight.returnmsg , {
                            confirmButtonText: "知道了",
                            title: "错误提示",
                            type: "warning",
                            showClose:false,
                            callback:this.closeLoginWin
                    });
                  }
                }else{
                    this.loginloading=false
                   this.$alert(res2.message, {
                            confirmButtonText: "知道了",
                            title: "错误提示",
                            type: "error",
                            showClose:false,
                            callback:this.closeLoginWin
                          });
                }
              
              });
            };
            if (res.data.type == "Skp") {
              //税控盘需导入注册码
             companyDiskRegistrationCodeInit({
                                  digitalCertificatePassword:this.taxDiskInfo.digitalCertificatePassword,
                                  diskType:this.taxDiskInfo.diskType,
                                  onlineLocation:this.taxDiskInfo.onlineLocation,
                                  taxDiskNum:this.taxDiskInfo.taxDiskNum,
                                  taxDiskPassword:this.taxDiskInfo.taxDiskPassword
                                }).then((coderes) => {
                  if (coderes.code == 200) {
                   let registrationCode = coderes.data.registrationCode;
                      //注册码导入不成功尝试执行5次
                    let countTimes=0
                    let regiscode=()=>{
                      if(countTimes<=5){
                      request({
                      url: "http://localhost:13769/TaxDisk/SkpOperate  ",
                      method: "post",
                      data: this.getXmlParam3(registrationCode),
                      showLoading:false
                    }).then((regisRes) => {
                       let isRight = X2JS.xml2js(regisRes.data).business.body.output; 
                        if(isRight.returncode=='00000000'|| isRight.returnmsg=='成功'){
                        request({
                        url: "http://localhost:13769/TaxDisk/SkpOperate  ",
                        method: "post",
                        data: this.getXmlParam4(
                          this.taxDiskInfo.taxDiskPassword
                        ),
                        showLoading:false
                      }).then((skpres) => {
                        if(skpres.code=='0'){
                            let skpInfo = X2JS.xml2js(skpres.data).business.body.output;
                        if (skpInfo.returncode == "00000000") {
                          judgeDigitPassword(
                            "http://localhost:13769/TaxDisk/SkpOperate",
                            this.getXmlParam5(skpInfo,this.taxDiskInfo.taxDiskPassword,this.taxDiskInfo.digitalCertificatePassword)
                          );
                        }else{
                           this.loginloading=false
                           this.$alert(skpInfo.returnmsg, {
                            confirmButtonText: "知道了",
                            title: "错误提示",
                            type: "error",
                            showClose:false,
                            callback:this.closeLoginWin
                          });
                        }
                        }else{
                           this.loginloading=false
                           this.$alert(skpres.message, {
                            confirmButtonText: "知道了",
                            title: "错误提示",
                            type: "error",
                            showClose:false,
                            callback:this.closeLoginWin
                          });
                        }
                       
                      });
                     }else{
                       countTimes+=1
                       regiscode()
                     }
                    });
                    }else{
                       this.loginloading=false
                       this.$confirm('注册信息导入失败，是否重试？', {
                            confirmButtonText: "是",
                            cancelButtonText: '否',
                            title: "提示：",
                            type: 'error',
                            showClose:false,
                        }).then(() => {
                         countTimes=3
                         regiscode()
                        }).catch(() => {
                        this.closeLoginWin()        
                     });
                    }
                  }  
                  regiscode()
               
                  }else{
                     this.loginloading=false
                     this.$alert(coderes.msg, {
                            confirmButtonText: "知道了",
                            title: "错误提示",
                            type: "error",
                            showClose:false,
                            callback:this.closeLoginWin
                          });
                  }
                }
              );
            } else if (res.data.type == "SWUKey") {
                //先获取税盘信息
                request({
                          url: "http://localhost:13769/TaxDisk/SWUKeyOperate",
                          method: "post",
                          data: this.getXmlParam1(
                            this.taxDiskInfo.taxDiskPassword
                          ),
                          showLoading:false
                        }).then((info)=>{
                          if(info.code=='0'){    

                        let isRight = X2JS.xml2js(info.data).business.body.output;
                        if (isRight.returncode == "0") {
                              judgeDigitPassword(
                          "http://localhost:13769/TaxDisk/SWUKeyOperate",
                           this.getXmlParam2(
                          this.taxDiskInfo.digitalCertificatePassword,
                          this.taxDiskInfo.taxDiskPassword
                          )
                          );
                        } else {
                           this.loginloading=false
                          //  this.$globals.closeContent();
                          this.$alert(isRight.returnmsg, {
                            confirmButtonText: "知道了",
                            title: "错误提示",
                            type: "error",
                            showClose:false,
                            callback:this.closeLoginWin
                          });
                        }
                        }else{
                            this.loginloading=false
                            this.$alert(info.message, {
                            confirmButtonText: "知道了",
                            title: "错误提示",
                            type: "error",
                            showClose:false,
                            callback:this.closeLoginWin
                          });
                         }
                        })


            } else if (res.data.type == "Jsp") {
            
                 judgeDigitPassword(
                          "http://localhost:13769/TaxDisk/JspOperate",
                           this.getXmlParam6(this.taxDiskInfo.digitalCertificatePassword)
                            );
            }
          } else {
            //当前登录账号选择的盘与当前插入的盘号不同(A2)
            // const judgeOff = setInterval(() => {
            //   this.GetTaxDeviceStates().then((res) => {
            //     if (res.code != "0") {
            //       console.log("A2盘已断开");
            //       clearInterval(judgeOff);
            //       const judgeOn = setInterval(() => {
            //         this.GetTaxDeviceStates().then((res) => {
            //           if (res.code == "0") {
            //             console.log("A2重新插盘");
            //             clearInterval(judgeOn);
            //             this.hasDiskInsert(res);
            //           }
            //         });
            //       }, 2000);
            //       localStorage.setItem("setIntervalId", judgeOn);
            //     }
            //   });
            // }, 2000);
            // localStorage.setItem("setIntervalId", judgeOff);

              let timeFunc=()=>{
                          let timer= setTimeout(()=>{
                            this.GetTaxDeviceStates().then((res) => {
                            if (res.code != "0") {
                             let judgeOnFunc=()=>{
                               let timer2=setTimeout(() => {
                                   this.GetTaxDeviceStates().then((res) => {
                                  if (res.code == "0") {
                                   //变更状态为在线
                                   this.hasDiskInsert(res);
                                   return
                                   }else{
                                     judgeOnFunc()
                                   }
                                 });
                                  clearTimeout(timer2)
                               }, 2000);
                                 localStorage.setItem("setIntervalId", timer2);
                             }
                              judgeOnFunc()
                             }else{
                              timeFunc()
                             }
                            });
                            clearTimeout(timer)
                        },2000)
                           localStorage.setItem("setIntervalId", timer);
                        }
                        timeFunc()
            this.loginloading=false
            this.$alert(
              "插入盘与登录时选择的税盘盘号不同，请检查税盘是否正确",
              {
                confirmButtonText: "知道了",
                title: "税盘信息不一致",
                iconClass: "el-icon-warning",
                showClose:false,
                callback:()=>{
                             this.$store.commit("user/showLoginWin", false);
                             this.reload()
                          }
              }
            );
          }
        }else{
             this.loginloading=false
              this.$confirm('服务启动失败，是否重试？', {
                            confirmButtonText: "是",
                            cancelButtonText: '否',
                            title: "提示：",
                            type: 'error',
                            showClose:false,
                        }).then(() => {
                        this.hasDiskInsert(res)
                        }).catch(() => {
                        this.closeLoginWin()        
                     });
         
        }
      });
    },

    //确定税盘之后流程
    confirmDisk(currentdisk) {
      this.$store.commit("user/SET_TAXDISKNUM", currentdisk.taxDiskNum);  
      this.loginloading=true      
      //检查盘是否在线
      checkTaxDiskIsOnline(currentdisk.taxDiskNum).then((res) => {
        if (res.code == 200) {
          //在线
          if (res.data) {
            this.$store.commit("user/SET_diskIsOnline", "1");
            //不是托管 流程结束
            if (currentdisk.onlineLocation == 1) {

               this.reload();
               this.closeLoginWin();
               this.loginloading=false
               this.selectDiskVisible = false;
            } else {
              //是托管 检查企业销方是否完整
              listXiaoApi(currentdisk.taxDiskNum).then((res) => {
                if (res.code == 200) {
                  if (res.data.length > 0) {
                    //完整调用后台初始化数据接口 流程结束
                    this.closeLoginWin();
                    this.reload();
                   this.loginloading=false
                    this.selectDiskVisible = false;
                    invoiceInquiryInit({taxDiskNum:currentdisk.taxDiskNum,version:''});
                  } else {
                    //否则引导初始设置（同意协议、设置盘、企业信息、完成）
                    const loginInfo = this.$store.state.user.loginInfo;
                     this.loginloading=false;
                    this.setTemplateVisible = true;
                     let body=document.getElementsByTagName('body')[0]
                         body.style.overflow='hidden'
                    this.diskInfoForm=currentdisk
                    this.isOnlineLocation=true
                    this.getProvinceList();
                    this.companyInfo.companyName = loginInfo.companyName;
                    this.companyInfo.taxId = loginInfo.taxId;
                  }
                }
              });
            }
          } else {
            this.$store.commit("user/SET_diskIsOnline", "0");
            //不在线
            if (currentdisk.onlineLocation == "1") {
              //不是托管 检查企业销方是否完整
              listXiaoApi(currentdisk.taxDiskNum).then((res) => {
                if (res.code == 200) {
                  if (res.data.length > 0) {
                   
                    //完整检查是否插盘
                    request({url: "http://localhost:13769/TaxDisk/GetTaxDeviceStates",
                      method: "get",showLoading:false}).then((res) => {
                      if (res.code == "0") {
                        //本地有插盘 (需要封装公共方法，轮询有相同逻辑)
                        this.hasDiskInsert(res);
                      } else {
                        //没盘提示插盘 并启动网页轮询(A1)
                        // let tiemID = setInterval(() => {
                        //   this.GetTaxDeviceStates().then((res) => {
                        //     if (res.code == "0") {
                        //       clearInterval(tiemID);
                        //       this.hasDiskInsert(res);
                        //     }
                        //   });
                        // }, 2000);
                        let timeFunc=()=>{
                          let timeID= setTimeout(()=>{
                            this.GetTaxDeviceStates().then((res) => {
                              console.log(res)
                            if (res.code == "0") {
                              this.hasDiskInsert(res);
                             }else{
                              timeFunc()
                             }
                            });
                            clearTimeout(timeID)
                        },2000)
                          localStorage.setItem("setIntervalId", timeID);
                        }
                        timeFunc()
                        this.loginloading=false
                        this.$alert('未找到税盘，请插入税盘', {
                          confirmButtonText: "知道了",
                          title: "没有插盘",
                          type: "warning",
                          showClose:false,
                          callback:()=>{
                             this.$store.commit("user/showLoginWin", false);
                             this.reload()
                          }
                        });
                      }
                    });
                  } else {
                   this.loginloading=false
                    //否则引导设置企业信息
                    this.$confirm(
                      "企业销方信息不完整，请进行初始设置",
                      "温馨提示",
                      {
                        confirmButtonText: "确定",
                        cancelButtonText: "",
                        type: "warning",
                      }
                    ).then(() => {
                      this.companyInfo.companyName = this.loginInfo.companyName;
                      this.companyInfo.taxId = this.loginInfo.taxId;
                      this.companyInfoSetting = true;
                      this.getProvinceList();
                    });
                  }
                }
              });
            } else {
              this.loginloading=false
              //是托管 提示联系客服
              this.$alert("请联系客服人员解决", {
                confirmButtonText: "知道了",
                title: "税盘不在线",
                iconClass: "el-icon-warning",
                showClose:false,
                callback:()=>{
                  this.closeLoginWin();
                  this.reload()
                }
              });
            }
          }
        } else {

           this.loginloading=false
           this.$alert(res.msg, {
                      confirmButtonText: "知道了",
                      title: "错误提示",
                      type: "warning",
                      showClose:false,
                      callback:this.closeLoginWin
              });
        }
      });
    },
    //选择税盘
    handleDiskChange() {
      if(this.currentTaxDisk){
        this.selectDiskVisible = false;
       if(this.loginInfo.initFlag==1){
        //保存当前选择盘信息
         let disk = this.currentTaxDisk;
         let diskInfo = { el_label: disk.taxDiskName +'  '+ disk.taxDiskNum, ...disk };
         this.$store.commit("user/SET_TAXDISK", diskInfo);
         this.confirmDisk(disk);
       }else{
          if(this.currentTaxDisk.onlineLocation=='2'){
               const loginInfo = this.$store.state.user.loginInfo;    
               this.companyInfo.companyName = loginInfo.companyName;
               this.companyInfo.taxId = loginInfo.taxId;
               this.diskInfoForm=this.currentTaxDisk
               this.isOnlineLocation=true
          }
           
           this.getProvinceList();
           this.setTemplateVisible = true;
            let body=document.getElementsByTagName('body')[0]
                body.style.overflow='hidden'
       }
      }else{
         this.$message({
            message: '请选择税盘',
            type: "warning",
          });
      }
    },

    setTemplateClose(done){
      if(!this.showLoginBox){
        this.$store.commit("user/SET_LOGININFO", '');
        removeToken()
        this.closeLoginWin()
        let body=document.getElementsByTagName('body')[0]
                body.style.overflow='auto'
      }
      done()
    },
    //保存新设置盘信息
    setNewTaxDisk() {
      this.$refs["addNewtaxDiskForm"].validate((valid) => {
        if (valid) {

          //判断本地是否插盘
          request({url: "http://localhost:13769/TaxDisk/GetTaxDeviceStates",
                       method: "get"}).then((res) => {
            if (res.code == "0") {
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
              if (res.data.diskId == this.diskInfoForm.taxDiskNum) {
                //插盘连接盘
                request({
                  url: "http://localhost:13769/TaxDisk/ConnectTaxDisk",
                  method: "get",
                }).then((res2) => {
                  if (res2.code == "0") {
                    let addNewDisk = () => {
                      let params = {
                        companyId: this.$store.state.user.loginInfo.companyId,
                        ...this.diskInfoForm,
                      };
                      addApanApi(params).then((res) => {
                        if (res.code == 200) {
                          listByTokenApi().then((newdiskinfo)=>{
                               if(newdiskinfo.code==200){
                                  let diskInfo = {
                                     el_label: params.taxDiskName +'  '+ params.taxDiskNum,
                                     ...newdiskinfo.data[0]
                                    };
                                   this.$store.commit("user/SET_TAXDISK", diskInfo);
                                   this.$store.commit("user/SET_TAXDISKLIST", [diskInfo]);
                               }
                          })
                        
                          const loginInfo = this.$store.state.user.loginInfo;
                          this.companyInfo.companyName = loginInfo.companyName;
                          this.companyInfo.taxId = loginInfo.taxId;
                          this.currentsetp = 3;
                        } else {
                          this.$alert(res.msg, {
                            confirmButtonText: "知道了",
                            title: "税盘初始化失败",
                            type: "error",
                          });
                        }
                      });
                    };

                    if (res.data.type == "Jsp") {
                      //验证数字证书密码
                      request({
                        url: "http://localhost:13769/TaxDisk/JspOperate",
                        method: "post",
                        data: this.getXmlParam6(
                          this.diskInfoForm.digitalCertificatePassword
                        ),
                      }).then((jspres) => {
                        if(jspres.code=='0'){
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
                        }else{
                            this.$alert(jspres.message, {
                            confirmButtonText: "知道了",
                            title: "提示",
                            type: "warning",
                          });
                        } 
                      });
                    } else {
                      if (res.data.type == "SWUKey") {
                        //判断税盘密码是否正确
                        request({
                          url: "http://localhost:13769/TaxDisk/SWUKeyOperate",
                          method: "post",
                          data: this.getXmlParam1(
                            this.diskInfoForm.taxDiskPassword
                          ),
                        }).then((ukeypasswordres) => {
                          if (ukeypasswordres.code == "0") {
                            let diskInfo = X2JS.xml2js(ukeypasswordres.data).business.body.output;
                            if (diskInfo.returncode == "0") {
                              //密码正确  判断税号是否相同
                              if (diskInfo.nsrsbh == this.loginInfo.taxId) {
                                //判断数字证书口令是否正确
                                request({
                                  url:
                                    "http://localhost:13769/TaxDisk/SWUKeyOperate",
                                  method: "post",
                                  data: this.getXmlParam2(
                                    this.diskInfoForm
                                      .digitalCertificatePassword,
                                    this.diskInfoForm.taxDiskPassword
                                  ),
                                }).then((ukeykeywordres) => {
                                  if(ukeykeywordres.code=='0'){
                                    let isRight = X2JS.xml2js(ukeykeywordres.data).business.body.output;
                                  if (isRight.returncode == "0") {
                                    addNewDisk();
                                  } else {
                                    this.$alert(isRight.returnmsg, {
                                      confirmButtonText: "知道了",
                                      title: "错误提示",
                                      type: "error",
                                    });
                                  }
                                  }else{
                                     this.$alert(ukeykeywordres.message, {
                                     confirmButtonText: "知道了",
                                     title: "提示",
                                     type: "warning",
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
                          }else{
                             this.$message({
                                message: ukeypasswordres.message,
                                type: "warning",
                              });
                          }
                        });
                      } else {
                        //税控盘
                        //判断税盘密码是否正确
                        request({
                          url: "http://localhost:13769/TaxDisk/SkpOperate",
                          method: "post",
                          data: this.getXmlParam4(
                            this.diskInfoForm.taxDiskPassword
                          ),
                        }).then((skppasswordres) => {
                          if (skppasswordres.code == "0") {
                            let diskInfo = X2JS.xml2js(skppasswordres.data).business.body.output;
                            if (diskInfo.returncode == "00000000") {
                              //密码正确  判断税号是否相同
                              if (diskInfo.nsrsbh == this.loginInfo.taxId) {
                                //税控盘需导入注册码
                                companyDiskRegistrationCodeInit({
                                  digitalCertificatePassword:this.diskInfoForm.digitalCertificatePassword,
                                  diskType:this.diskInfoForm.diskType,
                                  onlineLocation:this.diskInfoForm.onlineLocation,
                                  taxDiskNum: res.data.diskId,
                                  taxDiskPassword:this.diskInfoForm.taxDiskPassword
                                }).then((coderes) => {
                                  if (coderes.code == 200) {
                                  let  registrationCode =coderes.data.registrationCode;
                                    request({
                                      url:
                                        "http://localhost:13769/TaxDisk/SkpOperate  ",
                                      method: "post",
                                      data: this.getXmlParam3(registrationCode),
                                    }).then(() => {
                                      //判断数字证书口令是否正确
                                      console.log(diskInfo)
                                      request({
                                        url:
                                          "http://localhost:13769/TaxDisk/SkpOperate",
                                        method: "post",
                                        data: this.getXmlParam5(diskInfo,this.diskInfoForm.taxDiskPassword,this.diskInfoForm.digitalCertificatePassword),
                                      }).then((skpkeywordres) => {
                                        if(skpkeywordres.code=='0'){
                                        let isRight = X2JS.xml2js(skpkeywordres.data).business.body.output;
                                        if (isRight.returncode == "00000000") {
                                          addNewDisk();
                                        } else {
                                          this.$alert(isRight.returnmsg, {
                                            confirmButtonText: "知道了",
                                            title: "错误提示",
                                            type: "error",
                                          });
                                        } 
                                        }else{
                                       this.$alert(skpInfo.returnmsg, {
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
                          }else{
                            this.$alert(skppasswordres.message, {
                            confirmButtonText: "知道了",
                            title: "提示",
                            type: "warning",
                          });
                          }
                        });
                      }
                    }
                  }else{
                      this.$message({
                                message: res2.message,
                                type: "warning",
                              });
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
    saveCompanyInfoSetting() {
      this.$refs["companyInfoForm"].validate((valid) => {
        console.log(valid);
        if (valid) {
          let param = {
            taxDiskNum: this.$store.state.user.taxDiskInfo.taxDiskNum,
            ...this.companyInfo,
          };
          companyInfoInit(param).then((res) => {
            if (res.code == 200) {
              this.companyInfoSetting = false;
              this.confirmDisk(this.$store.state.user.taxDiskInfo);
            }
          });
        }
      });
    },
    //完成税盘设置后的流程
    completeSetDisk() {
      this.setTemplateVisible = false;
       let body=document.getElementsByTagName('body')[0]
           body.style.overflow='auto'
      this.confirmDisk(this.$store.state.user.taxDiskInfo);
    },

    // 省
    getProvinceList() {
      getProvinceListApi().then((response) => {
        this.provinceList = response.data;
      });
    },
    // 市
    getCityList() {
      this.companyInfo.city = "";
      this.companyInfo.district = "";
      this.districtList = [];
      if (this.companyInfo.province != "") {
        getCityListApi(this.companyInfo.province).then((response) => {
          this.cityList = response.data;
        });
      }
    },
    // 区
    getDistrictList() {
      this.companyInfo.district = "";
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
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 11;
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: #000;
  z-index: 10;
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
.logindialog >>> .el-dialog__header{
  padding: 0;
}
.logindialog >>> .el-dialog__body{
  padding: 40px 20px;
}
.logindialog >>> .el-dialog{
  border-radius: 8px;
}
.login >>> .el-form-item__error{
  padding-top: 0px;
}
</style>
