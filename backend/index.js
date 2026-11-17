const http = require('http')

const server = http.createServer((request, response) => {
    if (request.method === 'GET') {
        response.statusCode = 200;
        response.end('Hola mundo, este es mi primer servidor de NodeJs')
    }
})

server.listen(3000, () => {
    console.log('Servidor ejecutandose en el puerto 3000')
})