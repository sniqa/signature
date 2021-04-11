<template>
  <div class="checkedin-content">
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
.checkedin-content {
	margin: 10px;
	display: inline-flex;
	/* flex-grow: 1; */
	border: 1px solid #000;
	width: 300px;
}
.checkedin-content p.person {
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 100px;
	margin: 0;
	border-right: 1px solid #000;
}
.checkedin-content > .signature {
	flex-grow: 1;
	height: 120px;
	width: 200px;
}
</style>