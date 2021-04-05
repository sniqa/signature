<template>
  <div class="qrcode">
    <canvas ref="canvasRef"></canvas>
    <img :src="qrcodeSrc" alt="">
  </div>
</template>
  
<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue'
import QRCode from 'qrcode'

export default defineComponent({
  name: 'QRcode',
  props: {
    msg: {
      type: String,
      default: 'hello'
    },
    size: {
      type: Number
    }
  },
  setup(props){
    const qrcodeSrc = ref('')
    // const generateQR = async text => {
    //   qrcodeSrc.value  = await QRCode.toDataURL(text,  { width: 500, height: 500 }) 
    // }
    // generateQR(props.qrcodemsg)
  
    
    const canvasRef = ref(null)
    onMounted(() => {
      QRCode.toCanvas(canvasRef.value, 
        props.msg,
        { width: props.size },
        function (error) {
          if (error) console.error(error)
        // console.log('success!');
      })
    })
    

    return {
      canvasRef,
      qrcodeSrc
    }
  }
})
</script>

<style>

.qrcode > img {
  width: inherit;
  width: inherit;
}
</style>