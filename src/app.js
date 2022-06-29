const express = require('express');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

//Cluster
const cluster = require("cluster");
const os = require("os");

//Compressor
const compression = require('compression');

//Log4js
const log4js = require('log4js');
const loggersConfig = require('./config/log4js');
const logger = log4js.getLogger();

app.use(session({
    secret:'myappnodejs',
    resave:true, 
    saveUninitialized:true
}));

//Passport
const passport = require('passport');
const initializePassport = require('./config/passportConnection')
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

const publicPath = path.join(__dirname+"/public");
app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(compression());

//Routes
const testsRouter = require('./routes/tests');
const registrationRoutes = require('./routes/registrationRoute')
app.use('/', testsRouter)


//Connection
const URL = "mongodb+srv://javier:123@codercluster.mmv7k.mongodb.net/passportdb?retryWrites=true&w=majority";

const MONGOOSE = mongoose.connect(URL, {
    useNewUrlParser: true, useUnifiedTopology: true
 }, error=>{
     if(error) throw new Error('Cannot connect');
     logger.info("db connected")
});

const port = process.env.PORT || 8080;
const numberCPUs = os.cpus().length;
portService = () =>{
    if(port == 8080){
        app.listen(port,()=>logger.info(`FORK: Listening on PORT: ${port}`));
    } else if (port === 8081) {
        if(cluster.isPrimary){
            for(let i =0; i<numberCPUs;i++){
                cluster.fork();
            }
            cluster.on('exit',(worker, code, signal)=>{
                logger.info(`Process ${worker.process.pid} ended`)
                cluster.fork()
            })
        } else {
            app.listen(port,()=>logger.info(` CLUSTER = running process ${process.pid} on port ${port}`));
        }
    }
}
portService()