const baseUrl = 'ws://' + window.location.hostname + ':8080'

export const commitURL = baseUrl + '/commit'
export const memberURL = baseUrl + '/member'


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