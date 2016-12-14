'use strict';

// Bring in express and create a router
const express = require('express');
const router = new express.Router();

router.post('/send/:mailer', (req, res, next) => {
    mailer.sendmail(req, res, next);
});

module.exports = router;
