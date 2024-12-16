const dotenv = require("dotenv")
const nodemailer = require("nodemailer")

dotenv.config()

const transporter = nodemailer.createTransport({
    secure: true,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.error("Error connecting to email server: ", error)
    }
})

function sendMail(to, sub, msg) {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            to: to,
            subject: sub,
            html: msg
        }, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                reject(false);
            } else {
                console.log("Email sent successfully:", info.response);
                resolve(true);
            }
        });
    });
}

module.exports = sendMail
