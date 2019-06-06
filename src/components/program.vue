<template>
  <div>
    <!------------------------------------列表-筛选------------------------------------------->
    <div class="index-filter-container">
      <el-form :model="searchInfo" :inline="true" ref="searchInfo" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
        <el-form-item prop="name">
          <el-input type="text" v-model="searchInfo.name"  placeholder="节目名称" @keyup.enter.native="_search(searchInfo)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary"  icon="search"
                     @click="_search(searchInfo)">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" @click="_clickFlag2('add', '新增节目')" type="primary" icon="edit">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-------------------------------------列表-栏目------------------------>
    <div class="index-main-table">
      <el-table :data="list"  border v-loading="listLoading" element-loading-text="正在加载中" fit highlight-current-row  style="width: 100%" >
        <el-table-column prop="name" label="名称" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="username" label="创建人" min-width="8%" align="center"></el-table-column>
        <el-table-column prop="remark" label="描述" min-width="10%" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="releaseTime" label="发布时间" min-width="16%" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="18%" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="10%" align="center"></el-table-column>
        <!------------------------------列表-操作栏------------------------------->
        <el-table-column align="left" label="操作" min-width="28%" header-align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == '待审核'" size="small" type="success" @click="_clickFlag2('edit', '', '编辑节目', scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status == '待审核'" size="small" type="danger" @click="_bind(scope.row)">绑定</el-button>
            <el-button v-if="scope.row.status == '待审核'" size="small" type="info" @click="_censorship(scope.row)">送审</el-button>
            <el-button v-if="scope.row.status == '待发布'" size="small" type="info" @click="_examine(scope.row)">审核</el-button>
            <el-button size="small" type="success" @click="_details(scope.row)">节目详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--------------------------------主体右侧分页------------------------------------->
    <div class="index-main-pagination" v-show="!listLoading">
      <div class="block" align="right">
        <div class="block">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="num"
            layout="total, prev, pager, next"
            :total="count.totalElements">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-----------------------------------添加/编辑弹框--------------------------------->
    <el-dialog :title="dialogTitle" size="small" :visible.sync="dialogShow" align="left" @close="editorClose">
      <el-form ref="dialogInfo" :model="dialogInfo" :rules="rules">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name" >
          <el-input  auto-complete="off" v-model="dialogInfo.name" style="width: 90%" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="屏幕尺寸" :label-width="formLabelWidth" prop="size">
            <el-radio-group v-model="dialogInfo.size">
              <el-radio label="160*32">滚动信息屏</el-radio>
              <el-radio label="80*64">全点阵信息屏</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="展示效果" :label-width="formLabelWidth" prop="showType">
          <el-radio-group v-model="dialogInfo.showType">
            <el-radio :label="0">静态</el-radio>
            <el-radio v-show="dialogInfo.size == '160*32'" :label="1">滚动</el-radio>
            <el-radio v-show="dialogInfo.size == '80*64'" :label="2">轮播</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="dialogInfo.showType === 1" label="滚动设置" :label-width="formLabelWidth" prop="showType">
          <span>步长(px)</span><el-input v-model="dialogInfo.step"  style="width: 25%; margin: 0 20px 0 10px"></el-input>
          <span>间隔时间(ms)</span><el-input v-model="dialogInfo.interval"  style="width: 25%; margin: 0 20px 0 10px"></el-input>
        </el-form-item>
        <el-form-item v-show="dialogInfo.showType === 2" label="间隔时间(ms)" :label-width="formLabelWidth" prop="interval" >
          <el-input  auto-complete="off" v-model="dialogInfo.interval" style="width: 90%" placeholder="间隔时长"></el-input>
        </el-form-item>
        <el-form-item label="节目内容" :label-width="formLabelWidth" prop="content" >
          <div class="hello" v-model="dialogInfo.content">
              <editor v-for="(item, index) in programNum" :key="index"
                      class="editorContent"
                      :id="'editor_id' + index" height="150px" width="90%" content="请输入节目内容"
                      pluginsPath="/static/kindeditor/plugins/"
                      :loadStyleMode="true"
                      :cssData="'body {background: #000000; color: #FF0000}'"
                      :items="[ 'source', 'undo', 'redo', 'justifyleft', 'justifycenter', 'justifyright', 'clearhtml', 'formatblock', 'fontname', 'fontsize', 'forecolor', 'bold',
                                'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', 'fullscreen' ]"
                      :colorTable="[ ['#FF0000', '#FFFF00', '#00FF00'] ]"
                      @on-content-change="onContentChange"></editor>
          </div>
          <div v-show="dialogInfo.showType === 2" class="content-btn-wrapper" style="width: 90%; display: flex; justify-content: space-around; margin-top: 5px">
            <el-button type="primary" size="small" style="letter-spacing: 1px" @click="_addProgram">添加第{{programNum+1}}屏节目内容</el-button>
          </div>
        </el-form-item>
        <el-form-item label="描述"  :label-width="formLabelWidth" prop="remark">
          <el-input  auto-complete="off" v-model="dialogInfo.remark" style="width: 90%" type="textarea" :rows="3" ></el-input>
        </el-form-item>
      </el-form>
      <div :style="'overflow: auto; text-align: center; background: #000; margin:0 auto;' + 'width:' + dialogInfo.size.split('*')[0] + 'px;' + 'height:' + dialogInfo.size.split('*')[1] + 'px;'  " v-if="dialogInfo.size" >
        <marquee v-show="dialogInfo.showType == 1"
                 :width="dialogInfo.size.split('*')[0] + 'px;'"
                 :height="dialogInfo.size.split('*')[1] + 'px;'"
                 :scrollDelay = "dialogInfo.interval"
                 :scrollAmount = "dialogInfo.step"
                  bgcolor="#000"
                  direction="left"
                  v-html="content" :style="'line-height:' +  dialogInfo.size.split('*')[1] + 'px;' ">
        </marquee>
        <div v-show="dialogInfo.showType != 1" v-html="content"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogShow = false; dialogInfo={}">取 消</el-button>-->
        <el-button @click="editorClose">取 消</el-button>
        <el-button type="primary" @click="_add_submit2(dialogInfo)">确 定</el-button>
      </div>
    </el-dialog>
    <!-----------------------------------绑定------------------------------------------->
    <Modal v-model="dialogBind" title="绑定屏幕">
      <Form ref="dialogBindInfo" :model="dialogBindInfo" align="left">
        <FormItem prop="name" label="节目名称">
          <Input  type="text"  v-model="dialogBindInfo.name" style="width: 80%" />
        </FormItem>
        <FormItem  label="绑定屏幕">
          <Select v-model="dialogBindInfo.screenIds" multiple placeholder="请选择" style="width:80%">
            <Option v-for="item in screenList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBind = false;">取 消</el-button>
        <el-button type="primary" @click="_bindSubmit(dialogBindInfo)">确 定</el-button>
      </div>
    </Modal>
    <!-----------------------------------审核发布------------------------------------------->
    <el-dialog title="审核发布" align="left" size="small" :visible.sync="dialogExamine" :modal=true>
      <el-form ref="dialogExamineInfo" :model="dialogExamineInfo">
        <el-form-item label="审核是否通过" :label-width="formLabelWidth" style="width: 90%">
          <el-radio-group v-model="dialogExamineInfo.success">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述"  :label-width="formLabelWidth" prop="remark" >
          <el-input  auto-complete="off" v-model="dialogExamineInfo.remark" style="width: 90%" type="textarea" :row="3"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogExamine = false; dialogExamineInfo={}">取 消</el-button>
        <el-button type="primary" @click="_examineSubmit(dialogExamineInfo)">确 定</el-button>
      </div>
    </el-dialog>
    <!-----------------------------------节目详情------------------------------------------->
    <el-dialog title="节目详情" align="left" size="small" :visible.sync="dialogDetails" :model="true" @close="dialogDetailsInfo={}">
      <el-form ref="dialogDetailsInfo" :mode="dialogDetailsInfo">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input auto-complete="off" :disabled="true" v-model="dialogDetailsInfo.name" style="width: 90%;"></el-input>
        </el-form-item>
      </el-form>
      <v-detail :pro="dialogDetailsInfo" ></v-detail>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetails = false; ">取 消</el-button>
        <el-button type="primary" @click="dialogDetails = false; isShow = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import apiMethods from 'api/apiMethods.js'
  import {baseUrl, baseContent, config} from 'api/config'
  import {add, edit} from 'api/getData'
  import VDetail from 'components/detail'
  export default {
    components: {VDetail},
    data() {
      return {
        path: '/program',                //本页路径
        listLoading: true,               //列表是否请求中
        list: [],                        //列表数据
        delRow: [],
        page: 1,                         //请求初始页数
        num: 10,                         //每页初始列表
        searchInfo: {},                  //搜索内容
        pagination: false,               //分页
        count: {                         //分页数据统计
          numberOfElements: 0,
          totalElements: 0,
        },
        dialogShow: false,               //新增弹框是否显示
        dialogInfo: {
          size: "160*32",
          isScroll: 0,
          content: []
        },                                   //弹框信息
        content: "请输入节目内容",
        dialogInfoDetail: {},
        dialogTitle: "",                    //弹框标题
        dialogType: "",                     //弹框类别
        dialogBind: false,               //绑定
        dialogBindInfo: {
          screenIds: []
        },
        dialogExamine: false,               //审核
        dialogExamineInfo: {},
        dialogDetails: false,               //详情
        dialogDetailsInfo: {},
        screenList: [],                  //屏幕列表
        screenIds: [],
        screen: [],
        formLabelWidth: '100px',
        editorText: "",                     //编辑器文本
        editorTextList: [],
        editorTextIndex: 0,
        programNum: 1,                     //编辑器数量
        programContent: "",
        rules: {                           //验证规则
          name: [
            {required: true, type: 'string', message: "请输入节目名称", trigger: 'blur'}
          ],
          content: [
//            {required: true, type: 'string', message: "请输入节目内容", trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this._list(this.page)
    },
    methods: {
      //绑定
      _bind(row) {
        this.dialogBind = true;
        this.dialogBindInfo = row;
        //获取屏幕列表
        axios.post(baseUrl + '/screen/list/2').then((res) => {
          if (res.data.code == 200) {
            this.screenList = res.data.data;
          }else if (res.data.code == -200 || res.data.success == false) {
            this.$message({showClose: true, message: res.data.message, type: "error"})
          }
        }).catch((err) => {
          console.log(err)
        })
        //获取节目对应的屏列表
        axios.post(baseUrl + '/relationScreen/program/list/' + row.id).then((res) => {
          this.screen = res.data.data
          for (var i=0; i<this.screen.length; i++) {
            this.screenIds.push(this.screen[i].id)
          }
          this.dialogBindInfo.screenIds = this.screenIds
          this.screenIds = [];
        }).catch((err) => {
          console.log(err)
        })
      },
      _bindSubmit(info) {
        axios.post(baseUrl + this.path + '/bind' + '/' + info.id, info.screenIds, config).then((res) => {
          if (res.data.code == 200) {
            this.$message({showClose: true, message: res.data.message, type: "success"})
            this.dialogBind = false;
            this.screenIds = [];   //清空绑定的屏幕列表
            this.dialogBindInfo.screenIds = [];
            this.dialogBindInfo = {};
            this._list(this.page);
          }else if (res.data.code == -200 || res.data.success == false) {
            this.$message({showClose: true, message: res.data.message, type: "error"})
            this.screenIds = [];   //清空绑定的屏幕列表
            this.dialogBindInfo.screenIds = [];
            this.dialogBindInfo = {};
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //送审
      _censorship(row) {
        axios.post(baseUrl + this.path + '/submitVerify' + '/' + row.id).then((res) => {
          if (res.data.code == 200) {
            this.$message({showClose: true, message: res.data.message, type: "success"})
            this._list(this.page);
          }else if (res.data.code == -200 || res.data.success == false) {
            this.$message({showClose: true, message: res.data.message, type: "error"})
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //审核
      _examine(row){
        this.dialogExamine = true;
        this.dialogExamineInfo = row;
      },
      _examineSubmit(info) {
        let formData = JSON.stringify(info)
        axios.post(baseUrl + this.path + '/succeedVerify', formData, config).then((res) => {
          if (res.data.code == 200) {
            this.$message({showClose: true, message: res.data.message, type: "success"})
            this.dialogExamine = false;
            this._list(this.page);
          }else if (res.data.code == -200 || res.data.success == false) {
            this.$message({showClose: true, message: res.data.message, type: "error"})
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //详情
      _details(row) {
        axios.post(baseUrl + this.path + "/" + row.id).then((res) => {
          if (res.data.code == 200) {
            this.dialogDetailsInfo = res.data.data
            this.dialogDetailsInfo.content = JSON.parse(res.data.data.content)
            this.dialogDetails = true;
          }else if (res.data.code == -200 || res.data.success == false) {
            this.$message({showClose: true, message: res.data.message, type: "error"})
          }
        })
      },
      //复写公用的方法
      _clickFlag2(type, addTitle, editTitle, row) {
        this.dialogShow = true;
        this.dialogType = type;
        if (type == 'add') {
          this.dialogTitle = addTitle;
          this.editorText = ""
          this.editorTextList = [];
          this.editorTextIndex = 0;
          row = ''
        }else if (type == 'edit') {
          this.dialogTitle = editTitle;
          //调用编辑方法
          this._edit2(row)
        }
      },
      /*
      * 编辑
      * */
      _edit2(row) {
        edit(baseUrl + this.path + "/" + row.id).then((res) => {
          if(res.data.code == 200) {
            this.dialogInfo = res.data.data
            this.editorTextList = JSON.parse(res.data.data.content)
            this.editorTextIndex = 0
            this.dialogInfo.size = this.dialogInfo.width + '*' + this.dialogInfo.height;
            this._list(this.page);
          }else if (res.data.code == -200 || res.data.success == false) {
            this.$message({showClose: true, message: res.data.message, type: "error"})
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //新增、编辑
      _add_submit2(info) {
        this.dialogInfo.width = this.dialogInfo.size.split('*')[0]
        this.dialogInfo.height = this.dialogInfo.size.split('*')[1]
        if (this.dialogType == 'add') {
          this._add2(info)
        }else if (this.dialogType == 'edit') {
          this._submit2(info)
        }
      },
      _add2(info) {
        for (var i=0; i<this.programNum; i++) {
          this.editorTextList[i] = KindEditor.instances[i].html()
        }
        this.dialogInfo.content = this.editorTextList
        this.$refs.dialogInfo.validate((valid) => {
          if (valid) {
            info.content = JSON.stringify(info.content)
            let formData = JSON.stringify(info);
            add(baseUrl + this.path + '/save', formData, config).then((res) => {
              if (res.data.code == 200) {
                this.$message({showClose: true, message: res.data.message, type: "success"})
                this.dialogInfo = {};
                this.editorTextList = [];
                this.editorTextIndex = 0;
                this.dialogShow = false;
                this._list(this.page)
              }else if(res.data.code == -200  || res.data.code == false) {
                this.$message({showClose: true, message: res.data.message, type: "error"})
              }
            }).catch((err) => {
              console.log(err)
            })
          }else {
            this.dialogInfo = {};
            return false
          }
        })
      },
      _submit2(info) {
        for (var i=0; i<this.programNum; i++) {
          this.editorTextList[i] = KindEditor.instances[i].html()
        }
        this.dialogInfo.content = this.editorTextList
        info.content = JSON.stringify(info.content)
        let formData = JSON.stringify(info);
        edit(baseUrl + this.path + '/update', formData, config).then((res) => {
          if (res.data.code == 200) {
            this.$message({showClose: true, message: res.data.message, type: "success"})
            this.dialogInfo = {};
            this.editorTextList = [];
            this.editorTextIndex = 0;
            this.dialogShow = false;
            this._list(this.page);
          }else if(res.data.code == -200  || res.data.code == false) {
            this.$message({showClose: true, message: res.data.message, type: "error"})
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //文本编辑器
      onContentChange (val) {
        this.content = val
      },
      editorClose() {
        this.dialogShow = false;
        this.dialogInfo={};
        var editorContent = document.querySelectorAll(".ke-edit-iframe")
        editorContent[0].contentDocument.body.innerHTML = "请输入节目内容"
        this.content = "请输入节目内容"
      },
      //添加节目内容
      _addProgram() {
        this.programNum++
      }
    },
    mixins: [apiMethods]
  }
</script>

<style scoped>

</style>

