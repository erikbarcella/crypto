const express = require('express');
const app = express();
const path = require ('path');
const request = require('request');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

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
        res.render('index', {values});
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
        res.render('resultado', {values,quantidade,selectTwo,selectOne});
    })
    }
)

let port = 3000;
app.listen(port, () =>{
    console.log("Server running on port: "+ port);
})