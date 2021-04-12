<template>
  <div class="create-page">

		<!-- 初始化主题和WiFi -->
		<section class="create-page-operate"
			v-if="state.isCreateSubject"
		>

			<!-- 写入标题 -->
			<div class="create-page-subject">
				<input type="text" name="" id=""
					:value="subject"
					@change="createSuject"
					placeholder="点击添加主题"
				>

				<button @click="subjectBtn">确定</button>
			</div>

			<!-- 默认WIFI -->
			<div class="create-paga-wifi">

				<h3>局域网WiFi</h3>

				<div class="create-paga-wifi-account">
					<label for="wifiac">WiFi账号：</label>
					<input type="text" id="wifiac" @change="wifiac" :value="wifi.account">
				</div>
				
				<div class="create-paga-wifi-passwd">
					<label for="wifipwd">WiFi密码：</label>
					<input type="text" id="wifipwd" @change="wifipwd" :value="wifi.passwd">
				</div>
				
			</div>
		</section>


		<!-- 显示二维码 -->
		<section class="create-page-show"
			v-else
		>

			<div class="show-title">
				<span>主题: </span>
				<span class="convansation-title">{{ subject }} </span>
				<button @click="state.isCreateSubject = true">修改</button>
			</div>
			
			<div class="show-qrcode">
				<div class="show-qrcode-wifi">
					<h2>第一步: &nbsp;&nbsp;&nbsp;加入局域网</h2>
					<QRcode 
						:size="500"
						:msg="wifiQRcode"
					></QRcode>

					<h2>或者搜索WiFi加入:</h2>
					<p>WiFi账号：{{ wifi.account }}</p>
					<p>WiFi密码：{{ wifi.passwd }}</p>
				</div>

				<div class="show-qrcode-signature">
					<h2>第二步:&nbsp;&nbsp;&nbsp;进行签到</h2>
					<QRcode 
						:size="500"
						:msg="signinQRcode"
					></QRcode>

					<div class="show-signature-btn">
						<button @click="goSignature">显示已签到</button>
					</div>
				</div>
			</div>

		</section>
    
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import QRcode from '../components/QRcode.vue'

import { adminAccount, signinQRcode, str_encrypt } from '../common/config'

import wsServer, { memberURL } from '../common/ws'

import { Subjects } from '../common/indexedDB'

import { useStore, PersonState } from '../store'

import { uid } from '../common/utils'

export default defineComponent({
  name: 'Create',
  components: {
		QRcode
  },
	setup(){
		//创建ws服务
		const ws = wsServer(memberURL)

		const router = useRouter()
		const store = useStore()

		const state = reactive({
			isCreateSubject: true,
		})
		

		const wifi = reactive({
			account: window.localStorage.getItem(adminAccount.value + '.wifiac'),
			passwd: window.localStorage.getItem(adminAccount.value + '.wifipwd')
		})

		//存储ws接收到的数据
		const personData = reactive<Array<PersonState>>([]) 

		const origin = window.location.origin + '/signin/'

		const subject = ref('')

		//新建主题
		const subjectBtn = () => {

			if(subject.value === ''){
				alert('主题不能为空')
				return
			}
			store.commit('setSubjectID', uid()) //创建当前主题的唯一id

			//重置已有的签到
			personData.length = 0
			store.commit('setPersons', [])

			// ws.onopen = function () {
				ws.send(JSON.stringify({
					subject: subject.value,
					subjectID: store.state.subjectID
				}))
			// }
		

			//生成二维码链接
			signinQRcode.value = origin + store.state.subjectID + '/' + str_encrypt(subject.value)
			
			const data: Subjects = {
				subject: subject.value,
				subjectID: store.state.subjectID,			//id为唯一值，没有修改主题不会刷新
				created: new Date().toLocaleString(),
				owner: adminAccount.value
			}

			const subjectTx = store.state.indexedDB.transaction("Subject", "readwrite");
			const subjectStore = subjectTx.objectStore("Subject")
			
			subjectStore.put(data)
			
			state.isCreateSubject = false
		}

		//创建或修改主题
		const createSuject = (e: KeyboardEvent) => {
			subject.value = (e.target as HTMLInputElement).value
		}

		//显示已签到人员
		const goSignature = () => {
			router.push('/main/show')
		}


		ws.onmessage = (e) => {
      const newData = JSON.parse(e.data)
      const personInfoTx = store.state.indexedDB.transaction("PersonInfo", "readwrite")
			const personInfoStore = personInfoTx.objectStore("PersonInfo")
			
			if(newData.subjectID != store.state.subjectID){
				return
			}

      for(let i = 0, len = personData.length; i < len; i++){
				if(personData[i].personID === newData.personID || personData[i].person === newData.person){
					personData[i] = newData
					const personInfoIndex = personInfoStore.index('by_personID')
					const request = personInfoIndex.openCursor(IDBKeyRange.only(newData.personID));
					request.onsuccess = function() {
						const cursor = request.result;
						if (cursor) {
								
							cursor.update(newData)
														
							cursor.continue();
						} else {
							// No more matching records.
													
						}
					}

					store.commit('setPersons', personData)
          return
        }
      }
      personData.push(newData)
			
			personInfoStore.put(newData)
			store.commit('setPersons', personData)
    }

		function wifiac(e: KeyboardEvent) {
			wifi.account = (e.target as HTMLInputElement).value
			window.localStorage.setItem(adminAccount.value + '.wifiac', wifi.account)
		}
		function wifipwd(e: KeyboardEvent) {
			wifi.passwd = (e.target as HTMLInputElement).value
			window.localStorage.setItem(adminAccount.value + '.wifipwd', wifi.passwd)
		}
		
		const wifiQRcode = computed(() => `WIFI:T:WPA;S:${wifi.account};P:${wifi.passwd};;` )


		return  { state, subjectBtn, createSuject, wifi, goSignature, signinQRcode, subject, wifiac, wifipwd, wifiQRcode }
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
	flex-grow: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.create-page-subject {
	width: 100%;
	margin-top: 120px;
	height: 100px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	padding: 0 20px;
}
.create-page-subject > input {
	height: 80%;
	flex-grow: 1;
	outline: none;
	font-size: 36px;
	text-align: center;
	border: 1px dotted #000;
}
.create-page-subject > button {
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
.show-qrcode-wifi > p {
	font-size: 2em;
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

.create-paga-wifi {
	flex-grow: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
.create-paga-wifi label {
	color: var(--primary);
}
.create-paga-wifi input {
	outline: none;
	border: 0;
	border-bottom: 1px solid var(--primary);
	color: var(--primary);
	text-align: center;
	font-size: 1em;
}

.create-paga-wifi > div {
	margin: 10px;
}
.create-paga-wifi > h3 {
	color: var(--primary);
	margin: 20px;
}
</style>