const express = require('express')
const bodyParser= require('body-parser')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

const oauth2Client = new OAuth2(
    process.env.Client_ID,
    process.env.Client_Secret,
    "https://developers.google.com/oauthplayground"
    )
oauth2Client.setCredentials({
    refresh_token:process.env.Refresh_Token
})

const accessToken = oauth2Client.getAccessToken()

const smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
  auth:{
  type:"OAuth2",
  user:process.env.GMAIL_USER,
  clientId:process.env.Client_ID,
  clientSecret:process.env.Client_Secret,
  refreshToken:process.env.Refresh_Token,
  accessToken:accessToken
  }})

app.use(cors());
app.use('/views/assets', express.static(process.cwd() + '/views/assets'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/index.html');
});

app.post('/email', upload.none(), function (req, res) {
 const output="<p>You have a new contact request</p> <h3>Contact details</h3><ul><li>FirstName: ${req.body.name}</li><li>Subject: ${req.body.subject}</li><li>Email: ${req.body.email}</li><li>Message: ${req.body.message}</li> </ul>"
 
 const mailOpts = {
  from:process.env.GMAIL_USER,
  to:process.env.RECIPIENT,
  subject:'New message from Nodemailer-contact-form',
  html:output,
  attachments: [{
  filename: 'email.jpg',
  path:__dirname + '/views/email.jpg',cid: 'email' //same cid value as in the html img src
  }]}
smtpTrans.sendMail(mailOpts,(error,res)=>{
   if(error){
   console.log(error);
   }
   else{
    console.log("Message sent: " + res.message);
    response.status(200).send(200)
    }

   })
})
const port = process.env.PORT || 5000
const server = app.listen(port,listening)
function listening (){
  console.log(`server running on ${port}`)
}
