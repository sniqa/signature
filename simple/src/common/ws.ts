export const commitURL = 'ws://192.168.1.100:8080/commit'
export const memberURL = 'ws://192.168.1.100:8080/member'


const wsServer = (url: string) => {

	const ws = new WebSocket(url)

	ws.onclose = () => {
  	console.log('ws server close');
	}

	ws.onerror = () => console.log('ws server error')

	ws.onopen = () => {
		console.log('ws server open')
	}

	return ws

}



export default wsServer