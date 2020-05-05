var nodemailer = require('nodemailer')

const send_email = async (destination_mail,subject,message) =>{
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
      user: 'hhnguyen251097@gmail.com',
      pass: 'Suhu7815@@'
    }
  });
  
  var mailOptions = {
    from: 'hhnguyen251097@gmail.com',
    to: destination_mail,
    subject: subject,
    text: message
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = send_email