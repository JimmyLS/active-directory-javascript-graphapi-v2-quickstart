/*
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
*  See LICENSE in the source repository root for complete license information.
*/

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const https = require('https');
var privateKey  = fs.readFileSync('sslcert/3_sts.azurehybrid.tk.key', 'utf8');
var certificate = fs.readFileSync('sslcert/2_sts.azurehybrid.tk.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

//initialize express.
const app = express();

// Initialize variables.
//const port = 3000; // process.env.PORT || 3000;
const port = 443;

// Configure morgan module to log all requests.
app.use(morgan('dev'));

// Set the front-end folder to serve public assets.
app.use(express.static('JavaScriptSPA'))

// Set up a route for index.html.
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Start the server.
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port)
//app.listen(port);
console.log('Listening on port ' + port + '...');
