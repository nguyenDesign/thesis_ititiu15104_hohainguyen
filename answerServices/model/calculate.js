var express = require('express')
var app = express()
var amqp = require('amqplib/callback_api')
var send_result = require('./send_result')
var User = require('../model/user')
mysql = require('mysql')
require('../db/mongoose')
connection = require('../db/mysql')

const calculate = async ()=>{

    amqp.connect('amqp://host.docker.internal', (err,conn)=>{
        if (err){
            console.log('error at connect '+err)
        }
        conn.createChannel((err,ch)=>{
            if (err){
                console.log('err at create chanel: '+err)
            }
            var queue = 'answer_calculation'
            
            ch.assertQueue(queue, {durable: true})
            ch.consume(queue,async (message)=>{
                sum = 0
                message = message.content.toString()
                message = JSON.parse(message)
                console.log(message)
                sum = parseInt(message['q1']) + parseInt(message['q2']) + parseInt(message['q3']) + parseInt(message['q4'])

                // Status define
                if (sum > 10){
                    status = 'Good'
                }else if (sum > 5){
                    status = 'Normal'
                }else if (sum > 3){
                    status = 'Bad'
                }else{
                    status = 'Danger'
                }
                // another information
                email = message['email']
                time = Date(Date.now())
                user = await User.findOne({email:email})
                user.isSubmit = true
                await user.save()
                doctor = user.managed_by
                // Message define
                queue_msg = {
                    email: email,
                    status: status,
                    time: time,
                    managed_by: doctor
                }
                send_result(queue_msg)
            },{noAck:true})
            
        })
    })
}
module.exports = calculate

