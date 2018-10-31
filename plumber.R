

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
return("echo")
  
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
#' @get /tabcsv
#' @json
function(pdf){
  library("tabulizer")
  f <- paste("./node/pdfs/",toString(pdf, width = NULL), sep="")
  out1 <- extract_tables(f)
  # setwd(".node/pdfs/")
  
  s = toString(pdf, width = NULL)
  s1 = unlist(strsplit(s, split='.', fixed=TRUE))[1]
  csvFile = paste(s1, ".csv", sep="")
  
  write.table(out1, file = csvFile, append=TRUE, sep = ",")
  return("CSV successful")
  
  
}


