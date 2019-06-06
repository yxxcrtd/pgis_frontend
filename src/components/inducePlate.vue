<template>
  <div>
    <!------------------------------------列表-筛选------------------------------------------->
    <div class="index-filter-container">
      <el-form :model="searchInfo" :inline="true" ref="searchInfo" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
        <el-form-item prop="username">
          <el-input type="name" v-model="searchInfo.name"  placeholder="名称" @keyup.enter.native="_search(searchInfo)"></el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input type="code" v-model="searchInfo.code"  placeholder="编码" @keyup.enter.native="_search(searchInfo)"></el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-select v-model="searchInfo.level"  placeholder="等级" clearable>
            <el-option label="一级" :value="1"></el-option>
            <el-option label="二级" :value="2"></el-option>
            <el-option label="三级" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary"  icon="search"
                     @click="_search(searchInfo)">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" @click="_clickFlag('add', '新增诱导牌')" type="primary" icon="edit">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-------------------------------------列表-栏目------------------------>
    <div class="index-main-table">
      <el-table :data="list"  border v-loading="listLoading" element-loading-text="正在加载中" fit highlight-current-row style="width: 100%" >
        <el-table-column prop="code" label="编码" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="level" label="等级" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="name" label="名称" min-width="20%" align="left" header-align="center"></el-table-column>
        <el-table-column prop="location" label="坐标" min-width="17%" align="center"></el-table-column>
        <el-table-column prop="remark" label="详细描述" min-width="35%" align="left" :show-overflow-tooltip="true" header-align="center"></el-table-column>
        <!------------------------------列表-操作栏------------------------------->
        <el-table-column align="left" label="操作" min-width="8%" header-align="center">
          <template slot-scope="scope">
            <el-button size="small" type="info" @click="_clickFlag('edit', '', '编辑诱导牌', scope.row)">编辑</el-button>
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
        <el-form-item label="编码" :label-width="formLabelWidth" prop="code" >
          <el-input  auto-complete="off" v-model="dialogInfo.code" style="width: 80%" placeholder="编码"></el-input>
        </el-form-item>
        <el-form-item label="等级" :label-width="formLabelWidth" prop="level">
          <el-radio-group v-model="dialogInfo.level">
            <el-radio :label="1">一级</el-radio>
            <el-radio :label="2">二级</el-radio>
            <el-radio :label="3">三级</el-radio>
            <el-radio :label="4">LED</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name" >
          <el-input  auto-complete="off" v-model="dialogInfo.name" style="width: 80%" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="位置" :label-width="formLabelWidth" prop="location" >
          <el-input  auto-complete="off" v-model="dialogInfo.location" style="width: 80%" placeholder="位置"></el-input>
          <i class="el-icon-search" @click="_dialogMap(dialogInfo)"></i>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="remark" >
          <el-input  auto-complete="off" v-model="dialogInfo.remark" style="width: 80%" type="textarea" :rows="3" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false; dialogInfo={}">取 消</el-button>
        <el-button type="primary" @click="_add_submit(dialogInfo)">确 定</el-button>
      </div>
    </el-dialog>
    <!----------------------------------地图弹框------------------------------------->
    <el-dialog :title="'选择诱导牌位置：'+dialogInfo.location" size="large" :visible.sync="dialogMapShow" align="left" >
      <el-form ref=dialogMapInfo :model="dialogMapInfo">
        <div id="map"></div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMapShow = false">取 消</el-button>
        <el-button type="primary" @click="_position">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import apiMethods from 'api/apiMethods.js'
  import {baseUrl} from 'api/config'
  import VMap from 'components/map'
  export default {
    components: {VMap},
    data() {
      let self = this;                   //地图
      return {
        path: '/inducePlate',            //本页路径
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
          location: ""
        },                  //弹框信息
        dialogTitle: "",                 //弹框标题
        dialogType: "",                  //弹框类别
        formLabelWidth: '100px',
        dialogMapShow: false,
        dialogMapInfo: {},
        rules: {                           //验证规则
            name: [
              {required: true, type: 'string', message: "请输入名称", trigger: 'blur'}
            ],
            code: [
              {required: true,  message: " ",  trigger: 'blur'}
            ],
            level: [
              {required: true,  message: " "}
            ]
        },
        coordinate: '',                    //地图
        position: ""

      }
    },
    created() {
      this._list(this.page)
    },
    methods: {
      _dialogMap(info) {
        this.dialogMapShow = true;
        this._initMap()
      },
      _position() {
        this.dialogMapShow = false
      },
      _initMap() {
        axios.post(baseUrl + '/config/findByCode/coordinate').then((res) => {
          if (res.data.code == 200) {
            var _this = this;
            this.coordinate = res.data.data[0].value
            // 默认显示系统配置的地图中心坐标点
            var map = new AMap.Map('map', {
              resizeEnable: true,
              zoom: 15,
              scrollWheel: false
            });
            map.setCenter([this.coordinate.split(',')[0], this.coordinate.split(',')[1]])

            // 添加地图工具栏
            AMap.plugin([ 'AMap.ToolBar', 'AMap.Scale' ],
              function() {
                map.addControl(new AMap.ToolBar());
                map.addControl(new AMap.Scale());
              });
            //点击获取坐标
             map.on('click', function(e) {
               _this.dialogInfo.location = e.lnglat.getLng() + ',' + e.lnglat.getLat()
            });
          }
        })
      }
    },
    mixins: [apiMethods]
  }
</script>

<style scoped>
  #map { width: 100%; height: 500px}
</style>

