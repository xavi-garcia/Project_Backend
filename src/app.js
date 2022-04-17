const express = require('express');
const {Server} = require('socket.io');
const ProductsRouter = require('./routes/productsRoute');
const { normalize, schema } = require ('normalizr');
const moment = require('moment');
const ProductsManagerDB = require ('./Manager/ProductsManager.js');
const MessageManager = require('./Manager/MessageManager.js');

//Services
const productService = new ProductsManagerDB();
const messageService = new MessageManager();
const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>console.log(`Listening on PORT${PORT}`))
const io = new Server(server);

app.use(express.static(__dirname +'/public'))

//Router
app.use("/api/products-test", ProductsRouter);


//Sockets
io.on('connection', async socket=>{
    console.log('client is online');
    let products = await productService.getAll();
    io.emit("productLog", products);
    socket.on('sendProduct', async data=>{
       await productService.add(data);
       console.log(data)
       let products = await productService.getAll();
       io.emit('productsLog', products)
    })
})

let log = [];
const iLog = [];
const mainLog = {
  id: "xmen",
  name: "Chat Area",
  log: log,
};

io.on("connection", (socket) => {
  socket.emit("chatLog", iLog);
  socket.on("message", (data) => {
    console.log(data);
    data.time = moment().format("HH:mm:ss DD/MM/YYYY");
    iLog.push(data);
    io.emit("chatLog", iLog);
  });

  socket.on("authentication", (data) => {
    data.text.time = moment().format("HH:mm:ss DD/MM/YYYY");
    console.log(data)
    log.push(data);
    console.log(JSON.stringify(normalizedData, null, '\t'))
  });
});


//NORMALIZATION
const author = new schema.Entity("author");
const chatSchema = new schema.Entity("Chat Area", {
  author: author,
  messages: [author],
});

const normalizedData = normalize(mainLog, chatSchema);


