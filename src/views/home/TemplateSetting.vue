<template>
  <div class="blacklist">
    <div class="borderBottom">
      <breadnav textTitle="模版设置" @leftEvent="clickLeft" />
      <div class="exportbtn">
        <el-button
          type="primary"
          style="width: 74px"
          size="small"
          @click="exportTemplate"
          >导出</el-button
        >
      </div>
    </div>
    <div>
      <el-row>
        <el-col :span="4">
          <div>
            <div class="setbtn">
              <span @click="dialogShowAdd"
                >新增 </span>
              <span @click="dialogShowEdit"
                >修改 </span>
              <span @click="dialogDelete"
                >删除 </span>
              <span @click="dialogShowCopy">复制</span>
            </div>
            <div class="templatename">
              <!-- <p>默认模板</p>
              <p>默认模板1111</p>
              <p>默认模板2222</p> -->
              <el-scrollbar style="height: 100%">
                <!-- <el-menu :default-active="currentIndex" class="el-menu-vertical-demo" @select='handleSelect'>
                  <el-menu-item
                    v-for="(item, index) in invoiceListTemplate"
                    :key="item.id"
                    :index="index + 1 + ''"
                    @click="selectTemplate(item, index)"
                    
                  >
                    <span slot="title">{{ item.templateName }}</span>
                  </el-menu-item>
                </el-menu> -->

                <ul style="margin: 0">
                  <li
                    v-for="(item, index) in invoiceListTemplate"
                    :key="item.id + ''"
                    @click="selectTemplate(item, index)"
                    :class="{ selectedColor: selectIndex === index }"
                    style="width: 100%; height: auto; cursor: pointer; padding: 0px"
                  >
                    <p style="margin-left: 5px; display: inline-block; width: 100%">
                      {{ item.templateName }}
                    </p>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </div>
        </el-col>
        <el-col :span="20" class="fixedHeight">
          <el-table :data="tableData" style="width: 100%" row-key="id" class="table">
            <el-table-column prop="headerName" label="表头名称">
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.headerName }}</span>
                  <i
                    v-if="!isdefault"
                    class="icon el-icon-edit"
                    @click="editHeaderNameDialog(scope.row)"
                  ></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="headerDescription" label="表头说明">
            </el-table-column>
            <el-table-column
              prop="switchFlag"
              :label="isdefault ? '是否必填' : '开关'"
            >
              <template slot-scope="scope">
                <span v-if="isdefault">
                  {{ scope.row.requiredFlag == 0 ? "否" : "是" }}
                </span>
                <div v-else>
                  <el-switch
                    v-model="scope.row.switch"
                    :disabled="scope.row.switchFlag == 2 ? true : false"
                    @change="(val) => changeSwitch(val, scope.row.id)"
                  ></el-switch>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" v-if="!isdefault">
              <template slot-scope="scope">
                <span
                  style="cursor: pointer"
                  @click="deleteDetail(scope.row.id)"
                  v-html="scope.row.customFlag == 0 ? '' : deleteIcon"
                  >{{ deleteIcon }}</span
                >
              </template>
            </el-table-column>
          </el-table>
 
          <!-- <el-table :data="tableData" style="width: 100%">
            <el-table-column  label="表头名称">
              <template slot-scope="scope">
                <div>
                  <span>{{ scope.row.headerName }}</span>
                  <i class="icon el-icon-edit" @click="editHeaderNameDialog(scope.row.id)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="headerDescription" label="表头说明" >
            </el-table-column>
            <el-table-column prop="switchFlag" label="开关">
              <template slot-scope="scope">
                <el-switch
                  v-model='scope.row.switch'
                  :disabled='scope.row.switchFlag == 2 ? true : false'
                  @change="val => changeSwitch(val,scope.row.id)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span style="cursor:pointer" @click="deleteDetail(scope.row.id)"
                      v-html="scope.row.customFlag == 0 ? '' : deleteIcon">{{deleteIcon}}</span>
              </template>
            </el-table-column>
          </el-table> -->
 
          <div
            class="addHead"
            v-if="isdefault == false"
            @click="addNewDetailDialog"
          >
            <span>+ 添加</span>
          </div>
        </el-col>
      </el-row>
    </div>
 
    <el-dialog
      title="新增模板"
      :visible.sync="dialogAdd"
      width="40%"
      :close-on-click-modal="false"
      :before-close="closeAdd"
    >
      <el-form ref="addT" :rules="addRules" :model="Tform">
        <el-form-item
          label="模板名称："
          label-width="120px"
          prop="newtemplateName"
        >
          <el-input
            autocomplete="off"
            style="width: 70%"
            v-model.trim="Tform.newtemplateName"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">取 消</el-button>
        <el-button type="primary" @click="addTemplate">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改模板"
      :visible.sync="dialogAmend"
      width="40%"
      :close-on-click-modal="false"
      :before-close="closeEdit"
    >
      <el-form ref="updateT" :rules="updateRules" :model="Tform">
        <el-form-item
          label="模板名称："
          label-width="120px"
          prop="amendtemplateName"
        >
          <el-input
            autocomplete="off"
            style="width: 70%"
            v-model.trim="Tform.amendtemplateName"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEdit">取 消</el-button>
        <el-button type="primary" @click="amendTemplate">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="复制模板"
      :visible.sync="dialogCopy"
      width="40%"
      :close-on-click-modal="false"
      :before-close="closeCopy"
    >
      <el-form ref="copyT" :rules="copyRules" :model="Tform">
        <el-form-item
          label="新模板名称："
          label-width="120px"
          prop="copytemplateName"
        >
          <el-input
            autocomplete="off"
            style="width: 70%"
            v-model.trim="Tform.copytemplateName"
          ></el-input>
        </el-form-item>
        <el-form-item label="原模板名称：" label-width="120px">
          <span>{{ this.currentTemplate.templateName }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeCopy">取 消</el-button>
        <el-button type="primary" @click="copyTemplate">确 定</el-button>
      </div>
    </el-dialog>
 
    <!-- 模板明细dialog -->
    <!-- 修改表头 -->
    <el-dialog
      title="修改表头"
      :visible.sync="editHeaderNameVisible"
      width="40%"
      :before-close="closeEditHeader"
      :close-on-click-modal="false"
    >
      <el-form ref="editHeader" :model="form2" :rules="rules2">
        <el-form-item label="表头名称：" label-width="120px" prop="newHeadName">
          <el-input
            autocomplete="off"
            style="width: 70%"
            v-model.trim="form2.newHeadName"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editHeaderName">确 定</el-button>
      </div>
    </el-dialog>
 
    <!-- 添加 -->
    <el-dialog
      title="新增表头"
      :visible.sync="addHeaderNameVisible"
      width="40%"
      :before-close="closeAddHeader"
      :close-on-click-modal="false"
    >
      <el-form ref="addHeader" :model="form" :rules="rules">
        <el-form-item label="表头名称：" label-width="120px" prop="newHeadName">
          <el-input
            autocomplete="off"
            style="width: 70%"
            v-model.trim="form.newHeadName"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="表头说明："
          label-width="120px"
          prop="newHeadDescription"
        >
          <el-input
            autocomplete="off"
            style="width: 70%"
            v-model.trim="form.newHeadDescription"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addNewDetail">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 
<script>
import Breadnav from "@/components/Breadnav";
import request from "@/utils/request";
import {
  delTemplate,
  getDetailByTemplateId,
  addTemplateDetail,
  updateTemplateDetail,
  deleteTemplateDetail,
  downloadTemplate,
  updateSort,
} from "@/api/InventoryInvoicing";
import { downloadFile } from "@/utils/function.js";
import { validStrCheckLength1 } from "@/utils/validate";
import Sortable from "sortablejs";
export default {
  name: "templateSetting",
  components: {
    Breadnav,
  },
  data() {
    const validateSearchText = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入关键字"));
      } else if (!validStrCheckLength1(value, 31)) {
        console.log("ssss");
        callback(new Error("最多输入30个汉字或字符"));
      } else {
        callback();
      }
    };
    return {
      dialogAdd: false,
      dialogAmend: false,
      dialogCopy: false,
      value1: true,
      isdefault: true,
      invoiceListTemplate: [],
      Tform: {
        newtemplateName: "",
        amendtemplateName: "",
        copytemplateName: "",
      },
 
      currentTemplate: {
        id: "0",
        templateName: '默认'
      },
      tableData: [],
      editHeaderNameVisible: false,
      addHeaderNameVisible: false,
      newHeadName: "",
      form: {
        newHeadName: "",
        newHeadDescription: "",
      },
      form2: {
        newHeadName: "",
      },
      rules: {
        newHeadName: [
          { required: true, message: "表头名称不允许为空", trigger: "change" },
          { required: true, trigger: "change", validator: validateSearchText },
        ],
        newHeadDescription: [
          { required: true, message: "表头说明不允许为空", trigger: "change" },
          { required: true, trigger: "change", validator: validateSearchText },
        ],
      },
      rules2: {
        newHeadName: [
          { required: true, message: "表头名称不允许为空", trigger: "change" },
          { required: true, trigger: "change", validator: validateSearchText },
        ]
      },
      addRules: {
        newtemplateName: [
          { required: true, message: "请输入模板名称", trigger: "change" },
          { required: true, trigger: "change", validator: validateSearchText },
        ],
      },
      updateRules: {
        amendtemplateName: [
          { required: true, message: "请输入模板名称", trigger: "change" },
          { required: true, trigger: "change", validator: validateSearchText },
        ],
      },
      copyRules: {
        copytemplateName: [
          { required: true, message: "请输入模板名称", trigger: "change" },
          { required: true, trigger: "change", validator: validateSearchText },
        ],
      },
      newHeadDescription: "",
      deleteIcon: '<i class="el-icon-delete"></i>',
      editIcon: '<i class="el-icon-edit"></i>',
      currentIndex: '1',
      selectIndex: 0
    };
  },
 
  created() {
    this.taxDiskNum = this.$store.state.user.taxDiskNum;
    this.getTemplate();
    // this.getDetail(0);
    console.log(this.taxDiskNum);
  },
  mounted() {
    this.rowDrop();
  },
  
  watch: {
      
    },
  methods: {
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
        async onEnd({ newIndex, oldIndex }) {
          if (_this.isdefault) {
            _this.$message({
              type: "info",
              message: "默认模板不允许修改！",
            });
            return;
          } else {
            console.log(newIndex);
            console.log(oldIndex);
            try {
              const res = await updateSort({
                fromId: _this.tableData[oldIndex].id,
                toId: _this.tableData[newIndex].id,
              });
              if (res.code == 200) {
                const currRow = _this.tableData.splice(oldIndex, 1)[0];
                _this.tableData.splice(newIndex, 0, currRow);
                _this.getDetail(_this.currentTemplate.id);
                _this.$message({
                  message: "移动成功",
                  type: "success",
                });
              }
            } catch {
              (error) => _this.$message({ type: "error", message: error });
            }
          }
        },
      });
    },
 
    selectTemplate(item, index) {
      // console.log(item);
      // if (item.id == 0) {
      //   this.isdefault = true;
      // } else {
      //   this.isdefault = false;
      // }
      this.selectIndex = index
      console.log(index)
      this.currentTemplate = item;
      this.getDetail(item.id);
    },
    handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
 
    //获取详细模板信息
    async getDetail(id) {
      
      if (id == 0) {
        this.isdefault = true;
      } else {
        this.isdefault = false;
      }
      console.log('是否是默认模板'+this.isdefault);
      const res = await getDetailByTemplateId({ templateId: id });
      if (res.code == 200) {
        res.data.forEach((item) => {
          item.switch = item.switchFlag == 0 ? false : true;
        });
       
        this.tableData = res.data;
      } else {
        
      }
    },
 
    //获取模板列表
    getTemplate(index) {
      request({
        url: "server/invoiceListTemplate/list",
        method: "get",
        params: {
          taxDiskNum: this.taxDiskNum,
        },
      }).then((res) => {
        this.invoiceListTemplate = res.data;
        if(index){
          this.getDetail(res.data[index].id)
        }
        else{
          this.getDetail(this.currentTemplate.id)
        }
        
      });
    },
    //新增模板
    addTemplate() {
      this.$refs["addT"].validate(async (valid) => {
        if (valid) {
          request({
            url: "server/invoiceListTemplate/insertTemplate",
            method: "post",
            data: {
              taxDiskNum: this.taxDiskNum,
              templateName: this.Tform.newtemplateName,
            },
          }).then((res) => {
            if (res.code == 200) {
              this.getTemplate();
              this.dialogAdd = false;
              this.$refs["addT"].resetFields();
              this.$message({
                message: "新增模板成功",
                type: "success",
              });
            } else {
              
            }
          });
        } else {
          return false;
        }
      });
    },
    //修改模板
    amendTemplate() {
      this.$refs["updateT"].validate(async (valid) => {
        if (valid) {
          request({
            url: "server/invoiceListTemplate/updateTemplate",
            method: "put",
            params: {
              templateName: this.Tform.amendtemplateName,
              id: this.currentTemplate.id,
              taxDiskNum: this.taxDiskNum
            },
          }).then((res) => {
            if (res.code == 200) {
              this.getTemplate();
              this.dialogAmend = false;
              this.currentTemplate.templateName = this.Tform.amendtemplateName
              this.$refs["updateT"].resetFields();
              this.$message({
                message: "修改模板成功",
                type: "success",
              });
            } else {
              
            }
          });
        } else {
          return false;
        }
      });
    },
    //删除模板
    dialogDelete() {
      console.log(this.currentTemplate)
      console.log(this.invoiceListTemplate)
      // console.log(this.currentTemplate.id == this.invoiceListTemplate[2].id)
      // console.log(this.invoiceListTemplate.findIndex((value) => {return value.id == this.currentTemplate.id}))
      let index = this.invoiceListTemplate.findIndex((value) => {return value.id == this.currentTemplate.id})
      console.log(index)
      this.$confirm("你确定删除吗?", "提示", {
        type: "warning",
      })
        .then(async () => {
          const res = await delTemplate({ id: this.currentTemplate.id });
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            request({
              url: "server/invoiceListTemplate/list",
              method: "get",
              params: {
                taxDiskNum: this.taxDiskNum,
              },
            }).then(res => {
              this.invoiceListTemplate = res.data
              if(res.data.length > 1 && res.data.length !== index){      //删除列表中间的模板
                this.currentTemplate = res.data[index]         
                console.log(this.currentTemplate)
                this.$nextTick(()=>{
                  // this.currentIndex = index + ''      //控制高亮
                  this.getDetail(res.data[index].id)
                })           
              }
              else{        // 删除列表中最后一个模板
                this.currentTemplate = res.data[0]
                this.$nextTick(()=>{
                  this.selectIndex = 0
                  this.invoiceListTemplate = res.data
                  // this.currentIndex = '1'     //控制高亮
                  this.getDetail(0)
                })
                console.log(this.currentIndex)             
              }   
              console.log(this.currentIndex)   
              console.log(res.data[index-1])
            })
            
          } else {
            
          }
        })
        .catch(() => {});
    },
    dialogShowAdd(){
      if(this.invoiceListTemplate.length >= 20){
        this.$message({
          type: 'warning',
          message: '已超过20个模板，不允许添加'
        })
        return
      }
      this.dialogAdd = true
    },
    dialogShowEdit() {
      if (this.currentTemplate.id == "") {
        this.$message({
          type: "warning",
          message: "未选择原模板",
        });
        return;
      }
      this.Tform.amendtemplateName = this.currentTemplate.templateName;
      this.dialogAmend = true;
    },
    dialogShowCopy() {
      console.log(this.currentTemplate);
      if (this.currentTemplate.id == "") {
        this.$message({
          type: "warning",
          message: "未选择原模板",
        });
        return;
      }
      this.dialogCopy = true;
    },
    //复制模板
    copyTemplate() {
      this.$refs["copyT"].validate(async (valid) => {
        if (valid) {
          request({
            url: "server/invoiceListTemplate/copyTemplate",
            method: "post",
            params: {
              templateName: this.Tform.copytemplateName,
              id: this.currentTemplate.id,
              taxDiskNum: this.taxDiskNum,
            },
          }).then((res) => {
            if (res.code == 200) {
              this.getTemplate();
              this.dialogCopy = false;
              this.$refs["copyT"].resetFields();
              this.$message({
                message: "复制模板成功",
                type: "success",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
 
    //修改表头名称
    editHeaderNameDialog(val) {
      console.log(val);
      this.editHeaderNameVisible = true;
      this.detailId = val.id;
      this.form2.newHeadName = val.headerName;
    },
    async editHeaderName() {
      this.$refs["editHeader"].validate(async (valid) => {
        if (valid) {
          var data = {
            id: this.detailId,
            templateId: this.currentTemplate.id,
            headName: this.form2.newHeadName,
          };
          const res = await updateTemplateDetail(data);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "修改成功",
            });
            
            this.editHeaderNameVisible = false;
            this.$refs["editHeader"].resetFields();
            this.getDetail(this.currentTemplate.id);
          } else {
            
          }
        } else {
          return false;
        }
      });
    },
    closeEditHeader() {
      this.$refs["editHeader"].resetFields();
      this.form2.newHeadName = "";
      this.editHeaderNameVisible = false;
    },
    //新增模板内容
    addNewDetailDialog() {
      this.addHeaderNameVisible = true;
    },
    addNewDetail() {
      this.$refs["addHeader"].validate(async (valid) => {
        if (valid) {
          var data = {
            customFlag: 1,
            headerDescription: this.form.newHeadDescription,
            headerName: this.form.newHeadName,
            switchFlag: 1,
            templateId: this.currentTemplate.id,
          };
          const res = await addTemplateDetail(data);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "添加成功",
            });
            this.addHeaderNameVisible = false;
            this.getDetail(this.currentTemplate.id);
            this.$refs["addHeader"].resetFields();
          } else {
            
          }
        } else {
          return false;
        }
      });
    },
    closeAddHeader() {
      this.$refs["addHeader"].resetFields();
      this.addHeaderNameVisible = false;
    },
    //删除模板明细
    deleteDetail(id) {
      this.$confirm("确定要删除吗?", "提示", {
        type: "warning",
      })
        .then(async () => {
          const res = await deleteTemplateDetail({ id });
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getDetail(this.currentTemplate.id);
          }
        })
        .catch(() => {});
    },
 
    //修改是否必填
    async changeSwitch(val, id) {
      console.log(val, id);
      var data = {
        id,
        templateId: this.currentTemplate.id,
        switchFlag: val ? 1 : 0,
      };
      try {
        const res = await updateTemplateDetail(data);
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "修改成功！",
          });
          this.getDetail(this.currentTemplate.id);
        }
      } catch (error) {
        
      }
    },
    //导出模板
    async exportTemplate() {
      try {
        const res = await downloadTemplate({
          templateId: this.currentTemplate.id,
        });
 
        downloadFile(res, "发票测试");
      } catch {
        this.$message({
          type: "error",
          message: "导出失败",
        });
      }
    },
    clickLeft() {
      this.$router.push({ name: "inventoryInvoicing" });
    },
    closeAdd() {
      this.dialogAdd = false;
      this.$refs["addT"].resetFields();
    },
    closeEdit() {
      this.dialogAmend = false;
      this.$refs["updateT"].resetFields();
    },
    closeCopy() {
      this.dialogCopy = false;
      this.$refs["copyT"].resetFields();
    },
  },
};
</script>
<style scoped>
.blacklist {
  background-color: #ffffff;
  height: 100vh;
}
.exportbtn {
  float: right;
  line-height: 62px;
  margin-right: 28px;
}
 
.setbtn {
  display: flex;
  justify-content: center;
  color: #5e8cf9;
  height: 40px;
  line-height: 40px;
  
  /* border-bottom: 1px solid #ebeef5; */
  padding: 0 20px;
}
.setbtn span {
  cursor: pointer;
  display: inline-block;
  align-items: center;
  width: 40px;
}
.templatelist {
  /* height: 100vh;
  border-right: 1px solid #ebeef5; */
  /* overflow-x: auto; */
  /* overflow-y: auto; */
  /* width: 220px; */
}
.templatename {
  padding: 0 20px;
  height: 500px;
}
 
.addHead {
  cursor: pointer;
  height: 30px;
  width: 50%;
  color: rgb(128, 128, 128);
  border: 2px dashed rgb(128, 128, 128);
  line-height: 30px;
  align-items: center;
  justify-content: center;
  display: flex;
  margin: 10px auto;
}
.icon {
  cursor: pointer;
  display: inline-block;
  position: absolute;
  right: 30px;
  font-size: 20px;
}
.table{
  /* height: 616px; */
  width: 100%;
  overflow-y: auto;
}
.fixedHeight{
  height: 600px;
  overflow: auto;
}
.selectedColor {
  background-color: #e6f7ff;
}
</style>