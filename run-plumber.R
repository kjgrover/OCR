
library(plumber)

r <- plumb("~OCR/plumbere.R")

r$run(port=4000)
