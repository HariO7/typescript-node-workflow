import express,{Application, Request, Response, NextFunction} from 'express'
import { ReadVResult } from 'fs'
import { QueryResult } from 'pg'
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

app.post('/comment/:id', (req:Request,res: Response)=>{
    const {company} = req.body
    const id = req.params.id
    pool.query(`
     INSERT INTO usercomment(user_id,company)
     VALUES ($1,$2)
    `,[id,company],(err: Error,results: QueryResult)=>{
        if(err){
            console.log(err);
            res.json('error')
        }else{
            console.log('card added');
            res.json(results.rows)
        }
    })
})

app.get('/comment',(req:Request, res: Response)=>{
    pool.query(`
        SELECT usercomment.user_id,userdata.username,usercomment.company
        FROM userdata
        JOIN usercomment
        ON userdata.id = usercomment.user_id;
    `,[],(err: Error, results: QueryResult)=>{
        if(err){
            console.log(err);
            res.json('error')
        }else{
            res.send(results.rows)
            console.log(results.rows);
            
        }
    })
})

app.get('/comment/:userid',( req: Request,res:Response)=>{
    const userid = req.params.userid
    console.log(userid);
    pool.query(`
    SELECT usercomment.user_id,userdata.username,usercomment.company
    FROM userdata
    JOIN usercomment
    ON userdata.id = usercomment.user_id
    WHERE userdata.id = $1
    `,[userid],(err:Error, results:QueryResult)=>{
        if(err){
            res.json(err)
            console.log(err);
        }else{
            console.log(results.rows);
            res.json(results.rows)
            
        }
    })
})




app.listen(3001, () => console.log('Server connected'))