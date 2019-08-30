<template>
  <div class="ql-login">
    <div class="ql-login__title">
      Waye pro
    </div>
    <div class="ql-login__form">
      <!-- <div slot="header">
        <i class="cqbicon icon-login"></i> 欢迎登录实验室管理端
      </div> -->
      <el-form :model="userForm" ref="form" :rules="rules">
        <el-form-item prop="userName">
          <el-input prefix-icon="wyicon icon-user-o" v-model="userForm.userName" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="wyicon icon-lock" type="password" v-model="userForm.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="kaptcha">
          <el-input style="width:100px" v-model="userForm.kaptcha" placeholder="验证码" maxlength="4"></el-input>
          <img class="ql-login__img" :src="codeUrl" alt="" @click="refreshCode">
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" native-type="submit" :loading="submited" @click.prevent="login" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="footer">
      <!-- <img src="../assets/img/logo-blue.png" alt=""> -->
      <div>Copyright © 2019 上海蔚一信息技术有限公司</div>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import { validCodeUrl } from '@/api/auth'
import { PASSPORD_HASH } from '@/constants/password'
export default {
  data () {
    const validSms = (rule, value, cb) => {
      if (this.needSmsCode && !value && !this.resending) {
        cb(new Error('请输入短信码'))
      } else {
        cb()
      }
    }
    return {
      submited: false,
      codeUrl: validCodeUrl(Date.now()),
      sended: false,
      countTimer: null,
      userForm: {
        userName: '',
        kaptcha: '',
        password: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名' }
        ],
        password: [
          { required: true, message: '请输入密码' }
        ],
        kaptcha: [
          { required: true, message: '请输入验证码' }
        ],
        smsCode: [
          { validator: validSms }
        ]
      }
    }
  },

  mounted () {

  },

  methods: {
    refreshCode () {
      this.codeUrl = validCodeUrl(Date.now())
      this.userForm.kaptcha = ''
    },

    login () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let { userName, password, kaptcha } = this.userForm

          this.submited = true
          password = md5(`${password}${PASSPORD_HASH}`)
          this.$store.dispatch('login', { userName, password, kaptcha }).then((data) => {
            this.submited = false
            this.$router.push({ path: this.$route.query.redirect || '/' })
          }).catch(() => {
            this.refreshCode()
            this.submited = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import "../assets/scss/mixins/mixins.scss";

@include b(login) {
  background: #f0f2f5 url("../assets/img/background.jpg");
  background-size: 100%;
  width: 100%;
  min-height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  background-size:cover;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @include e(form) {
    width: 368px;
    .el-card__body{
      .el-form{
        margin:20px 30px 0;
        .el-input{
          height:45px;
          .el-input__prefix{
            .el-input__icon{
              font-size: 20px;
              position: relative;
              top:-5px;
            }
          }
        }
      }
    }
  }
  @include e(title){
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 56px;
    font-family: "STXingkai";
    font-weight: 700;
    margin-bottom: 60px;
  }
  @include e(img) {
    height: 36px;
    vertical-align: middle;
    position: relative;
    top: -1px;
    border-radius: 3px;
    margin-left: 2px;
  }
  .footer{
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    color: #808695;
    img {
      margin-bottom: 6px;
    }
  }
}
</style>
