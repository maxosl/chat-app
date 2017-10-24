'use strict';

const express	 	= require('express');
const router 		= express.Router();

// Register via username and password
router.get('*', function(req, res, next) {
    res.sendFile(path.resolve(__dirname, '/client/build', 'index.html'));
});

module.exports = router;