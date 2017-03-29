'use strict';


// Load in configs from your .env file
require('dotenv').config();

const User = require('../models/user').User;
const Chat = require('../models/chat').Chat;
const sgTransport = require('nodemailer-sendgrid-transport');
// Bring in nodemailer
const nodemailer = require('nodemailer');


// SMPT transporter
// const smtpString = `smtps://${process.env.SENDGRID_USERNAME}%40gmail.com:${process.env.SENDGRID_PASSWORD}@smtp.gmail.com`;
let smtpString = options
let transporterSMTP = nodemailer.createTransport(smtpString);


var options = {
	auth: {
		// api_user: process.env.SENDGRID_USERNAME,
		// api_key: process.env.SENDGRID_PASSWORD
		api_user: 'app57565034@heroku.com',
		api_key: 'vzlntvxm4814'
	}
}





const mailer = {
    signupNotification: function(user) {
      console.log("SENDING ACCOUNT CONFIRMATION EMAIL");
        let transporter = transporterSMTP;
        let mailOptions = {
            from: `hello@independentwork.com`,
            to: `${user.local.email}`,
            subject: `Welcome to Independent Work!`,
            text: `
                    Hi ${user.firstName}, thank you for signing up for Indenpendent Work!
                    Click the following link to sign in and join the community!
                    http://independentwork.com/#/login.
                  `,
            html: ` <p>
                        Hi ${user.firstName}, thank you for signing up for Indenpendent Work!
                        <br />
                        Click the following link to sign in and join the community!
                        <a href="http://independentwork.com/#/login>Log in to Independent Work</a>
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
                console.log("ERROR SENDING ACCOUNT CONFIRMATION EMAIL");

            }
            console.log(info);
        });
    },
    messageNotification: function(messageData) {
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
                            Click the following link to view your messages: http://independentwork.com/#/conversation/${sender._id}.
                          `,
                    html: `<p>
                                Hi ${receiver.firstName}, you have a new message waiting for you from ${sender.firstName} ${sender.lastName}.
                                <br />
                                Click the following link to view your messages: http://independentwork.com/#/conversation/${sender._id}.
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
