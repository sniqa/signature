<template>
  <div class="show-signatures">

    <div class="show-signatures-btn">
      <button @click="returnCreate">
				返回二维码界面
			</button>
    </div>
      

      <div class="show-signatures-content">
        <CheckedIn 
          v-for="item in store.state.persons"
          :title="item.person"
          :signature="item.signature"
        ></CheckedIn>
      </div>

  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'

import Button from '../components/Button.vue'

import CheckedIn from '../components/CheckedIn.vue'

import { useStore } from '../store/'


export default defineComponent({
  name: 'Show',
  components: {
		CheckedIn,
    Button
  },
  setup(){
		const router = useRouter()

    const store = useStore()

    const returnCreate = () => {
			router.push('/main/create')
		}


		return { returnCreate, store }
  }
})
</script>

<style>
.show-signatures  {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  align-items: center;
}

.show-signatures-btn {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding: 20px;
  box-sizing: border-box;
}

.show-signatures-btn > button {
  cursor: pointer;
  border-radius: 5px;
  padding: 10px;
  border: 1px solid var(--primary);
  background-color: transparent;
  color: var(--primary);
  outline: none;
}
.show-signatures-btn > button:hover {
  background-color: var(--primary);
  color: var(--color-primary);
} 

.show-signatures-content {
  align-self: initial;
  justify-self: initial;
  display: inline-flex;
  flex-wrap: wrap;
  margin: 20px 40px;
  position: relative;
}

.show-signatures-content::after {
  content: '';
  position: absolute;
  display: block;
  clear: both;
}
</style>