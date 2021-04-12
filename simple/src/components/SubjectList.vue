<template>
  <div class="subject-list" @click="onClick">
		<div class="subject-list-show">
			<p class="subject">{{ subject }}</p>
 			<p class="created">{{ created }}</p>
		</div>
    <div class="downbtn"></div>
    <div class="delbtn" @click="del">删除</div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SubjectList',
  components: {
  },
	props: {
		subject: String,
		created: String
	},
	emits: ['onClick', 'onDel'],
	setup(props, ctx){
		const onClick = () => {
			ctx.emit('onClick')
		}

		const del = (e) => {
			e.stopPropagation()
			ctx.emit('onDel')
		}
		return { onClick, del }
	}
})
</script>

<style>
.subject-list {
	width: 100%;
	height: 50px;
	border: 1px solid #aaa;
	/* background-color: #eee; */
	border-radius: 5px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	margin: 5px;
	padding: 0 20px;
	box-sizing: border-box;
}
.subject-list-show {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-grow: 1;
}
.subject-list-show >p:nth-child(1) {
	font-weight: bold;
}
.subject-list-show >p:nth-child(2) {
	letter-spacing: 1px;
}

.subject-list > .downbtn {
	position: relative;
	width: 50px;
}
.subject-list > .downbtn::after {
	position: absolute;
	content: '';
	display: block;
	left: 50%;
	margin-left: -5px;
	border-bottom: 5px solid transparent;
	border-right: 5px solid transparent;
	border-left: 5px solid transparent;
	border-top: 5px solid #aaa;
}
.subject-list > .delbtn {
	color: var(--primary);
	cursor: pointer;
}
</style>