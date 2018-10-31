

library(plumber)
library(tabulizer)

#' @filter cors
cors <- function(req, res) {
  
  res$setHeader("Access-Control-Allow-Origin", "*")
  
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$setHeader("Access-Control-Allow-Methods","*")
    res$setHeader("Access-Control-Allow-Headers", req$HTTP_ACCESS_CONTROL_REQUEST_HEADERS)
    res$status <- 200 
    return(list())
  } else {
    plumber::forward()
  }
  
}

#' @get /echo
function(){
return("Vince is going to pass his class tonight!")
  
}

#' @param pdf
#' @get /tab
#' @json
function(pdf){
  library("tabulizer")
  f <- paste("./node/pdfs/",toString(pdf, width = NULL), sep="")
  extract_tables(f)
}

#' @param pdf
#' @post /post
#' @json
function(req){
  # library("tabulizer")


  # f <- req$postBody
  # extract_tables(f)
  # extract_tables(req$postBody)
  # content <- read_feather(data)
  # somefile <- readBin(con = formContents$upload$tempfile, "raw", 
  #                     n = file.size(formContents$upload$tempfile))
  # req$postBody
  # extract_tables(content)
}