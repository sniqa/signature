<template>
  <div class="main">this is main page</div>
  <Button></Button>
  <Button></Button>
  <QRcode :msg="url"></QRcode>

  <Show 
    v-for="item in data"
    :title="item.title" 
    :signature="item.signature"
  ></Show>
</template>
  
<script lang='ts'>
import { defineComponent, reactive, ref } from 'vue'
  
import Button from './Button.vue'
import QRcode from './QRcode.vue'
import Show from './CheckedIn.vue'

import wsServer, { memberURL } from '../common/ws'

interface Data {
  id: string
  title: string
  signature: string
}

export default defineComponent({
  name: 'Main',
  components: { Button, QRcode, Show },
  setup(){
    const url = 'http://192.168.0.104:3000/signin'

    const ws = wsServer(memberURL)

    const data = reactive<Array<Data>>([])

    ws.onmessage = (e) => {
      const newData = JSON.parse(e.data)
      for(let i = 0, len = data.length; i < len; i++){
        if(data[i].id === newData.id || data[i].title === newData.title){
          data[i] = newData
          return
        }
      }
      data.push(newData)
    }

    return { url, data }
  }
})
</script>

<style>

</style>