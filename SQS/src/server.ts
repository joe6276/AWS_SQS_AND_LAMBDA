import express, { json } from 'express'
import router from './routes/userRoutes'


const app= express()
app.use(json())

app.use('/user', router)


app.listen (4000, ()=>{
    console.log('Server Running...');
})