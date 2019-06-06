<template>
  <div class="login-container">
      <!--登录框-->
    <div class="login-wrapper">
      <!--左侧-->
      <!--<div class="login-left">-->
        <!--<div class="logo">-->
          <!--<img class="logo-img" src="../assets/logo.png" alt="">-->
          <!--<div class="title-cn">停车诱导系统</div>-->
          <!--<div class="title-en">Parking Guidance System</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--中间-->
      <!--<div class="login-center">-->
        <!--<div class="line"></div>-->
      <!--</div>-->
      <!--右侧-->
      <div class="login-right">
        <div class="login-form">
          <el-form  :model="loginInfo" :rules="rules" ref="loginInfo" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
            <h3 class="login-title">{{systemName}}</h3>
            <el-form-item prop="username">
              <el-input type="text" v-model="loginInfo.username"  placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="loginInfo.password"  placeholder="请输入密码" ></el-input>
            </el-form-item>
            <el-form-item v-if="requireVerify" prop="verifyCode">
              <el-input type="text" v-model="loginInfo.verifyCode" auto-complete="off"
                        placeholder="请输入验证码" class="w-150" @keyup.enter.native="_submit('loginInfo')">
              </el-input>
              <img :src="verifyUrl" @click="_refreshVerify()" class="verify-pos" />
            </el-form-item>
            <el-button type=""  @click.native="_submit('loginInfo')">登录</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import {mapMutations} from 'vuex'
  import {baseUrl} from 'api/config'
  import {login} from 'api/getData'
  import {apiPost, resetCommonData, handelResponse} from "api/http1"

  export default {
    data() {
      return {
        loginInfo :{
          username: "",
          password: "",
          verifyCode: ""
        },
        systemName: '',
        requireVerify: true,
        verifyUrl: '/api/user/verify',
        verifyImg:  '',
        rules: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          verifyCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        }
      }
    },
    created(){
      this._verifyConfig()
      this._systemName()
    },
    methods: {
      _refreshVerify() {
        setTimeout(() => {
          this.verifyUrl = '/api/user/verify' + '?v=' + moment().unix()
        }, 300)
      },
      //提交
      _submit(form) {
          login(baseUrl + '/user/login', this.loginInfo).then((res) => {
              let username = '', id = '';
              if (res.data.code == 200) {
                this.$router.push('/index')
                resetCommonData(res.data.data)      //设置权限验证
                username = res.data.data.userInfo.username;
                id = res.data.data.userInfo.id;
                Cookies.set('username', username);
                Cookies.set('id', id);
              }else if(res.data.code == -200) {
                this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: "error"
                })
                this.loginInfo.verifyCode = '';
                this._refreshVerify()
              }
          }).catch((err) => {
            console.log(err)
          })
      },
      //图片验证码是否启用
      _verifyConfig() {
        axios.post(baseUrl + '/config/findByCode/show_verify').then((res) => {
          if (res.data.code == 200) {
            if (res.data.data[0].value == 0) {
              this.requireVerify = true;
            }else if(res.data.data[0].value == 1) {
              this.requireVerify = false;
            }
          }
        })
      },
      //系统名称
      _systemName() {
        axios.post(baseUrl + '/config/findByCode/system_name').then((res) => {
          if (res.data.code == 200) {
            this.systemName = res.data.data[0].value
            Cookies.set('systemname', this.systemName);
          }
        })
      }
    }
  }
</script>

<style scoped lang="css" rel="stylesheet/css">
  .login-container{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: url("./bg.png") no-repeat 0 0;
    background-position: center center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login-wrapper{
    padding: 30px 50px;
    background: #fff;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .login-wrapper:hover{
    box-shadow: #80848f 0 0 50px;
  }
  /*****************************左侧*******************************/
  .login-left{
    flex: 1;
    height: 100%;
  }
  .logo{
    height: 100%;
  }
  .logo-img{
    width: 102px;
    height: 109px;
    margin: 80px 0 0 0;
  }
  .title-cn{
    color: #00FFC0;
    font-size: 28px;
    margin-top: 41px;
    letter-spacing: 10px;
  }
  .title-en{
    color: #00FFC0;
    font-size: 12px;
    margin-top: 7px;
    letter-spacing: 2px;
    word-spacing: 15px;
  }
  /*****************************中部*******************************/
  .login-center{
    width: 3px;
    height: 328px;
    background: #113A57;
    margin: 12px 50px;
  }
  /*****************************右侧*******************************/
  .login-right{
    flex: 1;
    height: 100%;
    padding: 0 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .login-title{
    text-align: left;
    font-size: 24px;
    color: #495060;
    font-weight: 400;
    letter-spacing: 1px;
    margin-bottom: 15px;
  }
  .el-input >>> input{
     background: none;
     border: none;
     border-radius: 0px;
     outline: 0px;
     width: 100%;
     height: 50px;
     border-bottom: 2px #dddee1 solid;
     color: #495060;
     padding: 0;
     font-size: 19px;
     position: relative;
   }
  .verify-pos{
    width: 120px;
    height: 50px;
    position: absolute;
    right: 0px;
    top: -10px;
  }
  .el-input >>> input::-webkit-input-placeholder{
    color: #80848f;
  }
  .el-input >>> input:-moz-placeholder{
    color: #80848f;
  }
  .el-input >>> input::-moz-placeholder{
    color: #80848f;
  }
  .el-input >>> input:-ms-input-placeholder{
    color: #80848f;
  }
  .el-button{
    margin-top: 30px;
    width: 350px;
    height: 50px;
    border-radius: 30px;
    border: none;
    background: #2d8cf0;
    color: #fff;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: 3px;
  }
  .el-button:hover{
    color: #fff;
  }
</style>
