'use strict';

// Load in configs from your .env file
require('dotenv').config();

// Bring in express and create a router
const express = require('express');
const router = new express.Router();

// Bring in nodemailer
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const ses = require('nodemailer-ses-transport');
const mandrillTransport = require('nodemailer-mandrill-transport');


// create different transporters

// SMPT transporter
let smtpString = `smtps://${process.env.GMAIL_USER}%40gmail.com:${process.env.GMAIL_PASS}@smtp.gmail.com`
let transporterSMTP = nodemailer.createTransport(smtpString);

// AWS Transporter
let transporterAWS = nodemailer.createTransport(ses({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}));

// Mandrill Transporter
let transporterMandrill = nodemailer.createTransport(mandrillTransport({
    auth: {
        apiKey: process.env.MANDRILL_API_KEY
    }
}));

// SendGrid Transporter
let transporterSG = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}));

router.post('/send/:mailer', (req, res, next) => {

    let mailerType = req.params.mailer;
    let transporter;

    switch (mailerType) {
        case 'smtp':
            transporter = transporterSMTP
            break;
        case 'sendgrid':
            transporter = transporterSG
            break;
        case 'aws':
            transporter = transporterAWS
            break;
        case 'mandrill':
            transporter = transporterMantrill
            break;
        default:
            transporter = transporterSMTP;
            break;
    }

    let mailOptions = {
        from: 'node-litemailer@rainbows.com', // sender address
        to: 'info@node-litemailer.com', // list of receivers
        subject: 'Hello - sent from node-litemailer', // Subject line
        text: 'Hello world !', // plaintext body
        html: '<b>Hello world !</b>' // html body
    };

    mailOptions = Object.assign(mailOptions, req.body);

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            // Send a sad little error back to the client
            return res.send(error.responseCode, {
                message: 'Could not send your email :(',
                error,
                mailOptions
            });
        }

        // Send a happy little response back to the client
        return res.send({
            status: 'Message sent: ' + info.response + ' :)',
            mailOptions,
            _sendDate: new Date()
        });
    });

});

// TODO: Implement routes for all these different
router.post('/send/sendgrid', (req, res, next) => {
    let transporter = transporterSG;
});
// router.post('/send/mailgun')
// router.post('/send/aws-ses')

module.exports = router;
