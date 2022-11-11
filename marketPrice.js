const request = require('request');

let moedas = ["USD,BTC,EUR"];
let convert=["BRL"]

function cotacoes(){

    let resposta;
    
    request(`https://economia.awesomeapi.com.br/last/${moedas+"-"+convert}`, (error,response,body)=>{

        if(!error && response.statusCode==200){
            ret = JSON.parse(body);

            console.log(ret);
            
            console.log("PRECO DOLAR: "+ret.USDBRL.bid);
            console.log("PRECO EURO: "+ret.EURBRL.bid);
            console.log("PRECO BTC: "+ret.BTCBRL.bid); 
        }
    })    
}