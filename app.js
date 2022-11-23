const express = require('express');
const app = express();
const path = require ('path');
const request = require('request');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

let resposta = {};

app.get('/', (req,res)=>{
    res.render("index");
})

app.get('/cotacao', async(req,res)=>{
    const{selectOne,selectTwo } = req.query;

   await request(`https://economia.awesomeapi.com.br/last/${selectOne+"-"+selectTwo}`, (error,response,body)=>{

        if(!error && response.statusCode==200){
            resposta = JSON.parse(body);
            console.log(resposta);
        }
        res.render("resultado", {resposta});
    })

    }
)

let port = 3000;
app.listen(port, () =>{
    console.log("Server running on port: "+ port);
})