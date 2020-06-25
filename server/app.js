const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {MONGOURL} = require('./key')
const PORT = 5000
var cors = require("cors");




mongoose.connect(MONGOURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
   console.log("connected to mongodb")
})
mongoose.connection.on('error',(err)=>{
    console.log("error in connection",err)
 })

require('./model/user')
require('./model/post')

app.use(express.json())
app.use(cors());
app.use(require('./routes/auth'))
app.use(require('./routes/post'));
app.use(require('./routes/user'));



app.listen(PORT,()=>{
    console.log("server on PORT",PORT)
})



