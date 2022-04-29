const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy

const app = express();

app.listen(8080,()=>{console.log('Listening on Port 8080')});

//Archivos estaticos
const publicPath = path.join(__dirname+"/public");
app.use(express.static(publicPath));

//Configuración de req.body
app.use(express.json());
//Middleware que nos permite leer los datos enviados por formularios sin esto express no interpreta la info
app.use(express.urlencoded({extended:true}));

 const URL = "mongodb+srv://javier:123@codercluster.mmv7k.mongodb.net/passportdb?retryWrites=true&w=majority";
 mongoose.connect(URL, {
    useNewUrlParser: true, useUnifiedTopology: true
 }, error=>{
     if(error) throw new Error('Cannot connect');
     console.log("db connected")
 });

//Crear sesión
app.use(session({
    secret:'myappnodejs',
    resave:true, //en verdadero significa que aunque no haya sido modificada la vamos a volver a guardar
    saveUninitialized:true// aunque no le guardemos nada se va a guardar
}));

//Configurar passport para la sesión
//Inicializar passport
app.use(passport.initialize());

//Vincular esta sesión con passport
app.use(passport.session());

//Serialización
passport.serializeUser((user, done)=>{
    return done(null, user.id)
});

//Deserialización
passport.deserializeUser((id, done)=>{
    User.findById(id,(err,user)=>{
        return done(err, user)
    })
});

const createHash = (password) =>{
    return bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10)
    )
}

//Estrategia con passport de registro
passport.use('registro', new LocalStrategy(
    {
        passReqToCallback: true
    },
    (req, username, password, done)=>{
        User.findOne({username:username},(err, user)=>{
            if(err) return done(err)
            if(user) return done(null, false, {message:"user already exists"});
            const newUser = {
                name: req.body.name,
                username: username,
                password: createHash( password)
            }
            User.create(newUser,(err, userCreated)=>{
                if(err) return done (err);
                return done(null, userCreated)
            })
        })
    }

))

//Estrategia con passport de login
passport.use('login', new LocalStrategy(
  {
      passReqToCallback: true
  },
  (req, username, password, done)=>{
      User.findOne({username:username},(err,userFound)=>{
          if(err) return done(err);
          //validamos si el usuario no existe
          if(!userFound) return done(null, false, {message:"user does not exists"})
          //si encuentra el usuario, verificamos la contrasena
          if(!bcrypt.compare(password, userFound.password)){
              return done(null, false,{message:"invalid password"})
          }
          //abrir la sesion con el userFound
          req.session.user = {username: userFound.username}
          done(null, userFound);
      })
  }
))


//routes
app.get('/', (req,res)=>{
    res.sendFile(publicPath+ '/index.html')
});

app.get('/signup', (req,res)=>{
    res.sendFile(publicPath+ '/signup.html')
});

app.get('/login', (req,res)=>{
    res.sendFile(publicPath+ '/login.html')
});

app.get('/logout',(req,res)=>{
  req.logOut();
  req.session.destroy();
  res.redirect('/');
})

app.get('/perfil', (req,res)=>{
    res.sendFile(publicPath+ '/perfil.html')
});

app.get('/error', (req, res)=>{
  res.sendFile(publicPath+ '/error.html')
})

app.post("/signupForm", passport.authenticate('registro',{
    failureRedirect: '/error.html'
}),(req, res)=>{
    res.redirect("/perfil")
    console.log(req.body)
})

app.post("/loginForm", passport.authenticate('login',{
  failureRedirect: '/error.html',
  failureMessage: true
}),(req, res)=>{
  res.redirect("/perfil")
  console.log(req.body)
})