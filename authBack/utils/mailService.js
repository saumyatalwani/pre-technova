require('dotenv').config();
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const fs = require('fs');
// Read configs.json
const configs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../configs.json'), 'utf-8'));

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

// Configure Handlebars options
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve(__dirname, '../views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, '../views/'),
    extName: '.hbs'
};

// Use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions));

const sendMail = (to, subject, templateKey, context) => {
    const template = configs[templateKey];
    if (!template) {
        return console.log(`Template for key "${templateKey}" not found in configs.json`);
    }

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        template: template,
        context: context
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};

module.exports = { sendMail };