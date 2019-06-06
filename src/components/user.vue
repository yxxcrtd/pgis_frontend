<template>
  <div>
    <!------------------------------------列表-筛选------------------------------------------->
    <div class="index-filter-container">
      <el-form :model="searchInfo" :inline="true" ref="searchInfo" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
        <el-form-item prop="username">
          <el-input type="text" v-model="searchInfo.username"  placeholder="用户名" @keyup.enter.native="_search(searchInfo)"></el-input>
        </el-form-item>
        <el-form-item prop="realName">
          <el-input type="text" v-model="searchInfo.realName"  placeholder="姓名" @keyup.enter.native="_search(searchInfo)"></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input type="text" v-model="searchInfo.phone"  placeholder="电话" @keyup.enter.native="_search(searchInfo)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary"  icon="search"
                     @click="_search(searchInfo)">搜索</el-button>
        </el-form-item>
        <!--<el-form-item>-->
          <!--<el-button class="filter-item" style="margin-left: 10px;" @click="_clickFlag('add', '创建用户')" type="primary" icon="edit">添加</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <!-------------------------------------列表-栏目------------------------------------------>
    <div class="index-main-table">
      <el-table :data="list"  border v-loading="listLoading" element-loading-text="正在加载中" fit highlight-current-row  style="width: 100%" >
        <el-table-column prop="username" label="用户名" min-width="8%" align="center"></el-table-column>
        <el-table-column prop="realName" label="姓名" min-width="12%" align="center"></el-table-column>
        <el-table-column prop="phone" label="电话" min-width="12%" align="center"></el-table-column>
        <el-table-column prop="lastLoginIp" label="最后登录IP" min-width="13%" align="center"></el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间" min-width="15%" align="center"></el-table-column>
        <el-table-column prop="type" label="用户类型" min-width="11%" align="center"></el-table-column>
        <!------------------------------列表-操作栏------------------------------->
        <el-table-column align="left" label="操作" min-width="22%" header-align="center">
          <template slot-scope="scope">
            <el-button size="small" v-if="scope.row.id != 1" type="info" @click="_clickFlag('edit', '', '编辑用户', scope.row)">编辑</el-button>
            <el-button size="small" v-if="scope.row.id != 1" type="success"  @click="_resetPassword(scope.row)">重置密码</el-button>
            <el-button size="small" v-if="scope.row.id != 1" type="danger" @click="_delId(scope.row)">删除</el-button>
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
    <!-----------------------------------删除弹框------------------------------------------->
    <el-dialog title="提示" align="left" :modal="false" :visible.sync="dialogDel" size="tiny">
      <span>确认删除当前数据？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="primary" @click="_del(delRow, 'delete')">确 定</el-button>
      </span>
    </el-dialog>
    <!-----------------------------------重置弹框------------------------------------------->
    <el-dialog title="重置密码" size="tiny" :visible.sync="dialogResetShow" align="left">
      <el-form :model="dialogResetInfo" ref="dialogResetInfo" :rules="rules">
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input  auto-complete="off" v-model="dialogResetInfo.password" style="width: 200px" placeholder="默认密码：123456"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogResetShow = false">取 消</el-button>
        <el-button type="primary" @click="_reset(dialogResetInfo)">确 定</el-button>
      </div>
    </el-dialog>
    <!-----------------------------------添加/编辑弹框------------------------------------------->
    <el-dialog :title="dialogTitle" size="tiny" :visible.sync="dialogShow" align="left" @close="dialogInfo={}">
      <el-form ref="dialogInfo" :model="dialogInfo" :rules="rules">
        <el-form-item  label="用户名" :label-width="formLabelWidth" prop="username" >
          <el-input  auto-complete="off" v-model="dialogInfo.username" style="width: 200px" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogType =='add'" label="密码" :label-width="formLabelWidth" prop="password">
          <el-input  auto-complete="off" v-model="dialogInfo.password" style="width: 200px" :placeholder="dialogType=='reset'?'默认密码：123456':'密码'"></el-input>
        </el-form-item>
        <el-form-item  label="姓名" :label-width="formLabelWidth" prop="realName">
          <el-input  auto-complete="off" v-model="dialogInfo.realName" style="width: 200px" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item  label="手机" :label-width="formLabelWidth" prop="phone">
          <el-input  auto-complete="off" v-model="dialogInfo.phone" style="width: 200px"></el-input>
        </el-form-item>
        <!--<el-form-item v-if="dialogType =='add'" label="加密盐值" :label-width="formLabelWidth" prop="salt">-->
          <!--<el-input  auto-complete="off" v-model="dialogInfo.salt" style="width: 200px"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false; dialogInfo = {};">取 消</el-button>
        <el-button type="primary" @click="_add_submit(dialogInfo, path)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import apiMethods from 'api/apiMethods.js'
  import {del, reset} from "api/getData";
  import {baseUrl, config} from 'api/config'

  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value.length < 6 ) {
          callback(new Error('密码长度不能少于6位'));
        } else {
          callback();
        }
      };
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号码'));
        } else if (value.length != 11 ) {
          callback(new Error('请输入11位手机号码'));
        } else {
          callback();
        }
      };
      var validateSalt = (rule, value, callback) => {
        if (value.length > 8) {
          callback(new Error('盐值不能大于8位'))
        } else {
          callback();
        }
      };
      return {
        path: '/user',                   //本页路径
        listLoading: true,               //列表是否请求中
        list: [],                        //列表数据
        page: 1,                         //请求初始页数
        num: 10,                         //每页初始列表
        searchInfo: {},                  //搜索内容
        pagination: false,               //分页
        count: {                         //分页数据统计
          numberOfElements: 0,
          totalElements: 0,
        },
        userStatus: false,               //启用禁用按钮
        dialogShow: false,               //新增弹框是否显示
        dialogResetShow: false,          //重置弹框
        dialogInfo: {},                  //弹框信息
        dialogResetInfo: {},             //重置信息
        dialogTitle: "",                 //弹框标题
        dialogType: "",                  //弹框类别
        dialogDel: false,
        dleRow: [],
        formLabelWidth: '100px',
        rules: {                          //验证规则
            username: [
              {required: true, type: 'string', message: "请输入用户名", trigger: 'blur'}
            ],
            password: [
              {required: true,  validator: validatePass, trigger: 'change'},
            ],
            realName: [
              {required: true, type: 'string', message: "请输入姓名", trigger: 'blur'}
            ],
            phone: [
              {required: true,  validator: validatePhone, trigger: 'change'}
            ],
            salt: [
              {required: false, validator: validateSalt, trigger: 'change'}
            ]
        }
      }
    },
    watch:{
      searchInfo() {
      }
    },
    created() {
      this._list(this.page, this.path)
    },
    methods: {
      _resetPassword(row) {
        this.dialogType = 'reset'
        this.dialogResetShow = true;
//        console.log(row)
        this.dialogResetInfo.id = row.id;
        this.dialogResetInfo.password = "123456"
      },
      _reset(dialogResetInfo) {
        this.$refs.dialogResetInfo.validate((valid) => {
          if (valid) {
            let formData = JSON.stringify(this.dialogResetInfo);
            reset(baseUrl + this.path + '/reset', formData, config).then((res) => {
              if (res.data.code == 200) {
                this.$message({showClose: true, message: res.data.message, type: "success"})
                this._list(this.page);
                this.dialogResetShow = false;
                this.dialogResetInfo = {};
              }else if(res.data.code == -200  || res.data.code == false) {
                this.$message({showClose: true, message: res.data.message, type: "error"})
              }
            })
          }else {
            return false
          }
        })
      }
    },
    mixins: [apiMethods]
  }
</script>

