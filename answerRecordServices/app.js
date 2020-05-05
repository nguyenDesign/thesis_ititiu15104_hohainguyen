// Module require
const express = require('express')
const app = express()
const port = 3004
const auth = require('./middleware/auth')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('./db/mongoose')
// User model
const User = require('./model/user')
const getrecord = require('./model/record')
//Set up environment
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({ extended: false }))  
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json())

//Answer record user interface
app.get('/api/record',auth,async function(req,res){
    user = req.user
    records = await getrecord(user.email)    
    res.render('patientStatusRecord',{user:user, records:records})
})

// Answer record login
app.get('/api/record/login',function(req,res){
    res.render('login')
})

// Answer record verify
app.post('/api/record/verify',async (req,res)=>{
    try{
        const patient = await User.findByCredentials(req.body.email,req.body.password)
        const token = await patient.generateAuthToken()
        res.cookie('auth_token',token)
        res.redirect('/api/record')
    } catch (e) {
        res.status(400).send('Error:'+e)
    }
})

// Log out
app.post('/api/record/logout', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.redirect("/api/record")
    } catch (e) {
        res.status(500).send()
    }
})
app.listen(port,()=>{console.log("Service listen on port "+port)})