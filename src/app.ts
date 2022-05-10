import express,{Application, Request, Response, NextFunction} from 'express'

const app:Application = express()
const add = (a:number, b:string):string=> a + b;

app.get('/',(req : Request,res : Response)=>{
    console.log(add(3,'3'));
    res.send('Hello ')
})

app.listen(3000, () => console.log('Server connected'))