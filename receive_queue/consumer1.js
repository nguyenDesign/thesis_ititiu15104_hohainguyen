var amqp = require('amqplib/callback_api')
mysql = require('mysql')

const connection = mysql.createConnection({
    // host: "host.docker.internal",
    host:"localhost",
    user: "root",
    password:"1234",
    database:"questiondata",
});

amqp.connect('amqp://localhost', (err,conn)=>{
    if (err){
        console.log('error at connect '+err)
    }
    conn.createChannel((err,ch)=>{
        if (err){
            console.log('err at create chanel: '+err)
        }
        var queue = 'answer_record'

        ch.assertQueue(queue, {durable: true})
        ch.consume(queue,(message)=>{
            msg_queue = message.content.toString()
            msg_queue = JSON.parse(msg_queue)
            data = {
                email: msg_queue['email'],
                status: msg_queue['status'],
                date: msg_queue['time'],
                managed_by: msg_queue['managed_by']
            }
            console.log(data)
            sql = 'INSERT INTO answer_record SET ?'
            connection.query(sql,data)
        },{noAck:true})

    })
})

