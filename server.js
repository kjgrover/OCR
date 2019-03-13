// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var http = require("http");
var fs = require("fs");
var upload = require("express-fileupload");
var cors = require('cors');
var path = require('path');

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 80;

app.use('/', express.static(path.join(__dirname + '/node/public')))

app.use(cors());  //technically not needed...this allows this server to be used as an external API
app.use(upload()); //this is needed for the binary file upload to the server 

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("./node/routes/apiRoutes")(app);
require("./node/routes/htmlRoutes")(app);

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
