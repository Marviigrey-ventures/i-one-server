const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    host: process.env.HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
})

const sendMail = async (to, subject, text) =>{
const mailOptions = {
    from: process.env.USER,
    to,
    subject,
    text,
}


try{
    await transporter.sendMail(mailOptions, (error, info) =>{
        if (error) {
            console.error("Error sending email: ", error);
          } else {
            console.log("Email sent: ", info.response);
          }
    })
    console.log(`Email sent to ${to}`)
}catch(err){
    console.error(`Error sending email to ${to}:`, error);
        throw error; 
}
}


module.exports = sendMail