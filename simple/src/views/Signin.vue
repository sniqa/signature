<template>
  <div class="signin-page">

		<h1>{{ subject }}</h1>

		<label for="">请输入姓名：</label>
		<input type="text" name="" id=""
			@change.prevent="onChange"
		>

		<p>电子签名：</p>
		<Signature 
			@canvasReset="canvasReset"
			@canvasCommit="canvasCommit"
		></Signature>

		<div class="control-area">
			<button @click="reset">重置</button>
			<button @click="commit">提交</button>
		</div>
		
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, onUnmounted, ref } from 'vue'

import { useRoute } from 'vue-router'

import Signature from '../components/Signature.vue'

import wsServer, { commitURL } from '../common/ws'

import { uid } from '../common/utils'

import { PersonState } from '../store'

import { str_decrypt } from '../common/config'


export default defineComponent({
  name: 'Signin',
  components: {
    Signature
  },
	setup() {

		const router = useRoute()
		 
		const subjectID = (router.params.subjectID as string)

		console.log(subjectID);
		
		const subject = ref(str_decrypt((router.params.subject as string))) 
		
		const personID = uid()		//生成唯一id，在不关闭网页的时候可使用该id来修改

		//获取输入框的值
		const personName = ref('')
		const onChange = (e) => {
			personName.value = e.target.value
		}

		//创建websocket客户端
		const ws = wsServer(commitURL)

		onUnmounted(() => {
			ws.close()
		})

		ws.onmessage = function (e) {
			switch(e.data) {
				case 'success' :
					alert('签到成功')
					break
				case 'failure' :
					alert('签到失败')
					break
				case 'expired' :
					alert('已过期，请重新扫描二维码')
					break
				default :

			}

		}

		//将Signature组件的canvasReset方法提取出来给父组件使用
		let resetFn: () => void		
		const canvasReset = (fn: () => void) => {
			resetFn = fn
		}
		const reset = () => {
			resetFn()
		}	

		
		//将Signature组件的canvasCommit方法提取出来给父组件使用
		let commitFn: () => string | boolean
		const canvasCommit = (fn: () => string | boolean) => {
			commitFn = fn
		}	
		const commit = () => {
			const res = commitFn()
			if(personName.value.trim() === ''){
				alert('需要输入姓名')
				return
			}
			if(res === false){
				alert('电子签名不能为空白')
				return
			}

			const data: PersonState = {
				subjectID,
				personID, 
				person: personName.value,
				signature: res as string,
				created: new Date().toLocaleString()
			}

			ws.send(JSON.stringify(data))
		}

		return { canvasReset, canvasCommit, reset, commit, onChange, subject }
	}
})
</script>

<style>
.signin-page {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	margin: 10px;
}
.signin-page > h1 {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	padding: 10px;
	box-sizing: border-box;
}
.signin-page > input {
	padding: 0 15px;
	border-radius: 25px;
	margin-bottom: 20px;
	outline: none;
	font-size: 18px;
	line-height: 32px;
	border: 1px solid rgb(37, 97, 175);
}
.signin-page > label,
.signin-page > p
{
	text-align: left;
	margin-bottom: 10px;
}

.control-area {
	display: flex;
	justify-content: space-around;
	align-items: center;
	margin: 10px;
}

.control-area > button {
 	border: 1px solid rgb(37, 97, 175);
	padding: 12px 50px;
	border-radius: 5px;
	outline: none;
	cursor: pointer;
	background-color: rgb(37, 97, 175);
	color: #fff;
	letter-spacing: 5px;
	text-indent: 5px;
}
</style>