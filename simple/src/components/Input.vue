<template>
  <div class="input-area">
    <label :for="id" class="input-label" v-if="title">{{ title }}</label>
    <input 
      v-bind="$attrs"
      class="input"
      :id="id" 
      :value="modelValue"
      @change="onChange"
    >
  </div>  
</template>
  
<script lang='ts'>
import { defineComponent } from 'vue'
  
export default defineComponent({
  name: 'Input',
  props: {
    title: String,
    id: String,
    modelValue: String
  },
  emits: ['update:modelValue'],
  setup(props, ctx){
    const onChange = (e: KeyboardEvent) => {
      const val = (e.target as HTMLInputElement).value
      ctx.emit('update:modelValue', val)
    }

    return { onChange }
  }
})
</script>

<style>
.input-area {
  margin: 20px 0;
}

.input-label {
  display: inline-block;
  width: 4em;
  text-align: justify;
  text-align-last: justify;
  margin: 6px 5px 6px 0px;
  color: var(--primary);
}

input.input {
  padding: 0 10px;
  box-sizing: border-box;
  height: 30px;
  width: 100%;
  border-radius: 25px;
  border: 1px solid var(--primary);
  color: var(--primary);
  outline: none;
}
input::-webkit-input-placeholder{
  color: var(--primary);
}
input::-moz-placeholder{   /* Mozilla Firefox 19+ */
  color: var(--primary);
}
input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
  color: var(--primary);
}
input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
  color: var(--primary);
}

</style>