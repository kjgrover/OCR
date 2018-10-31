var path = require("path");
var request = require("request");
var fs = require("fs")

module.exports = function (app) {
    
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
      app.get("/csvgrab", function(req, res) {

        console.log('successfully deleted local image')
        res.sendFile("./node/pdfs/"+req.query.filename);                                

      });

};