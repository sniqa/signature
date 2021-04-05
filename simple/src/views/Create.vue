<template>
  <div class="create-page">

		<!-- 写入标题 -->
		<section class="create-page-operate"
			v-if="state.isCreateTitle"
		>
			<input type="text" name="" id=""
				:value="state.titleValue"
				@change="createTitle"
				placeholder="点击添加标题"
			>

			<button @click="titleBtn">确定</button>
		</section>

		<!-- 显示二维码 -->
		<section class="create-page-show"
			v-else
		>

			<div class="show-title">
				<span>标题: </span>
				<span class="convansation-title">{{ state.titleValue }} </span>
				<button @click="changeTitle">修改</button>
			</div>
			
			<div class="show-qrcode">
				<div class="show-qrcode-wifi">
					<h2>第一步: &nbsp;&nbsp;&nbsp;加入局域网WIFI</h2>
					<QRcode :size="500"></QRcode>
					<h2>或者</h2>
					<h3>搜索WiFi加入:</h3>
					<p>WiFi账号：{{ wifi.account }}</p>
					<p>WiFi密码：{{ wifi.passwd }}</p>
				</div>

				<div class="show-qrcode-signature">
					<h2>第二步:&nbsp;&nbsp;&nbsp;进行签到</h2>
					<QRcode :size="500"></QRcode>

					<div class="show-signature-btn">
						<button @click="goSignature">显示已签到</button>
					</div>
				</div>
			</div>

		</section>
    
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'

import QRcode from '../components/QRcode.vue'

import { uid } from '../common/utils'
import { account } from './Login.vue'

import request, { Subject } from '../common/indexedDB'

//该界面的唯一id
export const titleID = computed(() => uid())

export default defineComponent({
  name: 'Create',
  components: {
		QRcode
  },
	setup(){
		const state = reactive({
			isCreateTitle: true,
			titleValue: ''
		})

		const wifi = reactive({
			account: '',
			passwd: ''
		})

		const router = useRouter()

		let db: IDBDatabase
		request.onsuccess = function() {
  		db = request.result
			console.log('链接数据库成功');
			
		}



		//新建标题
		const titleBtn = () => {
			if(state.titleValue === ''){
				alert('标题不能为空')
				return
			}

			const tx = db.transaction("Subject", "readwrite");
			const store = tx.objectStore("Subject");

			const data: Subject = {
				title: state.titleValue,
				id: titleID.value,			//id为唯一值，不刷新界面就不会改变
				created: new Date().toLocaleString(),
				owner: account.value
			}

			store.put(data)
			
			state.isCreateTitle = false
		}

		const createTitle = (e: KeyboardEvent) => {
			state.titleValue = (e.target as HTMLInputElement).value
		}

		const changeTitle = () => {
			state.isCreateTitle = true
		}

		const goSignature = () => {
			router.push('/main/show')
		}

		return  { state, titleBtn, changeTitle, createTitle, wifi, goSignature }
	}
})
</script>

<style>
.create-page {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
}

.create-page-operate {
	margin-top: 120px;
	height: 100px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	padding: 0 20px;
}
.create-page-operate > input {
	height: 80%;
	flex-grow: 1;
	outline: none;
	font-size: 36px;
	text-align: center;
	border: 1px dotted #000;
}
.create-page-operate > button {
	margin-left: 20px;
	width: 100px;
	height: 80%;
	background-color: var(--primary);
	color: var(--color-primary);
	border: 0;
	outline: none;
	cursor: pointer;
	letter-spacing: 5px;
	font-size: 24px;
}
.create-page-show {
	flex-grow: 1;
}


.show-title {
	min-height: 60px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid #eee;
	margin: 0 20px;
	box-sizing: border-box;
}
.show-title > button {
	outline: none;
	min-width: 80px;
	border: 1px solid var(--primary);	
	color: var(--primary);
	padding: 10px 15px;
	cursor: pointer;
	background-color: transparent;
	border-radius: 5px;
	letter-spacing: 5px;
	text-indent: 5px;
}
.show-title > button:hover,
.show-signature-btn > button:hover {
	background-color: var(--primary);
	color: var(--color-primary);
}
.show-title > span:nth-child(2) {
	font-size: 24px;
	word-break: break-all;
	padding: 15px 50px;
	line-height: 1.5em;
	box-sizing: border-box;
	font-weight: bold;
}
.show-title > span:nth-child(1) {
	font-size: 18px;
	min-width: 80px;
}
.show-qrcode {
	display: flex;
	flex-direction: row;
	box-sizing: border-box;
	flex-grow: 1;
}

.show-qrcode-wifi,
.show-qrcode-signature {
	width: 50%;
	display: flex;
	flex-grow: 1;
	justify-content: space-between;
	flex-direction: column;
	border-left: 1px solid #eee;
	height: 100%;
}
.show-qrcode-wifi > h2,
.show-qrcode-signature > h2 {
	text-align: left;
	margin: 20px;
}
.show-qrcode-wifi > p {
	margin: 15px 10px 10px 10px;
	font-weight: bolder;
	text-align: left;
	margin-left: 100px;
}
.show-qrcode-wifi > h3 {
	margin: 0;
	font-style: italic;
	font-weight: normal;
}

.show-signature-btn {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin: 150px 20px 0 0;
}
.show-signature-btn > button {
	outline: none;
	border: 1px solid var(--primary);
	color: var(--primary);
	background-color: transparent;
	padding: 20px;
	letter-spacing: 5px;
	text-indent: 5px;
	box-sizing: border-box;
	cursor: pointer;
	border-radius: 5px;
}
</style>