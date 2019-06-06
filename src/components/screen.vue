<template>
  <div>
    <!------------------------------------列表-筛选------------------------------------------->
    <div class="index-filter-container">
      <el-form :model="searchInfo" :inline="true" ref="searchInfo" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
        <el-form-item prop="name" style="width: 10%">
          <el-input type="text" v-model="searchInfo.name"  placeholder="名称" @keyup.enter.native="_search(searchInfo)"></el-input>
        </el-form-item>
        <el-form-item prop="code" style="width: 10%">
          <el-input type="text" v-model="searchInfo.code"  placeholder="编码" @keyup.enter.native="_search(searchInfo)"></el-input>
        </el-form-item>
        <el-form-item style="width: 15%">
          <el-select v-model="searchInfo.controlCardId"  placeholder="控制卡" clearable>
            <el-option
              v-for="item in controlCardIdList"
              :key="item.code"
              :label="item.code"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 15%">
          <el-select v-model="searchInfo.inducePlateId"  placeholder="诱导牌" clearable>
            <el-option
              v-for="item in inducePlateIdList"
              :key="item.code"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 15%">
          <el-select v-model="searchInfo.type"  placeholder="屏幕类型" clearable>
            <el-option
              v-for="item in screenTypeList"
              :key="item.type"
              :label="item.typeText"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary"  icon="search"
                     @click="_search(searchInfo)">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" @click="_clickFlag('add', '新增屏幕')" type="primary" icon="edit">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-------------------------------------列表-栏目------------------------>
    <div class="index-main-table">
      <el-table :data="list"  border v-loading="listLoading" element-loading-text="正在加载中" fit highlight-current-row  style="width: 100%" >
        <el-table-column prop="name" label="名称" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="code" label="编码" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="type" label="屏幕类型" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="controlCardCode" label="控制卡" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="inducePlateName" label="诱导牌" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="orderNum" label="序号" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="15%" align="center"></el-table-column>
        <!------------------------------列表-操作栏------------------------------->
        <el-table-column align="left" label="操作" min-width="10%" header-align="center">
          <template slot-scope="scope">
            <el-button size="small" type="info" @click="_clickFlag2('edit', '', '编辑屏幕', scope.row)">编辑</el-button>
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
      <el-form ref="dialogInfo" :model="dialogInfo" :rules="rules">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name" >
          <el-input  auto-complete="off" v-model="dialogInfo.name" style="width: 80%" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="编码" :label-width="formLabelWidth" prop="code" >
          <el-input  auto-complete="off" v-model="dialogInfo.code" style="width: 80%" placeholder="编码"></el-input>
        </el-form-item>
        <el-form-item label="屏幕类型" :label-width="formLabelWidth" prop="type">
          <el-radio-group v-model="dialogInfo.type">
            <el-radio :label="1">车位数屏</el-radio>
            <el-radio :label="2">文字信息屏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="屏幕尺寸" :label-width="formLabelWidth" prop="size">
          <el-radio-group v-model="dialogInfo.size">
            <el-radio label="16*8">车位数屏</el-radio>
            <el-radio label="160*32">滚动信息长屏</el-radio>
            <el-radio label="80*64">全点阵信息屏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属控制卡" :label-width="formLabelWidth" prop="controlCardId">
          <el-select v-model="dialogInfo.controlCardId"  placeholder="请选择" style="width: 80%">
            <el-option
              v-for="item in controlCardIdList"
              :key="item.code"
              :label="item.code"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属诱导牌" :label-width="formLabelWidth" prop="inducePlateId">
          <el-select v-model="dialogInfo.inducePlateId"  placeholder="请选择" style="width: 80%">
            <el-option
              v-for="item in inducePlateIdList"
              :key="item.code"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序号" :label-width="formLabelWidth" prop="orderNum" >
          <el-input  auto-complete="off" v-model="dialogInfo.orderNum" style="width: 80%" placeholder="序号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false; dialogInfo={}">取 消</el-button>
        <el-button type="primary" @click="_add_submit2(dialogInfo)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import apiMethods from 'api/apiMethods.js'
  import {baseUrl} from 'api/config'
  import {add, edit} from 'api/getData'

  export default {
    data() {
      var validateWidth = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入屏幕宽度'));
        } else {
          callback();
        }
      };
      var validateHeight = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入屏幕高度'));
        } else {
          callback();
        }
      };
      return {
        path: '/screen',                  //本页路径
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
        controlCardIdList: [],
        inducePlateIdList: [],
        screenTypeList: [
          {
            type: 1,
            typeText: '车位数屏'
          },
          {
            type: 2,
            typeText: '文字信息屏'
          }
        ],
        rules: {                           //验证规则
            name: [
              {required: true, type: 'string', message: "请输入名称", trigger: 'blur'}
            ],
            code: [
              {required: true, type: 'string', message: "请输入编码", trigger: 'blur'}
            ],
            type: [
              {required: true, type: 'number', message: " ", trigger: 'blur'}
            ],
            size: [
              {required: true, type: 'string', message: " ", trigger: 'blur'}
            ],
            width: [
              {required: true, validator: validateWidth, trigger: 'blur'}
            ],
            height: [
              {required: true, validator: validateHeight, trigger: 'blur'}
            ],
            controlCardId: [
              {required: true,  type: 'number', message: " ", trigger: 'blur'}
            ],
            inducePlateId: [
              {required: true,  type: 'number', message: " ", trigger: 'blur'}
            ],
            orderNum: [
              {required: true, type: "string", message: "请输入序号", trigger: 'blur'}
            ]
        }
      }
    },
    created() {
      this._list(this.page)
      this._getControlCardIdList()
      this._getInducePlateIdList()
    },
    methods: {
      _getControlCardIdList() {
        axios.post(baseUrl + '/controlCard/list').then((res) => {
          if (res.data.code == 200) {
            this.controlCardIdList = res.data.data
          }
        }).catch((err) => {
          console.log(err)
        })
      },

      _getInducePlateIdList() {
        axios.post(baseUrl + '/inducePlate/list').then((res) => {
          if (res.data.code == 200) {
            this.inducePlateIdList = res.data.data
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //复写公用的方法
      _clickFlag2(type, addTitle, editTitle, row) {
        this.dialogShow = true;
        this.dialogType = type;
        if (type == 'add') {
          this.dialogTitle = addTitle;
          row = ''
        }else if (type == 'edit') {
          this.dialogTitle = editTitle;
          //调用编辑方法
          this._edit2(row)
        }
      },
      //编辑
      _edit2(row) {
        edit(baseUrl + this.path + "/" + row.id).then((res) => {
          if(res.data.code == 200) {
            this.dialogInfo = res.data.data
            this.dialogInfo.size = this.dialogInfo.width + '*' + this.dialogInfo.height;
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
          this._add(info)
        }else if (this.dialogType == 'edit') {
          this._submit(info)
        }
      }
    },
    mixins: [apiMethods]
  }
</script>

