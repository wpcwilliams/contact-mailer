var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var cors = require('cors');
const config = require('./config');

var transport = {
    host: config.HOST, 
    port: 587,
    auth: {
    user: config.USER,
    pass: config.PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(`${error} \n ${config.USER} \n ${config.PASS}`);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
  var name = req.body.name
  var email = req.body.email
  var message = req.body.message
  var company = req.body.company
  var content = `Name:\n\t ${name} \n Email:\n\t ${email} \n Company:\n\t ${company} \n Message: \n\t ${message}`

  var mail = {
    from: config.USER,
    to: config.FORWARD,
    subject: 'New Message from Contact Form',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: err
      })
    } else {
      res.json({
       status: 'success'
      })
    }
  })
})

const app = express()
app.use(cors())
app.use(express.json())
app.use('/', router)
app.listen(config.PORT)