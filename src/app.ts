import express,{Application, Request, Response, NextFunction} from 'express'
import pool from './model/db.config'


const app:Application = express()
app.use(express.json())

//create

app.post('/create',(req : Request,res : Response)=>{
    
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
                console.log(results.rows)
            }
        }
    )
})

//read

app.get('/read',(req:Request,res: Response)=>{
    pool.query(
        `select * from userdata order by id asc`,(err,results)=>{
            res.json(results.rows)
        }
    )
})

app.get('/read/:id',(req:Request,res:Response)=>{
    const id = req.params.id
    
    pool.query(
        `select * from userdata
        where id = $1`,[id],(err,results)=>{
            if(err){
                console.log(err)
                res.json(err)
            }else{
                res.json(results.rows[0])
            }
        }
    )
})

//updated

app.put('/read/:id',(req:Request, res:Response)=>{
    const id = req.params.id
    const {username} = req.body
    pool.query(
        `update userdata set username =$1 
        where id= $2 
        returning`,[username,id],(err,results)=>{
            if(err){
                console.log(err)
                res.json(err)
            }else{
                console.log(results.rows)
                res.json('updated')
            }
        }
    )
})

//delete

app.delete('/read/:id',(req:Request,res:Response)=>{
    const id = req.params.id
    pool.query(
       `delete from userdata where id= $1`,[id],(err,results)=>{
           if(err){
               console.log(err);
               res.json(err)
           }else{
               console.log(results);
               res.json('deleted')
           }
       }
    )
})


app.listen(3001, () => console.log('Server connected'))