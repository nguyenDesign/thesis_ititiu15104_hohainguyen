var amqp = require('amqplib/callback_api')

const send_raw_anser = (queue,message)=>{
    amqp.connect('amqp://host.docker.internal', (err,conn)=>{
        if (err){
            console.log('error at connect '+err)
        }
        conn.createChannel((err,ch)=>{
            if (err){
                console.log('err at create chanel: '+err)
            }
            ch.assertQueue(queue, {durable: true})
            ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
        })
        setTimeout(()=>{
            conn.close();
        },500)
    })
}

module.exports = send_raw_anser