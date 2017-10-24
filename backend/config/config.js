'use strict';

const init = function () {

    let config = require('./config.json');

    if(process.env.NODE_ENV === 'production') {
        // Put in your prod config code here
    }

    return config;
};

module.exports = init();