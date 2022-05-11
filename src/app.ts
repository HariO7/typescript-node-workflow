import express,{Application, Request, Response, NextFunction} from 'express'
import pool from './model/db.config'


const app:Application = express()
app.use(express.json())

app.post('/create',(req : Request,res : Response)=>{
    console.log(req.body);
    
    const {username,city,country,hobby,pin} = req.body
    const id:number = Math.floor(Math.random() * 9999)
    pool.query(
        `insert into userdata (id,username,city,country,hobby,pin)
        values($1,$2,$3,$4,$5,$6)
        returning id`,
        [id,username,city,country,hobby,pin],(err,results) =>{
            if(err){
                console.log(err)
                res.json(err)
            }else{
                res.json('user created')
                res.json(results.rows)
            }
        }
    )
})

app.listen(3001, () => console.log('Server connected'))