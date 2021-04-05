<template>
  
    <header class="header">
      <h1>简单签到系统</h1>
    </header>

    <main class="main">
      <Input id="account" v-model="data.account" placeholder="账号"></Input>
      <Input id="passwd" v-model="data.passwd" placeholder="密码"></Input>
      <Button title="确定" @btnClick="btnClick"></Button>
    </main>
 
</template>
  
<script lang='ts'>
import { computed, defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'

import Input from '../components/Input.vue'
import Button from '../components/Button.vue'

export const account = computed(() => 'admin') //到处用户账号

export default defineComponent({
  name: 'Login',
  components: { Input, Button },
  setup(props, ctx) {

    const router = useRouter()

    const data = reactive({
      account: window.localStorage.getItem('account'),
      passwd: window.localStorage.getItem('account'),
    })

    const btnClick = () => {

      if(true) {
        router.push('/main')
      }
    }

    return { data, btnClick }
  }

})
</script>

<style>
.header {
  flex-grow: 3;
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
}
</style>