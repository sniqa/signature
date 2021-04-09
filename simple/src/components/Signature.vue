<template>
	<div class="signature" 
		ref="signatureRef"
	>
		<canvas class="canvas"
			ref="canvasRef"
			@mousedown="mousedown"
			@mousemove="mousemove"
			@mouseup="mouseup"
			@touchstart="touchStart"
			@touchmove="touchMove"
			@touchend="touchEnd"
		></canvas>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'

interface CanvasData {
	isDraw: boolean,
	prevX: number,		//上一个最标点X
	prevY: number			//上一个最标点Y
}

export default defineComponent({
  name: 'Signature',
  emits: ['canvasReset', 'canvasCommit'],
	setup(props, ctx) {

		const canvas: CanvasData = {
			isDraw: false,
			prevX: 0,
			prevY: 0
		}

		let signatureRef = ref<HTMLLIElement>(null)

		let canvasEle: HTMLCanvasElement 								//canvas元素
		let canvasCtx: CanvasRenderingContext2D = null 	//canvas 上下文
		const canvasRef = ref<HTMLCanvasElement>(null)	//
		
		//画笔
		const brush = (ctx: CanvasRenderingContext2D) => {
			// const gradient = ctx.createLinearGradient(0,0,170,0);
			// gradient.addColorStop(0, "magenta")
			// gradient.addColorStop(0.5, "blue");
			// gradient.addColorStop(1, "red");
			ctx.strokeStyle = '#000'
			ctx.lineWidth = 5
		}

		//画出两个坐标之间的线
		const draw = (x: number, y: number) => {
			canvasCtx.beginPath()
			canvasCtx.moveTo(canvas.prevX, canvas.prevY)
			canvasCtx.lineTo(x, y)		
			canvasCtx.stroke()
			canvasCtx.closePath()
			canvas.prevX = x
			canvas.prevY = y
		}

		//桌面设备
		const pcDraw = (e: MouseEvent) => {
			let x = e.pageX - canvasEle.offsetLeft
			let y = e.pageY	- canvasEle.offsetTop
			draw(x, y)
		}
		const mousedown = (e: MouseEvent) => {
			canvas.isDraw = true
			canvas.prevX = e.pageX - canvasEle.offsetLeft
			canvas.prevY = e.pageY - canvasEle.offsetTop
		}
		const mousemove = (e: MouseEvent) => {
			if(canvas.isDraw){
				pcDraw(e)
			}
		}
		const mouseup = (e: MouseEvent) => {
			canvas.isDraw = false
		}
		
		//移动设备
		const mobilDraw = (e: TouchEvent) => {
			e.preventDefault()
			let x = e.targetTouches[0].pageX - canvasEle.offsetLeft
			let y = e.targetTouches[0].pageY	- canvasEle.offsetTop	
			draw(x, y)
		}
		const touchStart = (e: TouchEvent) => {
			canvas.isDraw = true
			canvas.prevX = e.targetTouches[0].pageX - canvasEle.offsetLeft
			canvas.prevY = e.targetTouches[0].pageY	- canvasEle.offsetTop
		}
		const touchMove = (e: TouchEvent) => {
			if(canvas.isDraw) { mobilDraw(e) }
		}
		const touchEnd = (e: TouchEvent) => {
			canvas.isDraw = false
			// mobilDraw(e)
		}

		// //新建空白画布，用来判断画布是否为空
		const blankCanvas = document.createElement('canvas')

		//重置
		const reset = () => {
			canvasCtx.clearRect(0, 0, canvasEle.width, canvasEle.height)
		}

		const commit = () => {
			const img = canvasEle.toDataURL()
			if(blankCanvas.toDataURL() == img){
				return false
			}
			return img
		}

		ctx.emit('canvasReset', reset)
		ctx.emit('canvasCommit', commit)

		//初始化
		onMounted(() => {
			let signatureEle = signatureRef.value
			canvasEle = canvasRef.value	
			canvasCtx = canvasEle.getContext('2d')
			canvasEle.width = signatureEle.clientWidth
      canvasEle.height = signatureEle.clientHeight
			brush(canvasCtx)

			//监测页面是否发送重绘
			window.addEventListener('resize', resize)

			//空白画布设置大小
			blankCanvas.width = canvasEle.width
    	blankCanvas.height = canvasEle.height
		})


		//当canvas重新调整大小时,会重置图案和设置,移动设备表现当在该界面使用输入法时会重置
		//该方法在重新调整canvas大小将原数据保存并在重新调整大小之后将原图案重绘回画布上，
		//以及重新设置画笔
		const resize = () => {
			const imgData = canvasCtx.getImageData(0, 0, canvasEle.width, canvasEle.height)
			let signatureEle = signatureRef.value
			canvasEle.width = signatureEle.clientWidth
      canvasEle.height = signatureEle.clientHeight
			canvasCtx.putImageData(imgData, 0, 0);
			brush(canvasCtx)
		}

		onUnmounted(() => {
			window.removeEventListener('resize', resize)
		})

		return { mousedown, mousemove, mouseup, canvasRef, touchStart, touchMove, touchEnd, signatureRef }
	}	
})
</script>

<style>
.signature {
	flex-grow: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	/* min-width: 450px; */
	/* min-height: 400px; */
}
.canvas {
	border: 1px solid rgb(37, 97, 175);
	height: 100%;
	width: 100%;
	box-sizing: border-box;
}
</style>