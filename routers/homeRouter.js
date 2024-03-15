const express = require('express')
const router = express.Router()


router.get('/', (req,res)=>{
    res.render('index.pug',{title:"Students RPS", message:"Welcome"})
    // res.status(200).send('Homepage');
})


module.exports = router