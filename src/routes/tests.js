const express = require('express');
const router = express.Router();

router.get('/info', (req, res)=>{
    res.send(`<div>
                <h3>Object Process Information</h3>
                <h3>Project File: </h3> <p>${process.cwd()}</p>
                <h3>Execution Path: </h3><p> ${process.execPath}</p>
                <h3>Platform name: </h3><p> ${process.platform}</p>
                <h3>Execution Argument: </h3><p>${process.argv}</p>
                <h3>Node Version: </h3><p>${process.version}</p>
                <h3>Process Id: </h3><p>${process.pid}</p>
                <h3>Memory Usage: </h3><p>${process.memoryUsage.rss()}</p>
            </div>`)
});

router.get("/datos",(req,res)=>{
    res.send(`<h1>soy el servidor express con datos corriendo en el proceso  ${process.pid}</h1>`)
})

router.get('/api/randoms/:num',(req, res)=>{
    try{
        if(PORT === 8081 || PORT === 8082 || PORT === 8083 || PORT === 8084 || PORT === 8085){
            let param =  req.params.num;
            randomNumbers =[];
            for(let i=0; i<param; i++){ 
                let randomIndex = Math.floor((Math.random(param) * 1000) + 1); 
                randomNumbers.push(randomIndex)
            }
            res.send({randomNumbers});
            console.log(`${randomNumbers} running on process ${process.pid} on port ${PORT}`) 
        }
    }
    catch (error) {
        console.log(error);
    } 

})

module.exports = router;
