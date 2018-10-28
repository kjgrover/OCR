// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var http = require("http");
var fs = require("fs")
var upload = require("express-fileupload")
// Sets up the Express App
// =============================================================
var app = express();

var PORT = 8080;

app.use(upload())
app.use("/public", express.static(__dirname + '/public'));

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);

app.post("/pdfpost", function(req, res) {

    if(req.files){
      //foo is the post key name for the file
        var file = req.files.foo,
        filename = file.name
    
        file.mv("./pdfs/"+filename).then(res.send("The file was saved!"))
    }

  });

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
