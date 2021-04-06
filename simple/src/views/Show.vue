<template>
  <div class="show-signatrues">
      <button @click="returnCreate">
				返回二维码界面
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

import Button from '../components/Button.vue'

import CheckedIn from '../components/CheckedIn.vue'

import wsServer, { memberURL } from '../common/ws'

import { PersonInfos } from '../common/indexedDB'

export interface Person extends PersonInfos {
  personID: string
}

export default defineComponent({
  name: 'Show',
  components: {
		CheckedIn,
    Button
  },
  setup(){
		const router = useRouter()

    const returnCreate = () => {
			router.push('/main/create')
		}

		const data = reactive<Array<Person>>([]) 

		const ws = wsServer(memberURL)

		ws.onmessage = (e) => {
      const newData = JSON.parse(e.data)
      for(let i = 0, len = data.length; i < len; i++){
        if(data[i].personID === newData.personID || data[i].person === newData.person){
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
/* .show-signatrues > button {

} */
</style>