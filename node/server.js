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

app.use(express.static('public'))
app.use(cors());
app.use(upload())


// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);

require("./node/routes/apiRoutes")(app);
require("./node/routes/htmlRoutes")(app);



app.post("/pdfpost", function(req, res) {


  if(req.files){
    //foo is the post key name for the file
      var file = req.files.foo,
      filename = file.name
  
      file.mv("./node/pdfs/" +filename).then(res.send("The file was saved!"))
  }

});

  app.get("/pdfdelete", function(req, res) {
      console.log(req.params)
      fs.unlink("./node/pdfs/"+req.query.filename, (err) => {
          if (err) {
              res.send("failed to delete local image:"+err);
          } else {
              console.log('successfully deleted local image')
              res.send("The file was deleted!");                                
          }
  });

    });

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
