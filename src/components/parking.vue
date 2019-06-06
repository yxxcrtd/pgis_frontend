<template>
  <div>
    <!------------------------------------列表-筛选------------------------------------------->
    <div class="index-filter-container">
      <el-form :model="searchInfo" :inline="true" ref="searchInfo" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
        <el-form-item prop="code">
          <el-input type="text" v-model="searchInfo.code"  placeholder="编码" @keyup.enter.native="_search(searchInfo)"></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-input type="text" v-model="searchInfo.name"  placeholder="名称" @keyup.enter.native="_search(searchInfo)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary"  icon="search"
                     @click="_search(searchInfo)">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" @click="_clickFlag('add', '新增停车场')" type="primary" icon="edit">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-------------------------------------列表-栏目------------------------>
    <div class="index-main-table">
      <el-table :data="list"  border v-loading="listLoading" element-loading-text="正在加载中" fit highlight-current-row  style="width: 100%" >
        <el-table-column prop="code" label="编码" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="name" label="名称" min-width="20%" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="accessMode" label="接入方式" min-width="15%" align="center"></el-table-column>
        <el-table-column prop="lotTotalCount" label="车位数" min-width="15%" align="center"></el-table-column>
        <el-table-column prop="lotRemainCount" label="剩余车位数" min-width="15%" align="center"></el-table-column>
        <!------------------------------列表-操作栏------------------------------->
        <el-table-column align="left" label="操作" min-width="15%" header-align="center">
          <template slot-scope="scope">
            <el-button size="small" type="info" @click="_clickFlag('edit', '', '编辑停车场', scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="_bind(scope.row)">绑定</el-button>
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
    <!-----------------------------------添加/编辑弹框---------------------->
    <el-dialog :title="dialogTitle" size="tiny" :visible.sync="dialogShow" align="left" @close="dialogInfo={}">
      <el-form :model="dialogInfo" ref="dialogInfo" :rules="rules">
        <el-form-item label="编码" :label-width="formLabelWidth" prop="code" >
          <el-input  auto-complete="off" v-model="dialogInfo.code" style="width: 90%" placeholder="编码"></el-input>
        </el-form-item>
        <el-form-item label="停车场名称" :label-width="formLabelWidth" prop="name" >
          <el-input  auto-complete="off" v-model="dialogInfo.name" style="width: 90%" placeholder="停车场名称"></el-input>
        </el-form-item>
        <el-form-item label="单位名称" :label-width="formLabelWidth" prop="unitName" >
          <el-input  auto-complete="off" v-model="dialogInfo.unitName" style="width: 90%" placeholder="单位名称"></el-input>
        </el-form-item>
        <el-form-item label="文字信息屏" :label-width="formLabelWidth" prop="mediaScreenIds">
          <el-select v-model="dialogInfo.mediaScreenId"  placeholder="请选择文字信息屏" style="width: 90%">
            <el-option
              v-for="item in mediaScreenList"
              :key="item.code"
              :label="item.code"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
          <el-radio-group v-model="dialogInfo.type" style="width: 110%">
            <el-radio :label="1">室内</el-radio>
            <el-radio :label="2">室外</el-radio>
            <el-radio :label="3">占道</el-radio>
            <el-radio :label="4">机械</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="接入方式" :label-width="formLabelWidth" prop="accessMode">
          <el-radio-group v-model="dialogInfo.accessMode" style="width: 100%">
            <el-radio :label="1">地磁</el-radio>
            <el-radio :label="2">系统</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="车位数" :label-width="formLabelWidth" prop="lotTotalCount" >
          <el-input  auto-complete="off" v-model="dialogInfo.lotTotalCount" style="width: 90%" placeholder="车位数"></el-input>
        </el-form-item>
        <el-form-item label="剩余车位数" :label-width="formLabelWidth" prop="lotRemainCount" >
          <el-input  auto-complete="off" v-model="dialogInfo.lotRemainCount" style="width: 90%" placeholder="剩余车位数"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false; dialogInfo={}">取 消</el-button>
        <el-button type="primary" @click="_add_submit(dialogInfo)">确 定</el-button>
      </div>
    </el-dialog>
    <!-----------------------------------绑定------------------------------------------->
    <Modal v-model="dialogBind" title="绑定屏幕">
      <Form ref="dialogBindInfo" :model="dialogBindInfo" align="left">
        <FormItem prop="name" label="停车场名称">
          <Input  type="text"  v-model="dialogBindInfo.name" style="width: 80%" />
        </FormItem>
        <FormItem  label="已绑定屏幕">
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
  </div>
</template>

<script type="text/javascript">
  import apiMethods from 'api/apiMethods.js'
  import {baseUrl, config} from 'api/config'
  export default {
    data() {
      var validateTotalCount = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入车位数'));
        } else if (value <= 0) {
          callback(new Error('车位数不能小于等于0'));
        } else {
          callback();
        }
      };
      var validateRemainCount = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入剩余车位数'));
        } else if (value < 0) {
          callback(new Error('剩余车位数不能小于0'));
        } else if (value > parseInt(this.dialogInfo.lotTotalCount) || value == 0) {
          callback(new Error('剩余车位数不能大于车位数'));
        } else {
          callback();
        }
      };
      return {
        path: '/parking',                   //本页路径
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
          lotTotalCount: '',
          lotRemainCount: ''
        },                  //弹框信息
        dialogTitle: "",                 //弹框标题
        dialogType: "",                  //弹框类别
        dialogDel: false,
        dialogBind: false,               //绑定
        dialogBindInfo: {
          screenIds: []
        },
        screenList: [],                  //屏幕列表
        screenIds: [],
        screen: [],
        mediaScreenList: [],
        mediaScreenId: [],
        formLabelWidth: '100px',
        rules: {                           //验证规则
            code: [
              {required: true,  message: "请输入编码", trigger: 'blur'}
            ],
            name: [
              {required: true,  message: "请输入名称", trigger: 'blur'}
            ],
            type: [
              {required: true, type:'number', message: "请选择类型", trigger: 'blur'}
            ],
            accessMode: [
              {required: true, type:'number',  message: "请选择接入方式", trigger: 'blur'}
            ],
            lotTotalCount: [
              {required: true, validator: validateTotalCount, trigger: 'blur'}
            ],
            lotRemainCount: [
              {required: true, validator: validateRemainCount, trigger: 'blur'}
            ]
        }
      }
    },
    created() {
      this._list(this.page)
      axios.post(baseUrl + '/screen/list/2').then((res) => {
        if (res.data.code == 200) {
          this.mediaScreenList = res.data.data;
        }
      })
    },
    methods: {
      //绑定
      _bind(row) {
        this.dialogBind = true;
        this.dialogBindInfo = row;
        //获取车位屏列表
        axios.post(baseUrl + '/screen/list/1').then((res) => {
          if (res.data.code == 200) {
            this.screenList = res.data.data;
          }
        }).catch((err) => {
          console.log(err)
        })
        //获取停车场对应的屏列表
        axios.post(baseUrl + '/relationScreen/parking/list/' + row.id).then((res) => {
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
            this.dialogBindInfo.screenIds = [];
            this._list(this.page);
          }else if (res.data.success == false) {
            this.$message({showClose: true, message: res.data.message, type: "error"})
            this.dialogBindInfo.screenIds = [];
            this._list(this.page);
          }else if(res.data.code == -200) {
            this.$message({showClose: true, message: res.data.message, type: "error"})
            this.dialogBindInfo.screenIds = [];
            this._list(this.page);
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    mixins: [apiMethods]
  }
</script>

