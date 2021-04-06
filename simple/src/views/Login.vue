<template>
  
    <header class="header">
      <h1>简单签到系统</h1>
    </header>

    <main class="main">

      <div class="login-area" v-if="loginData.isLogin">

        <h3>{{ loginData.title }}</h3>
        <Input v-model="loginData.account" placeholder="请输入账号"></Input>
        <Input type="password" v-model="loginData.passwd" placeholder="请输入密码"></Input>
        <div class="login-area-btn">
          <Button title="登录" @btnClick="loginClick"></Button>
          <Button title="注册" @btnClick="loginData.isLogin = false"></Button>
        </div>
      </div>
     
      <div class="register-area" v-else>
        <h3>{{ regData.title }}</h3>
        <Input v-model="regData.account" placeholder="请输入账号"></Input>
        <Input type="password" v-model="regData.passwd" placeholder="请输入密码"></Input>
        <Input type="password" v-model="regData.verifyPasswd" placeholder="确认密码"></Input>
        <div class="register-area-btn">
          <Button title="注册" @btnClick="regClick"></Button>
          <Button title="返回" @btnClick="loginData.isLogin = true"></Button>
        </div>
      </div>

    </main>
 
</template>
  
<script lang='ts'>
import { computed, defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import Input from '../components/Input.vue'
import Button from '../components/Button.vue'

import { adminAccount } from '../common/config'

export default defineComponent({
  name: 'Login',
  components: { Input, Button },
  setup(props, ctx) {

    const router = useRouter()

    //上一次登录的账号信息
    const prevAccountKey = '$.prevAccount'
    const prevPasswd = '$.prevPasswd'

    //登录
    const loginData = reactive({
      title: '登录',
      account: window.localStorage.getItem(prevAccountKey) || '',
      passwd: window.localStorage.getItem(prevPasswd) || '',
      isLogin: true
    })
    
    const loginClick = () => {
      const account = window.localStorage.getItem(getAccountKey(loginData.account))
      const passwd = window.localStorage.getItem(getPasswdKey(loginData.account))

      if(loginData.account === ''){
        alert('账号不能为空')
        return
      }

      if(account != loginData.account || passwd != loginData.passwd){
        alert('账号或密码错误')
        return
      }

      window.localStorage.setItem(prevAccountKey, loginData.account)
      window.localStorage.setItem(prevPasswd, loginData.passwd)
      adminAccount.value = loginData.account
      router.push('/main')
      
    }

    //注册
    const regData = reactive({
      title: '注册',
      account: '',
      passwd: '',
      verifyPasswd: '',
    })
    const regClick = () => {

      const accountKey = getAccountKey(regData.account)
      
      const account = window.localStorage.getItem(accountKey)
      
      if(account === regData.account){
        alert('账号已有')
        return
      }

      if(accountKey != null || accountKey != '') {
        
        if(regData.account === ''){
          alert('账号不能为空')
          return
        }

        if(regData.passwd != regData.verifyPasswd){
           alert('两次输入密码不一致')
           return
        } 
               
        window.localStorage.setItem(accountKey, regData.account)
        window.localStorage.setItem(getPasswdKey(regData.account), regData.passwd)
        alert('注册成功')
        loginData.isLogin = true

      }
    
    }

    //生成账号 索引密钥
    const getAccountKey = (account: string) => {
      return account + '.ac'
    }
    //生成密码 索引密钥
    const getPasswdKey = (account: string) => {
      return account + '.pwd'
    }
  
    return { loginData, loginClick, regData, regClick }
  }

})
</script>

<style>
.header {
  flex-grow: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  /* box-sizing: border-box; */
}
.header > h1 {
  padding-top: 150px;
}
.main {
  flex-grow: 9;
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.login-area,
.register-area {
  background-color: #eee;
  padding: 40px;
  width: 200px;
  display: inline;
}
.login-area > .login-area-btn {
  display: flex;
  padding-top: 10px;
  justify-content: space-between;
}
.register-area > .register-area-btn {
  display: flex;
  padding-top: 10px;
  justify-content: space-between;
}
.login-area > h3,
.register-area > h3 {
  color: var(--primary);
  letter-spacing: 5px;
  text-indent: 5px;
}

</style>