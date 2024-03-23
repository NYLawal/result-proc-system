require('express-async-errors');
require('dotenv').config();
const startupDebugger = require('debug')('app:startup')   // replaces console.log, use DEBUG=app:* or  DEBUG=app:startup to run
// const dbDebugger = require('debug')('app:db')
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const connectDB = require('./db/connect')
const studentRouter = require('./routers/studentRouter');
const scoreRouter = require('./routers/scoreRouter');
const homeRouter = require('./routers/homeRouter');
const errorHandler= require('./middleware/errorHandler')
const morgan = require('morgan')
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
app.set('view-engine', 'pug')
app.set('views', './views')


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))


if (app.get('env') === 'development' ) {
    app.use(morgan('tiny'))
    startupDebugger('morgan enabled...')
}
app.use('/', homeRouter )
app.use('/api/student', studentRouter )
app.use('/api/score', scoreRouter )
app.use(errorHandler)

 const port = process.env.PORT || 5000
async function start(){
    try {
        const success = await connectDB(process.env.Mongo_URI)
        if (success) console.log('connected')
        app.listen(port, startupDebugger(`server listening on port ${port}`))
    } catch (error) {
        startupDebugger(error)
    }
}
start()

// app.listen(port, ()=>{
//    startupDebugger('server listening on port ' + port);
// })