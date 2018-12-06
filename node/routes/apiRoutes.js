var path = require("path");
var request = require("request");
var fs = require("fs")

module.exports = function (app) {
  

app.post("/pdfpost", function(req, res) {


    if(req.files){
      //foo is the post key name for the file
        var file = req.files.foo,
        filename = file.name
        pdfname = filename.slice(0,-3) + "pdf"
    
        file.mv("./node/png/" +filename).then(res.send(filename+" saved")) //writes binary file to server
        fs.closeSync(fs.openSync("./node/pdfs/"+pdfname, 'w'))             //saves empty PDF file to server to be used by OCR 
    }

  });

app.get("/delete", function(req, res) {

    var deletefile = req.query.filename.slice(0,-3)

    fs.unlink("./node/csv/"+deletefile+"csv", (err) => {
        if (err) {
            res.send("failed to delete local image:"+err);
        }
    });

    fs.unlink("./node/pdfs/"+deletefile+"pdf", (err) => {
        if (err) {
            res.send("failed to delete local image:"+err);
        }
    });

    fs.unlink("./node/png/"+deletefile+"png", (err) => {
        if (err) {
            res.send("failed to delete local image:"+err);
        } else {
            res.send("All files successfully deleted");                                
        }
    });
});

    
app.get("/csvgrab", function(req, res) {

    res.download(path.join(__dirname, '../csv/', req.query.filename));
    });


app.get("/ocr", function(req, res) {

    var appId = 'rocr_app';
    var password = 'Yt/3zJ20k7nYJSok8G3kR1tw ';
    var ocrfile = req.query.filename.slice(0,-3)
    var imagePath = "./node/png/" + ocrfile + "png";
    var outputPath = './node/pdfs/' + ocrfile + "pdf"; //note this is an empty file created by the /pdfpost route

    try {
        var ocrsdkModule = require('./ocrsdk.js');
        var ocrsdk = ocrsdkModule.create(appId, password);
        ocrsdk.serverUrl = "https://cloud.ocrsdk.com"; // changed to https for secure connection

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
            res.send("Done.");
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
        settings.language = "English";
        settings.exportFormat = "pdfSearchable"; 

        console.log("Uploading image..");
        ocrsdk.processImage(imagePath, settings, uploadCompleted);

    } catch (err) {
        res.send("Error: " + err.message);
    }
});

};

