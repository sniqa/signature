<template>
  <button 
    @click.prevent="onClick"
    class="button"
  >{{ title }}</button>
</template>
  
<script lang='ts'>
import { defineComponent } from 'vue'
  
export default defineComponent({
  name: 'Button',
  props: {
    title: String
  },
  emits: ['btnClick'],
  setup(props, ctx){
    const onClick = () => {
      ctx.emit('btnClick')
    }

    return { onClick }
  }
})
</script>

<style>
button.button {
  cursor: pointer;
  color: #fff;
  padding: 6px 15px;
  border: 0;
  border-radius: 25px;
  outline: none;
  text-indent: 5px;
  letter-spacing: 5px;
  text-align: justify;
  text-align-last: justify;
  width: inherit;
  box-sizing: border-box;
  background-color: rgb(54, 100, 224);
}
</style>