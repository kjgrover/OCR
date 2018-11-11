$.ajaxSetup({
    beforeSend:function(jqXHR,settings){
      if (settings.dataType === 'binary'){
        settings.xhr().responseType='arraybuffer';
        settings.processData=false;
      }
    }
  })
  
      let pdfName;
      let csvName;
      let pngName;
  
      $("#file-form").on("submit", function(event) {
      event.preventDefault() 

      $("#loading").prepend("<img id='loader' src='/node/public/media/loader-bar.gif' />");

      let filePath = $("#file-name").val();
          pngName = filePath.replace(/^.*[\\\/]/, '');
          csvName = pngName.slice(0,-3)+"csv"
          pdfName = pngName.slice(0,-3)+"pdf"
  
      let formData = new FormData(this);
  
      $.ajax({
          url: "http://104.248.69.73:8080/pdfpost",
          type: 'POST',
          data: formData,
          async: false,
          cache: false,
          contentType: false,
          processData: false,
          success: function () {
              alert('File Submitted!');
          }
  
      }).then(ocr() && res.send("beginning OCR"))
  });
  
  
  function ocr() {
    
    $.ajax({
          url: "http://104.248.69.73:8080/ocr?filename="+pngName,
          type: 'GET',
          dataType: 'text',
          async: false,
          success: function () {
              console.log("ocr finished");
          }
        }).then(makecsv())
  }
  
  
  function makecsv() {
    
    $.ajax({
          url: "http://104.248.69.73:4000/tabcsv?pdf="+pdfName,
          type: 'GET',
          dataType: 'text',
          async: false,
          success: function () {
              console.log("grabbing "+pdfName);
              $("#loading").text("");
          }
        }).then(window.open("/csvgrab?filename="+csvName) && setTimeout(function(){ deleteall(); }, 10000))  

  }

  
  function deleteall() {
    
    $.ajax({
          url: "http://104.248.69.73:8080/delete?filename="+csvName,
          type: 'GET',
          dataType: 'text',
          async: false,
          success: function () {
              console.log("deleted all");
          }
        }).then(csvName = "", pdfName = "", pngName = "")
  }
  
  
  
  // function getjson() {
  //   $.ajax({
  //         url: "http://104.248.69.73:4000/tab?pdf="+pdfName,
  //         type: 'GET',
  //         dataType: 'blob',
  //         success: function (data) {
  //             console.log("JSON BELOW");
  //         }
  //       }).then(function(data) {
  //             console.log(data);
  //         })
  // }
  
  