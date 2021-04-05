<template>
  <section class="signature">
    <div class="signatureBox">
      <div class="canvasBox" ref="canvasHW">
        <canvas @touchstart='touchStart'
                @touchmove='touchMove'
                @touchend='touchEnd'
                ref="canvasRef"
                @mousedown="mouseDown"
                @mousemove="mouseMove"
                @mouseup="mouseUp"></canvas>
        <div class="btnBox">
          <button
              type="default"
              @click="overwrite"
              >重写</button>
          <button
              size="small"
              type="primary"
              @click="commit"
              >
                
              提交签名
          </button>
        </div>   
      </div>
    </div>
  </section>    
</template>

<script lang='ts'>
import { reactive, ref, onMounted, defineComponent } from "vue"


export default defineComponent({
  name: 'signature',
  setup(){

    const canvasRef = ref(null)
    const canvasHW = ref(null)

    const data = reactive({
      client: {},
      points: [],
      canvasTxt: null,
      startX: 0,
      startY: 0,
      moveY: 0,
      moveX: 0,
      endY: 0,
      endX: 0,
      w: null,
      h: null,
      isDown: false,
      // isViewAutograph: this.$route.query.isViews > 0,
      // contractSuccess: this.$route.query.contractSuccess
    })

    onMounted(() => {
      let canvas = canvasRef.value
      canvas.height = canvasHW.value.offsetHeight - 160
      canvas.width = canvasHW.value.offsetWidth - 20
      data.canvasTxt = canvas.getContext('2d')
    }) 

    const handleUpload = (data) =>{
      data.fileUrl.push(data)
    }

    const backHome = () => {
      window.history.back()
    }

     //电脑设备事件
    const mouseDown = (ev) => {
      ev = ev || event
      ev.preventDefault()
      if (1) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        data.startX = obj.x
        data.startY = obj.y
        data.canvasTxt.beginPath()
        data.canvasTxt.moveTo(data.startX, data.startY)
        data.canvasTxt.lineTo(obj.x, obj.y)
        data.canvasTxt.stroke()
        data.canvasTxt.closePath()
        data.points.push(obj)
        data.isDown = true
      }
    }

     //移动设备事件
    const touchStart = (ev) => {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clientX,
          y: ev.targetTouches[0].clientY - 48
        }
        data.startX = obj.x
        data.startY = obj.y
        data.canvasTxt.beginPath()
        data.canvasTxt.moveTo(data.startX, data.startY)
        data.canvasTxt.lineTo(obj.x, obj.y)
        data.canvasTxt.stroke()
        data.canvasTxt.closePath()
        data.points.push(obj)
      }
    }

        //电脑设备事件
    const mouseMove = (ev) => {
      ev = ev || event
      ev.preventDefault()
      if (data.isDown) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        data.moveY = obj.y
        data.moveX = obj.x
        data.canvasTxt.beginPath()
        data.canvasTxt.moveTo(data.startX, data.startY)
        data.canvasTxt.lineTo(obj.x, obj.y)
        data.canvasTxt.stroke()
        data.canvasTxt.closePath()
        data.startY = obj.y
        data.startX = obj.x
        data.points.push(obj)
      }
    }

    //移动设备事件
    const touchMove = (ev) => {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clientX,
          y: ev.targetTouches[0].clientY - 48
        }
        data.moveY = obj.y
        data.moveX = obj.x
        data.canvasTxt.beginPath()
        data.canvasTxt.moveTo(data.startX, data.startY)
        data.canvasTxt.lineTo(obj.x, obj.y)
        data.canvasTxt.stroke()
        data.canvasTxt.closePath()
        data.startY = obj.y
        data.startX = obj.x
        data.points.push(obj)
      }
    }

        //电脑设备事件
    const mouseUp = (ev) => {
      ev = ev || event
      ev.preventDefault()
      if (1) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        data.canvasTxt.beginPath()
        data.canvasTxt.moveTo(data.startX, data.startY)
        data.canvasTxt.lineTo(obj.x, obj.y)
        data.canvasTxt.stroke()
        data.canvasTxt.closePath()
        data.points.push(obj)
        data.points.push({x: -1, y: -1})
        data.isDown = false
      }
    }

        //移动设备事件
    const touchEnd = (ev) => {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clientX,
          y: ev.targetTouches[0].clientY - 48
        }
        data.canvasTxt.beginPath()
        data.canvasTxt.moveTo(data.startX, data.startY)
        data.canvasTxt.lineTo(obj.x, obj.y)
        data.canvasTxt.stroke()
        data.canvasTxt.closePath()
        data.points.push(obj)
        data.points.push({x: -1, y: -1})
        // debugger
        // data.imgUrl =
        //   (canvasRef.value && canvasRef.value.toDataURL()) || ''
      }
    }

     //重写
    const overwrite = () => {
      data.canvasTxt.clearRect(
        0,
        0,
        canvasRef.value.width,
        canvasRef.value.height
      )
      data.points = []
    }

     //提交签名
    const commit = () => {
      const res = canvasRef.value.toDataURL() //签名
      console.log('sign success');   
    }

    return {
      canvasRef,
      canvasHW,
      data,
      handleUpload,
      backHome,
      mouseDown,
      touchStart,
      mouseMove,
      touchMove,
      mouseUp,
      touchEnd,
      overwrite,
      commit
    }

  },

})
</script>

<style scoped>
.signatureBox {
  position: absolute;
  top: 50px;
  left: 0px;
  width: 100%;
  height: calc(100% - 50px);
  box-sizing: border-box;
  overflow: hidden;
  background: #fff;
  z-index: 100;
  display: flex;
  flex-direction: column;
}
.visaDetailTop {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  z-index: 2;
}
.visaDetailTop p {
  margin: 0px;
  text-align: center;
  color: #000;
  font-size: 1em;
  position: relative;
}
p.visaTitle {
  width: 100%;
  position: absolute;
  top: 5px;
  left: 0px;
  text-align: center;
  font-size: 1.2em;
}
.btnBack {
  display: block;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: transparent;
  border-color: transparent;
  outline: none;
}
.btnDaoHang {
  display: block;
  position: absolute;
  left: 0px;
  top: 0px;
  height: 2.2em;
  width: 2em;
  z-index: 1;
  background: transparent;
  border-color: transparent;
  outline: none;
}
.visaDetailTop p span {
  color: #fff;
  font-size: 1.2em;
}
.visaDetailTop p:first-of-type {
  float: left;
}
.visaDetailTop p:nth-of-type(2) {
  float: right;
}
.canvasBox {
  padding: 10px 5px;
  box-sizing: border-box;
  flex: 1;
}
canvas {
  border: 1px solid #e3e3e3;
}
.btnBox {
  /*height: 30px;*/
  padding: 5px;
  text-align: right;
  /*line-height: 30px;*/
}
.btnBox button:first-of-type {
  background: transparent;
  border-radius: 4px;
  height: 40px;
  width: 80px;
  font-size: 14px;
  /*padding: 5px 10px;*/
}
.btnBox button:last-of-type {
  background: #71b900;
  color: #fff;
  border-radius: 4px;
  height: 40px;
  width: 80px;
  font-size: 14px;
  /*padding: 5px 10px;*/
}
button {
  border: 1px solid #71b900;
  cursor: pointer;
  /* border: 0; */
  outline: none;
}
button:hover{
  background-color: mediumaquamarine;
}
@media only screen and (min-width: 750px) {
  .signatureBox {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    overflow: visible;
  }
}
</style>