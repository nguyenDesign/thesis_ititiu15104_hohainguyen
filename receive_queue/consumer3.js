var amqp = require('amqplib/callback_api')
mysql = require('mysql')
sendmail = require('./sendmail')
amqp.connect('amqp://localhost', (err,conn)=>{
    if (err){
        console.log('error at connect '+err)
    }
    conn.createChannel((err,ch)=>{
        if (err){
            console.log('err at create chanel: '+err)
        }
        var queue = 'send_mail_d'

        ch.assertQueue(queue, {durable: true})
        ch.consume(queue,(message)=>{
            msg_queue = message.content.toString()
            msg_queue = JSON.parse(msg_queue)
            console.log(msg_queue)
            data = {
                email: msg_queue['email'],
                status: msg_queue['status'],
                date: msg_queue['time'],
                managed_by: msg_queue['managed_by']
            }
        mail_content = `
            Hello,
            Email is sent automatically to notice your health result today.
            The result is 
            `+ data.status
        console.log(data)
        sendmail(data.managed_by, 'Health result of ' + data.email + 'on '+ data.date, mail_content)
        },{noAck:true})

    })
})