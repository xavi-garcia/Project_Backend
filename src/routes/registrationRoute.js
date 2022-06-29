const express = require('express');
const session = require('express-session');

const router = express.Router();
const path = require('path');
const app = express();
//passport
const passport = require('passport');
//Log4js
const log4js = require('log4js');
const loggersConfig = require('../config/log4js');
const logger = log4js.getLogger();

const publicPath = path.join(__dirname+"/public");


app.use(express.static(publicPath));

router.get('/', (req,res)=>{
    res.sendFile(publicPath+ '/index.html')
});

router.get('/signup', (req,res)=>{
    res.sendFile(publicPath+ '/signup.html')
});

router.get('/login', (req,res)=>{
    res.sendFile(publicPath+ '/login.html')
});

router.get('/logout',(req,res)=>{
  req.logOut();
  req.session.destroy();
  res.redirect('/');
})

router.get('/profile', (req,res)=>{
    res.sendFile(publicPath+ '/profile.html')
});

router.get('/error', (req, res)=>{
  res.sendFile(publicPath+ '/error.html')
})

router.post("/signupForm", passport.authenticate('registro',{
    failureRedirect: '/error.html'
}),(req, res)=>{
    res.redirect("/profile")
    logger.info(req.body)
})

router.post("/loginForm", passport.authenticate('login',{
  failureRedirect: '/error.html',
  failureMessage: true
}),(req, res)=>{
  res.redirect("/profile")
  logger.info(req.body)
})