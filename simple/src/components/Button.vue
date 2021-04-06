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
  padding: 6px 15px;
  border-radius: 25px;
  outline: none;
  text-indent: 5px;
  letter-spacing: 5px;
  width: inherit;
  box-sizing: border-box;
  color: var(--primary);
  border: 1px solid var(--primary);
  background-color: var(--color-primary);
}
button.button:hover {
  color: var(--color-primary);
  background-color: var(--primary);
}
</style>