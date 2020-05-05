// Module require
const express = require('express')
const app = express()
const port = 3001
const auth = require('./middleware/auth')
const bodyParser = require('body-parser');
const connection = require('./db/mysql')
const cookieParser = require('cookie-parser')

// Function definition
const getrecord = require('./model/record')
const saveQuestiondata = require('./model/saveQuestiondata')
const getAllQuestiondata = require('./model/getAllQuestiondata')
const getQuestiondata = require('./model/getQuestiondata')
const deleteQuestion = require('./model/deleteQuestiondata')
const editQuestion = require('./model/editQuestiondata')
require('./db/mongoose')


// User model
const User = require('./model/user')

// Set up environment
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({ extended: false }))   // parse application/x-www-form-urlencoded
app.use(bodyParser.json())// parse application/json
app.use(cookieParser())
app.use(express.static(__dirname + '/public'));


// Route define
app.get("/api/addQuestion",auth,function(req,res){
    user = req.user
    res.render("addQuiz",{doctor:user})
})

// Login page
app.get("/api/addQuestion/login",(req,res)=>{
    res.render("login")
})

// Patients record
app.get('/api/addQuestion/doctor/record',auth,async function(req,res){
    user = req.user
    records = await getrecord(user.email)
    
    res.render('patientStatusRecord',{user:user, records:records})
})

app.post("/api/addQuestion/login",async (req,res)=>{
    try {
        const doctor = await User.findByCredentials(req.body.email, req.body.password)
        const token = await doctor.generateAuthToken()
        res.cookie('auth_token',token)
        res.redirect('/api/addQuestion')
    } catch (e) {
        res.status(400).send('Error:'+e)
    }
})
// Receive result from html form and save data into database 
app.post("/api/addQuestion/createQuest",function(req,res){
    info = req.body
    try{
        saveQuestiondata(info,res)
    }catch (e) {
        res.status(400).send('Error:'+e)
    }
})
// Log out 
app.post('/api/addQuestion/logout', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.redirect("/api/addQuestion")
    } catch (e) {
        res.status(500).send()
    }
})

// Manage questions rendering
app.get("/api/addQuestion/manage", (req,res)=>{
    questions = getAllQuestiondata((error, questions)=>{
        res.render('question_update',{questions:questions})
    })
})

// Delete 
app.post("/api/addQuestion/delete/:id", (req,res)=>{
    id = req.params.id
    deleteQuestion(id,res)    
})
// Edit
app.post("/api/addQuestion/edit/:id", (req,res)=>{
    id = req.params.id
    getQuestiondata(id,(error,data)=>{
        question= data[0]
        res.render("editQuiz",{question:question})
    })
})
// Update
app.post("/api/addQuestion/edit/update/:id",(req,res)=>{
    id = req.params.id
    info = req.body
    editQuestion(id,info)
    res.redirect('/api/addQuestion')
})
app.listen(port, () => console.log(`app listening on port ${port}!`))