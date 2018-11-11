$.ajaxSetup({
    beforeSend:function(jqXHR,settings){
      if (settings.dataType === 'binary'){
        settings.xhr().responseType='arraybuffer';
        settings.processData=false;
      }
    }
  })
  
      var pdfName;
      var csvName;
      var pngName;
  
      $("#file-form").on("submit", function(event) {
      event.preventDefault() 
      var filePath = $("#file-name").val();
          pngName = filePath.replace(/^.*[\\\/]/, '');
          csvName = pngName.slice(0,-3)+"csv"
          pdfName = pngName.slice(0,-3)+"pdf"
  
      var formData = new FormData(this);
  
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
  
      }).then(ocr())
  });
  
  
  function ocr() {
    
    $.ajax({
          url: "http://104.248.69.73:8080/ocr?filename="+pngName,
          type: 'GET',
          dataType: 'text',
          async: false,
          success: function () {
              console.log("ocr in progress");
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
          }
        // }).then(window.open("/csvgrab?filename="+csvName) && setTimeout(function(){ deleteall(); }, 10000))
      }).then(postfile())
  

  }
  
  function postfile() {
    
    var win = window.open("/csvgrab?filename="+csvName)
    $(win.document).load(function() {
        deleteall()
    })

    
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
  
  