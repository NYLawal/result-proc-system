const express = require('express');
const app = express();
const connectDB = require('./db/connect')
require('dotenv').config();
const router = require('./routers/studentRouter');
const errorHandler= require('./middleware/errorHandler')

app.use(express.json());



app.get('/', (req,res)=>{
    res.status(200).send('Homepage');
})
app.use('/student', router )
app.use(errorHandler)

const port = process.env.PORT || 5000
async function start(){
    try {
        await connectDB(process.env.Mongo_URI)
        app.listen(port, console.log(`server listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}
start()
// app.listen(5000, ()=>{
//     console.log('server listening on port 5000');
// })