//Define modules 
const express = require('express')
const app = express()
const port = 3002
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs')
const auth = require('./middleware/auth')
const cookieParser = require('cookie-parser')
const path = require('path')

//Import mongodb
require('./db/mongoose')

//Set up environment
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({ extended: false }))  
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));


//User model 
const User = require('./models/user')

//Crud interface

//Admin manage interface rendering
app.get("/api/register",auth ,async (req,res)=>{
    try {
        const users = await User.find({})
        const doctors = await User.find({role: 'doctor'})
        res.render("crud",{users:users,doctors:doctors})
    } catch (e) {
        res.status(500).send()
    }
})

app.get("/api/admin",function(req,res){
    res.render('login')
})

//Authentications of administrator
app.post("/api/admin/login",async(req,res)=>{
    try {
        const admin = await User.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAuthToken()
        res.cookie('auth_token',token)
        res.redirect('/api/register')
    } catch (e) {
        res.status(400).send('Error:'+e)
    }
})

//Add new user
app.post("/api/register/add",function(req,res){
    user = new User(req.body)
    user.save().then(()=>{
        res.status(201).redirect('/api/register')
    }).catch((e)=>{
        res.status(400).jsonp(e.message)
    })
})

//Delete user infomation
app.post("/api/register/delete/:id",async(req,res)=>{
    user = await User.findById({_id:req.params.id})
    if (user.role == 'doctor'){
        // Find patients related to removed doctor and deleted their relationships
        patients = await User.update({managed_by: user.email},{"$set": {managed_by:'None'}}, {"multi":true})
    }
    await User.findOneAndDelete({_id:req.params.id})
    res.redirect('/api/register')
})

//Edit user information
app.post("/api/register/edit/:id", async (req,res) => {
    const user = await User.find({_id: req.params.id})
    if (user[0].role == 'patient'){
        doctors = await User.find({role:'doctor'})
        res.render('edit',{user:user[0],doctors:doctors})
    }else{
        empty = []
        res.render('edit',{user:user[0],doctors: empty})
    }
    
})

//Update user information
app.post("/api/register/edit/update/:id", async (req,res)=>{
    filter = {_id:req.params.id}
    const user = await User.findOne(filter)
    hash_pass = await bcrypt.hash(req.body.password, 8)
    await User.updateOne(filter,{
        name: req.body.name,
        email:req.body.email,
        password:hash_pass,
        phone:req.body.phone,
        managed_by:req.body.managed_by
    })
    
    await user.save().then(()=>{
        res.redirect('/api/register')
    }).catch((e)=>{
        res.send(e)
    })
})
// Log out 
app.post('/api/register/logout', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.redirect("/api/register")
    } catch (e) {
        res.status(500).send()
    }
})
app.listen(port, () => console.log(`app listening on port ${port}!`))