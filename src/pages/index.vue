<template>
  <div class="index-container" >
    <!--------------------------------头部------------------------------------->
    <div class="index-top" :class="{'hiddenClick': isClick}">
      <!--------------------------------头部标题------------------------------------->
      <div class="index-title">
        <div class="index-title-icon">
          <i class="iconfont icon-diannao"></i>
        </div>
        <div class="index-title-text">{{systemname}}</div>
      </div>
      <!--------------------------------登录信息------------------------------------->
      <div class="index-user">
        <div class="index-user-avator">
          <i class="iconfont icon-ren index-user-icon"></i>
        </div>
        <el-dropdown>
            <span class="el-dropdown-link">
              <p class="index-user-name">{{username}}</p>
              <i class="iconfont icon-xiangxia"></i>
            </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="_modifyPassword"><span>修改密码</span></el-dropdown-item>
            <el-dropdown-item @click.native="_logout"><span>退出登录</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-----------------------------------修改密码弹框------------------------------------------->
    <el-dialog title="修改密码" size="tiny" :visible.sync="dialogModifyShow" align="left">
      <el-form :model="dialogModifyInfo" ref="dialogModifyInfo" :rules="rules">
        <el-form-item label="请输入新密码" :label-width="formLabelWidth" prop="password1">
          <el-input type="password" auto-complete="off" v-model="dialogModifyInfo.password1" style="width: 90%" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="请再次输入新密码" :label-width="formLabelWidth" prop="password2">
          <el-input type="password" auto-complete="off" v-model="dialogModifyInfo.password2" style="width: 90%" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModifyShow = false">取 消</el-button>
        <el-button type="primary" @click="_modify(dialogModifyInfo)">确 定</el-button>
      </div>
    </el-dialog>
    <!--------------------------------主体------------------------------------->
    <div class="index-main" :class="{'hiddenClick': isClick}">
      <!--------------------------------主体左侧导航------------------------------------->
      <div class="index-main-nav">
        <el-menu theme="dark" class="el-menu-vertical-demo"  :collapse="isClick" :unique-opened="true">
          <div  style="background: #293841; height: 41px; width: 100%;">
            <div class="index-logo-right" @click="showHiddAside" >
              <div class="index-logo-more" :class="{'is-click': isClick}">
                <i class="iconfont icon-hanburg" ></i>
              </div>
            </div>
          </div>
          <router-link to="/index">
            <el-menu-item index="0" align="left">
                <i class="iconfont icon-shouye"></i>
                <span slot="title" :class="{'index-text' : isClick}">首页</span>
            </el-menu-item>
          </router-link>
          <el-submenu index="1">
            <template slot="title">
              <i class="iconfont icon-yunying"></i>
              <span slot="title">运营管理</span>
            </template>
            <el-menu-item index="1-3" style="padding-left: 50px;" @click="getTags">
              <i class="iconfont icon-shoujiqia"></i>
              <router-link to="/sim" >sim卡管理</router-link>
            </el-menu-item>
            <el-menu-item index="1-4" style="padding-left: 50px;" @click="getTags">
              <i class="iconfont icon-tingchechang"></i>
              <router-link to="/parking" >停车场管理</router-link>
            </el-menu-item>
            <el-menu-item index="1-5" style="padding-left: 50px;" @click="getTags">
              <i class="iconfont icon-cardb"></i>
              <router-link to="/controlCard">控制卡管理</router-link>
            </el-menu-item>
            <el-menu-item index="1-6" style="padding-left: 50px;" @click="getTags">
              <i class="iconfont icon-jiemuguanli"></i>
              <router-link to="/program">节目管理</router-link>
            </el-menu-item>
            <el-menu-item index="1-7" style="padding-left: 50px;" @click="getTags">
              <i class="iconfont icon-indicator-panel"></i>
              <router-link to="/inducePlate">诱导牌管理</router-link>
            </el-menu-item>
            <el-menu-item index="1-8" style="padding-left: 50px;" @click="getTags">
              <i class="iconfont icon-wuxianxinhao"></i>
              <router-link to="/repeater">中继器管理</router-link>
            </el-menu-item>
            <el-menu-item index="1-9" style="padding-left: 50px;" @click="getTags">
              <i class="iconfont icon-t02"></i>
              <router-link to="/screen">屏幕管理</router-link>
            </el-menu-item>
            <el-menu-item index="1-10" style="padding-left: 50px;" @click="getTags">
              <i class="iconfont icon-dici"></i>
              <router-link to="/geoSensor">地磁管理</router-link>
            </el-menu-item>
            <el-menu-item index="1-11" style="padding-left: 50px;" @click="getTags">
              <i class="iconfont icon-wangguanzaixian"></i>
              <router-link to="/gateway">网关管理</router-link>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2" >
            <template slot="title">
              <i class="iconfont icon-xitongshezhi"></i>
              <span slot="title">系统管理</span>
            </template>
            <el-menu-item index="2-1" style="padding-left: 50px;" @click="getTags">
              <i class="iconfont icon-icon09"></i>
              <router-link to="/user">用户管理</router-link>
            </el-menu-item>
            <el-menu-item index="2-2" style="padding-left: 50px;" @click="getTags">
              <i class="iconfont icon-banshou-shixin"></i>
              <router-link to="/config">配置管理</router-link>
            </el-menu-item>
            <el-menu-item index="2-3" style="padding-left: 50px;" @click="getTags">
              <i class="iconfont icon-rizhi"></i>
              <router-link to="/log">业务日志</router-link>
            </el-menu-item>
            <el-menu-item index="2-4" style="padding-left: 50px;">
              <i class="iconfont icon-jiekoupeizhiguanli"></i>
              <a href="http://139.198.2.158:8081/swagger-ui.html">接口文档</a>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <!--------------------------------主体右侧列表------------------------------------->
      <div class="index-main-content">
        <!--------------------------------主体右侧面包屑------------------------------------->
        <div class="index-main-breadcrumbs">
          <div class="index-main-tag">
              <!--tag标签-->
              <!--<div>-->
                <!--<el-tag to="/index" :class="$route.path == '/map'? 'tagactive': ''"  @close="handleClose(item)" :close-transition="false">-->
                  <!--<router-link to="/map" style="color: #fff">首 页</router-link>-->
                <!--</el-tag>-->
              <!--</div>-->
              <!--<div v-for="(item, index) in tagList">-->
                <!--<el-tag :key="index" :to="item.path"-->
                  <!--:closable="true"-->
                  <!--:close-transition="true"-->
                  <!--:class="$route.path == item.path? 'tagactive': ''"-->
                  <!--@close="handleClose(item)">-->
                  <!--<router-link :to="item.path" style="color: #fff">{{item.value}}</router-link>-->
                <!--</el-tag>-->
              <!--</div>-->
            <el-tabs v-model="tabIndex" type="card"  @tab-click="tabClick" @tab-remove="tabRemove">
              <el-tab-pane
                :key="item.path"
                v-for="(item, index) in tagList"
                :label="item.value"
                :name="item.path" :closable="item.path=='/map'?false:true"
                :class="$route.path == item.path? 'is-active': ''">
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <!------------------------------------列表------------------------------------------->
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import {mapGetters} from 'vuex'
  import {logout, menu, list} from 'api/getData'
  import {baseUrl, config} from 'api/config'
  export default {
    data() {
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.dialogModifyInfo.password1 !== '') {
//              this.$refs.dialogModifyInfo.validateField('checkPass');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.dialogModifyInfo.password1) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
      return {
        menuList: [],                 //菜单数据
        isClick: false,               //显示隐藏侧栏
        isShowHiddSetMenu: false,     //显示隐藏个人设置菜单
        dialogModifyShow: false,      //修改密码弹框
        dialogModifyInfo: {
          password: '',
          password1: '',
          passowrd2: ''
        },         //修改密码信息
        tableShow: false,             //用户列表
        username: '',                 //登录用户
        id: '',
        systemname: '',                //系统名称
        formLabelWidth: '150px',
        tagList: [{
          path: '/map',
          value: '首页'
        }],                            //标签列表
        tabIndex: '/map',
        rules: {                       //验证规则
          password1: [
            {required: true,  validator: validatePass, trigger: 'blur' }
          ],
          password2: [
            {required: true,  validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.username = Cookies.get('username')        //获取用户名
      this.id = Cookies.get('id')                   //获取id
      this.systemname = Cookies.get('systemname')  //系统名称
      this.tagList = (JSON.parse(sessionStorage.getItem("tag")))?JSON.parse(sessionStorage.getItem("tag")):this.tagList;
      this.tabIndex = this.$route.path
    },
    methods: {
      handleClose(item) {
        this.tagList.splice(this.tagList.lastIndexOf(item), 1);
        if (this.tagList.length) {
          this.$router.push(this.tagList[this.tagList.length - 1].path)
        }else {
          this.$router.push('/map')
        }
      },
      getTags() {
        var count = 0;
        for (var i=1; i<=this.tagList.length-1; i++) {
          if(this.tagList[i].path == this.$route.path) {
            count ++;
          }
        }
        if (count == 0) {
          this.tagList.push({
            path: this.$route.path,
            value: ''
          })
        }
        for (var i=0; i<=this.tagList.length-1; i++) {
          if (this.tagList[i].path == '/sim') {
            this.tagList[i].value = 'SIM卡管理'
          }else if (this.tagList[i].path == '/parking') {
            this.tagList[i].value = '停车场管理'
          }else if (this.tagList[i].path == '/controlCard') {
            this.tagList[i].value = '控制卡管理'
          }else if (this.tagList[i].path == '/program') {
            this.tagList[i].value = '节目管理'
          }else if (this.tagList[i].path == '/inducePlate') {
            this.tagList[i].value = '诱导牌管理'
          }else if (this.tagList[i].path == '/repeater') {
            this.tagList[i].value = '中继器管理'
          }else if (this.tagList[i].path == '/screen') {
            this.tagList[i].value = '屏幕管理'
          }else if (this.tagList[i].path == '/user') {
            this.tagList[i].value = '用户管理'
          }else if (this.tagList[i].path == '/config') {
            this.tagList[i].value = '配置管理'
          }else if (this.tagList[i].path == '/log') {
            this.tagList[i].value = '业务日志'
          }else if (this.tagList[i].path == '/geoSensor') {
            this.tagList[i].value = '地磁管理'
          }else if (this.tagList[i].path == '/gateway') {
            this.tagList[i].value = '网关管理'
          }
          this.tabIndex = this.$route.path
          var tag = JSON.stringify(this.tagList)
          sessionStorage.setItem('tag', tag)
        }
      },
      //显示隐藏侧栏
      showHiddAside() {
        this.isClick = !this.isClick;
      },
      //显示隐藏个人设置菜单
      showHiddSetMenu() {
        this.isShowHiddSetMenu = !this.isShowHiddSetMenu;
      },
      //退出
      _logout() {
        this.$confirm('确认退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          let data = {
            authkey: Lockr.get('authKey'),
            sessionId: Lockr.get('sessionId')
          }
          logout(baseUrl + '/user/logout', data).then((res) => {
            Lockr.rm('authKey')
            Lockr.rm('userInfo')
            Lockr.rm('sessionId')
            Cookies.remove('username')
            setTimeout(() => {
              this.$router.push('/')
            }, 1000)
          }).catch((err) => {
            console.log(err)
          })
        })
      },
      //修改密码弹框
      _modifyPassword() {
        this.dialogModifyShow = true;
      },
      //修改密码提交
      _modify(dialogModifyInfo) {
        dialogModifyInfo.id = this.id;
        dialogModifyInfo.username = this.username
        dialogModifyInfo.password = dialogModifyInfo.password2
        this.$refs.dialogModifyInfo.validate((valid) => {
          if (valid) {
            let formData = JSON.stringify(dialogModifyInfo);
            axios.post(baseUrl + '/user/reset', formData, config).then((res) => {
              if (res.data.code == 200) {
                this.$message({showClose: true, message: res.data.message, type: "success"})
                this.dialogModifyShow = false
              }else if (res.data.code == -200) {
                this.$message({showClose: true, message: res.data.message, type: "error"})
              }
            })
          }else {
            return false
          }
        })
      },
      //菜单数据
      _menu() {
        menu(baseUrl + '/menu/list' + '/' + 1 + '/' + 10, {}).then((res) => {
          if (res.data.code == 200) {
            this.menuList = res.data.data;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //
      tabClick(tab) {
        this.$router.push(tab.name)
        this.tabIndex = tab.name
      },
      tabRemove(tab) {
        for (var i=0; i<this.tagList.length; i++) {
          if (this.tagList[i].path == tab) {
            this.tagList.splice(this.tagList.lastIndexOf(this.tagList[i]), 1);
          }
        }
        if (this.tagList.length) {
          this.$router.push(this.tagList[this.tagList.length - 1].path)
        }else {
          this.$router.push('/map')
        }
        this.tabIndex = this.$route.path
      }
    }
  }
</script>

<style  lang="css" rel="stylesheet/css">
  .index-container{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  /***********************头部************************/
  .index-top{
    width: 100%;
    height: 60px;
    display: flex;
    transition: margin-left 0.28s ease-out;
  }
  /***********************头部logo************************/
  .index-logo-right{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .index-logo-more{
    width: 40px;
    height: 40px;
    text-align: center;
    transition: .3s;
  }
  .is-click{
    transform: rotate(90deg);
    transition: .3s;
  }
  .index-logo-right .index-logo-more .iconfont{
    font-size: 18px;
    line-height: 40px;
    margin-right: 0px;
    color: #fff;
  }
  /***********************头部标题************************/
  .index-title{
    flex: 8;
    text-align: center;
    background: #172424;
    display: flex;
    overflow: hidden;
  }
  .index-title-icon .icon-diannao{
    font-size: 39px;
    line-height: 54px;
    color: #20A0FF;
    margin-left: 24px;
  }
  .index-title-text{
    font-size: 24px;
    line-height: 60px;
    color: #fff;
    letter-spacing: 5px;
    font-weight: 400;
    overflow: hidden;
    margin-left: 16px;
  }

  /***********************登录信息************************/
  .index-user{
    flex: 1;
    background: #172424;
    display: flex;
    align-items: center;
    justify-items: center;
  }
  .index-user-avator{
    width: 40px;
    height: 49px;
  }
  .index-user-icon{
    font-size: 16px;
    line-height: 48px;
    color: #FFF;
  }
  .index-user-name{
    font-size: 16px;
    color: #eee;
    margin-right: 10px;
  }
  .el-dropdown-link{
    display: flex;
    align-items: center;
  }
  /***********************个人设置************************/
  .el-dropdown-menu__item{
    font-size: 14px;
  }
  /***********************主体部分************************/
  .index-main{
    width: 100%;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .index-text{
    display: none;
  }
  /***********************主体左侧导航************************/
  .index-main-nav{
    width: 200px;
    text-align: left;
    transition: width 0.28s ease-out;
    position: relative;
    top: 0;
    bottom: 0;
    height: 100%;
    background: #38454D;
    z-index: 999;
    float: left;
  }
  .index-main-nav .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    position: absolute;
    top: 0px;
    bottom: 0;
    border-radius: 0;
    background: #38454D;
  }
  .index-main-nav .el-menu-vertical-demo{
    position: absolute;
    top: 0px;
    bottom: 0;
    border-radius: 0;
    background: #38454D;
  }
  .index-main-nav .el-menu-item{
    background: #2E3D45;
    letter-spacing: 1px;
  }
  .el-submenu{
    background: #38454D;
    border-bottom: 1px solid #2F2F3B;
  }
  .el-menu .el-menu-item.is-active{
    background: #374953;
    color: #fff;
  }
  .index-main-nav .is-opened{
    background: #2E3D45;
  }
  .index-main-nav .iconfont{
    margin-right: 8px;
    font-size: 18px;
  }
  .index-main-nav .text{
    font-weight: bold;
    letter-spacing: 1px;
    font-weight: 500;
  }
  .el-menu-item{
    display: flex;
    align-items: center;
  }
  .el-menu-item a{
    display: block;
    width: 100%;
    height: 100%;
    font-size: 14px;
    text-decoration: none;
    color: #DDE9F1;
  }
  .el-menu-item a:hover{
    color: #fff;
  }
  .el-submenu .el-submenu__title:hover{
    background: #20A0FF;
    color: #fff;
  }
  /***********************主体右侧内容************************/
  .index-main-content{
    transition: margin-left 0.28s ease-out;
    margin-left: 200px;
  }
  /****************************面包屑***************************/
  .index-main-breadcrumbs{
    width: 100%;
    /*height: 60px;*/
    background: #eee;
    text-align: left;
  }
  .index-main-tag{
    width: 100%;
    height: 40px;
    line-height: 40px;
  }
  /****************************筛选***************************/
  .index-filter-container{
    width: 100%;
    height: 56px;
    box-sizing: border-box;
    padding: 10px 20px;
    text-align: left;
  }
  .index-filter-container .el-input{
  }
  .index-filter-container .el-button{
  }
  /****************************表格***************************/
  .index-main-table{
    padding: 10px 20px;
  }
  .el-table{
    width: 1000px;
    overflow: hidden;
  }
  .el-table-column{
    overflow: hidden;
  }
  .index-main-pagination{
    width: 100%;
  }
  .el-pagination{
    padding: 10px 20px 0 0;
  }
  /***********小动画*********/
  .hiddenClick .index-logo{
    width: 65px;
    overflow: inherit;
  }
  .hiddenClick .index-main-nav{
    width: 65px;
    overflow: inherit;
  }
  .hiddenClick .index-main-content{
    margin-left: 65px;
  }
  .hiddenClick .index-main-content .index-main-table {

  }
  .hiddenClick .index-filter-container {

  }
  .ivu-modal-body{
    text-align: center
  }
</style>
