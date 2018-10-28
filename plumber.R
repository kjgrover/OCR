

library(plumber)
library(tabulizer)


#' Echo the parameter that was sent in
#' @param msg The message to echo back.
#' @get /echo
function(msg=""){
  list(msg = paste0("The message is: '", msg, "PLUMBER IS WORKING"))
  }

#' @param pdf
#' @get /tab
#' @json
function(pdf){
  library("tabulizer")
  f <- paste("C:/Users/kelse/Desktop/Rscripts/Tessaract/",toString(pdf, width = NULL), sep="")
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







