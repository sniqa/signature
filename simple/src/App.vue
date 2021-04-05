<template>
 
    <router-view></router-view>

</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
  /* overflow: hidden; */
  display: flex;
  flex-direction: column;
  min-height: 500px;
  min-width: 350px;
}
* {
  margin: 0;
  padding: 0;
}
</style>