const express = require('express');
const {fork} = require("child_process");
const app = express();

app.listen(8080,()=>{console.log('Listening on Port 8080')});

app.get('/', (req, res)=>{
    res.send(`Calculos`)
})

const child = fork("./child.js");

app.get('/api/randoms/:num',(req, res)=>{
    let param =  req.params.num;
    child.send("start");
    if(isNaN(param)) return child.on("message", childMsg=>{
        res.send(`result ${childMsg}`)
    });
    randomNumbers =[];
    for(let i=0; i<param; i++){ 
        let randomIndex = Math.floor((Math.random(param) * 1000) + 1); 
        randomNumbers.push(randomIndex)
    }
    res.send({randomNumbers}); 

})





