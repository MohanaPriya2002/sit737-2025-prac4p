const express= require("express");
const app= express();
const fs = require('fs');
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-service' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
      new winston.transports.Console()
    ],
  });

const add = (n1, n2) =>n1+n2
const sub = (n1, n2) =>n1-n2
const multi = (n1, n2) =>n1*n2
const div = (n1, n2) => {
  if(n2==0) return "Error: Division by zero is not allowed"
  return n1/n2
}

app.get("/calculator", (req,res)=>{
    try{
    const n1= parseFloat(req.query.n1);
    const n2=parseFloat(req.query.n2);

    const operation = req.query.operation
    if(isNaN(n1)) {
        logger.error("n1 is incorrectly defined");
        throw new Error("n1 incorrectly defined");
    }
    if(isNaN(n2)) {
        logger.error("n2 is incorrectly defined");
        throw new Error("n2 incorrectly defined");
    }

    let result;
    switch (operation){
      case "add":
        result=add(n1,n2);
        break;
      case "sub":
        result=sub(n1,n2);
        break;
      case "multi":
        result=multi(n1,n2);
        break;
      case "div":
        result=div(n1,n2);
        break;  
      default: logger.error("Invalid Operation. Please use 'add', 'sub', 'multi' or 'div'");
      throw new Error("Invalid Operation")
    }

    logger.info(`Operation:${operation}, '+n1+' and '+n2+' are recieved.`);
    res.status(200).json({statuscode:200, data: result }); 
    } catch(error) { 
        console.error(error)
        res.status(500).json({statuscode:500, msg: error.toString() })
      }
});

const port=3040;
app.listen(port,()=> {
    console.log("hello i'm listening to port " +port);
})