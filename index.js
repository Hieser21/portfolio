require('dotenv').config()
const express = require('express')
const bodyParser= require('body-parser')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')

 
const OAuth2 = google.auth.OAuth2

const oauth2Client = new OAuth2(
    process.env.Client_ID,
    process.env.Client_Secret,
    "https://developers.google.com/oauthplayground"
    )

oauth2Client.setCredentials({
    refresh_token:process.env.Refresh_Token
})
const accessToken = oauth2Client.getAccessToken()

const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))
app.route("/").get(function (req, res) {
    res.sendFile(process.cwd() + "/views/index.html");
  });
app.use(express.static('views'))
app.post('/email',(req,response)=>{
const output=`
  <p>You have a new contact request</p>
  <img class="email" src="cid:email" alt="email-image">
  <h3>Contact details</h3>
  <ul>
  <li>FirstName: ${req.body.name}</li>
  <li>Subject: ${req.body.subject}</li>
  <li>Email: ${req.body.email}</li>
  <li>Message: ${req.body.message}</li>
  </ul>`
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
const mailOpts = {
  from:process.env.GMAIL_USER,
  to:process.env.RECIPIENT,
  subject:'Portfolio Website',
  html:output
}
smtpTrans.sendMail(mailOpts,(error,res)=>{
   if(error){
   console.log(error);
   }
   else{
    console.log("Message sent: " + res.message);
    response.status(200).send('You can go back from this window now!')
    }
  //smtpTrans.close();
   })
})
const port = process.env.PORT || 3000
const server = app.listen(port,listening)
function listening (){
  console.log(`server running on ${port}`)
}
