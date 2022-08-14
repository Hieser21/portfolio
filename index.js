var express = require('express');
var cors = require('cors');
require('dotenv').config()
 var multer = require('multer');
const nodemailer = require('nodemailer');
const upload = multer({ dest: './views/' })
var app = express();
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'annabell75@ethereal.email',
        pass: 'jKZtRk8UrEN8tqwNGE'
    }
});
app.use(cors());
app.use('/views/assets', express.static(process.cwd() + '/views/assets'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/web/email', upload.none(), function (req, res) {
    var message = {
        from: req.body.name + " " + req.body.email,
        to: "rarafat883@gmail.com",
        subject: req.body.subject,
        text: req.body.message,
        html: req.body.message
      };
  
      transporter.sendMail(message, function(err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
        }
      })
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
