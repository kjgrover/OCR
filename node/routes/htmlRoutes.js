var path = require('path');


module.exports = function (app) {

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get(" /.well-known/pki-validation/", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/3218FE1AB9AC2DC63DA63A12CB3B15F5.txt"));
});
};