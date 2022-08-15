var express = require('express');
var cors = require('cors');
require('dotenv').config()
 var multer = require('multer');
 var bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const upload = multer({ dest: './views/' })
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer().array());
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'rarafat883@gmail.com',
        pass: 'malevolentshrine22'
    }
});
app.use(cors());
app.use('/views/assets', express.static(process.cwd() + '/views/assets'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/index.html');
});

app.post('/email', upload.none(), function (req, res) {
    var message = {
        from:req.body.email,
        to: "rarafat15@yahoo.com",
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
