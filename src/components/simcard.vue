<template>
  <div>
    <!------------------------------------列表-筛选------------------------------------------->
    <div class="index-filter-container">
      <el-form :model="searchInfo" :inline="true" ref="searchInfo" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
        <el-form-item prop="phoneNumber">
          <el-input type="text" v-model="searchInfo.phoneNumber"  placeholder="手机号" @keyup.enter.native="_search(searchInfo)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary"  icon="search"
                     @click="_search(searchInfo)">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" @click="_clickFlag('add', '新增SIM卡')" type="primary" icon="edit">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-------------------------------------列表-栏目------------------------>
    <div class="index-main-table">
      <el-table :data="list"  border v-loading="listLoading" element-loading-text="正在加载中" fit highlight-current-row  style="width: 100%" >
        <el-table-column prop="phoneNumber" label="手机号" min-width="15%" align="center"></el-table-column>
        <el-table-column prop="operatorType" label="运营商" min-width="15%" align="center"></el-table-column>
        <el-table-column prop="networkMode" label="网络模式" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="deviceStatus" label="设备状态" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="20%" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="15%" align="center"></el-table-column>
        <!------------------------------列表-操作栏------------------------------->
        <el-table-column align="left" label="操作" min-width="15%" header-align="center">
          <template slot-scope="scope">
            <el-button size="small" type="info" @click="_clickFlag('edit', '', '编辑SIM卡', scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="_delId(scope.row, 'delete')">删除</el-button>
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
    <!-----------------------------------添加/编辑弹框---------------------->
    <el-dialog :title="dialogTitle" size="tiny" :visible.sync="dialogShow" align="left" @close="dialogInfo={}">
      <el-form ref="dialogInfo" :model="dialogInfo" :rules="rules">
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phoneNumber" >
          <el-input  auto-complete="off" v-model="dialogInfo.phoneNumber" style="width: 80%" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="运营商" :label-width="formLabelWidth" prop="operatorType">
          <el-radio-group v-model="dialogInfo.operatorType" style="width: 100%">
            <el-radio :label="1">移动</el-radio>
            <el-radio :label="2">联通</el-radio>
            <el-radio :label="3">电信</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="网络模式" :label-width="formLabelWidth" prop="networkMode">
          <el-radio-group v-model="dialogInfo.networkMode" style="width: 100%">
            <el-radio :label="1">3G</el-radio>
            <el-radio :label="2">4G</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark" >
          <el-input  auto-complete="off" v-model="dialogInfo.remark" style="width: 80%" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false; dialogInfo={}">取 消</el-button>
        <el-button type="primary" @click="_add_submit(dialogInfo)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import apiMethods from 'api/apiMethods.js'
  import {baseUrl} from 'api/config'
  export default {
    data() {
      var phoneNumber = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入手机号'));
        } else if ( (value.length?value.length:0) != 11) {
          callback(new Error('请输入11位手机号'));
        } else {
          callback();
        }
      };
      return {
        path: '/simCard',                   //本页路径
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
        dialogInfo: {},                  //弹框信息
        dialogTitle: "",                 //弹框标题
        dialogType: "",                  //弹框类别
        dialogDel: false,
        formLabelWidth: '100px',
        rules: {                           //验证规则
          phoneNumber: [
            {required: true, validator: phoneNumber, trigger: 'blur'}
          ],
          operatorType: [
            {required: true, message: " "}
          ],
          networkMode: [
            {required: true, message: " "}
          ]
        }
      }
    },
    created() {
      this._list(this.page)
    },
    methods: {
    },
    mixins: [apiMethods]
  }
</script>

