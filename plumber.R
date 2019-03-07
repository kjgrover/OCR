
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
  library("pdftools")
  f <- paste("./node/pdfs/",toString(pdf, width = NULL), sep="")
  w <- pdf_pagesize(f)
  adj <- w[1,5]/1000
    print(as.numeric(x1)*adj)
     print(as.numeric(x2)*adj)
       print(as.numeric(y1)*adj)
   print(as.numeric(y2)*adj)
  out1 <- extract_tables(f, area = list(c(as.numeric(y1)*adj, as.numeric(x1)*adj, as.numeric(y2)*adj, as.numeric(x2)*adj)), guess = FALSE)
  
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
#' @post /multicoordinate
#' @json
function(pdf, x1, x2, y1, y2){
  library("tabulizer")
  library("pdftools")
  f <- paste("./node/pdfs/",toString(pdf, width = NULL), sep="")
  w <- pdf_pagesize(f)
  adj <- w[1,5]/1000

  mx1 <- as.list(strsplit(x1, ",")[[1]])
  print("mx1 below")
  print(mx1[1])
  mx2 <- as.list(strsplit(x2, ",")[[1]])
  my1 <- as.list(strsplit(y1, ",")[[1]])
  my2 <- as.list(strsplit(y2, ",")[[1]])


# y <- 1
#  z <- 0
#  repeat {
#   assign(paste0("a", y), y) <- c(as.numeric(mx1[y])*adj,as.numeric(mx2[y])*adj, as.numeric(my1[y])*adj, as.numeric(my2[y])*adj)
#    y = y+1
#    if (y == length(mx1)){
#      break
#   }
#  }

listOfVectors <- list()
for (i in 1:length(mx1)) {

  listOfVectors[[i]] <- c(as.numeric(my1[i])*adj,as.numeric(mx1[i])*adj, as.numeric(my2[i])*adj, as.numeric(mx2[i])*adj)
}
print("list of vectors below")
print(listOfVectors)

p <- c(rep(1, each=length(mx1)))

print("pages vector below")
print(p)
  out1 <- extract_tables(f, pages = p, area = listOfVectors, guess = FALSE)
  
  s = toString(pdf, width = NULL)
  s1 = unlist(strsplit(s, split='.', fixed=TRUE))[1]
  csvFile = paste(s1, ".csv", sep="")
  
q <- length(out1)
t <- 1
plug <- vector(mode="numeric", length=0)
repeat {
  plug = append(plug, out1[[t]])
  t = t+1
  if (q == q){
    break
  }
}


  write.table(plug, file = paste("./node/csv/", csvFile, sep=""), append=TRUE, sep = ",", row.names=FALSE, col.names=FALSE)
  return("Successfully transformed PDF to CSV")
  
}


#* Return the sum of two numbers
#* @param a The first number to add
#* @param b The second number to add
#* @post /sum
function(a, b){
  return(as.numeric(a) + as.numeric(b))
}


