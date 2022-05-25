calculate = () =>{
    randomNumbersCart =[]; 
    for(let i=0; i<5e9; i++){
        let index = Math.floor((Math.random(10)  * 1000) + 1);
        randomNumbersCart.push(index);
    } 
    return randomNumbersCart
};

process.on("message",parentMsg=>{
    if(parentMsg === "start"){
        const randomNumbers = calculate();
        process.send(randomNumbers)
    }
})