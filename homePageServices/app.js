//Constant variables defined
const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql')
const bodyParser = require('body-parser');
var path = require('path')

//Setting up environment
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({ extended: false }))   // parse application/x-www-form-urlencoded
app.use(bodyParser.json())// parse application/json
app.use(express.static(path.join(__dirname, 'public')));

//Rendering home page
app.get('/',function(req,res){
    res.render('home')
})

//Rendering about us page
app.get('/about',function(req,res){
    res.render('about')
})

//Rendering contact page
app.get('/contact',function(req,res){
    res.render('contact')
})


app.listen(port,()=>{console.log('app listen on port:'+port)})