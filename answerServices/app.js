// Libraries declaration
const express = require('express')
const app = express()
const port = 3003
const mysql = require('mysql')
const bodyParser = require('body-parser')
const connection = require('./db/mysql')
const auth = require('./middleware/auth')
const cookieParser = require('cookie-parser')
const path = require('path')
// Import function
const getQuestion = require('./model/getQuestion')
const getDailyQuestion = require('./model/getDailyQuestion')
const getAnswer = require('./model/getAnswer')
const display = require('./model/display')
const send_raw_answer = require('./model/send_raw_answer')
const calculate = require('./model/calculate')
const submitcheck = require('./model/submitcheck')

require ('./db/mongoose')

// Import model
const User = require('./model/user')

// Environment set up
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({ extended: false }))   // parse application/x-www-form-urlencoded
app.use(bodyParser.json())// parse application/json
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));


//get the result from users to choose 
app.post('/api/answer/receive/:email',async function(req,res){
    body = {
        email: req.params.email,
        q1: req.body.q1,
        q2: req.body.q2,
        q3: req.body.q3,
        q4: req.body.q4
    }
    send_raw_answer('answer_calculation', body)
    calculate()
    res.redirect('/api/answer/result')
})

//  Question page
app.get("/api/answer",auth,async function(req,res){
    isSubmit = req.user.isSubmit //check for user current status.
    isSubmit = await submitcheck(isSubmit) //check if it is new day
    if (isSubmit == true){ //user has submit questions today.
        email = req.user.email
        user = await User.findOne({email})
        user.isSubmit = true
        await user.save()
        res.redirect('/api/answer/result')
    }
    if (isSubmit == false){
        qlist = []
        qList = await getQuestion()
        aList = await getAnswer()
        email = req.user.email
        const user = await User.findOne({email})
        for (const element of qList){
            if (user.monthly_quest.includes(element.id)){
                index = qList.indexOf(element)
                qlist = qList.splice(index,1)
            }
        }
        if (qlist.length < 5){
            qlist = await getDailyQuestion()
        }
        for (const element of qList){
            if (element.type == 'Monthly'){
                id = element.id
                await user.monthly_quest_check(id)
            }
        }
        data = await display(qList,aList)
        res.render('quiz',{data:data,user:req.user})
    }
    
})

// Result page
app.get('/api/answer/result',function(req,res){
    res.render('status')
})

// Login page
app.get("/api/answer/login",function(req,res){
    res.render("login")
})

app.post('/api/answer/verify',async (req,res)=>{
    try {
        const patient = await User.findByCredentials(req.body.email, req.body.password)
        const token = await patient.generateAuthToken()
      
        res.cookie('auth_token',token)
        res.redirect('/api/answer')
    } catch (e) {
        res.status(400).send('Error:'+e)
    }
})
app.listen(port, () => console.log(`app listening on port ${port}!`))