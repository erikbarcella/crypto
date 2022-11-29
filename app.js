const express = require('express');
const app = express();
const path = require ('path');
const request = require('request');
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const expressSession = require("express-session");
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use(expressSession({
    secret: "meu_segredo...",
    resave: false,
    saveUninitiaded: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost/dbCurrency", {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {console.log('Conexão estabelecida com o banco!');})
    .catch(err => {console.log("Erro ao conectar com o banco:" + err);});

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

let resposta = {};
let ret = [""];
let values;

app.get('/', async(req,res)=>{

    await request("https://economia.awesomeapi.com.br/last/USD-BRL", (error,response,body)=>{

        if(!error && response.statusCode==200){
            resposta = JSON.parse(body);
            ret[1] = resposta;
            let arr = ret.map(function(obj){
                return Object.keys(obj).map(function(key){
                    return obj[key] 
                })
            })
            values = arr[1].find(element => element)
        }
        res.render('home', {values});
    })
})
        
app.get('/cotacao', async(req,res)=>{
    const{selectOne,selectTwo,quantidade } = req.query;

    await request(`https://economia.awesomeapi.com.br/last/${selectOne+"-"+selectTwo}`, (error,response,body)=>{

        if(!error && response.statusCode==200){
            resposta = JSON.parse(body);
            ret[1] = resposta;
            let arr = ret.map(function(obj){
                return Object.keys(obj).map(function(key){
                    return obj[key] 
                })
            })
            values = arr[1].find(element => element)
        }
        console.log(values);
        res.render('resultado', {values,quantidade,selectTwo,selectOne});
    })
    }
)

app.post("/cotacoes/:id", async(req,res)=>{
    const {id}=req.params;
    await console.log("cheguei aqui"+id);
})

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err){
            console.log(err);
            res.render("register");
        } else {
            passport.authenticate("local")(req, res, ()=>{
                res.redirect("/favoritos");
            });
        }
    })
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/favoritos",
    failureRedirect: "/login"
}));

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

app.get("/cotacoes",  isLoggedIn, (req, res) => {
    res.render("favoritos");
});


let port = 3000;
app.listen(port, () =>{
    console.log("Server running on port: "+ port);
})