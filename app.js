const express = require('express');
const app = express();
const path = require ('path');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.get("/", (req,res)=>{
    res.render("index.ejs");
})

app.get("/cotacao", (req,res)=>{
    
})

let port = 3000;
app.listen(port, () =>{
    console.log("Server running on port: "+ port);
})