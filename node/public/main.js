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
      let x1;
      let x2;
      let y1;
      let y2;
      
var jcrop_api;                                  //I know its a global variable but just don't touch it mkay?

$(function () {                                 //this is for the file upload and display
    $(":file").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    });
});

function imageIsLoaded(e) {                     //Note I initiated the crop box in the nested function to keep from invoking Jcrop prematurely
    $('#cropbox').attr('src', e.target.result);
    $(function($){
                initJcrop($('#cropbox'));
                $("#show").click(function () {
                    // get the coordinates.
                        console.log(jcrop_api.tellSelect());
                        x1 = jcrop_api.tellSelect().x;
                        x2 = jcrop_api.tellSelect().x2;
                        y1 = jcrop_api.tellSelect().y;
                        y2 = jcrop_api.tellSelect().y2;
                        
                        console.log(x1 + ' ' + x2 + ' ' + y1 + ' ' +y2)

                });
            });
};

function initJcrop(oImg){                       //this is straight out of the Jcrop documentation AKA don't touch
        oImg.Jcrop({}
            ,function(){
            jcrop_api = this;
        });
    };      
    
  
$("#file-form").on("submit", function(event) {
    // $("#file-form").submit( function(event) {

    event.preventDefault() 

    //   $("#loading").toggle();
    //   document.getElementById('loading').style.display = 'block';

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
              console.log("beginning OCR")
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
              console.log("ocr finished");
          }
        }).then(makecsv())
  }
  
  
  function makecsv() {
    
    // $.ajax({
    //       url: "http://104.248.69.73:4000/tabcsv?pdf="+pdfName,
    //       type: 'GET',
    //       dataType: 'text',
    //       async: false,
    //       success: function () {
    //           console.log("grabbing "+pdfName);
    //           $("#loading").text("");
    //       }
    //     }).then(window.open("/csvgrab?filename="+csvName) && setTimeout(function(){ deleteall(); }, 10000))  

        $.ajax({
          url: "http://104.248.69.73:4000/tabcsv",
          type: 'GET',
          dataType: 'JSON',
          data: {
            pdf: pdfName,
            x1: x1,
            x2: x2,
            y1: y1,
            y2: y2
          },
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
  
  