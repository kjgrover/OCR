// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var http = require("http");
var fs = require("fs")
var upload = require("express-fileupload")
var cors = require('cors')

// Sets up the Express App
// =============================================================
var app = express();

var PORT = 8080;

app.use(express.static(__dirname + '/node/public'))
app.use(cors());
app.use(upload())


// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);

require("./node/routes/apiRoutes")(app);
require("./node/routes/htmlRoutes")(app);

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
