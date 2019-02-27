
library(plumber)
library(tabulizer)
library(pdftools)

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
  
  s = toString(pdf, width = NULL)
  s1 = unlist(strsplit(s, split='.', fixed=TRUE))[1]
  csvFile = paste(s1, ".csv", sep="")
  
  write.table(out1, file = paste("./node/csv/", csvFile, sep=""), append=TRUE, sep = ",", row.names=FALSE, col.names=FALSE)
  return("Successfully transformed PDF to CSV")
  
}


#' @param pdf
#' @param x1
#' @param x2
#' @param y1
#' @param y2
#' @post /coordinatesCSV
#' @json
function(pdf, x1, x2, y1, y2){
  library("tabulizer")
  f <- paste("./node/pdfs/",toString(pdf, width = NULL), sep="")
  w <- pdf_pagesize(f)
  adj <- w[1,5]/1000
  out1 <- extract_tables(f, area = list(c(as.numeric(y1)*adj, as.numeric(x1)*adj, as.numeric(y2)*adj, as.numeric(x2)*adj)), guess = FALSE)
  
  s = toString(pdf, width = NULL)
  s1 = unlist(strsplit(s, split='.', fixed=TRUE))[1]
  csvFile = paste(s1, ".csv", sep="")
  
  write.table(out1, file = paste("./node/csv/", csvFile, sep=""), append=TRUE, sep = ",", row.names=FALSE, col.names=FALSE)
  return("Successfully transformed PDF to CSV")
  
}

#* Return the sum of two numbers
#* @param a The first number to add
#* @param b The second number to add
#* @post /sum
function(a, b){
  return(as.numeric(a) + as.numeric(b))
}


