var amqp = require('amqplib/callback_api')

// const send = (queue,message)=>{
//     amqp.connect('amqp://host.docker.internal', (err,conn)=>{
//         if (err){
//             console.log('error at connect '+err)
//         }
//         conn.createChannel((err,ch)=>{
//             if (err){
//                 console.log('err at create chanel: '+err)
//             }
//             ch.assertQueue(queue, {durable: true})
//             ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
//         })
//         setTimeout(()=>{
//             conn.close();
//         },500)
//     })
// }
const send_result = (message)=>{
    amqp.connect('amqp://host.docker.internal', (err, conn)=> {
    if (err) {
      throw err;
    }
    conn.createChannel(function(err, channel) {
      if (err) {
        throw error1;
      }
      var exchange = 'result_exchange';
    
      channel.assertExchange(exchange, 'fanout', {
        durable: true
      });
      channel.publish(exchange, '', Buffer.from(JSON.stringify(message)));
    });
  
    setTimeout(function() { 
      conn.close(); 
      process.exit(0) 
    }, 500);
  });
}
module.exports = send_result