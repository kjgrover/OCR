var path = require("path");
var request = require("request");
var fs = require("fs")

module.exports = function (app) {
    
app.post("/pdfpost", function(req, res) {


    if(req.files){
      //foo is the post key name for the file
        var file = req.files.foo,
        filename = file.name
        pdfname = filename.slice(0,-3) + ".pdf"
    
        file.mv("./node/png/" +filename).then(res.send(filename+" saved"))

        fs.closeSync(fs.openSync("./node/pdfs/"+pdfname, 'w'))

    }

  });

    app.get("/pdfdelete", function(req, res) {
        console.log(req.params)
        fs.unlink("./node/pdfs/"+req.query.filename, (err) => {
            if (err) {
                res.send("failed to delete local image:"+err);
            } else {
                res.send(req.query.filename+" was successfully deleted");                                
            }
        });

    });


      app.get("/csvgrab", function(req, res) {

        res.download(path.join(__dirname, '../csv/', req.query.filename));
      });


      app.get("/csvdelete", function(req, res) {
        fs.unlink("./node/csv/"+req.query.filename, (err) => {
            if (err) {
                res.send("failed to delete local image:"+err);
            } else {
                res.send(req.query.filename+" was successfully deleted");                                
            }
        });

    });


    app.get("/ocr", function(req, res) {
        console.log(req.params)

        // Demo sample using ABBYY Cloud OCR SDK from Node.js

        if (((typeof process) == 'undefined') || ((typeof window) != 'undefined')) {
            throw new Error("This code must be run on server side under NodeJS");
        }

        // Name of application you created
        var appId = 'rocr_app';
        // Password should be sent to your e-mail after application was created
        var password = 'Yt/3zJ20k7nYJSok8G3kR1tw ';

        var ocrfile = req.query.filename.slice(0,-3)

        var imagePath = "./node/png/" + ocrfile + "png";
        var outputPath = './node/pdf/' + ocrfile + "pdf";

        try {
            console.log("ABBYY Cloud OCR SDK Sample for Node.js");

            var ocrsdkModule = require('./ocrsdk.js');
            var ocrsdk = ocrsdkModule.create(appId, password);
            ocrsdk.serverUrl = "https://cloud.ocrsdk.com"; // change to https for secure connection

            if (appId.length == 0 || password.length == 0) {
                throw new Error("Please provide your application id and password!");
            }
            
            if( imagePath == 'myFile.jpg') {
                throw new Error( "Please provide path to your image!")
            }

            function downloadCompleted(error) {
                if (error) {
                    console.log("Error: " + error.message);
                    return;
                }
                console.log("Done.");
            }

            function processingCompleted(error, taskData) {
                if (error) {
                    console.log("Error: " + error.message);
                    return;
                }

                if (taskData.status != 'Completed') {
                    console.log("Error processing the task.");
                    if (taskData.error) {
                        console.log("Message: " + taskData.error);
                    }
                    return;
                }

                console.log("Processing completed.");
                console.log("Downloading result to " + outputPath);

                ocrsdk
                        .downloadResult(taskData.resultUrl.toString(), outputPath,
                                downloadCompleted);
            }

            function uploadCompleted(error, taskData) {
                if (error) {
                    console.log("Error: " + error.message);
                    return;
                }

                console.log("Upload completed.");
                console.log("Task id = " + taskData.id + ", status is " + taskData.status);
                if (!ocrsdk.isTaskActive(taskData)) {
                    console.log("Unexpected task status " + taskData.status);
                    return;
                }

                ocrsdk.waitForCompletion(taskData.id, processingCompleted);
            }

            var settings = new ocrsdkModule.ProcessingSettings();
            // Set your own recognition language and output format here
            settings.language = "English"; // Can be comma-separated list, e.g. "German,French".
            settings.exportFormat = "pdfSearchable"; // All possible values are listed in 'exportFormat' parameter description 
                                        // at http://ocrsdk.com/documentation/apireference/processImage/

            console.log("Uploading image..");
            ocrsdk.processImage(imagePath, settings, uploadCompleted);

        } catch (err) {
            console.log("Error: " + err.message);
        }




    });




};

