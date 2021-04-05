import * as http from 'http'
import * as webSocket from 'ws'

const server = http.createServer()

const memberWSS = new webSocket.Server({ noServer: true })  //

const commitWSS = new webSocket.Server({ noServer: true });

memberWSS.on('connection', function connection(ws) {
	
	ws.on('message', (data) => {
		ws.send(data)
	}) 
 
	memberWSS.on('signin', (data) => {
		
		ws.send(data)
	})
});



commitWSS.on('connection', function connection(ws) {
  ws.on('message', (data) => {
		
		memberWSS.emit('signin', data)
		ws.send('succeed')
	})
});

server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = request.url

	
  switch(pathname){
    case '/member':
			memberWSS.handleUpgrade(request, socket, head, function done(ws) {
				memberWSS.emit('connection', ws, request);
			})
			break

		case '/commit':
			commitWSS.handleUpgrade(request, socket, head, function done(ws) {
				commitWSS.emit('connection', ws, request);
			})
			break

		default: 
			socket.destroy()
			break
  }
    
})

server.listen(8080, () => {
	console.log(`server run at http:192.168.0.104:8080`);
	
});