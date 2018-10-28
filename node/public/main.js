$("#file-form").on("submit", function(event) {
    event.preventDefault() 

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
            alert('Form Submitted!');
        }
        }).then(function(data) {
            console.log(data);

        })
});