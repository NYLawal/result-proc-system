const nodemailer = require("nodemailer");


const SENDMAIL = async (email, subject, text) => {
    try {
        let mailTransporter =
            nodemailer.createTransport(
                {
                    service: "Gmail",
                    name: 'gmail.com',
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.USER_PASSWORD,
                    }
                }
            );

        let mailDetails = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: `\nPlease click on the link below to reset your password \nNote that the link expires in one hour\n\n${text}`
        };

        mailTransporter
            .sendMail(mailDetails,
                function (err, data) {
                    if (err) {
                        console.log('Error Occurs');
                    } else {
                        console.log('Email sent successfully');
                    }
                });
    } catch (error) {
        console.log(error, "email not sent");
    }
};


const GETMAIL = async (fullname, email, phone, subject, message) => {
    try {
        let mailTransporter =
            nodemailer.createTransport(
                {
                    service: "Gmail",
                    name: 'gmail.com',
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.USER_PASSWORD,
                    }
                }
            );
        console.log(email)
        let mailDetails = {
            from: {
                name: fullname,
                address: email
            },
            to: process.env.EMAIL_USER,
            subject: subject,
            text: `${message} \n\nEmail: ${email} \n\nPhone: ${phone}`
        };

        mailTransporter
            .sendMail(mailDetails,
                function (err, data) {
                    if (err) {
                        console.log('Error Occurs');
                    } else {
                        console.log('Email sent successfully');
                    }
                });
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = { SENDMAIL, GETMAIL }

