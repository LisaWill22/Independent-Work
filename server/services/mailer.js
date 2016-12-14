'use strict';


// Load in configs from your .env file
require('dotenv').config();

const User = require('../models/user').User;
const Chat = require('../models/chat').Chat;

// Bring in nodemailer
const nodemailer = require('nodemailer');
// const sgTransport = require('nodemailer-sendgrid-transport');
// const ses = require('nodemailer-ses-transport');
// const mandrillTransport = require('nodemailer-mandrill-transport');

// SMPT transporter
let smtpString = `smtps://${process.env.GMAIL_USER}%40gmail.com:${process.env.GMAIL_PASS}@smtp.gmail.com`
let transporterSMTP = nodemailer.createTransport(smtpString);

// // AWS Transporter
// let transporterAWS = nodemailer.createTransport(ses({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// }));
//
// // Mandrill Transporter
// let transporterMandrill = nodemailer.createTransport(mandrillTransport({
//     auth: {
//         apiKey: process.env.MANDRILL_API_KEY
//     }
// }));
//
// // SendGrid Transporter
// let transporterSG = nodemailer.createTransport(sgTransport({
//     auth: {
//         api_key: process.env.SENDGRID_API_KEY
//     }
// }));

const mailer = {

    sendEmailNotification: function(messageData) {
        let transporter = transporterSMTP;
        User.find({
            _id: {
                $in: messageData.users
            }
        }, { image: 0
        }, function (err, users) {
            if (err) {
                console.error(err);
            } else {
                let receiver = users.filter(user => {
                    return user._id == messageData.receiver;
                })[0];

                let sender = users.filter(user => {
                    return user._id == messageData.sender;
                })[0];


                let mailOptions = {
                    from: `notifications@indenpendentwork.com`,
                    to: `${receiver.local.email}`,
                    subject: `You have a new message!`,
                    text: `
                            Hi ${receiver.firstName}, you have a new message waiting for you from ${sender.firstName} ${sender.lastName}.
                            Click the following link to view your messages: http://launchpeer-iw.herokuapp.com/#/conversation/${sender._id}.
                          `,
                    html: `<p>
                                Hi ${receiver.firstName}, you have a new message waiting for you from ${sender.firstName} ${sender.lastName}.
                                <br />
                                Click the following link to view your messages: http://launchpeer-iw.herokuapp.com/#/conversation/${sender._id}.
                            </p>
                            <br />
                            <p>
                                <i>Your friends at Indenpendent Work</i> - <a href="//:www.independentwork.com">www.independentwork.com</a>
                            </p>
                          `,
                };

                // Send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    }
                    console.log(info);
                });
            }
        });
    },

    sendMail: function (req, res, next) {
        let mailerType = req.params.mailer;
        let transporter;

        switch (mailerType) {
            case 'smtp':
                transporter = transporterSMTP;
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

    }
};

module.exports = mailer;
