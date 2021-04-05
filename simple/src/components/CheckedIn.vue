<template>
  <div class="CheckedIn-content">
    <p class="person">{{ title }}</p>
			<img :src="signature" alt="" class="signature">
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CheckedIn',
	props: {
		title: String,
		signature: String
	},
  components: {
  }
})
</script>

<style>
.CheckedIn-content {
	display: flex;
	border: 1px solid #000;
	width: 300px;
}
.CheckedIn-content p.person {
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 100px;
	margin: 0;
	border-right: 1px solid #000;
}
.CheckedIn-content > .signature {
	flex-grow: 1;
	height: 120px;
	width: 200px;
}
</style>