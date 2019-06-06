<template>
  <div>
    <!------------------------------------列表-筛选------------------------------------------->
    <div class="index-filter-container">
      <el-form :model="searchInfo" :inline="true" ref="searchInfo" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
        <el-form-item prop="code">
          <el-input type="text" v-model="searchInfo.code"  placeholder="编码" @keyup.enter.native="_search(searchInfo)"></el-input>
        </el-form-item>
        <el-form-item prop="gatewayId">
          <el-select v-model="searchInfo.gatewayId"  placeholder="网关" clearable>
            <el-option
              v-for="item in gatewayIdList"
              :key="item.code"
              :label="item.code"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary"  icon="search"
                     @click="_search(searchInfo)">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" @click="_clickFlag('add', '新增中继器')" type="primary" icon="edit">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-------------------------------------列表-栏目------------------------>
    <div class="index-main-table">
      <el-table :data="list"  border v-loading="listLoading" element-loading-text="正在加载中" fit highlight-current-row  style="width: 100%" >
        <el-table-column prop="code" label="编码" min-width="20%" align="center"></el-table-column>
        <el-table-column prop="gatewayCode" label="网关" min-width="20%" align="center"></el-table-column>
        <el-table-column prop="deviceStatus" label="设备状态" min-width="20%" align="center"></el-table-column>
        <el-table-column prop="remark" label="描述" min-width="20%" align="center" :show-overflow-tooltip="true"></el-table-column>
        <!------------------------------列表-操作栏------------------------------->
        <el-table-column align="left" label="操作" min-width="20%" header-align="center">
          <template slot-scope="scope">
            <el-button size="small" type="info" @click="_clickFlag('edit', '', '编辑中继器', scope.row)">编辑</el-button>
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
    <!-----------------------------------添加/编辑弹框-------------------------------->
    <el-dialog :title="dialogTitle" size="tiny" :visible.sync="dialogShow" align="left" @close="dialogInfo={}">
      <el-form ref="dialogInfo" :model="dialogInfo" :rules="rules">
        <el-form-item label="编码" :label-width="formLabelWidth" prop="code" >
          <el-input  auto-complete="off" v-model="dialogInfo.code" style="width: 80%" placeholder="编码"></el-input>
        </el-form-item>
        <el-form-item label="网关" :label-width="formLabelWidth" prop="gatewayId">
          <el-select v-model="dialogInfo.gatewayId"  placeholder="请选择" style="width: 80%">
            <el-option
              v-for="item in gatewayIdList"
              :key="item.code"
              :label="item.code"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态" :label-width="formLabelWidth" prop="deviceStatus">
          <el-radio-group v-model="dialogInfo.deviceStatus">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">异常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="remark" >
          <el-input  auto-complete="off" v-model="dialogInfo.remark" style="width: 80%" placeholder="描述"></el-input>
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
      return {
        path: '/repeater',                //本页路径
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
        gatewayIdList: [],
        rules: {                           //验证规则
            code: [
              {required: true, type: 'string', message: "请输入编码", trigger: 'blur'}
            ],
            gatewayId: [
              {required: true,  message: "请输入网关ID"}
            ],
            deviceStatus: [
              {required: true,  message: "请选择设备状态"}
            ]
        }
      }
    },
    created() {
      this._list(this.page)
      this._getGatewayId()
    },
    methods: {
      _getGatewayId() {
        axios.post(baseUrl + '/gateway/list').then((res) => {
          if (res.data.code == 200) {
            this.gatewayIdList = res.data.data
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    mixins: [apiMethods]
  }
</script>

