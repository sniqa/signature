<template>
  <div class="show-signatrues">
      <button @click="returnCreate">
				返回二維碼界面
			</button>

			<CheckedIn 
				v-for="item in data"
				:title="item.title"
				:signature="item.signature"
			></CheckedIn>


  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'

import CheckedIn from '../components/CheckedIn.vue'

import wsServer, { memberURL } from '../common/ws'


interface Data {
  id: string
  title: string
  signature: string
}

export default defineComponent({
  name: 'Show',
  components: {
		CheckedIn
  },
  setup(){
		const router = useRouter()

    const returnCreate = () => {
			router.push('/main/create')
		}

		const data = reactive<Array<Data>>([]) 

		const ws = wsServer(memberURL)

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

		return { returnCreate, data }
  }
})
</script>

<style>

</style>