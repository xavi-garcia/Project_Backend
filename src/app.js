const express = require('express');
const {Server} = require('socket.io');
const { normalize, schema } = require ('normalizr');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const moment = require('moment');


const ProductsRouter = require('./routes/productsRoute');
const ProductsManagerDB = require ('./Manager/ProductsManager.js');
const MessageManager = require('./Manager/MessageManager.js');


//Services
const productService = new ProductsManagerDB();
const messageService = new MessageManager();
const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>console.log(`Listening on PORT${PORT}`))
const io = new Server(server);

app.use(express.static(__dirname +'/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Session
app.use(cookieParser());
app.use(session({
      store: MongoStore.create({
          mongoUrl: 'mongodb+srv://javier:123@codercluster.mmv7k.mongodb.net/MySessionsDB?retryWrites=true&w=majority',
          ttl: 600
      }),
      secret: 'mongoatlasjavi',
      resave: false,
      saveUninitialized: false,
      cookie: {
          maxAge: 600000
    }
}));

//Router
app.use("/api/products-test", ProductsRouter);


//LogIn and LogOut
app.get('/logout', (req, res) => {
    res.redirect('/logout', {
        username: req.session.username
    });
    req.session.destroy();
});

app.post('/login', async (req, res) => {
    req.session.username = req.body.username
    res.send({message: 'You are logged in!'});
});

app.post('/logout', async (req, res) => {
    const username = req.session.username;
    req.session.destroy();
    res.send({message: 'You logged out!', username});
});

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


