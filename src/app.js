const express = require('express');
const {Server} = require('socket.io');

const ProductsManagerDB = require ('./Manager/ProductsManager.js')

//Services
const productService = new ProductsManagerDB();
const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>console.log(`Listening on PORT${PORT}`))
const io = new Server(server);

app.use(express.static(__dirname+'/public'))



io.on('connection', async socket=>{
    console.log('client is online');
    socket.on('sendProduct', async data=>{
       await productService.add(data);
       console.log(data)
       let products = await productService.getAll();
       io.emit('productsLog', products)
    })
})

let log = [];

io.on('connection',(socket)=>{
    socket.broadcast.emit('newUser')
    socket.emit('log', log);

    socket.on('message', data=>{
        log.push(data);
        io.emit('log',log)
    })

    socket.on('registered', data=>{
        socket.emit('log',log);
    })
})

