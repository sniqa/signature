<template>
  <div class="main-page">

		<header class="main-page-header">
			<div class="main-page-header-account" ref="accountRef">
				<label for="account">用户 : </label>
				<button id="account" 
					class="main-page-header-account-login"
					@click="accountClick"	
				>{{ adminAccount }}</button>
				<button 
					class="main-page-header-account-logout"
					@click.prevent="logout"
					ref="logoutRef"
					v-if="state.isShowLogout"
				>注销</button>
			</div>

			<div class="main-page-header-btn">
				<button @click="create">新建签到</button>
    		<button @click="history">历史记录</button>
			</div>	
		</header>

		<!-- <main class="main-page-main">
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
		</main> -->

		<main class="main-page-main">
			<router-view v-slot="{ Component }">
				<keep-alive>
					<component :is="Component" />
				</keep-alive>
			</router-view>
		</main>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useStore } from '../store'

import { adminAccount } from '../common/config'

import { uid } from '../common/utils'

export default defineComponent({
  name: 'Main',
  components: {
  },
	setup(){

		const router = useRouter()
		const store = useStore()

		const state = reactive({
			isShowLogout: false,
			isHistory: false
		})

		const create = () => {
			store.commit('setSubjectID', uid())
			router.push('/main/create')
		}

		const history = () => {
			router.push('/main/history')
		}

		const accountClick = () => {
			state.isShowLogout = !state.isShowLogout
		}



		const logoutRef = ref<HTMLElement>(null)
		const accountRef = ref<HTMLElement>(null)

	
		//注销操作
		const logout = (e: MouseEvent) => {
			if(e.target === logoutRef.value){
				adminAccount.value = ''
				window.removeEventListener('click', logoutBtn)
				router.push('/login')
			}
			return
		}
 
		//当logout按钮显示的时候，如果点击在其他区域，则隐藏按钮
		const logoutBtn = (e: MouseEvent) => {
			if(accountRef.value.contains(e.target as HTMLElement) ){
				return
			}
			state.isShowLogout = false
		}

		//监视logout按钮是否显示，当显示的时候添加一个事件
		watch(() => state.isShowLogout, () => {
			if(state.isShowLogout){
				window.addEventListener('click', logoutBtn)
				return
			}
			window.removeEventListener('click', logoutBtn)
		})


		return { adminAccount, state, create, history, accountClick, logout, accountRef, logoutRef }
	}
})
</script>

<style>
.main-page-header {
	position: relative;
	box-sizing: border-box;
	padding: 0 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 60px;
	color: var(--color-primary);
	background-color: var(--primary);
}

.main-page-header-account > label {
	margin: 10px;
}

.main-page-header-account-login {
	padding: 6px;
	cursor: pointer;
	position: relative;
	background-color: transparent;
	color: var(--color-primary);
	/* border: 1px solid var(--color-primary); */
	border: 0;
	outline: none;
}

.main-page-header-account-login::before {
	--angle: 6px;
	position: absolute;
	content: "";
	display: block;
	top: 50%;
	margin-top: calc(var(--angle) / 3 * -1);
	right: calc(var(--angle) * -2);
	border-top: var(--angle) solid var(--color-primary);
	border-left: var(--angle) solid transparent;
	border-bottom: var(--angle) solid transparent;
	border-right: var(--angle) solid transparent;
}

.main-page-header-account-logout {
	position: absolute;
	top: 105%;
	left: 90px;
	border: 1px solid var(--primary);
	background-color: transparent;
	z-index: 99;
	outline: none;
	color: var(--primary);
	border-radius: 5px;
	width: 60px;
	padding: 10px;
	box-sizing: border-box;
	cursor: pointer;
}

.main-page-header-account-logout:hover {
	background-color: var(--primary);
	color: var(--color-primary);
}

.main-page-header-btn > button {
	outline: none;
	margin: 6px;
	cursor: pointer;
	background-color: var(--color-primary);
	border: 0;
	color: var(--primary);
	padding: 10px;
}

.main-page-header-btn > button:hover {
	background-color: var(--primary);
	color: var(--color-primary);
	border: 1px solid var(--color-primary);
	box-sizing: border-box;
}

.main-page {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
}

.main-page-main{
	flex-grow: 1;
	display: flex;
}
</style>