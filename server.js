const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path');

const app = express()

app.use(morgan('dev'))
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use('/api/users/',require('./router/routes'))

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client','build','index.html'))
    })
}

const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    mongoose.connect(`mongodb+srv://${process.env.dbUsername}:${process.env.dbPassword}@cluster0-qzv1e.mongodb.net/Auth-app?retryWrites=true&w=majority`,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
})

