<template>
  <div>
    <!------------------------------------列表-筛选------------------------------------------->
    <div class="index-filter-container">
      <el-form :model="searchInfo" :inline="true" ref="searchInfo" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
        <el-form-item prop="username">
          <el-input type="text" v-model="searchInfo.username"  placeholder="用户" @keyup.enter.native="_search(searchInfo)"></el-input>
        </el-form-item>
        <el-form-item prop="ip">
          <el-input type="text" v-model="searchInfo.ip"  placeholder="IP" @keyup.enter.native="_search(searchInfo)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary"  icon="search"
                     @click="_search(searchInfo)">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-------------------------------------列表-栏目------------------------>
    <div class="index-main-table">
      <el-table :data="list"  border v-loading="listLoading" element-loading-text="正在加载中" fit highlight-current-row  style="width: 100%" >
        <el-table-column prop="username" label="用户" min-width="8%" align="center"></el-table-column>
        <el-table-column prop="url" label="接口地址" min-width="34%" align="left" header-align="center"></el-table-column>
        <el-table-column prop="httpMethod" label="请求方法" min-width="9%" align="center"></el-table-column>
        <el-table-column prop="ip" label="IP地址" min-width="13%" align="center"></el-table-column>
        <el-table-column prop="spendTime" label="响应时间(ms)" min-width="13%" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="15%" align="center"></el-table-column>
        <!------------------------------列表-操作栏------------------------------->
        <el-table-column align="left" label="操作" min-width="8%" header-align="center">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="_lookUp(scope.row)">查看详情</el-button>
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
    <!-----------------------------------详情弹框------------------------------------------->
    <el-dialog class="lookupdialog" title="接口详情" size="small" :visible.sync="dialogShow" align="left" >
      <el-form ref="lookUpInfo" :model="dialogInfo">
        <el-form-item label="用户" :label-width="formLabelWidth" prop="username" >
          <el-input  auto-complete="off" v-model="dialogInfo.username" style="width: 90%;" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="接口地址" :label-width="formLabelWidth" prop="url" >
          <el-input  auto-complete="off" v-model="dialogInfo.url" style="width: 90%" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="请求方法" :label-width="formLabelWidth" prop="httpMethod" >
          <el-input  auto-complete="off" v-model="dialogInfo.httpMethod" style="width: 90%" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="响应时间(ms)" :label-width="formLabelWidth" prop="spendTime" >
          <el-input  auto-complete="off" v-model="dialogInfo.spendTime" style="width: 90%" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="IP地址" :label-width="formLabelWidth" prop="ip" >
          <el-input  auto-complete="off" v-model="dialogInfo.ip" style="width: 90%" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="创建时间" :label-width="formLabelWidth" prop="createTime" >
          <el-input  auto-complete="off" v-model="dialogInfo.createTime" style="width: 90%" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="classMethod" :label-width="formLabelWidth" prop="classMethod" >
          <el-input  auto-complete="off" v-model="dialogInfo.classMethod" style="width: 90%" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="response" :label-width="formLabelWidth" prop="response" >
          <el-input  auto-complete="off" v-model="dialogInfo.response" style="width: 90%" type="textarea" :rows="4" ></el-input>
        </el-form-item>
        <el-form-item label="args"  :label-width="formLabelWidth" prop="args" >
          <el-input  auto-complete="off" v-model="dialogInfo.args" style="width: 90%" type="textarea" :rows="4" ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import apiMethods from 'api/apiMethods.js'
  import {baseUrl} from 'api/config'
  export default {
    data() {
      return {
        path: '/log',                     //本页路径
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
        dialogShow: false,               //弹框是否显示
        dialogInfo: {},                  //弹框信息
        dialogTitle: "",                 //弹框标题
        dialogType: "",                  //弹框类别
        dialogDel: false,
        formLabelWidth: '100px'
      }
    },
    created() {
      this._list(this.page)
    },
    methods: {
      //查看详情
      _lookUp(row) {
        axios.post(baseUrl + this.path + '/' + row.id).then((res) => {
          if (res.data.code == 200) {
            this.dialogInfo = res.data.data;
            this.dialogShow = true;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
    },
    mixins: [apiMethods]
  }
</script>

