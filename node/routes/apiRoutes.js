var path = require("path");
var request = require("request");
var fs = require("fs")

module.exports = function (app) {

    app.post("/pdfpost", function(req, res) {
        fs.writeFile("/pdfs", req.body, function(err) {
            if(err) {
                return console.log(err);
            }
        
            res.send("The file was saved!");

        })

      });

};